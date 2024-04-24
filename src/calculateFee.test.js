import {
  calculateCashInFee,
  calculateJuridicalCashOutFee,
  calculateNaturalCashOutFee,
  calculateFee,
} from './calculateFee.js';
import {
  CASH_IN_COMMISSION_FEE_PERCENTAGE,
  CASH_OUT_COMMISSION_FEE_PERCENTAGE,
  CASH_OUT_WEEKLY_LIMIT,
  MAX_CASH_IN_COMMISSION_FEE,
  MIN_CASH_OUT_COMMISSION_FEE,
  OPERATION_TYPES,
  USER_TYPES,
} from './constants.js';

describe('calculateCashInFee', () => {
  test('calculates the correct cash-in fee', () => {
    const operation = {
      operation: {
        amount: 1000,
      },
    };
    const fee = calculateCashInFee(operation);
    expect(fee).toBe(1000 * (CASH_IN_COMMISSION_FEE_PERCENTAGE / 100));
  });

  test('returns the maximum cash-in fee if the calculated fee exceeds it', () => {
    const operation = {
      operation: {
        amount: 1000000,
      },
    };
    const fee = calculateCashInFee(operation);
    expect(fee).toBe(MAX_CASH_IN_COMMISSION_FEE);
  });
});

describe('calculateJuridicalCashOutFee', () => {
  test('calculates the correct cash-out fee for juridical users', () => {
    const operation = {
      operation: {
        amount: 1000,
      },
    };
    const fee = calculateJuridicalCashOutFee(operation);
    expect(fee).toBe(1000 * (CASH_OUT_COMMISSION_FEE_PERCENTAGE / 100));
  });

  test('returns the minimum cash-out fee if the calculated fee is less than it', () => {
    const operation = {
      operation: {
        amount: 1,
      },
    };
    const fee = calculateJuridicalCashOutFee(operation);
    expect(fee).toBe(MIN_CASH_OUT_COMMISSION_FEE);
  });
});

describe('calculateNaturalCashOutFee', () => {
  test('calculates the correct cash-out fee for natural users within the weekly limit', () => {
    const operation = {
      user_id: 2,
      date: '2023-04-17T00:00:00.000Z',
      operation: {
        amount: 500,
      },
    };
    const fee = calculateNaturalCashOutFee(operation);
    expect(fee).toBe(0);
  });

  test('calculates the correct cash-out fee for natural users exceeding the weekly limit', () => {
    const operation = {
      user_id: 3,
      date: '2023-04-17T00:00:00.000Z',
      operation: {
        amount: 1500,
      },
    };
    const fee = calculateNaturalCashOutFee(operation);
    expect(fee).toBe(
      (1500 - CASH_OUT_WEEKLY_LIMIT) *
        (CASH_OUT_COMMISSION_FEE_PERCENTAGE / 100)
    );
  });

  test('calculates the correct cash-out fee for natural users with multiple operations in the same week', () => {
    const operation1 = {
      user_id: 1,
      date: '2023-04-17T00:00:00.000Z',
      operation: {
        amount: 500,
      },
    };
    calculateNaturalCashOutFee(operation1);

    const operation2 = {
      user_id: 1,
      date: '2023-04-19T00:00:00.000Z',
      operation: {
        amount: 600,
      },
    };
    const fee = calculateNaturalCashOutFee(operation2);
    expect(fee).toBe(100 * (CASH_OUT_COMMISSION_FEE_PERCENTAGE / 100));
  });
});

describe('calculateFee', () => {
  test('calculates the correct cash-in fee', () => {
    const operation = {
      type: OPERATION_TYPES.CASH_IN,
      operation: {
        amount: 1000,
      },
    };
    const fee = calculateFee(operation);
    expect(fee).toBe(calculateCashInFee(operation));
  });

  test('calculates the correct cash-out fee for juridical users', () => {
    const operation = {
      type: OPERATION_TYPES.CASH_OUT,
      user_type: USER_TYPES.JURIDICAL,
      operation: {
        amount: 1000,
      },
    };
    const fee = calculateFee(operation);
    expect(fee).toBe(calculateJuridicalCashOutFee(operation));
  });

  test('calculates the correct cash-out fee for natural users', () => {
    const operation = {
      type: OPERATION_TYPES.CASH_OUT,
      user_type: USER_TYPES.NATURAL,
      user_id: 1,
      date: '2023-04-17T00:00:00.000Z',
      operation: {
        amount: 1000,
      },
    };
    const fee = calculateFee(operation);
    expect(fee).toBe(calculateNaturalCashOutFee(operation));
  });
});
