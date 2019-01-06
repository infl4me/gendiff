import renderTree from './renderTree';
import renderPlain from './renderPlain';
import renderJson from './renderJson';

export { renderTree, renderPlain, renderJson };

const formatTypes = {
  tree: renderTree,
  plain: renderPlain,
  json: renderJson,
};

export default format => formatTypes[format];
