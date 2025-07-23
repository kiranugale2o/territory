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

const KYC = () => {
  const navigation = useNavigation();
  const auth = useContext(AuthContext);

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

  const isFormValid = () => {
    const {
      bankname,
      accountholdername,
      accountnumber,
      ifsc,
      address,
      state,
      city,
      pincode,
      adharno,
      panno,
      experience,
    } = userData;

    return (
      bankname?.trim() &&
      accountholdername?.trim() &&
      /^\d{9,17}$/.test(accountnumber) &&
      /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc) &&
      address?.trim() &&
      state &&
      city &&
      /^\d{6}$/.test(pincode) &&
      /^\d{12}$/.test(adharno) &&
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panno) &&
      experience?.trim()
    );
  };

  const [formErrors, setFormErrors] = useState({});

  const [imageFiles, setImageFiles] = useState({
    adharImage: null,
    panImage: null,
    reraImage: null,
  });

  const launchImagePicker = category => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            'Image Error',
            response.errorMessage || 'Unable to pick image',
          );
          return;
        }
        const asset = response.assets?.[0];
        if (asset) {
          setImageFiles(prev => ({ ...prev, [category]: asset }));
        }
      },
    );
  };

  const removeImage = category => {
    setImageFiles(prev => ({ ...prev, [category]: null }));
  };

  const fetchStates = async () => {
    try {
      const res = await fetch(`https://api.reparv.in/admin/states`);
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
      const res = await fetch(
        `https://api.reparv.in/admin/cities/${userData.state}`,
      );
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      setCitiesList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const showDetails = async () => {
    try {
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
      console.log(data, 'fffffffff');

      setUserData(data);
    } catch (e) {
      console.log(e);
    }
  };

  /* ────────────────────────── Submit ────────────────────────── */
  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) =>
      formData.append(key, value),
    );

    // 3 image fields (if selected)
    ['adharImage', 'panImage', 'reraImage'].forEach(field => {
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
      const res = await fetch(
        `https://api.reparv.in/admin/territorypartner/edit/${auth?.user?.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

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
      console.log(e.message, 'err');
    }
  };

  useEffect(() => {
    showDetails();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [userData.state]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Enter Details to Start Your Journey</Text>

        {/* Step 1: Bank Details */}
        <Text style={styles.step}>Step 1: Bank Details</Text>
        <Text style={styles.label}>Bank Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Bank Name*"
          value={userData.bankname}
          placeholderTextColor={'gray'}
          onChangeText={t => setUserData({ ...userData, bankname: t })}
        />

        <Text style={styles.label}>Account Holder Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Account Holder Name*"
          value={userData.accountholdername}
          placeholderTextColor={'gray'}
          onChangeText={t => setUserData({ ...userData, accountholdername: t })}
        />

        <Text style={styles.label}>Account Number*</Text>
        <TextInput
          style={styles.input}
          placeholder="Account Number*"
          keyboardType="number-pad"
          value={userData.accountnumber}
          placeholderTextColor={'gray'}
          onChangeText={t =>
            /^\d{0,17}$/.test(t) &&
            setUserData({ ...userData, accountnumber: t })
          }
        />

        <Text style={styles.label}>IFSC Code*</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: SBIN0001234"
          autoCapitalize="characters"
          value={userData.ifsc}
          placeholderTextColor="gray"
          onChangeText={t => {
            const val = t.toUpperCase();
            setUserData({ ...userData, ifsc: val });
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(val)) {
              setFormErrors(prev => ({
                ...prev,
                ifsc: 'Invalid IFSC format (e.g., SBIN0001234)',
              }));
            } else {
              setFormErrors(prev => ({ ...prev, ifsc: '' }));
            }
          }}
        />
        {formErrors.ifsc ? (
          <Text style={styles.errorText}>{formErrors.ifsc}</Text>
        ) : null}

        {/* Step 2: Address Details */}
        <Text style={styles.step}>Step 2: Address Details</Text>
        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={styles.input}
          placeholder="Address*"
          placeholderTextColor={'gray'}
          value={userData.address}
          onChangeText={t => setUserData({ ...userData, address: t })}
        />

        <Text style={styles.label}>State*</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={userData.state}
            onValueChange={v => setUserData({ ...userData, state: v })}
            style={styles.picker}
          >
            <Picker.Item label="Select your State" value="" />
            {statesList.map((s, i) => (
              <Picker.Item key={i} label={s.state} value={s.state} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>City*</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={userData.city}
            onValueChange={v => setUserData({ ...userData, city: v })}
            style={styles.picker}
          >
            <Picker.Item label="Select your City" value="" />
            {citiesList.map((c, i) => (
              <Picker.Item key={i} label={c.city} value={c.city} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Pin Code*</Text>
        <TextInput
          style={styles.input}
          placeholder="Pin Code*"
          keyboardType="number-pad"
          value={userData.pincode?.toString() || ''}
          onChangeText={t =>
            /^\d{0,6}$/.test(t) && setUserData({ ...userData, pincode: t })
          }
        />

        {/* Step 3: Other Details */}
        <Text style={styles.step}>Step 3: Other Details & Proof</Text>
        <Text style={styles.label}>Aadhaar Number*</Text>
        <TextInput
          style={styles.input}
          placeholder="12-digit Aadhaar (e.g., 123412341234)"
          placeholderTextColor="gray"
          keyboardType="number-pad"
          value={userData.adharno}
          onChangeText={t => {
            setUserData({ ...userData, adharno: t });
            if (!/^\d{12}$/.test(t)) {
              setFormErrors(prev => ({
                ...prev,
                adharno: 'Invalid Aadhaar number (must be 12 digits)',
              }));
            } else {
              setFormErrors(prev => ({ ...prev, adharno: '' }));
            }
          }}
        />
        {formErrors.adharno ? (
          <Text style={styles.errorText}>{formErrors.adharno}</Text>
        ) : null}

        <Text style={styles.label}>PAN Number*</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: ABCDE1234F"
          placeholderTextColor="gray"
          autoCapitalize="characters"
          value={userData.panno}
          onChangeText={t => {
            const formatted = t.toUpperCase();
            setUserData({ ...userData, panno: formatted });

            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formatted)) {
              setFormErrors(prev => ({
                ...prev,
                panno: 'Invalid PAN format (e.g., ABCDE1234F)',
              }));
            } else {
              setFormErrors(prev => ({ ...prev, panno: '' }));
            }
          }}
        />
        {formErrors.panno ? (
          <Text style={styles.errorText}>{formErrors.panno}</Text>
        ) : null}

        <Text style={styles.label}>RERA Number</Text>
        <TextInput
          style={styles.input}
          placeholder="RERA Number"
          placeholderTextColor={'gray'}
          autoCapitalize="characters"
          value={userData.rerano}
          onChangeText={t =>
            /^[A-Z0-9]{0,10}$/.test(t) &&
            setUserData({ ...userData, rerano: t.toUpperCase() })
          }
        />

        <Text style={styles.label}>Experience*</Text>
        <TextInput
          style={styles.input}
          placeholder="Experience*"
          placeholderTextColor={'gray'}
          value={userData.experience}
          onChangeText={t => setUserData({ ...userData, experience: t })}
        />

        <UploadBlock
          label="Upload Aadhaar Card Image*"
          file={imageFiles.adharImage}
          onPick={() => launchImagePicker('adharImage')}
          onRemove={() => removeImage('adharImage')}
        />
        <UploadBlock
          label="Upload PAN Card Image*"
          file={imageFiles.panImage}
          onPick={() => launchImagePicker('panImage')}
          onRemove={() => removeImage('panImage')}
        />
        <UploadBlock
          label="Upload RERA Image"
          file={imageFiles.reraImage}
          onPick={() => launchImagePicker('reraImage')}
          onRemove={() => removeImage('reraImage')}
        />

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancel]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.save,
              !isFormValid() && { backgroundColor: '#999' },
            ]}
            disabled={!isFormValid()}
            onPress={handleSubmit}
          >
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

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

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },

  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  scroll: { paddingBottom: 40 },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: 'black',
  },
  step: { fontSize: 16, fontWeight: '600', marginVertical: 10, color: 'black' },
  label: { fontSize: 14, color: 'black', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: { height: 50, width: '100%', color: 'black' },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: { color: '#777' },
  previewWrap: { marginTop: 8 },
  preview: { width: '100%', height: 200, borderRadius: 8 },
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
  cancel: { backgroundColor: '#000000B2' },
  save: { backgroundColor: '#0078DB' },
  btnText: { color: '#fff', fontWeight: '600' },
});

export default KYC;
