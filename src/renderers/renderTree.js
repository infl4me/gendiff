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
  `${calcIndent(depth, skipFirstDepth)}- ${key}: ${stringify(oldValue, depth)}\n${calcIndent(depth, skipFirstDepth)}+ ${key}: ${stringify(newValue, depth)}`);
const buildDeleted = (key, oldValue, depth) => `${calcIndent(depth, skipFirstDepth)}- ${key}: ${stringify(oldValue, depth)}`;
const buildAdded = (key, newValue, depth) => `${calcIndent(depth, skipFirstDepth)}+ ${key}: ${stringify(newValue, depth)}`;

const actions = {
  nested: ({ key, children }, depth, renderFunction) => (
    buildNested(key, children, depth, renderFunction)),
  unchanged: ({ key, oldValue }, depth) => buildUnchanged(key, oldValue, depth),
  changed: ({ key, oldValue, newValue }, depth) => buildChanged(key, oldValue, newValue, depth),
  deleted: ({ key, oldValue }, depth) => buildDeleted(key, oldValue, depth),
  added: ({ key, newValue }, depth) => buildAdded(key, newValue, depth),
};

const render = (ast, depth = 1) => {
  const entries = Object.entries(ast);
  const result = entries.reduce((acc, [key, node]) => {
    const { flag } = node;
    return [...acc, actions[flag]({ key, ...node }, depth, render)];
  }, []);
  return `{\n${result.join('\n')}\n${calcIndent(depth, skipFirstDepth)}}`;
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
