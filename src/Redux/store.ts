import { Action, Store } from '@reduxjs/toolkit';
import { createStore } from 'redux'
import { combineReducers } from 'redux'
import queue from './Store/Queue'

const rootReducer = combineReducers({
    queue
})
//@ts-ignore
const store: Store = createStore(rootReducer);
export default store;