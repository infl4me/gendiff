import yaml from 'js-yaml';
import ini from 'ini';

const map = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parseToObject = (data, dataType) => {
  const parsedData = map[dataType](data);
  // console.log(parsedData, dataType, '!!!!!!!!!');
  return parsedData;
};

export default parseToObject;
