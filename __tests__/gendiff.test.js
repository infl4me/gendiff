import gendiff from '../src';

const expected = `{
  host: hexlet.io
- timeout: 50
+ timeout: 20
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;

describe('gendiff', () => {
  it('json', () => {
    const pathBefore = './__tests__/__fixtures__/before.json';
    const pathAfter = './__tests__/__fixtures__/after.json';
    const actual = gendiff(pathBefore, pathAfter);
    expect(actual).toBe(expected);
  });

  it('yml', () => {
    const pathBefore = './__tests__/__fixtures__/before.yml';
    const pathAfter = './__tests__/__fixtures__/after.yml';
    const actual = gendiff(pathBefore, pathAfter);
    expect(actual).toBe(expected);
  });

  it('ini', () => {
    const pathBefore = './__tests__/__fixtures__/before.ini';
    const pathAfter = './__tests__/__fixtures__/after.ini';
    const actual = gendiff(pathBefore, pathAfter);
    expect(actual).toBe(expected);
  });

  it('json & yaml', () => {
    const pathBefore = './__tests__/__fixtures__/before.yml';
    const pathAfter = './__tests__/__fixtures__/after.json';
    const actual = gendiff(pathBefore, pathAfter);
    expect(actual).toBe(expected);
  });
});
