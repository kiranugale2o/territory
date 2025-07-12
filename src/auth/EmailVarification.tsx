import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../utils';

const {width} = Dimensions.get('window');

const EmailVerification = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [newOtp, setNewOtp] = useState<number | null>(null);
  const [resendTimer, setResendTimer] = useState(300); // 5 minutes

  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Get email from AsyncStorage
    AsyncStorage.getItem('email').then(stored => {
      if (stored) setEmail(stored);
    });
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtpArr = [...otp];
    newOtpArr[index] = text;
    setOtp(newOtpArr);

    const joined = newOtpArr.join('');
    const number = parseInt(joined, 10);
    setNewOtp(number);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const storedHash = await AsyncStorage.getItem('otpHash');
    if (!storedHash) {
      Toast.show({type: 'error', text1: 'Error', text2: 'No OTP hash found'});
      return;
    }

    const res = await fetch(
      'https://api.reparv.in/territoryapp/client/verify-otp',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, otp: newOtp, hash: storedHash}),
      },
    );

    const data = await res.json();
    if (data.verified) {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'OTP verified successfully',
      });
      await AsyncStorage.removeItem('otpHash');
      navigation.navigate('PasswordResetMessage');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: data.message || 'Invalid OTP',
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch(
        `https://api.reparv.in/territoryapp/client/send-otp/${email}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (!res.ok) throw new Error('Failed to resend OTP');
      const data = await res.json();
      await AsyncStorage.setItem('otpHash', data.hash);
      setResendTimer(300); // Reset timer

      Toast.show({
        type: 'success',
        text1: 'OTP Resent',
        text2: 'Please check your email',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: 'Could not send OTP',
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
        <View style={styles.infoContainer}>
          <Text style={styles.checkEmail}>Check your email</Text>
          <Text style={styles.emailDescription}>
            We sent a reset link to {email}. Enter the 6-digit code from the
            email.
          </Text>
        </View>

        <View style={styles.codeContainer}>
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              style={styles.codeBox}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={text => handleOtpChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <TouchableOpacity disabled={resendTimer > 0} onPress={handleResendOtp}>
          <Text style={[styles.resendText, resendTimer > 0 && {color: '#aaa'}]}>
            {resendTimer > 0
              ? `Resend available in ${Math.floor(resendTimer / 60)
                  .toString()
                  .padStart(2, '0')}:${(resendTimer % 60)
                  .toString()
                  .padStart(2, '0')}`
              : 'Didn’t get the code? '}
            {resendTimer === 0 && (
              <Text style={styles.resendLink}>Resend email</Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
      <Toast config={toastConfig} />
    </View>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 100,
  },
  infoContainer: {
    marginBottom: 30,
  },
  checkEmail: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  emailDescription: {
    fontSize: 14,
    lineHeight: 24,
    color: 'rgba(0, 0, 0, 0.4)',
    fontFamily: 'Inter',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  codeBox: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    color: 'black',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  resendText: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 17,
    color: 'rgba(0, 0, 0, 0.4)',
    fontFamily: 'Inter',
  },
  resendLink: {
    color: '#0078DB',
    fontWeight: '600',
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
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
