import gendiff from '../src';

const expected = `{
  host: hexlet.io
- timeout: 50
+ timeout: 20
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;

describe('genDiff', () => {
  it('json', () => {
    const pathBefore = './__tests__/__fixtures__/before.json';
    const pathAfter = './__tests__/__fixtures__/after.json';
    const actual = gendiff(pathBefore, pathAfter);
    expect(actual).toBe(expected);
  });

  // it('yml', () => {
  //   const pathBefore = './__tests__/__fixtures__/before.yml';
  //   const pathAfter = './__tests__/__fixtures__/after.yml';
  //   const actual = gendiff(pathBefore, pathAfter);
  //   expect(actual).toBe(expected);
  // });
});
