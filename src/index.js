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

const parse = (file1, file2) => {
  const entriesFile1 = Object.entries(file1);
  const keysFile2 = Object.keys(file2);

  const reduce1 = entriesFile1.reduce((acc, [key, value]) => {
    if (has(file2, key)) {
      if (value === file2[key]) {
        return [...acc, { flag: 'unchanged', entry: [key, value] }];
      }
      return [...acc, { flag: 'changed', entry: [[key, value], [key, file2[key]]] }];
    }
    return [...acc, { flag: 'deleted', entry: [key, value] }];
  }, []);
  const reduce2 = keysFile2.reduce((acc, key) => (
    has(file1, key) ? acc : [...acc, { flag: 'added', entry: [key, file2[key]] }]
  ), reduce1);
  return reduce2;
};

export const render = (file1, file2) => {
  const result = parse(file1, file2)
    .reduce((acc, n) => {
      const { flag, entry } = n;
      return `${acc}\n${actions[flag](entry)}`;
    }, '');
  return `{${result}\n}`;
};


const gendiff = (pathFile1, pathFile2) => {
  const file1 = parseFileToObject(pathFile1);
  const file2 = parseFileToObject(pathFile2);

  return render(file1, file2);
};
export default gendiff;
