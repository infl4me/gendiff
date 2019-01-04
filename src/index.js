import { has, union } from 'lodash';
import fs from 'fs';
import path from 'path';
import parseToObject from './parsers';
import renderPlain from './renderPlain';
import renderTree from './renderTree';

export const actions = {
  nested: {
    getNodeParts: (obj1, obj2, parseFunction) => (
      { children: parseFunction(obj1, obj2) }),
    check: (obj1, obj2, key) => typeof obj1[key] === 'object' && typeof obj2[key] === 'object',
  },
  unchanged: {
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
    check: (obj1, obj2, key) => obj1[key] === obj2[key],
  },
  changed: {
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
    check: (obj1, obj2, key) => has(obj1, key) && has(obj2, key),
  },
  deleted: {
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
    check: (obj1, obj2, key) => has(obj1, key) && !has(obj2, key),
  },
  added: {
    getNodeParts: (oldValue, newValue) => ({ oldValue, newValue }),
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

const formatTypes = {
  tree: renderTree,
  plain: renderPlain,
};

const gendiff = (pathToFile1, pathToFile2, formatType) => {
  const file1Extension = path.extname(pathToFile1);
  const file2Extension = path.extname(pathToFile2);
  const file1Content = fs.readFileSync(pathToFile1, 'utf8');
  const file2Content = fs.readFileSync(pathToFile2, 'utf8');
  const obj1 = parseToObject(file1Content, file1Extension);
  const obj2 = parseToObject(file2Content, file2Extension);
  return formatTypes[formatType](parseToAst(obj1, obj2));
};

export default gendiff;
