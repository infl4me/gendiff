const stringify = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'object') {
    return '[complex value]';
  }
  return Number.isNaN(Number(value)) ? `'${value}'` : value;
};

const buildChanged = (ancestry, oldValue, newValue) => `Property '${ancestry.join('.')}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`;
const buildDeleted = ancestry => `Property '${ancestry.join('.')}' was removed`;
const buildAdded = (ancestry, newValue) => `Property '${ancestry.join('.')}' was added with value: ${stringify(newValue)}`;

const actions = {
  nested: ({ children }, ancestry, fn) => fn(children, ancestry),
  unchanged: () => '',
  changed: ({ oldValue, newValue }, ancestry) => buildChanged(ancestry, oldValue, newValue),
  deleted: (_a, ancestry) => buildDeleted(ancestry),
  added: ({ newValue }, ancestry) => buildAdded(ancestry, newValue),
};

const render = (ast, ancestry = []) => {
  const entries = Object.entries(ast);
  const result = entries.reduce((acc, [key, node]) => {
    const newAncestry = [...ancestry, key];
    const { flag } = node;
    const buildedString = actions[flag](node, newAncestry, render);
    return buildedString ? [...acc, buildedString] : acc;
  }, []);
  return result.join('\n');
};

export default render;
