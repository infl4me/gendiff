import { flatten } from 'lodash';

const stringify = (value, depth) => {
  if (typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.reduce((acc, key) => `${acc}${'  '.repeat(depth + 2)}${key}: ${value[key]}`, '');
  return `{\n${result}\n${'  '.repeat(depth + 1)}}`;
};

const buildNested = (key, children, depth, renderFunction) => `  ${key}: ${renderFunction(children, depth + 1)}`;
const buildUnchanged = (key, oldValue) => `  ${key}: ${oldValue}`;
const buildChanged = (key, oldValue, newValue) => (
  [`- ${key}: ${oldValue}`, `+ ${key}: ${newValue}`]);
const buildDeleted = (key, oldValue) => `- ${key}: ${oldValue}`;
const buildAdded = (key, newValue) => `+ ${key}: ${newValue}`;

const actions = {
  nested: ({ name, children }, depth, renderFunction) => (
    buildNested(name, children, depth, renderFunction)),
  unchanged: ({ name, oldValue }) => buildUnchanged(name, oldValue),
  changed: ({ name, oldValue, newValue }) => buildChanged(name, oldValue, newValue),
  deleted: ({ name, oldValue }) => buildDeleted(name, oldValue),
  added: ({ name, newValue }) => buildAdded(name, newValue),
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
