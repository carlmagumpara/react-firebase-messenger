import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

function Auth({ children }) {
  const auth = useSelector(state => state.firebase.auth);

  if (auth.isEmpty) {
    return <Navigate to="/login" />
  }

  return children
}

export default Auth;