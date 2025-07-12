import React, { useContext, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/AuthContext';
import { toastConfig } from '../utils';

const PasswordUpdateModal = ({ visible, onClose, onUpdatePassword }) => {
    
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const auth=useContext(AuthContext);
  const handleUpdate = async() => {
    if ( !newPassword || !confirmPassword) {
 
      Toast.show({
        type:'info',
        text1:'Error',
        text2:'Please fill in all fields..'
      })
      return;
    }

    if (newPassword !== confirmPassword) {
      //Alert.alert('Error', 'New password and confirm password do not match.');
      Toast.show({
        type:'info',
        text1:'Error',
        text2:'New password and confirm password do not match.'
      })
      return;
    }

    // Trigger parent handler
 await handleResetPassword()

    // Clear fields & close
   
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };


   
  
    const handleResetPassword = async () => {
    //  const email = await AsyncStorage.getItem('email');
  
      if (confirmPassword.length < 6) {
        return Alert.alert('Weak Password', 'Use at least 6 characters.');
      }
  
      try {
        const res = await fetch(
          'https://api.reparv.in/territoryapp/client/reset-password',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:auth?.user?.email, newPassword: confirmPassword}),
          },
        );
  
        const data = await res.json();
      
        if (data.success) {
      
          Toast.show({
    type:'success',
    text1:'Successfully Updated !'
  })
    // Delay 3 seconds before closing modal and navigating
  setTimeout(() => {
    onClose();
   
  }, 5000);
 
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `Error, ${data.message || 'Reset failed'} `,
          });
            onClose()
        }
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong.',
        });
          onClose()
 
      }
    };
  
    const [showPassword, setShowPassword] = useState(false);
    const [confirmshowPassword, setConfirmShowPassword] = useState(false);
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Update Password</Text>

         

          <TextInput
            style={styles.input}
            placeholder="New Password"
             placeholderTextColor={'gray'}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
             placeholderTextColor={'gray'}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate} style={[styles.button, styles.update]}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast config={toastConfig}/>
    </Modal>
  );
};

export default PasswordUpdateModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color:'black',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 10,
  },
  cancel: {
    backgroundColor: '#bbb',
  },
  update: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
