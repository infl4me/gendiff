import { has, union } from 'lodash';
import fs from 'fs';
import path from 'path';
import parseToObject from './parsers';

const buildUnchanged = (key, value) => `  ${key}: ${value}`;
const buildChanged = (key, value1, value2) => `- ${key}: ${value1}\n+ ${key}: ${value2}`;
const buildDeleted = (key, value) => `- ${key}: ${value}`;
const buildAdded = (key, value) => `+ ${key}: ${value}`;

const actions = {
  unchanged: {
    buildStr: ([k, v]) => buildUnchanged(k, v),
    check: (obj1, obj2, key) => obj1[key] === obj2[key],
  },
  changed: {
    buildStr: ([k, v1, v2]) => buildChanged(k, v1, v2),
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key),
  },
  deleted: {
    buildStr: ([k, v]) => buildDeleted(k, v),
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
  },
  added: {
    buildStr: ([k, , v2]) => buildAdded(k, v2),
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
  },
};


const parseToAst = (obj1, obj2) => {
  const keysObj1 = Object.keys(obj1);
  const keysObj2 = Object.keys(obj2);

  const unionKeys = union(keysObj1, keysObj2);
  const result = unionKeys.map((key) => {
    const found = Object.keys(actions).find(action => actions[action].check(obj1, obj2, key));
    return { flag: found, entry: [key, obj1[key], obj2[key]] };
  });
  return result;
};

export const render = (obj1, obj2) => {
  const ast = parseToAst(obj1, obj2);
  const result = ast.reduce((acc, n) => {
    const { flag, entry } = n;
    return `${acc}\n${actions[flag].buildStr(entry)}`;
  }, '');

  return `{${result}\n}`;
};

const gendiff = (pathToFile1, pathToFile2) => {
  const file1Extension = path.extname(pathToFile1);
  const file2Extension = path.extname(pathToFile2);
  const file1 = fs.readFileSync(pathToFile1, 'utf8');
  const file2 = fs.readFileSync(pathToFile2, 'utf8');
  const obj1 = parseToObject(file1, file1Extension);
  const obj2 = parseToObject(file2, file2Extension);
  return render(obj1, obj2);
};

export default gendiff;
