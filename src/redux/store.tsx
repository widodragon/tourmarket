import { legacy_createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducers';
const persistConfig = {
  key: 'root',
  storage,
};
const logger = createLogger({});
const persistedReducer = persistReducer(persistConfig, reducer);

export const store = legacy_createStore(
  persistedReducer,
  applyMiddleware(logger, promiseMiddleware)
);
export const persistor = persistStore(store);
