import React, { useContext, useEffect, useState } from 'react';

import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  Linking,
  TextInput,
  ScrollView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Svg, { Path } from 'react-native-svg';
import CheckBox from '@react-native-community/checkbox';
import { RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { launchImageLibrary } from 'react-native-image-picker';
import { Loader, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { vi } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContext';
import { formatIndianAmount } from '..';

const optionsR = [
  { label: 'Pending', value: 'pending', color: '#FFCA00', select: false },
  { label: 'Booked', value: 'ongoing', color: '#0078DB', select: false },
];

const optionsL = [
  { label: 'Token', value: 'token', color: '#0078DB', select: false },
  { label: 'Cancelled', value: 'cancelled', color: '#EF4444', select: false },
];

const BookingClientInfoCard = ({ data }) => {
  const navigation = useNavigation();

  const [customer, setCustomer] = useState(null);
  const [paymentList, setPaymentList] = useState([]);
  const [showCustomer, setShowCustomer] = useState(false);

  const [selectedValue, setSelectedValue] = useState(data.status);
  const [modalVisible, setModalVisible] = useState(false);
  const [opmodalVisible, setOpModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState();
  const selected =
    !optionsL.find(opt => opt.value === selectedValue)?.select ||
    !optionsR.find(opt => opt.value === selectedValue)?.select;
  console.log(selected);

  const selectColor =
    optionsL.find(opt => opt.value === selectedValue)?.color ||
    optionsR.find(opt => opt.value === selectedValue)?.color;

  const selectedLabel =
    optionsL.find(opt => opt.value === selectedValue)?.label ||
    optionsR.find(opt => opt.value === selectedValue)?.label;

  const selectedColor =
    optionsL.find(opt => opt.value === selectedValue)?.color ||
    optionsR.find(opt => opt.value === selectedValue)?.color;
  const handleSelect = value => {
    // setSelectedValue(value);
    // setModalVisible(false);
    if (value === 'View') {
      setOpModalVisible(false);
      setModalVisible(true);
    } else {
      setOpModalVisible(false);
      setPaymentPopUp(true);
    }
  };

  const optionsr = [
    {
      label: 'Add Payment',
      value: 'addPayment',
      color: 'black',
      select: false,
    },
  ];

  const optionsl = [
    { label: 'View', value: 'View', color: 'black', select: true },
  ];

  const STATUS_PALETTE = {
    Token: { bg: '#E6F7FF', fg: '#1890FF' }, // Blue
    'Visit Scheduled': { bg: '#FFFBE6', fg: '#FAAD14' }, // Yellow
    Visited: { bg: '#F6FFED', fg: '#52C41A' }, // Green
    Cancelled: { bg: '#FFF1F0', fg: '#FF4D4F' }, // Red
    'Follow up': { bg: '#F9F0FF', fg: '#722ED1' }, // Purple
  };

  const { bg: pillBg, fg: pillFg } = STATUS_PALETTE[data?.status] || {
    bg: '#F0F0F0',
    fg: '#333',
  };

  //image getting
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setImageUri(asset);
        }
      },
    );
  };
  const [paymentPopup, setPaymentPopUp] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [image, setImage] = useState(null);
  const [customerPayments, setCustomerPayments] = useState([]);

  const fetchCustomerPayments = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/customers/payment/get/${data?.enquirerId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) throw new Error('Failed to fetch customer payment');

      const data = await response.json();
      console.log(data, 'ffffffffff');

      // Add it to the array (if multiple can come, push, otherwise store as 1-element array)
      setCustomerPayments(data); // stored in an array
    } catch (error) {
      console.error('Error fetching customer payment:', error);
    }
  };
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const getCustomer = async () => {
    console.log(data);

    try {
      fetch(
        `https://api.reparv.in/territory-partner/customers/payment/get/${data.enquirerid}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then(res =>
        res.json().then(res => {
          setCustomerPayments(res);
          console.log(res, 'dd');
        }),
      );
    } catch (error) {
      console.error('Error fetching customer payment:', error);
    }
  };

  const calculateBalance = (payments, customer) => {
    const totalPaid = payments.reduce((sum, p) => sum + p?.paymentAmount, 0);
    const balance = customer?.dealamount - totalPaid;
    console.log(`Remaining balance: ₹${balance}`);
  };

  const auth = useContext(AuthContext);

  useEffect(() => {
    getCustomer();
    const interval = setInterval(getCustomer, 3000); //tch every 30s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  //fetchCustomerPayments();

  const addCustomerPayment = async () => {
    if (submitDisabled) return; // Prevent double click
    setSubmitDisabled(true);

    const formData = new FormData();
    formData.append('paymentType', paymentType);
    formData.append('paymentAmount', paymentAmount);

    if (imageUri) {
      formData.append('paymentImage', {
        uri: imageUri.uri,
        name: imageUri.fileName || 'payment.jpg',
        type: imageUri.type || 'image/jpeg',
      });
    }

    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/customers/payment/add/${data?.enquirerid}`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );

      const resData = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Payment added Successfully!',
        });
        setPaymentType('');
        setPaymentAmount('');
        setImageUri(null);
        setPaymentPopUp(false);
      } else {
        Toast.show({
          type: 'error',
          text1: `Error: ${resData.message}`,
        });
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong!',
      });
    } finally {
      setOpModalVisible(false);
      setSubmitDisabled(false); // Re-enable the button after completion
    }
  };

  const [previewImage, setPreviewImage] = useState(null);
  const [imageShow, setimageShow] = useState(false);

  return (
    <>
      {data.status === 'Token' ? (
        <View style={styles.container}>
          {/* Left section */}
          <View style={styles.leftContainer}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{data?.fullname}</Text>
              <View style={styles.phoneWrapper}>
                <View style={styles.iconBlueCircle}>
                  <Svg width="12" height="13" viewBox="0 0 12 13" fill="none">
                    <Path
                      d="M8.37124 8.10403L8.0679 8.40603C8.0679 8.40603 7.3459 9.12336 5.3759 7.16469C3.4059 5.20603 4.1279 4.48869 4.1279 4.48869L4.31857 4.29803C4.7899 3.83003 4.83457 3.07803 4.42324 2.52869L3.58324 1.40669C3.0739 0.726694 2.09057 0.636694 1.50724 1.21669L0.460571 2.25669C0.171904 2.54469 -0.0214293 2.91669 0.001904 3.33003C0.061904 4.38803 0.540571 6.66336 3.2099 9.31803C6.04124 12.1327 8.6979 12.2447 9.7839 12.1434C10.1279 12.1114 10.4266 11.9367 10.6672 11.6967L11.6139 10.7554C12.2539 10.12 12.0739 9.03003 11.2552 8.58536L9.9819 7.89269C9.44457 7.60136 8.79124 7.68669 8.37124 8.10403Z"
                      fill="#0068FF"
                    />
                  </Svg>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${data?.contact}`);
                  }}
                >
                  <Text style={styles.phone}>{data?.contact}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.projectName}>
              {data?.propertyName === null
                ? 'property name'
                : data?.propertyName}
            </Text>
          </View>

          {/* Right section - Visit Schedule */}
          <View
            style={[
              styles.container2,
              {
                backgroundColor: pillBg,
                borderRadius: 20,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'space-around',
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 1,
                  padding: 9,
                  paddingVertical: 1,
                  //backgroundColor: 'white',
                }}
                onPress={() => setOpModalVisible(true)}
              >
                <Text
                  style={[
                    {
                      color: 'black',
                    },
                  ]}
                >
                  Action
                </Text>

                <Svg
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 9,
                  }}
                  width={10}
                  height={6}
                  viewBox="0 0 10 6"
                  fill="none"
                >
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.666687 0.333344L5.33335 5.66668L10 0.333344H0.666687Z"
                    fill="black"
                    fillOpacity={0.4}
                  />
                </Svg>

                {/* <Text style={styles.selectText}>{selectedLabel}</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}

      <Modal transparent visible={opmodalVisible} animationType="fade">
        <View style={styles.centeredOverlay}>
          <View style={styles.optionPopup}>
            <Text style={styles.popupTitle}>Select Action</Text>

            {[...optionsl, ...optionsr].map(item => (
              <TouchableOpacity
                key={item.value}
                style={styles.popupOption}
                onPress={() => handleSelect(item.value)}
              >
                <View style={styles.checkbox}>
                  {selectedValue === item.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={[styles.optionText, { color: item.color }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closePopupBtn}
              onPress={() => setOpModalVisible(false)}
            >
              <Text style={styles.closePopupBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={paymentPopup}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,

            backgroundColor: '#00000080',
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              width: '95%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 16,
                  color: 'black',
                  textAlign: 'center',
                }}
              >
                Add Payment Details
              </Text>
              <X
                size={30}
                color={'gray'}
                onPress={() => {
                  setPaymentPopUp(false);
                }}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, marginBottom: 6, color: 'black' }}>
                Payment Type
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <Picker
                  selectedValue={paymentType}
                  onValueChange={(itemValue, itemIndex) =>
                    setPaymentType(itemValue)
                  }
                  style={{
                    height: 50,
                    paddingHorizontal: 12,
                    color: 'black',
                  }}
                >
                  <Picker.Item label="Select Payment Type" value="" />
                  <Picker.Item label="Cash" value="cash" />
                  <Picker.Item label="Cheque" value="cheque" />
                  <Picker.Item label="UPI" value="upi" />
                </Picker>
              </View>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: 'black',
              }}
            >
              Payment Amount
            </Text>
            <TextInput
              placeholder="Enter Payment Amount"
              placeholderTextColor={'gray'}
              value={paymentAmount}
              onChangeText={text => {
                const numericText = text.replace(/[^0-9]/g, '');
                setPaymentAmount(numericText);
              }}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                padding: 12,
                color: 'black',
                marginBottom: 12,
              }}
            />

            {imageUri && (
              <Image
                source={{ uri: imageUri.uri }}
                style={{
                  width: 100,
                  height: 80,
                }}
              />
            )}
            <TouchableOpacity
              onPress={pickImage}
              style={{
                // backgroundColor: '#007bff',
                padding: 10,
                borderColor: 'gray',
                borderRadius: 10,
                borderWidth: 0.5,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ color: 'gray' }}>Upload Payment Image </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={addCustomerPayment}
              disabled={!paymentAmount || !paymentType || submitDisabled}
              style={{
                backgroundColor:
                  !paymentAmount || !paymentType || submitDisabled
                    ? '#ccc'
                    : '#28a745',
                padding: 14,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {submitDisabled ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        transparent={true}
        style={{ height: 300 }}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[{ height: 600, width: '95' }]}>
          <View style={styles.enhancedModal}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Booking Details</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {/* Customer Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>👤 Customer Info</Text>
                <Text style={styles.itemText}>
                  Name: <Text style={styles.value}>{data?.fullname}</Text>
                </Text>
                <Text style={styles.itemText}>
                  Contact: <Text style={styles.value}>{data?.contact}</Text>
                </Text>
              </View>
              {/* Property Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏠 Property Info</Text>
                <Text style={styles.itemText}>
                  Property:{' '}
                  <Text style={styles.value}>
                    {data?.propertyName || 'N/A'}
                  </Text>
                </Text>
              </View>

              {/* Property Info */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💳 Payment Info</Text>

                <Text style={styles.itemText}>
                  Deal Amount:{' '}
                  <Text style={[styles.value, { color: '#000' }]}>
                    ₹{formatIndianAmount(data?.dealamount)}
                  </Text>
                </Text>

                <Text style={styles.itemText}>
                  Token Amount:{' '}
                  <Text style={[styles.value, { color: 'green' }]}>
                    ₹{formatIndianAmount(data?.tokenamount)}
                  </Text>
                </Text>

                <Text style={styles.itemText}>
                  Total Paid Amount With Token:{' '}
                  <Text style={[styles.value, { color: 'green' }]}>
                    ₹
                    {formatIndianAmount(
                      (parseFloat(data?.tokenamount) || 0) +
                        customerPayments.reduce(
                          (sum, p) => sum + (parseFloat(p?.paymentAmount) || 0),
                          0,
                        ),
                    )}
                  </Text>
                </Text>

                <Text style={styles.itemText}>
                  Remaining Balance:{' '}
                  <Text style={[styles.value, { color: 'red' }]}>
                    ₹
                    {formatIndianAmount(
                      (parseFloat(data?.dealamount) || 0) -
                        ((parseFloat(data?.tokenamount) || 0) +
                          customerPayments.reduce(
                            (sum, p) =>
                              sum + (parseFloat(p?.paymentAmount) || 0),
                            0,
                          )),
                    )}
                  </Text>
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📜 Payment History</Text>

                {customerPayments.length === 0 ? (
                  <Text style={styles.noData}>
                    No payment history available.
                  </Text>
                ) : (
                  customerPayments.map((payment, index) => (
                    <View key={index} style={styles.paymentCard}>
                      <View style={styles.paymentCardRow}>
                        <View style={styles.paymentTextContainer}>
                          <Text style={styles.paymentType}>
                            {payment?.paymentType?.toUpperCase() || 'Unknown'}
                          </Text>
                          <Text style={styles.paymentAmount}>
                            ₹{formatIndianAmount(payment?.paymentAmount)}
                          </Text>
                          {payment?.created_at && (
                            <Text style={styles.paymentDate}>
                              {payment?.created_at?.slice(0, 12)}
                            </Text>
                          )}
                        </View>

                        {payment?.paymentImage ? (
                          <TouchableOpacity
                            onPress={() =>
                              setPreviewImage(
                                `https://api.reparv.in${payment?.paymentImage}`,
                              )
                            }
                          >
                            <Image
                              source={{
                                uri: `https://api.reparv.in${payment?.paymentImage}`,
                              }}
                              style={styles.paymentThumbnail}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.paymentThumbnail}>
                            <Text style={{ fontSize: 10, color: '#999' }}>
                              No Image
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setModalVisible(false);
                setCustomerPayments([]);
              }}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!previewImage}
        transparent
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            onPress={() => setPreviewImage(null)}
          />

          <View style={styles.modalContent}>
            <Image
              source={{ uri: previewImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPreviewImage(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 15,
    width: '100%',
    height: 72,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    width: 195,
    height: 40,
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
    //width: 105,
    height: 40,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    // width: 105,
    height: 17,
  },
  iconBlueCircle: {
    width: 12,
    height: 11.33,

    borderRadius: 6,
  },
  phone: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0068FF',
  },
  projectName: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 0,
    width: 75,
  },
  paymentCard: {
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 24,
    margin: 'auto',
    width: '90%',
    marginBottom: 12,
    borderWidth: 0.6,
    borderColor: '#C9D6DF',
  },

  paymentCardRow: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  paymentTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  paymentType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007BFF',
    marginBottom: 4,
  },

  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28A745',
    marginBottom: 4,
  },

  paymentDate: {
    fontSize: 12,
    color: '#6C757D',
  },

  paymentThumbnail: {
    width: 80,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  container2: {
    flexDirection: 'row',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#E9F2FF',

    //    height: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0068FF',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  cancel: {
    textAlign: 'center',
    paddingVertical: 5,
    color: 'black',
    padding: 10,
    borderRadius: 55,
    margin: 'auto',
    marginBottom: 10,
    backgroundColor: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'gray',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#0078DB',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  modalContent: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  centeredOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  optionPopup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },

  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentThumb: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginLeft: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  popupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  closePopupBtn: {
    marginTop: 16,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  closePopupBtnText: {
    fontWeight: 'bold',
    color: '#000',
  },

  closeButton: {
    marginTop: 15,
    backgroundColor: '#0A74DA',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  enhancedModal: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingBottom: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  header: {
    backgroundColor: '#0A74DA',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A74DA',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  noData: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  paymentCard: {
    backgroundColor: '#F9F9F9',
    //padding: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#DDD',
  },
  paymentInfo: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
    marginInline: 20,
  },
  paymentImage: {
    width: 300,
    height: 160,
    marginInline: -60,
    borderRadius: 8,
    marginTop: 6,
  },
  closeBtn: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#0A74DA',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingClientInfoCard;
