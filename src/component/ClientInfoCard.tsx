import React, { useContext, useEffect, useState } from 'react';

import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Svg, { Path } from 'react-native-svg';
import CheckBox from '@react-native-community/checkbox';
import {
  Enquirer,
  Enquiry,
  EnquiryDetails,
  PropertyInfo,
  RootStackParamList,
} from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { optionsL, optionsR, toastConfig } from '../utils';
import Toast from 'react-native-toast-message';
import DateSelectPopup from './DateSelectedPopup';
import { launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import { EllipsisVertical, X } from 'lucide-react-native';
import EnquiryRemarkList, { getStatusStyle } from './EnquiryRemarkList';
import { AuthContext } from '../context/AuthContext';
import { formatIndianAmount } from '..';
import ModalSelector from 'react-native-modal-selector';
import dayjs from 'dayjs';
//Interfaces
interface Props {
  enquiry: Enquirer;
}
const ScheduleData = {
  ename: '',
  edate: '',
  remark: '',
};

type DateObject = {
  day: number;
  month: string;
  year: number;
};

interface StateOption {
  id: number;
  state: string;
}
interface CityOptions {
  id: number;
  city: string;
  stateId: string;
}
interface ModalOption {
  key: string;
  label: string;
}

//Date Format function
const formatDate = (date: DateObject): string => {
  const monthMap: { [key: string]: number } = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  };

  const day = date.day;
  const month = monthMap[date.month.toLowerCase()];
  const year = date.year;

  return `${day}-${month}-${year}`;
};

const ClientInfoCard: React.FC<Props> = ({ enquiry }) => {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'PropertyDetails'
  >;
  const navigation = useNavigation<NavigationProp>();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedValue, setSelectedValue] = useState(enquiry.status);
  const [modalVisible, setModalVisible] = useState(false);
  const [tokenVisible, setTokenModel] = useState(false);
  const [followUpVisible, setfollowUpVisible] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [remark, setRemark] = useState('');
  const [dealAmount, setDealAmount] = useState('');
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOptions[]>([]);
  const [imageUri, setImageUri] = useState<any>();
  const [followRemark, setFollowUpRemark] = useState('');
  const [cancelVisible, setcancelVisible] = useState(false);
  const [cancelRemark, setCancelRemark] = useState('');
  const [remarkList, setRemarkList] = useState([]);
  const [updateEnquiryVisible, setShowUpdateEnquiry] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [visible, setStatusModalVisible] = useState(false);
  const [statusModel, setStatusModel] = useState(false);
  const [territoryModel, setterritoryModel] = useState(false);
  const [enquiryDetails, setEnquiryDetails] = useState<EnquiryDetails | null>(
    null,
  );
  const [tokenamount, setTokenAmount] = useState('');
  const [enquiryVisible, setShowEnquiry] = useState(false);
  const [scheduleVisit, setScheduleVisit] =
    useState<typeof ScheduleData>(ScheduleData);

  const [territoryPartnerToAssign, setterritoryPartnerToAssign] = useState({
    territorypartnerid: '',
    territorypartner: '',
    territorypartnercontact: '',
    territorypartnerdate: '',
  });
  const [selectedPropertyLabel, setSelectedPropertyLabel] =
    useState('Select Property');
  interface LastRemark {
    created_at: string; // ISO date string
    status: string;
    remark: string;
  }

  const [lastRemark, setLastRemark] = useState<LastRemark | null>(null);

  const [territoryPartnerList, setterritoryPartnerList] = useState([]);
  const [propertyList, setPropertyList] = useState<PropertyInfo[]>([]);

  const [enquiryUpdateDetails, setEnquiryUpdateDetails] = useState({
    customer: '',
    contact: '',
    location: '',
    city: '',
    minbudget: '',
    maxbudget: '',
    category: '',
    message: '',
    state: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    if (
      !enquiryUpdateDetails.customer?.trim() ||
      /\d/.test(enquiryUpdateDetails.customer)
    ) {
      newErrors.customer = 'Enter a valid name (no numbers)';
    }

    if (
      !enquiryUpdateDetails.contact ||
      !/^[6-9]\d{9}$/.test(enquiryUpdateDetails.contact)
    ) {
      newErrors.contact = 'Enter valid 10-digit mobile number';
    }

    if (!enquiryUpdateDetails.minbudget) {
      newErrors.minbudget = 'Min budget is required';
    }

    if (!enquiryUpdateDetails.maxbudget) {
      newErrors.maxbudget = 'Max budget is required';
    }

    if (!enquiryUpdateDetails.category) {
      newErrors.category = 'Select a category';
    }

    if (!enquiryUpdateDetails.state) {
      newErrors.state = 'Select a state';
    }

    if (!enquiryUpdateDetails.city) {
      newErrors.city = 'Select a city';
    }

    if (!enquiryUpdateDetails.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!enquiryUpdateDetails.message?.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [enquiryUpdateDetails]);

  const optionsr = [
    { label: 'Update', value: 'Update', color: 'black', select: false },
    { label: 'Property', value: 'Property', color: 'black', select: false },
  ];

  const optionsl = [
    { label: 'View', value: 'View', color: 'black', select: true },
    { label: 'Status', value: 'Status', color: 'black', select: false },
  ];

  const selected =
    !optionsL.find(opt => opt.value === selectedValue)?.select ||
    !optionsR.find(opt => opt.value === selectedValue)?.select;

  const selectColor =
    optionsL.find(opt => opt.value === selectedValue)?.color ||
    optionsR.find(opt => opt.value === selectedValue)?.color;

  let selectedLabel =
    optionsL.find(opt => opt.value === selectedValue)?.label ||
    optionsR.find(opt => opt.value === selectedValue)?.label;

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
  //ScheduleVisit data handle
  const handleChange = (name: string, value: string) => {
    setScheduleVisit({ ...scheduleVisit, [name]: value });
  };

  //update status after updation
  const changeStatus = async (id: any, value: any) => {
    try {
      const response = await fetch(
        `https://api.reparv.in/sales/enquirers/status/${enquiry?.enquirersid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ enquiryStatus: value }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setSelectedValue(value);
        Toast.show({
          type: 'success',
          text1: `${data.message}`,
          visibilityTime: 5000,
        });
        setTokenModel(false);

        console.log('Status updated successfully:', data);
      } else {
        console.error('Failed to update status:', data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  //scheduleVisitFunction
  const scheduleVisitFunction = async (
    enquirerId: any,
    visitDate: any,
    visitRemark: any,
  ) => {
    const formattedDate = moment(visitDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    if (!formattedDate || !visitRemark) {
      Toast.show({
        type: 'info',
        text1: 'All Value Required !',
      });

      return;
    }
    try {
      const response = await fetch(
        `https://api.reparv.in/sales/enquirers/visitscheduled/${enquirerId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitDate: formattedDate,
            visitRemark,
            enquiryStatus: 'Visit Scheduled',
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data.message, response);
        Alert.alert('Error', data.message);
        return;
      }

      await changeStatus(enquirerId, 'Visit Scheduled');
      setStatusModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Visit scheduled successfully:',
        visibilityTime: 5000,
      });
    } catch (error) {
      console.error('Network error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Something went wrong!',
        visibilityTime: 5000,
      });
    }
  };

  //date handle
  const handleOk = (date: any) => {
    setSelectedDate(date);
    setShowPicker(false);
    handleChange(
      'edate',
      formatDate({ day: date.day, month: date.month, year: date.year }),
    );
    setterritoryPartnerToAssign({
      ...territoryPartnerToAssign,
      territorypartnerdate: formatDate({
        day: date.day,
        month: date.month,
        year: date.year,
      }),
    });
  };

  //visit schedule update functions
  const handleSave = () => {
    scheduleVisitFunction(
      enquiry?.enquirersid,
      scheduleVisit.edate,
      scheduleVisit.remark,
    );
  };

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
        `https://api.reparv.in/admin/cities/${enquiryUpdateDetails?.state}`,
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
  //token update function
  const submitToken = async () => {
    const formData = new FormData();

    formData.append('paymenttype', paymentType);
    formData.append('tokenamount', tokenamount);
    formData.append('remark', remark);
    formData.append('dealamount', dealAmount);
    formData.append('enquiryStatus', 'Token');
    console.log(formData);

    if (imageUri) {
      formData.append('paymentimage', {
        uri: imageUri.uri,
        type: imageUri.type,
        name: imageUri.fileName,
      });
    }

    try {
      const response = await fetch(
        `https://api.reparv.in/sales/enquirers/token/${enquiry?.enquirersid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          credentials: 'include',
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.log('Error:', data.message);
        Alert.alert('Errog', data.message);
      } else {
        await changeStatus(enquiry?.enquirersid, 'Token');
        Toast.show({
          type: 'success',
          text1: 'Token added successfully',
          visibilityTime: 5000,
        });
        setDealAmount('');
        setRemark('');
        setImageUri('');
        setPaymentType('');
      }
    } catch (error) {
      setDealAmount('');
      setRemark('');
      setImageUri('');
      setPaymentType('');
      console.error('Upload error:', JSON.stringify(error, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network error occurred',
        visibilityTime: 5000,
      });
    }
  };

  const auth = useContext(AuthContext);
  //follow up upload
  const setFollowUp = async () => {
    if (!followRemark) {
      Toast.show({
        type: 'info',
        text1: 'Please Fill The Remark !',
      });
      return;
    }
    try {
      const response = await fetch(
        `https://api.reparv.in/sales/enquirers/followup/${enquiry?.enquirersid}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            followUpRemark: followRemark,
            enquiryStatus: 'Follow Up',
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        await changeStatus(enquiry?.enquirersid, 'Follow Up');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message,
        });
        setFollowUpRemark('');
        setfollowUpVisible(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message,
        });
        Alert.alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error while Add Follow Up Remark:', error);
    }
  };

  //cancelled
  const setCancelled = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/sales/enquirers/cancelled/${enquiry?.enquirersid}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cancelledRemark: cancelRemark,
            enquiryStatus: 'Cancelled',
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setcancelVisible(false);
        changeStatus(enquiry?.enquirersid, 'Cancelled');

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message,
        });
      }
    } catch (error) {
      console.error('Error while Add Cancelled Remark:', error);
    }
  };

  //fetxh enquiry details
  const viewEnquiry = async (id: any, status: string) => {
    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/enquirers/${id}`,
        {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch enquiry.');
      const data = await response.json();
      setEnquiryUpdateDetails(data);
      setEnquiryDetails(data);
      if (status === 'View') {
        setShowEnquiry(true);
      }
    } catch (err) {
      console.error('Error fetching :', err);
    }
  };

  // **Fetch Data from API**
  const fetchEnquiryRemarkList = async (id: number) => {
    try {
      const response = await fetch(
        `https://api.reparv.in/admin/enquirers/remark/list/${enquiry?.enquirersid}`,
        {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch enquirers.');
      const list = await response.json();
      setRemarkList(list);
      setLastRemark(list[list.length - 1]);
    } catch (err) {
      console.error('Error fetching :', err);
    }
  };

  const statusStyle = getStatusStyle(lastRemark?.status);
  //update enquiry
  const updateEnquiry = async () => {
    if (
      enquiryUpdateDetails.customer === '' ||
      enquiryUpdateDetails.contact === '' ||
      enquiryUpdateDetails.location === '' ||
      enquiryUpdateDetails.city === '' ||
      enquiryUpdateDetails.minbudget === '' ||
      enquiryUpdateDetails.maxbudget === '' ||
      enquiryUpdateDetails.category === '' ||
      enquiryUpdateDetails.message === '' ||
      enquiryUpdateDetails.state === ''
    ) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/enquiry/update/enquiry/${enquiry?.enquirersid}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enquiryUpdateDetails),
        },
      );

      if (!response.ok) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: ` ${response.status}`,
        });

        throw new Error(`Failed to save enquiry. Status: ${response.status}`);
      } else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Enquiry updated successfully!',
        });
      }

      // Clear form only after successful fetch
      setEnquiryUpdateDetails({
        enquirersid: '',
        propertyid: '',
        salespersonid: '',
        territorypartnerid: '',
        source: '',
        customer: '',
        contact: '',
        location: '',
        city: '',
        minbudget: '',
        maxbudget: '',
        category: '',
        status: '',
        assign: '',
        message: '',
        visitdate: '',
        territorystatus: '',
        state: '',
        updated_at: '',
        created_at: '',
        territoryName: '',
        territoryContact: '',
        territoryFollowUp: '',
        territoryStatus: '',
      });

      setShowUpdateEnquiry(false);
    } catch (err) {
      console.error('Error saving enquiry:', err);
    }
  };

  const isNumeric = (value: string) => /^\d+$/.test(value);
  const fetchPropertyCity = async (id: any) => {
    try {
      const response = await fetch(
        `https://api.reparv.in/sales/enquirers/property/city/${enquiry.enquirersid}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch City.');
      const data = await response.json();
    } catch (err) {
      console.error('Error fetching :', err);
    }
  };

  const [propertyUpdateModel, setPropertyUpdateModel] = useState(false);
  // **Fetch Data from API**
  const fetchPropertyList = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/admin/enquirers/property/list/${enquiry.enquirersid}`,
        {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok)
        throw new Error('Failed to fetch enquirers property list.');
      const list = await response.json();
      setPropertyList(list);
    } catch (err) {
      console.error('Error fetching :', err);
    }
  };
  //handle actions
  const handleSelect = async (value: string) => {
    setModalVisible(false);

    const id = enquiry?.enquirersid;
    if (!id) return;

    switch (value) {
      case 'Visit Scheduled':
        setStatusModalVisible(true);
        setStatusModel(false);
        break;

      case 'Token':
        setTokenModel(true);
        handleChange('Token', 'Token');
        setStatusModel(false);
        break;

      case 'Follow Up':
        setfollowUpVisible(true);
        setStatusModel(false);
        break;

      case 'New':
        changeStatus(enquiry.enquirersid, 'New');
        setStatusModel(false);
        break;

      case 'Property':
        fetchPropertyList();
        setPropertyUpdateModel(true);
        break;
      case 'Status':
        setStatusModel(true);

        break;

      case 'Cancelled':
        setcancelVisible(true);
        setStatusModel(false);
        break;

      case 'View':
        setShowEnquiry(true);
        await viewEnquiry(id, '');
        await fetchEnquiryRemarkList(id);
        break;

      case 'Update':
        setStatusModalVisible(false);
        await viewEnquiry(id, 'Update');
        setShowUpdateEnquiry(true);
        break;

      default:
        console.warn(`Unhandled selection value: ${value}`);
        break;
    }
  };

  const getDate = async (date: any) => {
    const newdate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return newdate;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStates();
      viewEnquiry(enquiry?.enquirersid, '');
      setSelectedValue(enquiry?.status);
    }, 5000); // fetch every 30s
    return () => clearInterval(interval); // cleanup on unmount
  }, [changeStatus, updateEnquiryVisible]);

  useEffect(() => {
    if (enquiryUpdateDetails?.state !== '') {
      fetchCities();
    }
  }, [enquiryUpdateDetails.state]);

  //status options
  const Statusoptions = [
    'New',
    'Follow Up',
    'Visit Scheduled',
    'Cancelled',
    'Token',
  ];

  const [propertyId, setPropertyId] = useState('');
  //update property Of Enquiry
  const updatePropertyToEnquiry = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/admin/enquirers/property/update/${enquiry.enquirersid}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ propertyId }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `${data.message}`,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `${data.message}`,
        });
      }
      setPropertyId('');
      setPropertyUpdateModel(false);
    } catch (error) {
      console.error('Error Updating Property to Enquiry :', error);
    }
  };

  const [isDisabled, setIsDisabled] = useState(
    enquiry?.propertyid !== null ? true : false,
  );

  // Use it as shown above

  const propertyOptions: ModalOption[] = propertyList
    .filter(
      (property: PropertyInfo) =>
        property.approve === 'Approved' && property.status === 'Active',
    )
    .map((property: PropertyInfo) => ({
      key: String(property.propertyid), // Convert if not already string
      label: `${property.propertyName}\n| ${
        property.builtUpArea
      } SqFt | ₹${formatIndianAmount(property.totalOfferPrice)}`,
    }));
  return (
    <>
      {enquiry?.status !== 'Token' ? (
        <>
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              if (enquiry?.propertyid !== null) {
                navigation.navigate('PropertyDetails', {
                  propertyid: enquiry?.propertyid,
                  enquirersid: enquiry?.enquirersid,
                  salespersonid: enquiry?.salespersonid,
                  booktype: 'enquiry',
                });
              } else {
                Toast.show({
                  type: 'info',
                  text1: 'Property Not Assign !',
                });
              }
            }}
          >
            {/* Left section */}
            <View style={styles.leftContainer}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>
                  <Text style={styles.name}>{enquiry.created_at}</Text>
                </Text>
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
                      Linking.openURL(`tel:${enquiry.contact}`);
                    }}
                  >
                    <Text style={styles.phone}>{enquiry.contact}</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.container2,
                    { backgroundColor: `${selectColor}20`, borderRadius: 20 },
                  ]}
                >
                  <Text
                    style={[
                      styles.label,
                      {
                        color: `${selectColor}`,
                      },
                    ]}
                  >
                    {selectedLabel}
                  </Text>
                </View>
              </View>
              <Text style={styles.cname}>{enquiry?.customer}</Text>
            </View>
            {/* Right section - Visit Schedule */}
            <View
              style={[
                styles.container2,
                {
                  borderRadius: 20,
                  borderColor: 'gray',
                  borderWidth: 0.2,
                  shadowOpacity: 5,
                  shadowRadius: 0.5,
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 1,
                  padding: 9,
                  paddingVertical: 1,
                  backgroundColor: 'white',
                }}
                onPress={() => setModalVisible(true)}
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

              <Modal transparent visible={modalVisible} animationType="slide">
                <View style={styles.modalOverlay}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancel}>X</Text>
                  </TouchableOpacity>
                  <View style={styles.modalContainer}>
                    <FlatList
                      data={optionsl}
                      keyExtractor={item => item.value}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.option}
                          onPress={() => handleSelect(item.value)}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              selectedValue === item.value && styles.checked,
                            ]}
                          >
                            {selectedValue === item.value && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </View>
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: `${item.color}`,
                              },
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />

                    <FlatList
                      data={optionsr}
                      keyExtractor={item => item.value}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.option}
                          onPress={() => handleSelect(item.value)}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              selectedValue === item.value && styles.checked,
                            ]}
                          >
                            {selectedValue === item.value && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </View>
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: `${item.color}`,
                              },
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>
            </View>
            {/* Visit Module */}
            <Modal transparent visible={visible} animationType="slide">
              <View style={Sstyles.overlay}>
                <View style={Sstyles.modal}>
                  <Text style={Sstyles.title}>Change Enquiry Status</Text>

                  <TextInput
                    style={Sstyles.input}
                    placeholder="Enquiry Status "
                    value="Visit Scheduled"
                    editable={false}
                    onChangeText={text => handleChange('ename', text)}
                    disableKeyboardShortcuts={true}
                  />

                  <TextInput
                    style={Sstyles.input}
                    placeholderTextColor={'gray'}
                    placeholder="Enter Remark"
                    onChangeText={text => handleChange('remark', text)}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={Sstyles.input}
                  >
                    <Text>
                      {!selectedDate ? (
                        <Text style={{ color: 'gray' }}>Date</Text>
                      ) : (
                        <Text>
                          {`${selectedDate?.day}-${selectedDate?.month}-${selectedDate?.year}`}
                        </Text>
                      )}
                    </Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <DateSelectPopup
                      visible={showPicker}
                      onCancel={() => setShowPicker(false)}
                      onOk={handleOk}
                    />
                  )}

                  <View style={Sstyles.buttonContainer}>
                    <TouchableOpacity
                      style={Sstyles.cancel}
                      onPress={() => {
                        setStatusModalVisible(false);
                      }}
                    >
                      <Text style={Sstyles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Sstyles.save} onPress={handleSave}>
                      <Text style={Sstyles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            {/* token update */}
            <Modal
              visible={tokenVisible}
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
                        textAlign: 'center',
                        color: 'black',
                      }}
                    >
                      Add Token
                    </Text>
                    <X
                      size={30}
                      color={'gray'}
                      onPress={() => {
                        setTokenModel(false);
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text
                      style={{ fontSize: 12, marginBottom: 6, color: 'black' }}
                    >
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
                      </Picker>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    Token Amount
                  </Text>
                  <TextInput
                    placeholder="Token Amount"
                    placeholderTextColor={'gray'}
                    value={tokenamount}
                    onChangeText={setTokenAmount}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 10,
                      color: 'black',
                      padding: 12,
                      marginBottom: 12,
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    Deal Amount
                  </Text>
                  <TextInput
                    placeholder="Deal Amount"
                    placeholderTextColor={'gray'}
                    value={dealAmount}
                    onChangeText={setDealAmount}
                    keyboardType="numeric"
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 20,
                      color: 'black',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    Remark
                  </Text>
                  <TextInput
                    placeholder="Remark"
                    placeholderTextColor={'gray'}
                    value={remark}
                    onChangeText={setRemark}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 12,
                      color: 'black',
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
                    <Text style={{ color: 'gray' }}>upload image </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={submitToken}
                    style={{
                      backgroundColor: '#0078DB',
                      padding: 14,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* Follow Up */}
            <Modal transparent visible={followUpVisible} animationType="slide">
              <View style={Sstyles.overlay}>
                <View style={Sstyles.modal}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={Sstyles.title}>Change Enquiry Status</Text>
                    <X
                      size={30}
                      color={'gray'}
                      onPress={() => {
                        setfollowUpVisible(false);
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    Enquiry Status
                  </Text>
                  <TextInput
                    style={[Sstyles.input, { color: 'gray' }]}
                    value="Follow Up"
                    editable={false}
                    onChangeText={text => setFollowUpRemark(text)}
                    disableKeyboardShortcuts={true}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    Enquiry Remark
                  </Text>
                  <TextInput
                    style={Sstyles.input}
                    placeholder="Enter Remark"
                    onChangeText={text => setFollowUpRemark(text)}
                    multiline
                  />
                  <TouchableOpacity
                    style={[Sstyles.save, { width: '50%', margin: 'auto' }]}
                    onPress={setFollowUp}
                  >
                    <Text
                      style={[Sstyles.buttonText, { marginInline: 'auto' }]}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* Cancelled Mark */}
            <Modal transparent visible={cancelVisible} animationType="slide">
              <View style={Sstyles.overlay}>
                <View style={Sstyles.modal}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={Sstyles.title}>Change Enquiry Status</Text>
                    <X
                      size={30}
                      color={'gray'}
                      onPress={() => {
                        setcancelVisible(false);
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    Enquiry Status
                  </Text>
                  <TextInput
                    style={[Sstyles.input, { color: 'gray' }]}
                    placeholderTextColor={'gray'}
                    value="Cancelled"
                    editable={false}
                    disableKeyboardShortcuts={true}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                    }}
                  >
                    Cancelled Remark
                  </Text>
                  <TextInput
                    style={Sstyles.input}
                    placeholder="Enter Remark"
                    placeholderTextColor={'gray'}
                    onChangeText={text => setCancelRemark(text)}
                    multiline
                  />
                  <TouchableOpacity
                    style={[Sstyles.save, { width: '50%', margin: 'auto' }]}
                    onPress={setCancelled}
                  >
                    <Text
                      style={[Sstyles.buttonText, { marginInline: 'auto' }]}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* View */}
            <Modal transparent visible={enquiryVisible} animationType="slide">
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  justifyContent: 'flex-end',
                }}
              >
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingHorizontal: 24,
                    paddingTop: 20,
                    paddingBottom: 30,
                    maxHeight: '92%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 12,
                  }}
                >
                  {/* Header */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#0078DB',
                      }}
                    >
                      Enquiry Details
                    </Text>
                    <X
                      size={30}
                      color={'#555'}
                      onPress={() => setShowEnquiry(false)}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: '#0078DB',
                      marginBottom: 12,
                    }}
                  >
                    {enquiryDetails?.source?.trim() || 'Onsite'} |{' '}
                    {enquiryDetails?.territorystatus}
                  </Text>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ gap: 20 }}>
                      {/* Commission */}
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#37474F',
                          }}
                        >
                          Commission Amount
                        </Text>
                        {enquiry?.commissionAmount ? (
                          <View
                            style={{
                              backgroundColor: '#E3F2FD',
                              borderRadius: 16,
                              paddingVertical: 10,
                              paddingHorizontal: 14,
                              marginTop: 6,
                            }}
                          >
                            <Text
                              style={{
                                color: '#1565C0',
                                fontWeight: 'bold',
                                fontSize: 15,
                              }}
                            >
                              ₹
                              {formatIndianAmount(
                                enquiry?.commissionAmount * 0.2,
                              )}
                            </Text>
                          </View>
                        ) : (
                          <Text
                            style={{
                              color: '#D32F2F',
                              fontSize: 13,
                              marginTop: 6,
                            }}
                          >
                            No commission amount available
                          </Text>
                        )}
                      </View>

                      {/* Last Follow Up */}
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#37474F',
                          }}
                        >
                          Last Follow Up
                        </Text>
                        {lastRemark ? (
                          <View style={{ marginTop: 6 }}>
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: statusStyle.color,
                                backgroundColor: statusStyle.backgroundColor,
                                padding: 6,
                                borderRadius: 6,
                              }}
                            >
                              {dayjs(lastRemark?.created_at).format(
                                'DD MMM YYYY',
                              )}{' '}
                              - {lastRemark?.status}
                            </Text>
                            {lastRemark?.remark === '' ? (
                              <View
                                style={{
                                  backgroundColor: '#0078DB20',
                                  borderRadius: 14,
                                  padding: 10,
                                  marginTop: 8,
                                }}
                              >
                                <Text style={{ color: '#333' }}>
                                  {lastRemark?.remark}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        ) : (
                          <Text
                            style={{
                              color: '#999',
                              fontSize: 13,
                              marginTop: 6,
                            }}
                          >
                            Not taken any follow up
                          </Text>
                        )}
                      </View>

                      {/* Visit Date */}
                      {enquiryDetails?.visitdate && (
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: '#37474F',
                            }}
                          >
                            Visit Date
                          </Text>
                          <Text
                            style={{
                              marginTop: 6,
                              color: '#1565C0',
                              backgroundColor: '#E3F2FD',
                              padding: 8,
                              borderRadius: 16,
                            }}
                          >
                            {enquiryDetails.visitdate}
                          </Text>
                        </View>
                      )}

                      {/* Customer */}
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#37474F',
                          }}
                        >
                          Customer Details
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                            marginTop: 6,
                          }}
                        >
                          <Text
                            style={{
                              backgroundColor: '#E3F2FD',
                              padding: 8,
                              borderRadius: 16,
                              color: 'black',
                            }}
                          >
                            {enquiryDetails?.customer}
                          </Text>
                          <Text
                            style={{
                              backgroundColor: '#E3F2FD',
                              padding: 8,
                              borderRadius: 16,
                              color: 'black',
                            }}
                          >
                            {enquiryDetails?.contact}
                          </Text>
                        </View>
                      </View>

                      {/* Budget */}
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#37474F',
                          }}
                        >
                          Budget
                        </Text>
                        <Text
                          style={{
                            backgroundColor: '#E3F2FD',
                            padding: 10,
                            borderRadius: 16,
                            marginTop: 6,
                            fontWeight: '700',
                            color: '#1565C0',
                          }}
                        >
                          ₹{formatIndianAmount(enquiryDetails?.minbudget)} - ₹
                          {formatIndianAmount(enquiryDetails?.maxbudget)}
                        </Text>
                      </View>

                      {/* Property Category */}

                      {}
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#37474F',
                          }}
                        >
                          Property Category
                        </Text>
                        <Text
                          style={{
                            backgroundColor: '#E3F2FD',
                            padding: 8,
                            borderRadius: 16,
                            marginTop: 6,
                            textAlign: 'center',
                            color: 'black',
                          }}
                        >
                          {enquiry?.category}
                        </Text>
                      </View>

                      {/* Location */}
                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#37474F',
                          }}
                        >
                          Enquired Property Location
                        </Text>
                        {enquiryDetails?.location !== null &&
                        enquiryDetails?.city !== null &&
                        enquiryDetails?.state !== null ? (
                          <Text
                            style={{
                              backgroundColor: '#E3F2FD',
                              padding: 12,
                              borderRadius: 16,
                              marginTop: 6,
                              color: 'black',
                            }}
                          >
                            {`${enquiryDetails?.location}, ${enquiryDetails?.city}, ${enquiryDetails?.state}`}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              backgroundColor: '#E3F2FD',
                              padding: 8,
                              borderRadius: 16,
                            }}
                          >
                            Address Not Defind
                          </Text>
                        )}
                      </View>

                      {/* Message */}
                      {enquiryDetails?.message && (
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: '#37474F',
                            }}
                          >
                            Message
                          </Text>
                          <Text
                            style={{
                              backgroundColor: '#E3F2FD',
                              padding: 12,
                              borderRadius: 16,
                              marginTop: 6,
                              color: 'black',
                            }}
                          >
                            {enquiryDetails.message}
                          </Text>
                        </View>
                      )}

                      {/* Remarks List */}
                      <EnquiryRemarkList remarkList={remarkList} />
                      <View style={{ padding: 20 }}></View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {/*updat Module */}
            <Modal
              transparent
              visible={updateEnquiryVisible}
              animationType="slide"
            >
              <View style={Sstyles.overlay}>
                <View style={Sstyles.modal}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={Sstyles.title}>Update Enquiry Details</Text>
                    <X
                      size={30}
                      color={'gray'}
                      onPress={() => {
                        setShowUpdateEnquiry(false);
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      marginTop: -20,
                      fontWeight: '700',
                      color: '#0078DB',
                    }}
                  >
                    {enquiryDetails?.source === '' ||
                    enquiryDetails?.source === null
                      ? ' Onsite '
                      : enquiryDetails?.source}
                    | {enquiryDetails?.territorystatus}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      borderWidth: 0.2,
                      backgroundColor: 'black',
                    }}
                  ></View>

                  <ScrollView style={{ height: 500 }}>
                    <View style={{ gap: 16, padding: 12 }}>
                      <Text style={{ fontSize: 14, color: 'black' }}>
                        Full Name
                      </Text>
                      <TextInput
                        style={[Sstyles.input, { color: 'black' }]}
                        placeholder="Enter full name"
                        placeholderTextColor="gray"
                        value={enquiryUpdateDetails.customer}
                        onChangeText={text =>
                          setEnquiryUpdateDetails({
                            ...enquiryUpdateDetails,
                            customer: text,
                          })
                        }
                      />
                      {errors.customer && (
                        <Text style={{ color: 'red' }}>{errors.customer}</Text>
                      )}

                      <Text style={{ fontSize: 14, color: 'black' }}>
                        Contact Number
                      </Text>
                      <TextInput
                        style={[Sstyles.input, { color: 'black' }]}
                        placeholder="Enter contact number"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        value={enquiryUpdateDetails.contact}
                        onChangeText={text =>
                          setEnquiryUpdateDetails({
                            ...enquiryUpdateDetails,
                            contact: text,
                          })
                        }
                      />
                      {errors.contact && (
                        <Text style={{ color: 'red' }}>{errors.contact}</Text>
                      )}

                      <Text style={{ fontSize: 14, color: 'black' }}>
                        Min-Budget
                      </Text>
                      <TextInput
                        style={[Sstyles.input, { color: 'black' }]}
                        placeholderTextColor={'gray'}
                        value={enquiryUpdateDetails?.minbudget ?? ''}
                        keyboardType="numeric"
                        onChangeText={text => {
                          setEnquiryUpdateDetails({
                            ...enquiryUpdateDetails,
                            minbudget: text, // ✅ keep as string
                          });
                        }}
                      />

                      <Text style={{ fontSize: 14, color: 'black' }}>
                        Max-Budget
                      </Text>
                      <TextInput
                        style={[Sstyles.input, { color: 'black' }]}
                        placeholderTextColor={'gray'}
                        value={enquiryUpdateDetails?.maxbudget ?? ''}
                        keyboardType="numeric"
                        onChangeText={text => {
                          setEnquiryUpdateDetails({
                            ...enquiryUpdateDetails,
                            maxbudget: text, // ✅ keep as string
                          });
                        }}
                      />

                      <View style={{ width: '100%', marginBottom: 16 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: '#00000066',
                          }}
                        >
                          Property Category
                        </Text>

                        <View
                          style={{
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: '#00000033',
                            borderRadius: 4,
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                          }}
                        >
                          <Picker
                            selectedValue={enquiryUpdateDetails.category}
                            onValueChange={itemValue =>
                              setEnquiryUpdateDetails({
                                ...enquiryUpdateDetails,
                                category: itemValue,
                              })
                            }
                            style={{
                              height: 50,
                              fontSize: 16,
                              color: 'black',
                              fontWeight: '500',
                            }}
                          >
                            <Picker.Item
                              label="Select Property Category"
                              value=""
                            />
                            <Picker.Item label="New Flat" value="NewFlat" />
                            <Picker.Item label="New Plot" value="NewPlot" />
                            <Picker.Item
                              label="Rental Flat"
                              value="RentalFlat"
                            />
                            <Picker.Item
                              label="Rental Shop"
                              value="RentalShop"
                            />
                            <Picker.Item
                              label="Rental Office"
                              value="RentalOffice"
                            />
                            <Picker.Item label="Resale" value="Resale" />
                            <Picker.Item label="Row House" value="RowHouse" />
                            <Picker.Item label="Lease" value="Lease" />
                            <Picker.Item label="Farm Land" value="FarmLand" />
                            <Picker.Item label="Farm House" value="FarmHouse" />
                            <Picker.Item
                              label="Commercial Flat"
                              value="CommercialFlat"
                            />
                            <Picker.Item
                              label="Commercial Plot"
                              value="CommercialPlot"
                            />
                            <Picker.Item
                              label="Industrial Space"
                              value="IndustrialSpace"
                            />
                          </Picker>
                        </View>
                      </View>
                      <View style={{ width: '100%', marginBottom: 16 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: '#00000066',
                          }}
                        >
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
                          }}
                        >
                          <Picker
                            selectedValue={enquiryUpdateDetails.state}
                            onValueChange={itemValue =>
                              setEnquiryUpdateDetails({
                                ...enquiryUpdateDetails,
                                state: itemValue,
                              })
                            }
                            style={{
                              height: 50,
                              fontSize: 16,
                              fontWeight: '500',
                              color: 'black',
                            }}
                          >
                            <Picker.Item
                              style={{ color: 'black' }}
                              label="Select Your State"
                              value=""
                            />
                            {states?.map((state, index) => (
                              <Picker.Item
                                key={index}
                                style={{ color: 'black' }}
                                label={state?.state}
                                value={state?.state}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                      <View style={{ width: '100%', marginBottom: 16 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: '#00000066',
                          }}
                        >
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
                          }}
                        >
                          <Picker
                            selectedValue={enquiryUpdateDetails.city}
                            onValueChange={itemValue =>
                              setEnquiryUpdateDetails({
                                ...enquiryUpdateDetails,
                                city: itemValue,
                              })
                            }
                            style={{
                              height: 50,
                              fontSize: 16,
                              fontWeight: '500',
                              color: 'black',
                            }}
                          >
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
                      <Text style={{ fontSize: 14, color: 'black' }}>
                        Location
                      </Text>
                      <TextInput
                        style={[Sstyles.input, { color: 'black' }]}
                        value={enquiryUpdateDetails?.location}
                        placeholderTextColor={'gray'}
                        onChangeText={text => {
                          setEnquiryUpdateDetails({
                            ...enquiryUpdateDetails,
                            location: text,
                          });
                        }}
                      />
                      <Text style={{ fontSize: 14, color: 'black' }}>
                        Message
                      </Text>
                      <TextInput
                        style={[Sstyles.input, { color: 'black' }]}
                        placeholderTextColor={'gray'}
                        value={enquiryUpdateDetails?.message}
                        onChangeText={text => {
                          setEnquiryUpdateDetails({
                            ...enquiryUpdateDetails,
                            message: text,
                          });
                        }}
                      />
                      <View style={Sstyles.buttonContainer}>
                        <TouchableOpacity
                          style={Sstyles.cancel}
                          onPress={() => {
                            setStatusModalVisible(false);
                          }}
                        >
                          <Text style={Sstyles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            Sstyles.save,
                            {
                              backgroundColor: isFormValid ? '#0078DB' : '#ccc',
                            },
                          ]}
                          disabled={!isFormValid}
                          onPress={updateEnquiry}
                        >
                          <Text style={Sstyles.buttonText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
            {/* Status  popup  */}
            <Modal
              transparent
              visible={statusModel}
              animationType="fade"
              onRequestClose={() => setStatusModel(false)}
            >
              <TouchableOpacity
                style={styles.statusmodalOverlay}
                activeOpacity={1}
                onPressOut={() => setStatusModel(false)}
              >
                <View style={styles.spopupMenu}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: 'white',
                    }}
                  >
                    <Text style={styles.spopupTitle}>Action</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setStatusModel(false);
                      }}
                    >
                      <X size={20} color={'gray'} />
                    </TouchableOpacity>
                  </View>

                  {Statusoptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.soptionItem}
                      onPress={() => handleSelect(option)}
                    >
                      <View style={styles.scheckbox}>
                        {selectedOption === option && (
                          <View style={styles.scheckedDot} />
                        )}
                      </View>
                      <Text style={styles.soptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Propert Select Model */}
            <Modal
              transparent
              visible={propertyUpdateModel}
              animationType="slide"
            >
              <View style={Sstyles.overlay}>
                <View style={Sstyles.modal}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={Sstyles.title}>
                      Update Property to Enquiry
                    </Text>
                    <X
                      size={30}
                      color={'gray'}
                      onPress={() => {
                        setPropertyUpdateModel(false);
                      }}
                    />
                  </View>

                  <View style={{ width: '100%', marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: '#00000066',
                        marginBottom: 8,
                      }}
                    >
                      Select Property
                    </Text>

                    {/* ✅ Check if propertyOptions is empty or null */}
                    {Array.isArray(propertyOptions) &&
                    propertyOptions.length > 0 ? (
                      <ModalSelector
                        data={propertyOptions}
                        initValue="Select Property"
                        onChange={option => {
                          setPropertyId(option?.key);
                          setSelectedPropertyLabel(option?.label);
                        }}
                        style={{
                          borderWidth: 0.3,
                          borderRadius: 6,
                          borderColor: 'gray',
                          padding: 10,
                        }}
                        initValueTextStyle={{ color: 'black', fontSize: 16 }}
                        selectTextStyle={{ color: 'black', fontSize: 16 }}
                        optionTextStyle={{ fontSize: 18, color: 'black' }}
                      >
                        <Text style={{ color: 'black', fontSize: 16 }}>
                          {selectedPropertyLabel || 'Select Property'}
                        </Text>
                      </ModalSelector>
                    ) : (
                      <Text style={{ color: 'red', fontSize: 16 }}>
                        Not Found Any properties based on your Budget .
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[Sstyles.save, { width: '50%', margin: 'auto' }]}
                    onPress={updatePropertyToEnquiry}
                    disabled={!propertyOptions || propertyOptions.length === 0} // ✅ disable if no options
                  >
                    <Text
                      style={[Sstyles.buttonText, { marginInline: 'auto' }]}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Toast config={toastConfig} />
          </TouchableOpacity>
        </>
      ) : null}
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
    height: 92,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 38,
    width: 195,
    height: 40,
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
    // width: 105,
    // height: 40,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  phoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,

    // height: 17,
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
  cname: {
    fontSize: 12,
    flexWrap: 'wrap',
    width: '33%',
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 4,
  },

  container2: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,

    backgroundColor: 'white',
    borderRadius: 30,
    height: 28,
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
    padding: 20,
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
  statusmodalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spopupMenu: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  spopupTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  spicker: {
    height: 50,
    width: '100%',
  },
  soptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  scheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  scheckedDot: {
    width: 10,
    height: 10,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  soptionText: {
    fontSize: 14,
    color: 'black',
  },
  issueTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
    color: '#2E2C34',
    marginBottom: 4,
  },
});

const Sstyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cancel: {
    backgroundColor: '#ccc',
    padding: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  save: {
    backgroundColor: '#0078DB',
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    margin: 'auto',
  },
});
export default ClientInfoCard;
