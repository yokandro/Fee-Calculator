import {
  CASH_IN_COMMISSION_FEE_PERCENTAGE,
  CASH_OUT_COMMISSION_FEE_PERCENTAGE,
  CASH_OUT_WEEKLY_LIMIT,
  MAX_CASH_IN_COMMISSION_FEE,
  MIN_CASH_OUT_COMMISSION_FEE,
  OPERATION_TYPES,
  USER_TYPES,
} from './constants.js';
import {
  roundToSmallestCurrency,
  areDatesInSameWeek,
  percentageToDecimal,
} from './helpers.js';

const userCashOutOperationsStore = {};

export const calculateCashInFee = (operation) => {
  const cashInFee = percentageToDecimal(CASH_IN_COMMISSION_FEE_PERCENTAGE);

  const fee = operation.operation.amount * cashInFee;

  if (fee > MAX_CASH_IN_COMMISSION_FEE) return MAX_CASH_IN_COMMISSION_FEE;

  return fee;
};

export const calculateJuridicalCashOutFee = (operation) => {
  const cashOutFee = percentageToDecimal(CASH_OUT_COMMISSION_FEE_PERCENTAGE);

  const fee = operation.operation.amount * cashOutFee;

  if (fee < MIN_CASH_OUT_COMMISSION_FEE) return MIN_CASH_OUT_COMMISSION_FEE;

  return fee;
};

export const calculateNaturalCashOutFee = (operation) => {
  const cashOutFee = percentageToDecimal(CASH_OUT_COMMISSION_FEE_PERCENTAGE);

  const operationAmount = operation.operation.amount;
  const userOperation = userCashOutOperationsStore[operation.user_id];

  // set first user operation if it doesn't exist
  if (!userOperation) {
    userCashOutOperationsStore[operation.user_id] = {
      date: operation.date,
      totalAmount: operationAmount,
    };

    return operationAmount > CASH_OUT_WEEKLY_LIMIT
      ? (operationAmount - CASH_OUT_WEEKLY_LIMIT) * cashOutFee
      : 0;
  }

  if (areDatesInSameWeek(userOperation.date, operation.date)) {
    /* 
      If the total amount of the user's operation plus the current operation amount
      exceeds the weekly limit, calculate the fee for the amount that exceeds the limit
    */
    if (
      userOperation.totalAmount < CASH_OUT_WEEKLY_LIMIT &&
      userOperation.totalAmount + operationAmount > CASH_OUT_WEEKLY_LIMIT
    ) {
      const fee =
        (userOperation.totalAmount + operationAmount - CASH_OUT_WEEKLY_LIMIT) *
        cashOutFee;

      userOperation.totalAmount += operationAmount;

      return fee;
    }

    userOperation.totalAmount += operationAmount;

    return userOperation.totalAmount > CASH_OUT_WEEKLY_LIMIT
      ? operationAmount * cashOutFee
      : 0;
  }

  // Update the user's operation if the operation is not in the same week
  userOperation.date = operation.date;
  userOperation.totalAmount = operationAmount;

  return operationAmount > CASH_OUT_WEEKLY_LIMIT
    ? (operationAmount - CASH_OUT_WEEKLY_LIMIT) * cashOutFee
    : 0;
};

export const calculateFee = (operation) => {
  let fee = 0;

  if (operation.type === OPERATION_TYPES.CASH_IN) {
    fee = calculateCashInFee(operation);
  }

  if (operation.type === OPERATION_TYPES.CASH_OUT) {
    if (operation.user_type === USER_TYPES.JURIDICAL) {
      fee = calculateJuridicalCashOutFee(operation);
    }
    if (operation.user_type === USER_TYPES.NATURAL) {
      fee = calculateNaturalCashOutFee(operation);
    }
  }

  return roundToSmallestCurrency(fee);
};
