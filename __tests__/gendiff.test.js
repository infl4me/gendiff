import fs from 'fs';
import gendiff from '../src';

const defaultPath = './__tests__/__fixtures__/';

test.each([
  ['.json', '.json', 'plain/'],
  ['.yml', '.yml', 'plain/'],
  ['.ini', '.ini', 'plain/'],
  ['.json', '.ini', 'plain/'],
  ['.yml', '.ini', 'plain/'],
  ['.json', '.json', 'nested/'],
  ['.yml', '.yml', 'nested/'],
  ['.ini', '.ini', 'nested/'],
  ['.json', '.ini', 'nested/'],
  ['.yml', '.ini', 'nested/'],
])('test before%s and after%s %s',
  (before, after, dataType) => {
    const beforePath = `${defaultPath}${dataType}before${before}`;
    const afterPath = `${defaultPath}${dataType}after${after}`;
    const expected = fs.readFileSync(`${defaultPath}${dataType}expected.txt`, 'utf-8');
    expect(gendiff(beforePath, afterPath)).toBe(expected);
  });
