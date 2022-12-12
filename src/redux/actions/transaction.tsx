export const setTransactionData = (transactionData: any) => {
  return {
    type: 'SET_TRANSACTION_DATA',
    transactionData,
  };
};

export const clearTransactionData = () => {
  return {
    type: 'CLEAR_TRANSACTION_DATA',
  };
};
