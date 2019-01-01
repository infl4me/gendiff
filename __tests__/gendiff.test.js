// import gendiff from '../src';
import before from './__fixtures__/before';
import after from './__fixtures__/after';
import { render } from '../src';

const expected = `{
  host: hexlet.io
- timeout: 50
+ timeout: 20
- proxy: 123.234.53.22
- follow: false
+ verbose: true
}`;
const actual = render(before, after);

test('diffJSON', () => {
  expect(actual).toBe(expected);
});
