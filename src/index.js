import { has } from 'lodash';
import parseFileToObject from './parsers';

const buildUnchanged = (key, value) => `  ${key}: ${value}`;
const buildChanged = (key1, value1, key2, value2) => `- ${key1}: ${value1}\n+ ${key2}: ${value2}`;
const buildDeleted = (key, value) => `- ${key}: ${value}`;
const buildAdded = (key, value) => `+ ${key}: ${value}`;

const actions = {
  unchanged: {
    getEntry: (key, value) => [key, value],
    buildStr: ([k, v]) => buildUnchanged(k, v),
    check: (obj, key, value) => has(obj, key) && value === obj[key],
  },
  changed: {
    getEntry: (key, value1, value2) => [[key, value1], [key, value2]],
    buildStr: ([[k1, v1], [k2, v2]]) => buildChanged(k1, v1, k2, v2),
    check: (obj, key) => has(obj, key),
  },
  deleted: {
    getEntry: (key, value) => [key, value],
    buildStr: ([k, v]) => buildDeleted(k, v),
    check: (obj, key) => !has(obj, key),
  },
  added: {
    getEntry: (key, value) => [key, value],
    buildStr: ([k, v]) => buildAdded(k, v),
  },
};

const parseToAst = (obj1, obj2) => {
  const keysObj1 = Object.keys(obj1);
  const keysObj2 = Object.keys(obj2);

  const reduce1 = keysObj1.reduce((acc, key) => {
    const found = Object.keys(actions).find(n => actions[n].check(obj2, key, obj1[key]));
    return [...acc, { flag: found, entry: actions[found].getEntry(key, obj1[key], obj2[key]) }];
  }, []);

  const reduce2 = keysObj2.reduce((acc, key) => (
    has(obj1, key) ? acc : [...acc, { flag: 'added', entry: [key, obj2[key]] }]
  ), reduce1);

  return reduce2;
};

export const render = (obj1, obj2) => {
  const ast = parseToAst(obj1, obj2);
  const result = ast.reduce((acc, n) => {
    const { flag, entry } = n;
    return `${acc}\n${actions[flag].buildStr(entry)}`;
  }, '');

  return `{${result}\n}`;
};

const gendiff = (pathFile1, pathFile2) => {
  const obj1 = parseFileToObject(pathFile1);
  const obj2 = parseFileToObject(pathFile2);
  return render(obj1, obj2);
};

export default gendiff;
