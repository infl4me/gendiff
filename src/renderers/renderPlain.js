import { isNaN, toNumber } from 'lodash';

const stringify = (value) => {
  if (value instanceof Object) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    const canConvertToNumber = !isNaN(toNumber(value));
    return canConvertToNumber ? value : `'${value}'`;
  }
  return value;
};

const actions = {
  nested: ({ children }, ancestry, fn) => fn(children, `${ancestry}.`),
  unchanged: () => '',
  changed: ({ oldValue, newValue }, ancestry) => `Property '${ancestry}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`,
  deleted: (_a, ancestry) => `Property '${ancestry}' was removed`,
  added: ({ newValue }, ancestry) => `Property '${ancestry}' was added with value: ${stringify(newValue)}`,
};

const render = (ast, ancestry = '') => {
  const result = ast.map((node) => {
    const { name, type } = node;
    const newAncestry = `${ancestry}${name}`;
    return actions[type](node, newAncestry, render);
  });
  return result.filter(v => v).join('\n');
};

export default render;
