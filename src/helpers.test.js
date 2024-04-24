import {
  areDatesInSameWeek,
  roundToSmallestCurrency,
  percentageToDecimal,
} from './helpers';

describe('areDatesInSameWeek', () => {
  it('should return true if the dates are in the same week', () => {
    const date1 = '2023-04-20';
    const date2 = '2023-04-22';
    expect(areDatesInSameWeek(date1, date2)).toBe(true);
  });

  it('should return false if the dates are not in the same week', () => {
    const date1 = '2023-04-20';
    const date2 = '2023-04-27';
    expect(areDatesInSameWeek(date1, date2)).toBe(false);
  });
});

describe('roundToSmallestCurrency', () => {
  it('should round up to the nearest smallest currency unit', () => {
    expect(roundToSmallestCurrency(1.234, 0.01)).toBe(1.24);
    expect(roundToSmallestCurrency(1.235, 0.01)).toBe(1.24);
    expect(roundToSmallestCurrency(1.239, 0.01)).toBe(1.24);
  });

  it('should handle different smallest currency units', () => {
    expect(roundToSmallestCurrency(1.2345, 0.05)).toBe(1.25);
    expect(roundToSmallestCurrency(1.2349, 0.05)).toBe(1.25);
  });
});

describe('percentageToDecimal', () => {
  it('should convert a percentage to a decimal', () => {
    expect(percentageToDecimal(10)).toBe(0.1);
    expect(percentageToDecimal(25)).toBe(0.25);
    expect(percentageToDecimal(50)).toBe(0.5);
    expect(percentageToDecimal(75)).toBe(0.75);
    expect(percentageToDecimal(100)).toBe(1);
  });
});
