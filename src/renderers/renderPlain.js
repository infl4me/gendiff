import { flatten, isNaN, toNumber } from 'lodash';

const stringify = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'object') {
    return '[complex value]';
  }
  const canBeNumber = !isNaN(toNumber(value));
  return canBeNumber ? value : `'${value}'`;
};

const buildChanged = (ancestry, oldValue, newValue) => `Property '${ancestry}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`;
const buildDeleted = ancestry => `Property '${ancestry}' was removed`;
const buildAdded = (ancestry, newValue) => `Property '${ancestry}' was added with value: ${stringify(newValue)}`;

const joinStr = (str, delimiter) => `${str}${delimiter}`;
const actions = {
  nested: ({ children }, ancestry, fn) => fn(children, joinStr(ancestry, '.')),
  unchanged: () => [],
  changed: ({ oldValue, newValue }, ancestry) => buildChanged(ancestry, oldValue, newValue),
  deleted: (_a, ancestry) => buildDeleted(ancestry),
  added: ({ newValue }, ancestry) => buildAdded(ancestry, newValue),
};

const render = (ast, ancestry = '') => {
  const result = ast.map((node) => {
    const { name, type } = node;
    const newAncestry = `${ancestry}${name}`;
    return actions[type](node, newAncestry, render);
  });
  return flatten(result).join('\n');
};

export default render;

// conconst render = (ast, ancestry = '') => {
//   const result = ast.reduce((acc, node) => {
//     const { name, type } = node;
//     const newAncestry = `${ancestry}${ancestry ? '.' : ''}${name}`;
//     const buildedString = actions[type](node, newAncestry, render);
//     return buildedString ? [...acc, buildedString] : acc;
//   }, []);

//   return result.join('\n');
// };
