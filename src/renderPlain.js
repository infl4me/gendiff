const stringify = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'object') {
    return '[complex value]';
  }
  return Number.isNaN(Number(value)) ? `'${value}'` : value;
};

const buildChanged = (ancestry, oldValue, newValue) => `Property '${ancestry}' was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`;
const buildDeleted = ancestry => `Property '${ancestry}' was removed`;
const buildAdded = (ancestry, newValue) => `Property '${ancestry}' was added with value: ${stringify(newValue)}`;

const actions = {
  nested: {
    buildStr: ({ children }, ancestry, fn) => fn(children, ancestry, []).join('\n'),
  },
  unchanged: {
    buildStr: () => '',
  },
  changed: {
    buildStr: ({ oldValue, newValue }, ancestry) => (
      buildChanged(ancestry, oldValue, newValue)),
  },
  deleted: {
    buildStr: (_a, ancestry) => buildDeleted(ancestry),
  },
  added: {
    buildStr: ({ newValue }, ancestry) => buildAdded(ancestry, newValue),
  },
};

const render = (ast) => {
  const iter = (tree, ancestry, acc) => {
    const entries = Object.entries(tree);
    const result = entries.reduce((acc2, [key, node]) => {
      const newAncestry = `${ancestry}${ancestry ? '.' : ''}${key}`;
      const { flag } = node;
      const buildedString = actions[flag].buildStr(node, newAncestry, iter);
      return buildedString ? [...acc2, buildedString] : acc2;
    }, acc);
    return result;
  };

  return iter(ast, '', []).join('\n');
};

export default render;
