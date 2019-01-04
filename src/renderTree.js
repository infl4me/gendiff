const stringify = (value) => {
  if (typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  const result = keys.reduce((acc, key) => `${acc}    ${key}: ${value[key]}`, '');
  return `{\n${result}\n  }`;
};

const addIndentToEachLineInText = text => (
  text.split('\n').map(line => `  ${line}`).join('\n')
);

const buildNested = (key, children, renderFunction) => (
  addIndentToEachLineInText(`${key}: ${renderFunction(children)}`)
);
const buildUnchanged = (key, oldValue) => `  ${key}: ${stringify(oldValue)}`;
const buildChanged = (key, oldValue, newValue) => `- ${key}: ${stringify(oldValue)}\n+ ${key}: ${stringify(newValue)}`;
const buildDeleted = (key, oldValue) => `- ${key}: ${stringify(oldValue)}`;
const buildAdded = (key, newValue) => `+ ${key}: ${stringify(newValue)}`;

const actions = {
  nested: {
    buildStr: ({ key, children }, renderFunction) => buildNested(key, children, renderFunction),
  },
  unchanged: {
    buildStr: ({ key, oldValue }) => buildUnchanged(key, oldValue),
  },
  changed: {
    buildStr: ({ key, oldValue, newValue }) => buildChanged(key, oldValue, newValue),
  },
  deleted: {
    buildStr: ({ key, oldValue }) => buildDeleted(key, oldValue),
  },
  added: {
    buildStr: ({ key, newValue }) => buildAdded(key, newValue),
  },
};

const render = (ast) => {
  const entries = Object.entries(ast);
  const result = entries.reduce((acc, [key, node]) => {
    const { flag } = node;
    return `${acc}\n${actions[flag].buildStr({ key, ...node }, render)}`;
  }, '');
  return `{${result}\n}`;
};

export default render;
