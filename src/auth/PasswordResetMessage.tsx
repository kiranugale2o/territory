import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RootStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const PasswordResetMessage = async () => {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'PasswordResetMessage'
  >;
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Password reset</Text>

        {/* Description */}
        <Text style={styles.description}>
          Your password has been successfully reset. Click confirm to set a new
          password.
        </Text>
      </View>
      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('SetNewPassword');
        }}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordResetMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 100,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#000000',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    color: 'rgba(0, 0, 0, 0.4)',
    fontFamily: 'Inter',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0078DB',
    height: 48,
    marginBottom: 20,
    margin: 'auto',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});
