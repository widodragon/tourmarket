const initialState = {
  transactionData: null,
};

const transaction = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_TRANSACTION_DATA':
      return {
        ...state,
        transactionData: action.transactionData,
      };
    case 'CLEAR_TRANSACTION_DATA':
      return {
        ...state,
        transactionData: null,
      };
    default:
      return state;
  }
};

export default transaction;
