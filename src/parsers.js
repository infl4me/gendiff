import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const extensions = [
  {
    name: '.json',
    action: file => JSON.parse(file),
  },
  {
    name: '.yml',
    action: file => yaml.safeLoad(file),
  },
  {
    name: '.ini',
    action: file => ini.parse(file),
  },
];

const parseFile = (filePath) => {
  const fileExtension = path.extname(filePath);
  const { action } = extensions.find(({ name }) => name === fileExtension);
  const parsedFile = action(fs.readFileSync(filePath, 'utf8'));
  return parsedFile;
};

export default parseFile;
