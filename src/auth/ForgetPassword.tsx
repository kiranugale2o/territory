import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Touchable,
  Button,
  Alert,
} from 'react-native';
import {RootStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../utils';

const {width} = Dimensions.get('window');

const ForgotPassword = () => {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Sign_In'
  >;
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState('');
  const sendOtp = async () => {
    try {
      const res = await fetch(
        `https://api.reparv.in/territoryapp/client/send-otp/${email}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (!res.ok) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Email not found`,
        });
        throw new Error('Failed to send OTP');
      }

      const data = await res.json();
      console.log('OTP sent. Store this hash:', data.hash);

      await AsyncStorage.setItem('otpHash', data.hash);
      await AsyncStorage.setItem('email', email);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Otp send successfully on ${email}`,
      });
      navigation.navigate('EmailVerification');
      return data.hash;
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Optionally show a user-friendly alert

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Email not found`,
      });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Forgot password</Text>
        <Text style={styles.subheading}>
          Please enter your email to reset the password
        </Text>

        <Text style={styles.label}>Your Email</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      {/* Reset Password Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          sendOtp();
        }}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <Toast config={toastConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginHorizontal: 25,
  },
  heading: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Inter',
    lineHeight: 19,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
    fontFamily: 'Inter',
    lineHeight: 19,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    letterSpacing: -0.48,
    color: '#000',
    marginBottom: 10,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#000',
  },
  button: {
    display: 'flex',
    height: 49,
    width: '90%',
    margin: 'auto',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0078DB',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default ForgotPassword;
