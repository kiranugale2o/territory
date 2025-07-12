import React, {useContext, useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {X} from 'lucide-react-native';
import {AuthContext} from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

  
const SiteVisitModal = ({visible, onClose, id}) => {
  const auth = useContext(AuthContext);

  const [formData, setFormData] = useState({
    propertyid: id,
    fullname: '',
    phone: '',
    state:'',
    city:'',
    minbudget:null,
    maxbudget:null,
    salesPersonName: auth?.user?.name,
    salesPersonContact: auth?.user?.contact,
  });

   
 const [states, setStates] = useState([]);

  const [cities, setCities] = useState([]);
  

  // **Fetch States from API**
  const fetchStates = async () => {
    try {
      const response = await fetch('https://api.reparv.in/admin/states', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch States.');
      const data = await response.json();
      setStates(data);
    } catch (err) {
      console.error('Error fetching :', err);
    }
  };

  // **Fetch States from API**
  const fetchCities = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/admin/cities/${formData?.state}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch cities.');
      const data = await response.json();
      setCities(data);
    } catch (err) {
      console.error('Error fetching :', err);
    }
  };

   useEffect(() => {
      const interval = setInterval(() => {
        fetchStates();
      
      }, 5000); // fetch every 30s
      return () => clearInterval(interval); // cleanup on unmount
    }, []);
  
    useEffect(() => {
      if (formData?.state !== '') {
        fetchCities();
      }
    }, [formData.state]);
  
  const handleSubmit = async () => {
    // Submit logic here
    if (formData.fullname === '' || formData.phone === '' || formData.city === '' || formData.state === '' || formData.minbudget=== '' || formData.maxbudget === '') {
      Toast.show({
        type: 'info',
        text1: 'All Values Required !',
      });
      return;
    }
    console.log('Booking submitted:', formData);
    try {
      const response = await fetch(`https://api.reparv.in/sales/enquiry/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save property. Status: ${response.status}`);
        Toast.show({
          type: 'error',
          text1: `Failed to save property. Status: ${response.status}`,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Property Enquiry Sent Successfully!',
          visibilityTime: 5000, // optional, default is 4000
        });

        // Close modal after 5 seconds
        setTimeout(() => {
          onClose();
        }, 5000);
      }

      // Clear form after success
      setFormData({
        ...formData,
        propertyid: id,
        fullname: '',
        phone: '',
        state:'',
    city:'',
    minbudget:null,
    maxbudget:null,
      });
    } catch (err) {
      onClose()
      console.error('Error Booking Property:', err);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.close}>
              <X name="close" size={22} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Conveniently Book a Property Visit</Text>

<ScrollView >
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={formData.fullname}
                onChangeText={text =>
                  setFormData({...formData, fullname: text})
                }
                placeholder="Enter Full Name"
                style={styles.input}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter Phone Number</Text>
              <TextInput
                value={formData.phone}
                onChangeText={text => {
                  if (/^\d{0,10}$/.test(text)) {
                    setFormData({...formData, phone: text});
                  }
                }}
                placeholder="Enter Phone Number"
                keyboardType="numeric"
                style={styles.input}
                maxLength={10}
              />
            </View>
             {/* max budget*/}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Min Budget</Text>
              <TextInput
                value={formData.minbudget}
                onChangeText={text =>
                  setFormData({...formData, minbudget: Number(text)})
                }
                placeholder="Enter Min Budget"
                style={styles.input}
              />
            </View>
             {/* Max */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Max Budget</Text>
              <TextInput
                value={formData.maxbudget}
                onChangeText={text =>
                  setFormData({...formData, maxbudget: Number(text)})
                }
                placeholder="Enter Full Name"
                style={styles.input}
              />
            </View>

               <View style={{width: '100%',marginBottom:12 }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: '500',
                                  color: '#00000066',
                                }}>
                                Select State
                              </Text>
            
                              <View
                                style={{
                                  marginTop: 10,
                                  borderWidth: 1,
                                  borderColor: '#00000033',
                                  borderRadius: 4,
                                  backgroundColor: '#fff',
                                  overflow: 'hidden',
                                  color: 'black',
                                }}>
                                <Picker
                                  selectedValue={formData.state}
                                  onValueChange={itemValue =>
                                     setFormData({...formData, state: itemValue})
                                  
                                  }
                                  style={{
                                    height: 50,
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: 'black',
                                  }}>
                                  <Picker.Item label="Select Your State" value="" />
                                  {states?.map((state, index) => (
                                    <Picker.Item
                                      key={index}
                                      label={state?.state}
                                      value={state?.state}
                                    />
                                  ))}
                                </Picker>
                              </View>
                            </View>
                            <View style={{width: '100%', }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: '500',
                                  color: '#00000066',
                                }}>
                                Select City
                              </Text>
            
                              <View
                                style={{
                                  marginTop: 10,
                                  borderWidth: 1,
                                  borderColor: '#00000033',
                                  borderRadius: 4,
                                  backgroundColor: '#fff',
                                  overflow: 'hidden',
                                }}>
                                <Picker
                                  selectedValue={formData.city}
                                  onValueChange={itemValue =>
                                    
                                     setFormData({...formData, city: itemValue})
                                  
                                  }
                                
                                  style={{
                                    height: 50,
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: 'black',
                                  }}>
                                  <Picker.Item label="Select Your City" value="" />
                                  {cities?.map((city, index) => (
                                    <Picker.Item
                                      key={index}
                                      label={city?.city}
                                      value={city?.city}
                                    />
                                  ))}
                                </Picker>
                              </View>
                            </View>
</ScrollView>
            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Book Site Visit Now</Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              By registering, you’ll get a call from our agent.
            </Text>
          </ScrollView>
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

export default SiteVisitModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  scroll: {
    gap: 14,
  },
  close: {
    alignSelf: 'flex-end',
    backgroundColor: '#FAFAFA',
    padding: 6,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  inputGroup: {
    gap: 6,
    marginBottom:12
  },
  label: {
    fontSize: 14,
    color: '#00000066',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00000033',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  button: {
    backgroundColor: '#0078DB',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#00000066',
  },
});
