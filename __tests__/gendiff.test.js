import fs from 'fs';
import gendiff from '../src';

const defaultPath = './__tests__/__fixtures__/';
const defaultPathBefore = `${defaultPath}before`;
const defaultPathAfter = `${defaultPath}after`;
const expected = fs.readFileSync(`${defaultPath}expected.txt`, 'utf-8');
test.each([
  ['.json', '.json'],
  ['.yml', '.yml'],
  ['.ini', '.ini'],
  ['.json', '.ini'],
])('test %s and %s',
  (before, after) => {
    const beforePath = `${defaultPathBefore}${before}`;
    const afterPath = `${defaultPathAfter}${after}`;
    expect(gendiff(beforePath, afterPath)).toBe(expected);
  });
