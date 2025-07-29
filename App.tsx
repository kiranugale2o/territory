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
      <NavigationContainer >
        <MainApp />
      </NavigationContainer>
    </AuthProvider>
  );
}

import BackgroundFetch from "react-native-background-fetch";

function MainApp() {
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
useEffect(() => {
  const setupBackgroundFetch = async () => {
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Android only, in minutes
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async (taskId) => {
        console.log('[BackgroundFetch] Event received:', taskId);
        // You can run check manually here too (optional)
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.warn('[BackgroundFetch] Failed to configure', error);
      }
    );

    console.log('[BackgroundFetch] Configured with status:', status);
  };

  setupBackgroundFetch();
}, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth?.user?.id && auth.token) {
        try {
          const res = await fetch(
            `https://api.reparv.in/admin/territorypartner/get/${auth.user.id}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            },
          );
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.log('Error fetching user details:', err);
        } finally {
          setIsFetching(false);
        }
      } else {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [auth?.user?.id, auth?.token]);

  if (auth?.isLoding || isFetching) return <Loader />;
  if (!auth?.token || !auth?.user) return <AuthStack />;
  if (!userData) return <Loader />;

  const isKYCIncomplete =
    !userData.adharno || userData.adharno.trim().length === 0;

  return <AppStack initialRouteName={isKYCIncomplete ? 'KYC' : 'MainTabs'} />;
}
