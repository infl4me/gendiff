import fs from 'fs';
import gendiff from '../src';

const defaultPath = './__tests__/__fixtures__/';
const expected = fs.readFileSync(`${defaultPath}expected.txt`, 'utf-8');
test.each([
  ['before.json', 'after.json'],
  ['before.yml', 'after.yml'],
  ['before.ini', 'after.ini'],
  ['before.json', 'after.ini'],
])('test %s and %s',
  (before, after) => {
    const beforePath = `${defaultPath}${before}`;
    const afterPath = `${defaultPath}${after}`;
    expect(gendiff(beforePath, afterPath)).toBe(expected);
  });
