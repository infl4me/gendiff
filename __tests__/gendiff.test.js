import fs from 'fs';
import gendiff from '../src';

const defaultPath = './__tests__/__fixtures__/';

test.each([
  ['.json', '.yml', 'nested/', 'tree'],
  ['.ini', '.json', 'nested/', 'tree'],
  ['.yml', '.ini', 'nested/', 'tree'],
  ['.json', '.yml', 'flat/', 'tree'],
  ['.ini', '.json', 'flat/', 'tree'],
  ['.yml', '.ini', 'flat/', 'tree'],
  ['.json', '.yml', 'nested/', 'plain'],
  ['.ini', '.json', 'nested/', 'plain'],
  ['.yml', '.ini', 'nested/', 'plain'],
  ['.json', '.yml', 'flat/', 'plain'],
  ['.ini', '.json', 'flat/', 'plain'],
  ['.yml', '.ini', 'flat/', 'plain'],
  ['.json', '.yml', 'nested/', 'json'],
  ['.ini', '.json', 'nested/', 'json'],
  ['.yml', '.ini', 'nested/', 'json'],
  ['.json', '.yml', 'flat/', 'json'],
  ['.ini', '.json', 'flat/', 'json'],
  ['.yml', '.ini', 'flat/', 'json'],
])('test before%s and after%s %s %s',
  (before, after, dataType, formatType) => {
    const beforePath = `${defaultPath}${dataType}before${before}`;
    const afterPath = `${defaultPath}${dataType}after${after}`;
    const expected = fs.readFileSync(`${defaultPath}${dataType}expected.${formatType}.txt`, 'utf-8');
    expect(gendiff(beforePath, afterPath, formatType)).toBe(expected);
  });
