import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const extensions = [
  {
    name: '.json',
    action: file => JSON.parse(file),
  },
  {
    name: '.yml',
    action: file => yaml.safeLoad(file),
  },
];

const parseFile = (filePath) => {
  const fileExtension = path.extname(filePath);
  const { action } = extensions.find(({ name }) => name === fileExtension);
  return action(fs.readFileSync(filePath));
};

export default parseFile;
