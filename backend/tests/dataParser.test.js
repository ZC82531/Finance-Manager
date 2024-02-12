const dataParserForItems = require('../utils/dataParser');

// Use ISO strings so Date.parse produces predictable results.
const ITEMS = [
  { date: '2026-04-01T12:00:00.000Z', amount: 50, category: 'food' },
  { date: '2026-04-10T12:00:00.000Z', amount: 30, category: 'transport' },
];

describe('dataParserForItems()', () => {
  test('returns an object with body and total properties', () => {
    const result = dataParserForItems(ITEMS);
    expect(result).toHaveProperty('body');
    expect(result).toHaveProperty('total');
  });

  test('body has one row per input item', () => {
    const result = dataParserForItems(ITEMS);
    expect(result.body).toHaveLength(ITEMS.length);
  });

  test('each row in body has exactly 4 elements: [sno, date, amount, category]', () => {
    const result = dataParserForItems(ITEMS);
    result.body.forEach((row) => {
      expect(Array.isArray(row)).toBe(true);
      expect(row).toHaveLength(4);
    });
  });

  test('serial numbers start at 1 and increment by 1', () => {
    const result = dataParserForItems(ITEMS);
    expect(result.body[0][0]).toBe(1);
    expect(result.body[1][0]).toBe(2);
  });

  test('amount and category are preserved in each row', () => {
    const result = dataParserForItems(ITEMS);
    expect(result.body[0][2]).toBe(50);
    expect(result.body[0][3]).toBe('food');
    expect(result.body[1][2]).toBe(30);
    expect(result.body[1][3]).toBe('transport');
  });

  test('total is the sum of all item amounts', () => {
    const result = dataParserForItems(ITEMS);
    expect(result.total).toBe(80);
  });

  test('formatted date is a non-empty string', () => {
    const result = dataParserForItems(ITEMS);
    expect(typeof result.body[0][1]).toBe('string');
    expect(result.body[0][1].length).toBeGreaterThan(0);
  });

  test('returns empty body and zero total for empty input', () => {
    const result = dataParserForItems([]);
    expect(result.body).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  test('handles a single item correctly', () => {
    const single = [{ date: '2026-04-05T08:00:00.000Z', amount: 99, category: 'rent' }];
    const result = dataParserForItems(single);
    expect(result.body).toHaveLength(1);
    expect(result.body[0][0]).toBe(1);
    expect(result.body[0][2]).toBe(99);
    expect(result.body[0][3]).toBe('rent');
    expect(result.total).toBe(99);
  });
});
