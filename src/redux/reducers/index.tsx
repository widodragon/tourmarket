import { combineReducers } from 'redux';

import common from './common';
import transaction from './transaction';

const appReducer = combineReducers({
  common,
  transaction,
});

export default appReducer;
