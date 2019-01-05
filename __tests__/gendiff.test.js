import fs from 'fs';
import gendiff from '../src';

const defaultPath = './__tests__/__fixtures__/';

test.each([
  ['.json', '.json', 'flat/', 'json'],
  ['.ini', '.yml', 'flat/', 'tree'],
  ['.json', '.ini', 'flat/', 'tree'],
  ['.yml', '.json', 'flat/', 'tree'],
  ['.ini', '.yml', 'nested/', 'tree'],
  ['.json', '.ini', 'nested/', 'tree'],
  ['.yml', '.json', 'nested/', 'tree'],
  ['.json', '.json', 'nested/', 'tree'],
  ['.json', '.json', 'nested/', 'plain'],
  ['.ini', '.ini', 'flat/', 'plain'],
  ['.json', '.ini', 'flat/', 'plain'],
  ['.yml', '.ini', 'flat/', 'plain'],
  ['.json', '.json', 'flat/', 'plain'],
  ['.json', '.json', 'nested/', 'json'],
  ['.yml', '.yml', 'nested/', 'json'],
  ['.ini', '.ini', 'nested/', 'plain'],
  ['.json', '.ini', 'nested/', 'plain'],
  ['.yml', '.ini', 'nested/', 'plain'],
  ['.yml', '.yml', 'nested/', 'json'],
  ['.ini', '.ini', 'nested/', 'json'],
  ['.json', '.ini', 'nested/', 'json'],
  ['.json', '.json', 'nested/', 'json'],
  ['.yml', '.yml', 'flat/', 'json'],
  ['.ini', '.ini', 'flat/', 'json'],
  ['.json', '.ini', 'flat/', 'json'],
  ['.json', '.json', 'flat/', 'json'],
])('test before%s and after%s %s %s',
  (before, after, dataType, formatType) => {
    const beforePath = `${defaultPath}${dataType}before${before}`;
    const afterPath = `${defaultPath}${dataType}after${after}`;
    const expected = fs.readFileSync(`${defaultPath}${dataType}expected.${formatType}.txt`, 'utf-8');
    expect(gendiff(beforePath, afterPath, formatType)).toBe(expected);
  });
