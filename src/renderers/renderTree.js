import { flatten } from 'lodash';

const indent = '  ';

const calcIndent = (depth, startFrom = 2) => (
  indent.repeat(depth + (startFrom <= -1 ? -1 : startFrom / 2 - 1)));

const stringify = (value, depth) => {
  if (typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.reduce((acc, key) => `${acc}${calcIndent(depth, 4)}${key}: ${value[key]}`, '');
  return `{\n${result}\n${calcIndent(depth)}}`;
};

const buildNested = (key, children, depth, renderFunction) => `${calcIndent(depth)}${key}: ${renderFunction(children, depth + 1)}`;
const buildUnchanged = (key, oldValue, depth) => `${calcIndent(depth, -1)}  ${key}: ${stringify(oldValue, depth)}`;
const buildChanged = (key, oldValue, newValue, depth) => (
  [`${calcIndent(depth, -1)}- ${key}: ${stringify(oldValue, depth)}`, `${calcIndent(depth, -1)}+ ${key}: ${stringify(newValue, depth)}`]);
const buildDeleted = (key, oldValue, depth) => `${calcIndent(depth, -1)}- ${key}: ${stringify(oldValue, depth)}`;
const buildAdded = (key, newValue, depth) => `${calcIndent(depth, -1)}+ ${key}: ${stringify(newValue, depth)}`;

const actions = {
  nested: ({ name, children }, depth, renderFunction) => (
    buildNested(name, children, depth, renderFunction)),
  unchanged: ({ name, oldValue }, depth) => buildUnchanged(name, oldValue, depth),
  changed: ({ name, oldValue, newValue }, depth) => buildChanged(name, oldValue, newValue, depth),
  deleted: ({ name, oldValue }, depth) => buildDeleted(name, oldValue, depth),
  added: ({ name, newValue }, depth) => buildAdded(name, newValue, depth),
};

const render = (ast, depth = 1) => {
  const result = ast.map((node) => {
    const { type } = node;
    return actions[type](node, depth, render);
  });
  return `{\n${flatten(result).join('\n')}\n${calcIndent(depth, -1)}}`;
};

export default render;
