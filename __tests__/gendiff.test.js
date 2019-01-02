import fs from 'fs';
import path from 'path';
import gendiff from '../src';

const defaultPath = './__tests__/__fixtures__/';
const expected = fs.readFileSync(path.join(defaultPath, 'expected.txt'), 'utf-8');
test.each([
  ['before.json', 'after.json'],
  ['before.yml', 'after.yml'],
  ['before.ini', 'after.ini'],
  ['before.json', 'after.ini'],
])('test %s and %s',
  (before, after) => {
    const beforePath = path.join(defaultPath, before);
    const afterPath = path.join(defaultPath, after);
    expect(gendiff(beforePath, afterPath)).toBe(expected);
  });
