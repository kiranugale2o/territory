import React, {useContext, useEffect, useState} from 'react';
import {Image, Keyboard, SafeAreaView, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import SignIn from './src/auth/signIn';
import ForgotPassword from './src/auth/ForgetPassword';
import EmailVerification from './src/auth/EmailVarification';
import PasswordResetMessage from './src/auth/PasswordResetMessage';
import SetNewPassword from './src/auth/SetPassword';
import PasswordChangedSuccess from './src/auth/PasswordChangedSuccess';
import AuthStack from './src/navigation/AuthStack';
// import {AuthContext, AuthProvider} from './src/context/AuthContext';
import AppStack from './src/navigation/AppStack';
import Loader from './src/component/loader';
import {AuthContext, AuthProvider} from './src/context/AuthContext';
//import AsyncStorage from '@react-native-async-storage/async-storage';

// import {requestUserPermission} from './src/firebaseNotification';

// import BellIcon from './src/component/Bellicon'; // unused in this code

// App Entry Point

//console.log(AsyncStorage, 'sssssssss');

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AuthProvider>
  );
}

// Separate component that consumes the context safely
function MainApp() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null; // or a loading screen or error message
  }

  return auth.isLoding ? (
    <Loader />
  ) : auth.token === null ? (
    <AuthStack />
  ) : (
    <AppStack />
  );
  //return <AppStack />;
}