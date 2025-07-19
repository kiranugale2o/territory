import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PasswordChangedSuccess: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'PasswordResetMessage'
  >;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Sign_In');
    }, 5000);

    return () => clearTimeout(timer); // ✅ Cleanup to prevent memory leaks
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.successIconContainer}>
        <Svg width={62} height={62} viewBox="0 0 62 62" fill="none">
          <Path
            d="M59.8181 30.9987C60.7756 29.8837 61.4466 28.5519 61.7729 27.1188C62.0992 25.6858 62.0709 24.1947 61.6904 22.7751C61.31 21.3554 60.589 20.0501 59.5898 18.9722C58.5907 17.8943 57.3437 17.0765 55.9569 16.5896C56.2286 15.1452 56.1438 13.6562 55.7098 12.252C55.2757 10.8477 54.5056 9.5706 53.4663 8.53137C52.4269 7.49214 51.1497 6.7222 49.7454 6.28836C48.3411 5.85452 46.8521 5.76988 45.4077 6.04179C44.9213 4.65471 44.1036 3.40733 43.0257 2.40795C41.9478 1.40857 40.6422 0.687407 39.2224 0.30706C37.8025 -0.0732862 36.3113 -0.101314 34.8782 0.22541C33.445 0.552134 32.1133 1.22373 30.9986 2.1819C29.8836 1.22439 28.5518 0.553398 27.1187 0.227126C25.6857 -0.0991468 24.1946 -0.0708426 22.775 0.309582C21.3554 0.690006 20.05 1.41106 18.9721 2.4102C17.8942 3.40933 17.0764 4.65637 16.5895 6.04313C15.1452 5.77166 13.6564 5.85668 12.2523 6.29081C10.8483 6.72495 9.57133 7.49508 8.53226 8.53441C7.4932 9.57374 6.72339 10.8509 6.28962 12.2551C5.85585 13.6592 5.77121 15.148 6.04304 16.5923C4.65628 17.0791 3.40924 17.897 2.41011 18.9749C1.41097 20.0527 0.689911 21.3581 0.309487 22.7778C-0.0709374 24.1974 -0.0992457 25.6884 0.227027 27.1215C0.553299 28.5546 1.22431 29.8864 2.18181 31.0014C1.22402 32.1164 0.552802 33.4483 0.226436 34.8815C-0.0999288 36.3147 -0.071596 37.8059 0.308995 39.2257C0.689586 40.6454 1.41092 41.9509 2.4104 43.0287C3.40988 44.1065 4.65731 44.9241 6.04439 45.4105C5.77232 46.8548 5.85686 48.3437 6.29069 49.748C6.72451 51.1522 7.49451 52.4294 8.53384 53.4685C9.57316 54.5077 10.8504 55.2776 12.2547 55.7112C13.659 56.1449 15.1479 56.2292 16.5922 55.957C17.0791 57.3437 17.8969 58.5908 18.9748 59.5899C20.0527 60.589 21.358 61.3101 22.7777 61.6905C24.1973 62.0709 25.6883 62.0992 27.1214 61.773C28.5545 61.4467 29.8863 60.7757 31.0013 59.8182C32.1163 60.776 33.4482 61.4472 34.8814 61.7736C36.3146 62.0999 37.8058 62.0716 39.2256 61.691C40.6454 61.3104 41.9508 60.5891 43.0286 59.5896C44.1064 58.5901 44.924 57.3427 45.4104 55.9556C46.8548 56.2276 48.3437 56.143 49.748 55.7092C51.1522 55.2754 52.4294 54.5054 53.4687 53.4661C54.508 52.4268 55.278 51.1496 55.7118 49.7454C56.1456 48.3411 56.2302 46.8522 55.9582 45.4078C57.3451 44.9211 58.5922 44.1033 59.5914 43.0253C60.5906 41.9474 61.3116 40.6419 61.692 39.2222C62.0723 37.8025 62.1004 36.3114 61.7738 34.8783C61.4473 33.4452 60.776 32.1135 59.8181 30.9987Z"
            fill="#18C07A"
          />
          <Path
            d="M25.4353 42.8322L16.8208 34.2231C16.4938 33.8956 16.3102 33.4518 16.3102 32.9891C16.3102 32.5263 16.4938 32.0825 16.8208 31.755L17.8673 30.7071C18.1948 30.3802 18.6386 30.1966 19.1013 30.1966C19.5641 30.1966 20.0079 30.3802 20.3354 30.7071L26.5974 36.9652L41.3451 21.2932C41.6624 20.9565 42.1004 20.7594 42.5628 20.7453C43.0253 20.7312 43.4745 20.9012 43.8117 21.218L44.8866 22.2323C45.2237 22.5497 45.4209 22.9879 45.4351 23.4507C45.4492 23.9135 45.2789 24.363 44.9618 24.7003L27.945 42.7933C27.7848 42.964 27.5918 43.1008 27.3777 43.1955C27.1635 43.2902 26.9325 43.3409 26.6984 43.3446C26.4643 43.3482 26.2318 43.3047 26.0148 43.2167C25.7978 43.1287 25.6007 42.9979 25.4353 42.8322Z"
            fill="white"
          />
        </Svg>
      </View>

      <Text style={styles.successText}>Successful</Text>

      <Text style={styles.message}>
        Congratulations! Your password has been changed. Redirecting to login...
      </Text>
      {/* Continue Button */}
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Sign_In');
        }}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default PasswordChangedSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#000000',
    letterSpacing: -0.45,
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    color: '#989898',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: 'Inter',
    marginBottom: 30,
    width: '100%',
  },
  button: {
    backgroundColor: '#0078DB',
    height: 48,
    width: '100%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});
