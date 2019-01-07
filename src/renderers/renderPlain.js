import { isNaN, toNumber } from 'lodash';

const stringify = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'object') {
    return '[complex value]';
  }
  const isValueContainsNumber = !isNaN(toNumber(value));
  return isValueContainsNumber ? value : `'${value}'`;
};

const actions = {
  nested: ({ children }, ancestry, fn) => fn(children, `${ancestry}.`),
  unchanged: () => '',
  changed: ({ oldValue, newValue }, ancestry) => `Property '${ancestry}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`,
  deleted: (_a, ancestry) => `Property '${ancestry}' was removed`,
  added: ({ newValue }, ancestry) => `Property '${ancestry}' was added with value: ${stringify(newValue)}`,
};

const render = (ast, ancestry = '') => {
  const result = ast.reduce((acc, node) => {
    const { name, type } = node;
    const newAncestry = `${ancestry}${name}`;
    const buildedString = actions[type](node, newAncestry, render);
    return buildedString ? [...acc, buildedString] : acc;
  }, []);

  return result.join('\n');
};

export default render;
