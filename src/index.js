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

const stringifyPlain = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'object') {
    return '[complex value]';
  }
  return Number.isNaN(Number(value)) ? `'${value}'` : value;
};

const addIndentToEachLineInText = text => (
  text.split('\n').map(line => `  ${line}`).join('\n')
);
const buildNested = (key, children, renderFunction) => (
  addIndentToEachLineInText(`${key}: ${renderFunction(children)}`)
);
const buildUnchanged = (key, oldValue) => `  ${key}: ${stringify(oldValue)}`;
const buildChanged = (key, oldValue, newValue) => `- ${key}: ${stringify(oldValue)}\n+ ${key}: ${stringify(newValue)}`;
const buildDeleted = (key, oldValue) => `- ${key}: ${stringify(oldValue)}`;
const buildAdded = (key, newValue) => `+ ${key}: ${stringify(newValue)}`;

// const buildNestedPlain = (key, children, renderFunction) => (
//   addIndentToEachLineInText(`${key}: ${renderFunction(children)}`)
// );
// const buildUnchangedPlain = (ancestry) =>
const buildChangedPlain = (ancestry, oldValue, newValue) => `Property '${ancestry}' was updated. From ${stringifyPlain(oldValue)} to ${stringifyPlain(newValue)}`;
const buildDeletedPlain = ancestry => `Property '${ancestry}' was removed`;
const buildAddedPlain = (ancestry, newValue) => `Property '${ancestry}' was added with value: ${stringifyPlain(newValue)}`;

const actions = {
  nested: {
    buildPlain: ({ children }, ancestry, fn) => fn(children, ancestry, []).join('\n'),
    getNodeParts: (obj1, obj2, parseFunction) => (
      { children: parseFunction(obj1, obj2) }),
    buildStr: ({ key, children }, renderFunction) => buildNested(key, children, renderFunction),
    check: (obj1, obj2, key) => typeof obj1[key] === 'object' && typeof obj2[key] === 'object',
  },
  unchanged: {
    buildPlain: () => '',
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
    buildStr: ({ key, oldValue }) => buildUnchanged(key, oldValue),
    check: (obj1, obj2, key) => obj1[key] === obj2[key],
  },
  changed: {
    buildPlain: ({ oldValue, newValue }, ancestry) => (
      buildChangedPlain(ancestry, oldValue, newValue)),
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
    buildStr: ({ key, oldValue, newValue }) => buildChanged(key, oldValue, newValue),
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key),
  },
  deleted: {
    buildPlain: (_a, ancestry) => buildDeletedPlain(ancestry),
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
    buildStr: ({ key, oldValue }) => buildDeleted(key, oldValue),
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
  },
  added: {
    buildPlain: ({ newValue }, ancestry) => buildAddedPlain(ancestry, newValue),
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
    buildStr: ({ key, newValue }) => buildAdded(key, newValue),
    check: (obj1, obj2, key) => !has(obj1, key) && has(obj2, key),
  },
};

const parseToAst = (obj1, obj2) => {
  const unionKeys = union(Object.keys(obj1), Object.keys(obj2));
  const result = unionKeys.reduce((acc, key) => {
    const flag = Object.keys(actions).find(action => actions[action].check(obj1, obj2, key));
    return {
      ...acc, [key]: { flag, ...actions[flag].getNodeParts(obj1[key], obj2[key], parseToAst) },
    };
  }, {});
  return result;
};
const render = (ast) => {
  // console.log(JSON.stringify(ast));
  // console.log(renderPlain(ast));
  const entries = Object.entries(ast);
  const result = entries.reduce((acc, [key, node]) => {
    const { flag } = node;
    return `${acc}\n${actions[flag].buildStr({ key, ...node }, render)}`;
  }, '');
  return `{${result}\n}`;
};


export const renderPlain = (ast) => {
  // console.log(obj1, obj2)
  // const ast = parseToAst(obj1, obj2);
  const iter = (tree, ancestry, acc) => {
    const entries = Object.entries(tree);
    const result = entries.reduce((acc2, [key, node]) => {
      const newAncestry = `${ancestry}${ancestry ? '.' : ''}${key}`;
      const { flag } = node;
      const buildedString = actions[flag].buildPlain(node, newAncestry, iter);
      return buildedString ? [...acc2, buildedString] : acc2;
    }, acc);

    return result;
  };
  return iter(ast, '', []).join('\n');
};


const formatTypes = {
  tree: render,
  plain: renderPlain,
};

const gendiff = (pathToFile1, pathToFile2, type) => {
  const file1Extension = path.extname(pathToFile1);
  const file2Extension = path.extname(pathToFile2);
  const file1Content = fs.readFileSync(pathToFile1, 'utf8');
  const file2Content = fs.readFileSync(pathToFile2, 'utf8');
  const obj1 = parseToObject(file1Content, file1Extension);
  const obj2 = parseToObject(file2Content, file2Extension);
  return formatTypes[type](parseToAst(obj1, obj2));
};

export default gendiff;
