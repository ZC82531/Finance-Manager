import { sortCategoryWise } from './seperator';

// The module uses a module-level Map that persists between calls within the
// same test file. Using a consistent CATS array ensures the Map entries are
// reset to 0 at the start of every sortCategoryWise call.
const CATS = ['food', 'transport'];

describe('sortCategoryWise()', () => {
  test('returns an array with one entry per category', () => {
    const result = sortCategoryWise([], CATS);
    expect(result).toHaveLength(CATS.length);
  });

  test('returns zeros when there are no expenses', () => {
    const result = sortCategoryWise([], CATS);
    expect(result[0]).toBe(0); // food
    expect(result[1]).toBe(0); // transport
  });

  test('sums amounts correctly for each category', () => {
    const expenses = [
      { category: 'food', amount: 50 },
      { category: 'transport', amount: 30 },
      { category: 'food', amount: 20 },
    ];
    const result = sortCategoryWise(expenses, CATS);
    expect(result[0]).toBe(70); // food: 50 + 20
    expect(result[1]).toBe(30); // transport: 30
  });

  test('returns zero for a category with no matching expenses', () => {
    const expenses = [{ category: 'food', amount: 100 }];
    const result = sortCategoryWise(expenses, CATS);
    expect(result[0]).toBe(100);
    expect(result[1]).toBe(0); // no transport expenses
  });

  test('handles a single expense correctly', () => {
    const expenses = [{ category: 'transport', amount: 45 }];
    const result = sortCategoryWise(expenses, CATS);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(45);
  });

  test('result length matches number of categories passed', () => {
    const threeCats = ['food', 'transport', 'entertainment'];
    const expenses = [{ category: 'entertainment', amount: 20 }];
    const result = sortCategoryWise(expenses, threeCats);
    expect(result).toHaveLength(3);
  });

  test('accumulates large sums without losing precision', () => {
    const expenses = Array.from({ length: 100 }, () => ({
      category: 'food',
      amount: 1,
    }));
    const result = sortCategoryWise(expenses, CATS);
    expect(result[0]).toBe(100);
  });
});
