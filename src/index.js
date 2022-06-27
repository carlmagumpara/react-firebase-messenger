import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { store, persistor } from './store';

import AuthIsLoaded from './pages/components/AuthIsLoaded';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const fbConfig = {
  apiKey: "AIzaSyApAY8dy-c6whCW--qf_VJsuW8_-EeWL4o",
  authDomain: "react-firebase-messenger-f756a.firebaseapp.com",
  projectId: "react-firebase-messenger-f756a",
  storageBucket: "react-firebase-messenger-f756a.appspot.com",
  messagingSenderId: "758391715948",
  appId: "1:758391715948:web:1600fee6751a0bdcd0c049"
};

firebase.initializeApp(fbConfig);

const rrfConfig = {
  userProfile: 'profiles',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider>
            <BrowserRouter>
              <AuthIsLoaded>
                <App />
              </AuthIsLoaded>
            </BrowserRouter>
          </ChakraProvider>
        </PersistGate>
      </ReactReduxFirebaseProvider>
    </Provider>  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
