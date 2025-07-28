import React, { useContext, useEffect, useState } from 'react';
import { Image, Keyboard, SafeAreaView, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

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
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';

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
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Sign_In'
  >;
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>();

  const [userData, setUserData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  const showDetails = async () => {
    try {
      setIsFetching(true);
      const res = await fetch(
        `https://api.reparv.in/admin/territorypartner/get/${auth?.user?.id}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (!res.ok) throw new Error('Failed to fetch details');
      const data = await res.json();
      setUserData(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsFetching(false);
    }
  };

  console.log('userData:', userData);
  console.log('adharno:', userData?.adharno);
  console.log(
    'Is empty or missing?',
    !userData?.adharno || userData.adharno.trim() === '',
  );

  useEffect(() => {
    if (auth?.user?.id) {
      showDetails();
    }
  }, [auth?.user?.id]);

  if (!auth || auth.isLoding || isFetching) {
    return <Loader />;
  }

  if (auth.token === null) {
    return <AuthStack />;
  }

  // ✅ Render nothing until userData is available
  if (!userData) {
    return <Loader />;
  }

  // ✅ Check KYC based on adharno
  const isKYCIncomplete =
    !userData.adharno || userData.adharno.trim().length === 0;

  return <AppStack initialRouteName={isKYCIncomplete ? 'KYC' : 'MainTabs'} />;
}
