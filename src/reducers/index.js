import { combineReducers } from 'redux';
import { actionTypes, firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

const appReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export default appReducer;