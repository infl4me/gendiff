const render = ast => (
  JSON.stringify(ast, (_key, value) => (typeof value === 'number' ? String(value) : value)));

export default render;
