import yaml from 'js-yaml';
import ini from 'ini';

const map = {
  '.json': data => JSON.parse(data),
  '.yml': data => yaml.safeLoad(data),
  '.ini': data => ini.parse(data),
};

const parseToObject = (data, dataType) => {
  const parsedData = map[dataType](data);
  return parsedData;
};

export default parseToObject;
