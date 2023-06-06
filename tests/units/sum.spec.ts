import { sum } from '../../src/utils/sum';

describe('Unit Testing Example', () => {
  it('It should the sum between 2 numbers', () => {
    const result = sum(1, 1);
    expect(result).toEqual(2);
  });
});
