import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';

import { useAuth } from '../store/auth';
import { AuthContext } from '../../context/AuthContext';
import { logger } from 'react-native-reanimated/lib/typescript/logger';

/**
 * KYC (Know‑Your‑Customer) screen converted from React‑web to React Native.
 *
 * 🔧 External dependencies (install & link):
 *   npm install @react-native-picker/picker react-native-image-picker
 *   npx pod-install  # for iOS
 *   • Configure the appropriate Android & iOS permissions for photo library / camera.
 */

const KYC = () => {
  const navigation = useNavigation();
  const auth=useContext(AuthContext)
  /* ──────────────────────────────── State ─────────────────────────────── */
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [userData, setUserData] = useState({
    id: '',
    fullname: '',
    contact: '',
    email: '',
    address: '',
    state: '',
    city: '',
    pincode: null,
    experience: '',
    adharno: '',
    panno: '',
    rerano: '',
    ifsc: '',
    bankname: '',
    accountnumber: '',
    accountholdername: '',
  });

  const [imageFiles, setImageFiles] = useState({
    adharImage: null,
    panImage: null,
    reraImage: null,
  });

  /* ────────────────────────── Helpers ────────────────────────── */
  const launchImagePicker = (category) => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Image Error', response.errorMessage || 'Unable to pick image');
          return;
        }
        const asset = response.assets?.[0];
        if (asset) {
          setImageFiles((prev) => ({ ...prev, [category]: asset }));
        }
      },
    );
  };

  const removeImage = (category) => {
    setImageFiles((prev) => ({ ...prev, [category]: null }));
  };

  /* ────────────────────────── API Calls ────────────────────────── */
  const fetchStates = async () => {
    try {
      const res = await fetch(`https://api.reparv.in/admin/states`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch states');
      const data = await res.json();
      setStatesList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCities = async () => {
    if (!userData.state) return;
    try {
      const res = await fetch(`https://api.reparv.in/admin/cities/${userData.state}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      setCitiesList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const showDetails = async () => {
    try {
      const res = await fetch(`https://api.reparv.in/admin/territorypartner/get/${auth?.user?.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch details');
      const data = await res.json();
      console.log(data,"fffffffff");
      
            setUserData(data);
    } catch (e) {
      console.log(e);
    }
  };

  /* ────────────────────────── Submit ────────────────────────── */
  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => formData.append(key, value));

    // 3 image fields (if selected)
    ['adharImage', 'panImage', 'reraImage'].forEach((field) => {
      const file = imageFiles[field];
      if (file) {
        formData.append(field, {
          uri: file.uri,
          type: file.type,
          name: file.fileName ?? `${field}.jpg`,
        });
      }
    });

    try {
      
      const res = await fetch(`https://api.reparv.in/admin/territorypartner/edit/${auth?.user?.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 409) {
        Alert.alert('Partner already exists!');
        return;
      }
      if (!res.ok) {
        Alert.alert('Error', `Failed – Status ${res.status}`);
        return;
      }

      Alert.alert('Success', 'KYC submitted successfully!.Login Again !', [
        {
          text: 'OK',
          onPress: () => auth?.logout(),
        },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
      console.log(e.message,"err");
      
    }
  };

  /* ─────────────── Lifecycle ────────────────────────── */
  useEffect(() => {
    showDetails();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [userData.state]);

  /* ────────────────────────── Render ────────────────────────── */
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Enter Details to Start Your Journey</Text>

        {/* Step 1: Bank Details */}
        <Text style={styles.step}>Step 1: Bank Details</Text>
        <TextInput style={styles.input} placeholder="Bank Name*" value={userData.bankname} placeholderTextColor={'gray'} onChangeText={(t) => setUserData({ ...userData, bankname: t })} />
        <TextInput style={styles.input} placeholder="Account Holder Name*" placeholderTextColor={'gray'} value={userData.accountholdername} onChangeText={(t) => setUserData({ ...userData, accountholdername: t })} />
        <TextInput style={styles.input} placeholder="Account Number*" placeholderTextColor={'gray'} keyboardType="number-pad" value={userData.accountnumber} onChangeText={(t) => /^\d{0,17}$/.test(t) && setUserData({ ...userData, accountnumber: t })} />
        <TextInput style={styles.input} placeholder="IFSC Code*" placeholderTextColor={'gray'} autoCapitalize="characters" value={userData.ifsc} onChangeText={(t) => /^[A-Z0-9]{0,11}$/.test(t) && setUserData({ ...userData, ifsc: t.toUpperCase() })} />

        {/* Step 2: Address Details */}
        <Text style={styles.step}>Step 2: Address Details</Text>
        <TextInput style={styles.input} placeholder="Address*" placeholderTextColor={'gray'} value={userData.address} onChangeText={(t) => setUserData({ ...userData, address: t })} />

        <Text style={styles.label}>State*</Text>
     <View
  style={{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  }}
>
  <Picker
    selectedValue={userData.state}
    onValueChange={(v) => setUserData({ ...userData, state: v })}
    style={{
      height: 50,
      width: '100%',
         color:'black'
    }}
  >
    <Picker.Item label="Select your State" value="" />
    {statesList.map((s, i) => (
      <Picker.Item key={i} label={s.state} value={s.state} />
    ))}
  </Picker>
</View>


        <Text style={styles.label}>City*</Text>
   <View
  style={{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    color:'black',
    overflow: 'hidden',
  }}
>
  <Picker
    selectedValue={userData.city}
    onValueChange={(v) => setUserData({ ...userData, city: v })}
    style={{
      height: 50,
      width: '100%',
      color:'black'
    }}
  >
    <Picker.Item label="Select your City" value="" />
    {citiesList.map((c, i) => (
      <Picker.Item key={i} label={c.city} value={c.city} />
    ))}
  </Picker>
</View>





        <TextInput style={styles.input} placeholder="Pin Code*" placeholderTextColor={'gray'} keyboardType="number-pad" value={userData.pincode?.toString() || ''}
 onChangeText={(t) => /^\d{0,6}$/.test(t) && setUserData({ ...userData, pincode: t })} />

        {/* Step 3: Other Details */}
        <Text style={styles.step}>Step 3: Other Details & Proof</Text>
        <TextInput style={styles.input} placeholder="Aadhaar Number*" placeholderTextColor={'gray'} keyboardType="number-pad" value={userData.adharno} onChangeText={(t) => /^\d{0,12}$/.test(t) && setUserData({ ...userData, adharno: t })} />
        <TextInput style={styles.input} placeholder="PAN Number*" placeholderTextColor={'gray'} autoCapitalize="characters" value={userData.panno} onChangeText={(t) => /^[A-Z0-9]{0,10}$/.test(t) && setUserData({ ...userData, panno: t.toUpperCase() })} />
        <TextInput style={styles.input} placeholder="RERA Number" placeholderTextColor={'gray'} autoCapitalize="characters" value={userData.rerano} onChangeText={(t) => /^[A-Z0-9]{0,10}$/.test(t) && setUserData({ ...userData, rerano: t.toUpperCase() })} />
        <TextInput style={styles.input} placeholder="Experience*" placeholderTextColor={'gray'} value={userData.experience} onChangeText={(t) => setUserData({ ...userData, experience: t })} />

        {/* Image Uploads */}
        <UploadBlock label="Upload Aadhaar Card Image*" file={imageFiles.adharImage} onPick={() => launchImagePicker('adharImage')} onRemove={() => removeImage('adharImage')} />
        <UploadBlock label="Upload PAN Card Image*" file={imageFiles.panImage} onPick={() => launchImagePicker('panImage')} onRemove={() => removeImage('panImage')} />
        <UploadBlock label="Upload RERA Image" file={imageFiles.reraImage} onPick={() => launchImagePicker('reraImage')} onRemove={() => removeImage('reraImage')} />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSubmit}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
   
    </View>
  );
};

/* ────────────────────────── Upload Block ────────────────────────── */
const UploadBlock = ({ label, file, onPick, onRemove }) => (
  <View style={{ marginVertical: 12 }}>
    <Text style={styles.label}>{label}</Text>
    {!file ? (
      <TouchableOpacity style={styles.uploadBox} onPress={onPick}>
        <Text style={styles.uploadText}>Tap to select image</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.previewWrap}>
        <Image source={{ uri: file.uri }} style={styles.preview} />
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Text style={{ color: '#fff' }}>✕</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

/* ────────────────────────── Styles ────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  scroll: {
    paddingBottom: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
     color:'black',
  },
  step: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color:'black'
  },
  label: {
    fontSize: 14,
    color: '#555',
     color:'black',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
     color:'black',
    fontSize: 15,
  },
  picker: {
    borderWidth: 1,
 color:'black',
    borderColor: 'gray',
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
     color:'black',
  },
  uploadText: {
    color: '#777',
     color:'black',
  },
  previewWrap: {
    marginTop: 8,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancel: {
    backgroundColor: '#000000B2',
  },
  save: {
    backgroundColor: '#0078DB',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default KYC;
