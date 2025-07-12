import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import BookingClientInfoCard from '../../component/BookingClientInfo';
import {RootStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
import { MeetingFollowUp } from '../Calender';

const screenHeight = Dimensions.get('window').height;

const Booking: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sign_In'>;
  const navigation = useNavigation<NavigationProp>();
  const [showIcons, setShowIcons] = useState(true);
  const [selectedValue, setSelectedValue] = useState('visit');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [bookingData, setBookingData] = useState([]);
  const [scrollY] = useState(new Animated.Value(0)); // Track scroll position
  // Calculate the Inquiry Section height dynamically based on scroll position
  const inquiryHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [screenHeight / 3, screenHeight], // Start from 1/3 screen height and expand to full height
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -screenHeight / 3], // Move the header up as you scroll down
    extrapolate: 'clamp',
  });

  const [isAtTop, setIsAtTop] = useState(true);

  // Handle Scroll
  const handleCardScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY === 0) {
      setShowIcons(true);
      setIsAtTop(true); // We're at the top
    } else {
      setShowIcons(false);
      setIsAtTop(false); // We're not at the top
    }
  };

  const optionsR = [
    {label: 'Pending', value: 'pending', color: '#FFCA00'},
    {label: 'Booked', value: 'ongoing', color: '#0078DB'},
  ];

  const optionsL = [
    {label: 'Token', value: 'token', color: '#076300'},
    {label: 'Cancelled', value: 'cancelled', color: '#EF4444'},
  ];

  const selectedColor =
    optionsL.find(opt => opt.value === selectedValue)?.color ||
    optionsR.find(opt => opt.value === selectedValue)?.color;

  const selectedLabel =
    optionsL.find(opt => opt.value === selectedValue)?.label ||
    optionsR.find(opt => opt.value === selectedValue)?.label;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setModalVisible(false);
  };
  const auth = useContext(AuthContext);
  const renderIconBox = (icon: any, label: string, ftype: string) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Flat', {flatType: ftype});
        auth?.setFlatName(ftype);
      }}
      style={[
        styles.iconBox,
        {marginTop: label === 'Commercial Plot' ? 10 : 0},
      ]}>
      <Image
        source={icon}
        style={[
          styles.iconImage,
          {marginTop: label === 'Commercial Plot' ? 2 : 0},
        ]}
      />
      <Text style={styles.ilabel}>{label}</Text>
    </TouchableOpacity>
  );

  //get booking records
  //get booking records
  const getBooking = async () => {
    fetch(`https://api.reparv.in/api/booking/territory/get/${auth?.user?.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBookingData(data);
        console.log('Booking data:', data);
      })
      .catch(error => {
        console.error('Error fetching booking data:', error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      getBooking();
      setViewAll(false); // Reset when screen is focused
    }, []),
  );

  const [meeting, setMeetings] = useState<MeetingFollowUp[]>([]);
    const [updatedMeeting, setUpdatedMeetings] = useState<MeetingFollowUp[]>([]);
  

   const fetchMeetings = async () => {
      try {
        const response = await fetch(
          'https://api.reparv.in/territory-partner/calender/meetings',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth?.token}`,
              // or real JWT token if using auth middleware
            },
          },
        );
  
        const data = await response.json();
  
        if (!response.ok) {
          console.error('API error:', data.message);
          Alert.alert('Error', data.message);
          return;
        }
  
        console.log('Fetched meetings:', data);
        setMeetings(data);
        setUpdatedMeetings(data);
      } catch (error) {
        console.error('Network error:', error);
        Alert.alert('Error', 'Failed to fetch meetings');
      }
    };
  
    useEffect(() => {
      fetchMeetings();
      // const interval = setInterval(fetchMeetings, 30000); //tch every 30s
      // return () => clearInterval(interval); // cleanup on unmount
    }, []);
  
  return (
    <View style={styles.screen}>
      {/* Top Icons Section */}
      <Animated.View
        style={{
          display: `${showIcons ? 'flex' : 'none'}`,
        }}>
        <View style={styles.container}>
          <View style={styles.Iconcontainer}>
            <View style={styles.row1}>
              {renderIconBox(
                require('../../../assets/booking/flat.png'),
                'New Flat',
                'NewFlat',
              )}
              {renderIconBox(
                require('../../../assets/booking/home.png'),
                'Farm House',
                'FarmHouse',
              )}
              {renderIconBox(
                require('../../../assets/booking/rent.png'),
                'Rental',
                'Rental',
              )}
              {renderIconBox(
                require('../../../assets/booking/lease.png'),
                'Lease',
                'Lease',
              )}
            </View>
            <View style={styles.row1}>
              {renderIconBox(
                require('../../../assets/booking/rhouse.png'),
                'Row House',
                'RowHouse',
              )}
              {renderIconBox(
                require('../../../assets/booking/nplot.png'),
                'New Plot',
                'NewPlot',
              )}
              {renderIconBox(
                require('../../../assets/booking/resale.png'),
                'Resale',
                'Resale',
              )}
              {renderIconBox(
                require('../../../assets/booking/commercial.png'),
                'Commercial',
                'Commercial',
              )}
            </View>
            {viewAll ? (
              <>
                <View style={styles.row1}>
                  {renderIconBox(
                    require('../../../assets/booking/cflat.png'),
                    'Commercial Flat',
                    'CommercialFlat',
                  )}
                  {renderIconBox(
                    require('../../../assets/booking/roffice.png'),
                    'Rental Office',
                    'RentalOffice',
                  )}
                  {renderIconBox(
                    require('../../../assets/booking/farmland.png'),
                    'Farm Land',
                    'FarmLand',
                  )}
                  {renderIconBox(
                    require('../../../assets/booking/cp.png'),
                    'Commercial Plot',
                    'CommercialPlot',
                  )}
                </View>
                <View style={styles.row1}>
                  {renderIconBox(
                    require('../../../assets/booking/r2.png'),
                    'Rental Shop',
                    'RentalShop',
                  )}
                </View>

                <TouchableOpacity onPress={() => setViewAll(false)}>
                  <Text style={styles.viewlessText}>Show Less</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setViewAll(true)}>
                <Text style={styles.viewAllText}>Show More </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Customer Section */}
      <Animated.View style={styles.frame}>
        <Text style={styles.customerText}>Customer</Text>
     
      </Animated.View>

      {/* Client Info Cards */}
      <ScrollView style={{marginTop: 0}} onScroll={handleCardScroll}>
        <View>
          {meeting &&
            meeting.map((d, i) => (
              <BookingClientInfoCard key={i} data={d} />
            ))}
          {meeting.length === 0 && (
            <Text
              style={{
                margin: 'auto',
                alignContent: 'center',
                justifyContent: 'center',
                marginTop: 50,
              }}>
              Not Found Any Booking Records.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancel}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalContainer}>
            {[optionsR, optionsL].map((list, i) => (
              <FlatList
                key={i}
                data={list}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item.value)}>
                    <View
                      style={[
                        styles.checkbox,
                        selectedValue === item.value && styles.checked,
                      ]}>
                      {selectedValue === item.value && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={[styles.optionText, {color: item.color}]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    width: '100%',
  },
  Iconcontainer: {
    width: '95%',
    marginHorizontal: 'auto',
    borderRadius: 16,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },

  iconBox: {
    flexDirection: 'column', // ← icon and label in a line
    alignItems: 'center', // ← vertical centering
    justifyContent: 'flex-start',
    width: 80, // or 48% depending on layout
    marginVertical: 8,
  },
  iconImage: {
    // width: 54,
    // height: 54,
    width: '64%',
    height: '64%',
    resizeMode: 'contain',
  },

  ilabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  viewlessText: {
    width: '100%',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 15,

    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#0068FF',
  },
  viewAllText: {
    width: '100%',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 15,
    marginTop: 5,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#0068FF',
  },
  frame: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 0},
    shadowOpacity: 0.65,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: 'white',
    zIndex: 1,
  },
  customerText: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 19,
    color: '#000000',
  },
  iconCustomer: {
    width: 20,
    height: 20,
  },
  button: {
    width: 40,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  cancel: {
    textAlign: 'center',
    paddingVertical: 5,
    width: 30,
    margin: 'auto',
    color: 'black',
    padding: 10,
    borderRadius: 55,
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
});

export default Booking;
