import formatMoney from '../lib/formatMoney';

it('should format money', () => {
  expect(formatMoney(100)).toBe(`$1`);
});
