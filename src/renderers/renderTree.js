import { flatten } from 'lodash';

const indent = ' ';
const calcIndent = (counter, fn) => indent.repeat(fn(counter));
const skipFirstDepth = depth => (depth - 1) * 2;

const stringify = (value, depth) => {
  if (typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.reduce((acc, key) => `${acc}${calcIndent(depth, d => d * 2 + 2)}${key}: ${value[key]}`, '');
  return `{\n${result}\n${calcIndent(depth, d => d * 2)}}`;
};

const buildNested = (key, children, depth, renderFunction) => `${calcIndent(depth, d => d * 2)}${key}: ${renderFunction(children, depth + 1)}`;

const buildUnchanged = (key, oldValue, depth) => `${calcIndent(depth, skipFirstDepth)}  ${key}: ${stringify(oldValue, depth)}`;
const buildChanged = (key, oldValue, newValue, depth) => (
  [`${calcIndent(depth, skipFirstDepth)}- ${key}: ${stringify(oldValue, depth)}`, `${calcIndent(depth, skipFirstDepth)}+ ${key}: ${stringify(newValue, depth)}`]);
const buildDeleted = (key, oldValue, depth) => `${calcIndent(depth, skipFirstDepth)}- ${key}: ${stringify(oldValue, depth)}`;
const buildAdded = (key, newValue, depth) => `${calcIndent(depth, skipFirstDepth)}+ ${key}: ${stringify(newValue, depth)}`;

const actions = {
  nested: ({ name, children }, depth, renderFunction) => (
    buildNested(name, children, depth, renderFunction)),
  unchanged: ({ name, oldValue }, depth) => buildUnchanged(name, oldValue, depth),
  changed: ({ name, oldValue, newValue }, depth) => buildChanged(name, oldValue, newValue, depth),
  deleted: ({ name, oldValue }, depth) => buildDeleted(name, oldValue, depth),
  added: ({ name, newValue }, depth) => buildAdded(name, newValue, depth),
};

// const render = (ast, depth = 1) => {
//   const result = ast.reduce((acc, node) => {
//     const { type } = node;
//     return [...acc, actions[type](node, depth, render)];
//   }, []);
//   return `{\n${result.join('\n')}\n${calcIndent(depth, skipFirstDepth)}}`;
// };
const render = (ast, depth = 1) => {
  const result = ast.map((node) => {
    const { type } = node;
    return actions[type](node, depth, render);
  });
  return `{\n${flatten(result).join('\n')}\n${calcIndent(depth, skipFirstDepth)}}`;
};

export default render;
// const addIndentToEachLineInText = text => (
//   text.split('\n').map(line => `  ${line}`).join('\n')
// );
// const render = (ast) => {
//   const entries = Object.entries(ast);
//   const result = entries.reduce((acc, [key, node]) => {
//     const { flag } = node;
//     return `${acc}\n${actions[flag]({ key, ...node }, render)}`;
//   }, '');
//   return `{${result}\n}`;
// };
