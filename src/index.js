import { has } from 'lodash';
import parseFileToObject from './parsers';

const buildUnchanged = (key, value) => `  ${key}: ${value}`;
const buildChanged = (key1, value1, key2, value2) => `- ${key1}: ${value1}\n+ ${key2}: ${value2}`;
const buildDeleted = (key, value) => `- ${key}: ${value}`;
const buildAdded = (key, value) => `+ ${key}: ${value}`;


const actions = {
  unchanged: ([k, v]) => buildUnchanged(k, v),
  changed: ([[k1, v1], [k2, v2]]) => buildChanged(k1, v1, k2, v2),
  deleted: ([k, v]) => buildDeleted(k, v),
  added: ([k, v]) => buildAdded(k, v),
};

const parseToAst = (object1, object2) => {
  const entriesobject1 = Object.entries(object1);
  const keysobject2 = Object.keys(object2);

  const reduce1 = entriesobject1.reduce((acc, [key, value]) => {
    if (has(object2, key)) {
      if (value === object2[key]) {
        return [...acc, { flag: 'unchanged', entry: [key, value] }];
      }
      return [...acc, { flag: 'changed', entry: [[key, value], [key, object2[key]]] }];
    }
    return [...acc, { flag: 'deleted', entry: [key, value] }];
  }, []);
  const reduce2 = keysobject2.reduce((acc, key) => (
    has(object1, key) ? acc : [...acc, { flag: 'added', entry: [key, object2[key]] }]
  ), reduce1);
  return reduce2;
};

export const render = (object1, object2) => {
  const result = parseToAst(object1, object2)
    .reduce((acc, n) => {
      const { flag, entry } = n;
      return `${acc}\n${actions[flag](entry)}`;
    }, '');
  return `{${result}\n}`;
};


const gendiff = (pathFile1, pathFile2) => {
  const object1 = parseFileToObject(pathFile1);
  const object2 = parseFileToObject(pathFile2);

  return render(object1, object2);
};
export default gendiff;
