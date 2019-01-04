const render = ast => (
  JSON.stringify(ast, (key, value) => (typeof value === 'number' ? String(value) : value)));


export default render;
