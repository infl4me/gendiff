import { flatten } from 'lodash';

const stringify = (value, depth) => {
  if (typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.reduce((acc, key) => `${acc}${'  '.repeat(depth + 2)}${key}: ${value[key]}`, '');
  return `{\n${result}\n${'  '.repeat(depth + 1)}}`;
};

const actions = {
  nested: ({ name, children }, depth, renderFunction) => (`  ${name}: ${renderFunction(children, depth + 1)}`),
  unchanged: ({ name, oldValue }) => `  ${name}: ${oldValue}`,
  changed: ({ name, oldValue, newValue }) => [`- ${name}: ${oldValue}`, `+ ${name}: ${newValue}`],
  deleted: ({ name, oldValue }) => `- ${name}: ${oldValue}`,
  added: ({ name, newValue }) => `+ ${name}: ${newValue}`,
};

const render = (ast, depth = 0) => {
  const strings = ast.map((node) => {
    const { type, oldValue, newValue } = node;
    return actions[type](
      {
        ...node,
        oldValue: stringify(oldValue, depth),
        newValue: stringify(newValue, depth),
      }, depth, render,
    );
  });
  const indentedStrings = flatten(strings).map(string => `${'  '.repeat(depth)}${string}`);
  return `{\n${indentedStrings.join('\n')}\n${'  '.repeat(depth)}}`;
};

export default render;
