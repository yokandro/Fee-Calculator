import dayjs from 'dayjs';

export const areDatesInSameWeek = (date1String, date2String) => {
  const date1 = dayjs(date1String);
  const date2 = dayjs(date2String);

  const isSameWeek = date1.isSame(date2, 'week');

  return isSameWeek;
};

export const roundToSmallestCurrency = (value, smallestCurrencyItem = 0.01) => {
  return Math.ceil(value / smallestCurrencyItem) * smallestCurrencyItem;
};

export const percentageToDecimal = (percentage) => percentage / 100;
