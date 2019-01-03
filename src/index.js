import { has, union } from 'lodash';
import fs from 'fs';
import path from 'path';
import parseToObject from './parsers';

const stringify = (value) => {
  if (typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.reduce((acc, key) => `${acc}    ${key}: ${value[key]}`, '');
  return `{\n${result}\n  }`;
};

const buildNested = (key, children, f) => (
  `${key}: ${f(children)}`.split('\n').map(str => `  ${str}`).join('\n')
);
const buildUnchanged = (key, value) => `  ${key}: ${stringify(value)}`;
const buildChanged = (key, value1, value2) => `- ${key}: ${stringify(value1)}\n+ ${key}: ${stringify(value2)}`;
const buildDeleted = (key, value) => `- ${key}: ${stringify(value)}`;
const buildAdded = (key, value) => `+ ${key}: ${stringify(value)}`;

const actions = {
  nested: {
    buildStr: ({ key, children }, f) => buildNested(key, children, f),
    check: (obj1, obj2, key) => typeof obj1[key] === 'object' && typeof obj2[key] === 'object',
  },
  unchanged: {
    buildStr: ({ key, oldValue }) => buildUnchanged(key, oldValue),
    check: (obj1, obj2, key) => obj1[key] === obj2[key],
  },
  changed: {
    buildStr: ({ key, oldValue, newValue }) => buildChanged(key, oldValue, newValue),
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key),
  },
  deleted: {
    buildStr: ({ key, oldValue }) => buildDeleted(key, oldValue),
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
  },
  added: {
    buildStr: ({ key, newValue }) => buildAdded(key, newValue),
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
  },
};


const parseToAst = (obj1, obj2) => {
  const unionKeys = union(Object.keys(obj1), Object.keys(obj2));
  const result = unionKeys.map((key) => {
    const flag = Object.keys(actions).find(action => actions[action].check(obj1, obj2, key));
    const oldValue = obj1[key];
    const newValue = obj2[key];
    if (flag === 'nested') {
      return { flag, key, children: parseToAst(oldValue, newValue) };
    }
    return {
      flag, key, oldValue, newValue,
    };
  });
  return result;
};

export const render = (ast) => {
  const result = ast.reduce((acc, item) => {
    const { flag } = item;
    return `${acc}\n${actions[flag].buildStr(item, render)}`;
  }, '');
  return `{${result}\n}`;
};

const gendiff = (pathToFile1, pathToFile2) => {
  const file1Extension = path.extname(pathToFile1);
  const file2Extension = path.extname(pathToFile2);
  const file1Content = fs.readFileSync(pathToFile1, 'utf8');
  const file2Content = fs.readFileSync(pathToFile2, 'utf8');
  const obj1 = parseToObject(file1Content, file1Extension);
  const obj2 = parseToObject(file2Content, file2Extension);
  return render(parseToAst(obj1, obj2));
};

export default gendiff;
