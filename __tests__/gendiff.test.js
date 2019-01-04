import fs from 'fs';
import gendiff from '../src';

const defaultPath = './__tests__/__fixtures__/';

test.each([
  ['.json', '.json', 'flat/', 'tree'],
  ['.yml', '.yml', 'flat/', 'tree'],
  ['.ini', '.ini', 'flat/', 'plain'],
  ['.json', '.ini', 'flat/', 'plain'],
  ['.yml', '.ini', 'flat/', 'plain'],
  ['.json', '.json', 'nested/', 'tree'],
  ['.yml', '.yml', 'nested/', 'tree'],
  ['.ini', '.ini', 'nested/', 'plain'],
  ['.json', '.ini', 'nested/', 'plain'],
  ['.yml', '.ini', 'nested/', 'plain'],
])('test before%s and after%s %s %s',
  (before, after, dataType, formatType) => {
    const beforePath = `${defaultPath}${dataType}before${before}`;
    const afterPath = `${defaultPath}${dataType}after${after}`;
    const expected = fs.readFileSync(`${defaultPath}${dataType}expected.${formatType}.txt`, 'utf-8');
    expect(gendiff(beforePath, afterPath, formatType)).toBe(expected);
  });
