import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

function Guest({ children }) {
  const auth = useSelector(state => state.firebase.auth);

  if (!auth.isEmpty) {
    return <Navigate to="/conversations" />
  }

  return children
}

export default Guest;