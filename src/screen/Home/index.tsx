import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Enquiry, RootStackParamList} from '../../types';
// import ClientInfoCard from '../../component/ClientInfoCard';
import Svg, {Path} from 'react-native-svg';
import {optionsL, optionsR, toastConfig} from '../../utils';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import ClientInfoCard from '../../component/ClientInfoCard';
import {AuthContext, AuthProvider} from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import Loader from '../../component/loader';
import {FilterIcon, SearchIcon, X} from 'lucide-react-native';
import EnquiryCustomeDatePicker from '../../component/EnquiryCustomeDatePicker';
import { isValid, isWithinInterval, parse } from 'date-fns';
import { MeetingFollowUp } from '../Calender';
import { formatIndianAmount } from '../..';
//import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';

const screenHeight = Dimensions.get('window').height;
interface NewEnquiry {
  customer: string;
  contact: string;
  minbudget: number | null;
  maxbudget: number | null;
  category: string;
  state: string;
  city: string;
  location: string;
  message: string;
  territoryName: string;
  territoryContact: string;
}
const Home: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
  const navigation = useNavigation<NavigationProp>();
  const [showCards, setShowCards] = useState(true);
  const [scrollY] = useState(new Animated.Value(0)); // Track scroll position
  const [lastOffset, setLastOffset] = useState(0); // Last scroll position to track direction
  const [selectedValue, setSelectedValue] = useState('visit');
  const [modalVisible, setModalVisible] = useState(false);

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
      setShowCards(true);
      setIsAtTop(true); // We're at the top
    } else {
      setShowCards(false);
      setIsAtTop(false); // We're not at the top
    }
  };

  const selected =
    !optionsL.find(opt => opt.value === selectedValue)?.select ||
    !optionsR.find(opt => opt.value === selectedValue)?.select;

  const selectColor =
    optionsL.find(opt => opt.value === selectedValue)?.color ||
    optionsR.find(opt => opt.value === selectedValue)?.color;

  const selectedLabel =
    optionsL.find(opt => opt.value === selectedValue)?.label ||
    optionsR.find(opt => opt.value === selectedValue)?.label;

  const [search, setSearch] = useState('');

  const handleSelect = async (value: string) => {
    setSelectedValue(value);
    if (value === 'reset') {
      setSearch('');
      setModalVisible(false);
      return;
    }
    setSearch(value);
    setModalVisible(false);
  };
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  const fetchEnquiries = async () => {
    try {
      const token = auth?.user?.id; // make sure you stored it at login

      const response = await fetch(
        'https://api.reparv.in/territory-partner/enquirers/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // token required for req.user.id to work
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fetch error:', errorData);
        return;
      }

      const data = await response.json();
      setEnquiries(data);
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const [overviewData, setOverviewData] = useState([]);
  const [overviewCountData, setOverviewCountData] = useState({});
  const [newEnquiry, setNewEnquiry] = useState<NewEnquiry>({
    customer: '',
    contact: '',
    minbudget: null,
    maxbudget: null,
    category: '',
    state: '',
    city: '',
    location: '',
    message: '',
    territoryName: auth?.user?.name ?? '',
    territoryContact: auth?.user?.contact ?? '',
  });
  const [addEnquiryVisible, setaddEnquiryVisible] = useState(false);
  // const fetchCountData = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://api.reparv.in/territory-partner/dashboard/count`,
  //       {
  //         method: 'GET',
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     if (!response.ok) throw new Error('Failed to fetch Count.');
  //     const data = await response.json();
  //     console.log(data, 'mmm');
  //     setOverviewCountData(data);
  //   } catch (err) {
  //     console.error('Error fetching :', err);
  //   }
  // };

  const handleEnquiryChange = (field: keyof NewEnquiry, value: any) => {
    setNewEnquiry(prev => ({
      ...prev,
      [field]: value,
    }));
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
        `https://api.reparv.in/admin/cities/${newEnquiry?.state}`,
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
      console.log(data);
      setCities(data);
    } catch (err) {
      console.error('Error fetching :', err);
    }
  };

  const addEnquiry = async () => {
    console.log(newEnquiry);
    if (
      newEnquiry.customer === '' ||
      newEnquiry.contact === '' ||
      newEnquiry.city === '' ||
      newEnquiry.category === '' ||
      newEnquiry.location === '' ||
      newEnquiry.message === '' ||
      newEnquiry.maxbudget === null ||
      newEnquiry.minbudget === null ||
      newEnquiry.state === ''
    ) {
      setaddEnquiryVisible(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All Values Are Required !',
      });
      return;
    }
    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/enquiry/add/enquiry/`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newEnquiry),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to save enquiry. Status: ${response.status}`);
      } else {
        setaddEnquiryVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Enquiry added successfully!',
        });
      }

      // Clear form only after successful fetch
      setNewEnquiry({
        customer: '',
        contact: '',
        minbudget: null,
        maxbudget: null,
        category: '',
        state: '',
        city: '',
        location: '',
        message: '',
        territoryName: '',
        territoryContact: '',
      });
    } catch (err) {
      console.error('Error saving enquiry:', err);
    }
  };

// const auth = useContext(AuthContext);
   // Filter logic for enquiries based on search
const filteredData = useMemo(() => {
  const query = search.toLowerCase().trim();

  const startRaw = auth?.dateRange?.startDate;
  const endRaw = auth?.dateRange?.endDate;

  const hasStart = !!startRaw;
  const hasEnd = !!endRaw;

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (hasStart) {
    startDate = new Date(startRaw); // e.g., '2025-08-07'
    startDate.setHours(0, 0, 0, 0); // Ensure beginning of day
  }

  if (hasEnd) {
    endDate = new Date(endRaw); // e.g., '2025-08-14'
    endDate.setHours(23, 59, 59, 999); // Ensure end of day
  }

  const result = enquiries.filter((item) => {
    const matchesSearch =
      query === '' ||
      item.location?.toLowerCase().includes(query) ||
      item.customer?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query);

    let matchesDate = true;

    if ((hasStart || hasEnd) && item.created_at) {
      const rawDate = item.created_at.split('|')[0]?.trim(); // e.g. "07 Aug 2025"
      const createdAt = parse(rawDate, 'dd MMM yyyy', new Date());

      if (!isValid(createdAt)) return false;

      if (hasStart && hasEnd) {
        matchesDate = isWithinInterval(createdAt, {
          start: startDate!,
          end: endDate!,
        });
      } else if (hasStart) {
        matchesDate = createdAt >= startDate!;
      } else if (hasEnd) {
        matchesDate = createdAt <= endDate!;
      }
    }

    return matchesSearch && matchesDate;
  });

  // Optional fallback: if filtering returns nothing
  if ((hasStart || hasEnd) && result.length === 0) {
    return enquiries.filter((item) => {
      return (
        query === '' ||
        item.location?.toLowerCase().includes(query) ||
        item.customer?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query)
      );
    });
  }

  console.log(result, 'Filtered Enquiries');
  return result;
}, [search, enquiries, auth?.dateRange, auth?.setDateRange]);



  useEffect(() => {
    if (newEnquiry.state != '') {
      fetchCities();
    }
  }, [newEnquiry.state]);


  const [meeting, setMeetings] = useState<MeetingFollowUp[]>([]);
     
  
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
         
        } catch (error) {
          console.error('Network error:', error);
          Alert.alert('Error', 'Failed to fetch meetings');
        }
      };
    
     

  const fetchNewCountData = async () => {
    try {
      const response = await fetch('https://api.reparv.in/sales/dashboard/count', {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch Count.");
      const data = await response.json();
      console.log(data);
      setOverviewCountData(data);
    } catch (err) {
      console.error("Error fetching :", err);
    }
  };

   useEffect(() => {
       fetchStates();
        fetchMeetings();
        // const interval = setInterval(fetchMeetings, 30000); //tch every 30s
        // return () => clearInterval(interval); // cleanup on unmount
      }, []);
  useEffect(() => {
      fetchNewCountData();
    fetchEnquiries(); // initial fetch
    const interval = setInterval(fetchEnquiries, 5000); // fetch every 30s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  if (loading) return <Loader />;
 

  
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
      }}>
      {/* Main ScrollView for the entire screen */}

      {/* Cards Section */}
      <Animated.View
        style={{
         // marginTop: 10,
          display: `${showCards ? 'flex' : 'none'}`,
        }}>
          <View
  style={{
    width: '100%',
    height: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 1, // Android shadow
    backgroundColor: 'white', // Needed to see shadow
    borderRadius: 8, // Optional: soft corners
   // marginVertical: 10, // spacing around
  }}>
        <ScrollView
          style={{
            width: '100%',
height:250
          }}>
          <View style={styles.box1}>
            <LinearGradient
              colors={['#0078DB', '#004170']}
              start={{x: 1, y: 0}}
              end={{x: 0.5, y: 0.5}}
              style={styles.card}>
              <View style={styles.content}>
                <Text style={styles.label}>Total Deal Amount</Text>
                <View style={styles.iconWrapper}>
                  <Image
                    source={require('../../../assets/icons/rs.png')}
                    style={styles.vectorInner}
                  />
                </View>
              </View>
              <Text style={styles.amount}>₹{formatIndianAmount(overviewCountData?.totalDealAmount)}</Text>
            </LinearGradient>
            {/* Card 1: No. of Deal Done */}
            <LinearGradient
              colors={['#0078DB', '#004170']}
              start={{x: 1, y: 0}}
              end={{x: 0.5, y: 0.5}}
              style={styles.card}>
              <View style={styles.content}>
                <Text style={styles.label}>No. of Deal Done</Text>
                <View style={styles.iconWrapper}>
                  <Image
                    source={require('../../../assets/icons/like.png')}
                    style={styles.vectorInner}
                  />
                </View>
              </View>
              <Text style={styles.amount}>0</Text>
            </LinearGradient>
          </View>
          <View style={styles.box2}>
            {/* Card 2: Self Earning */}
            <LinearGradient
              colors={['#0078DB', '#004170']}
              start={{x: 1, y: 0}}
              end={{x: 0.5, y: 0.5}}
              style={styles.card}>
              <View style={styles.content}>
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.label}>Self Earning</Text>
                  <Text style={[styles.label]}>Amount</Text>
                </View>
                <View style={styles.iconWrapper}>
                  <Image
                    source={require('../../../assets/icons/pr.png')}
                    style={styles.vectorInner}
                  />
                </View>
              </View>
              <Text style={styles.amount}>₹{formatIndianAmount(overviewCountData?.selfEarning)}</Text>
            </LinearGradient>

            {/* Card 3: Deal in Sq. Ft. */}
            <LinearGradient
              colors={['#0078DB', '#004170']}
              start={{x: 1, y: 0}}
              end={{x: 0.5, y: 0.5}}
              style={styles.card}>
              <View style={styles.content}>
                <Text style={styles.label}>Deal in Sq. Ft.</Text>
                <View style={styles.iconWrapper}>
                  <Image
                    source={require('../../../assets/icons/map.png')}
                    style={styles.vectorInner}
                  />
                </View>
              </View>
              <Text style={styles.amount}>{overviewCountData?.totalDealInSquareFeet} Sq. Ft.</Text>
            </LinearGradient>
          </View>
            <View style={styles.box2}>
            <LinearGradient
              colors={['#0078DB', '#004170']}
              start={{x: 1, y: 0}}
              end={{x: 0.5, y: 0.5}}
              style={styles.card}>
              <View style={styles.content}>
                <Text style={styles.label}>No of Enquiry</Text>
                
              </View>
              <Text style={styles.amount}>{enquiries.length}</Text>
            </LinearGradient>
            {/* Card 1: No. of Deal Done */}
            <TouchableOpacity  onPress={()=>{navigation.navigate('Tickets')}}>
            
          <LinearGradient
              colors={['#0078DB', '#004170']}
              start={{x: 1, y: 0}}
              end={{x: 0.5, y: 0.5}}
              style={styles.card}>
              <View style={styles.content}>
                <Text style={styles.label}>Total Tickets</Text>
                
              </View>
              <Text style={styles.amount}>{overviewCountData?.totalTicket
}</Text>
            </LinearGradient>
            </TouchableOpacity>
          </View>
        
        </ScrollView>
        </View>
      </Animated.View>
      {/* Cards List */}

      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 0,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ViewSchedule');
          }}>
          <Text style={[styles.text, {padding: 10}]}>View Schedule</Text>
        </TouchableOpacity>

        {/* Animated Inquiry Section */}
        <Animated.View style={[styles.frameContainer]}>
          {/* Search Container */}
            <View
            style={{
              flexDirection: 'row',
              gap:8
            }}>
            <View style={styles.searchContainer}>
              {/* <Image
                style={{
                  margin: 'auto',
                  marginLeft: 10,
                  width: 20,
                  height: 20,
                }}
                source={require('../../../assets/icons/map.png')}
              /> */}
              <View  style={{
                  margin: 'auto',
                  marginLeft: 10,
                  width: 20,
                //height: 20,
                }}>
  <SearchIcon width={20} strokeWidth={1} color={'gray'} />
                </View>
            
              <TextInput
                placeholder="Search Enquiries..."
                placeholderTextColor="#BCBCBD"
                value={search}
                onChangeText={setSearch}
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: 'none',
                  color: 'black',
                }}
              />
            </View>
         <EnquiryCustomeDatePicker/>
            {/* Fliter ICons */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}>
            
                <FilterIcon strokeWidth={1} fill={
                  'black'
                }  />
              {/* <Image
                style={styles.icon}
                source={require('../../../assets/icons/searchside.png')}
              /> */}
            </TouchableOpacity>
          </View>
          {/* Inqury and Add Client */}
          <View style={styles.containerOfInqury}>
            {/* Inquiries Label */}
            <Text style={styles.inquiryText}>Enquiries</Text>

            {/* Add Client Button */}
            <TouchableOpacity
              style={styles.addClientButton}
              onPress={() => {
                setaddEnquiryVisible(true);
              }}>
              {/* Placeholder for icon (use Image or vector icon here if needed) */}
              <View style={styles.iconPlaceholder}>
                <Svg width={16} height={18} viewBox="0 0 16 18" fill="none">
                  <Path
                    d="M6.83335 14.7025C6.83335 15.034 6.96505 15.352 7.19947 15.5864C7.43389 15.8208 7.75183 15.9525 8.08335 15.9525C8.41487 15.9525 8.73282 15.8208 8.96724 15.5864C9.20166 15.352 9.33335 15.034 9.33335 14.7025V9.28584H14.75C15.0815 9.28584 15.3995 9.15414 15.6339 8.91972C15.8683 8.6853 16 8.36736 16 8.03584C16 7.70432 15.8683 7.38637 15.6339 7.15195C15.3995 6.91753 15.0815 6.78584 14.75 6.78584H9.33335V1.36917C9.33335 1.03765 9.20166 0.719708 8.96724 0.485288C8.73282 0.250867 8.41487 0.119171 8.08335 0.119171C7.75183 0.119171 7.43389 0.250867 7.19947 0.485288C6.96505 0.719708 6.83335 1.03765 6.83335 1.36917V6.78584H1.41669C1.08517 6.78584 0.767224 6.91753 0.532804 7.15195C0.298383 7.38637 0.166687 7.70432 0.166687 8.03584C0.166687 8.36736 0.298383 8.6853 0.532804 8.91972C0.767224 9.15414 1.08517 9.28584 1.41669 9.28584H6.83335V14.7025Z"
                    fill="white"
                  />
                </Svg>
              </View>
              <Text style={styles.addClientText}>Add Enquiry</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>


      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        scrollEventThrottle={16} // Make scroll events smoother
        onScroll={handleCardScroll} // Regular onScroll handler
      >
        <View style={{flexDirection: 'column'}}>
          {enquiries !== null &&
            filteredData.map(d => (
              <>
                {d.territorystatus === 'Accepted' ? (
                  <ClientInfoCard key={d.enquirersid} enquiry={d} />
                ) : null}
              </>
            ))}

          {filteredData.length <= 0 && (
            <Text
              style={{
                fontSize: 13,
                margin: 'auto',
                marginTop: 10,
                fontWeight: '600',
              }}>
              Not Found Any Enquiries !
            </Text>
          )}
        </View>
        {enquiries?.length !== 0 ? (
          <View
            style={{
              padding: 20,
              height: 200,
            }}>
           <Text>.</Text> 
          </View>
        ) : null}
      </ScrollView>

      {/* <GestureHandlerRootView> */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancel}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalContainer}>
            <FlatList
              data={optionsR}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    handleSelect(item.value);
                  }}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedValue === item.value && styles.checked,
                    ]}>
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
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <FlatList
              data={optionsL}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    handleSelect(item.value);
                  }}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedValue === item.value && styles.checked,
                    ]}>
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
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      {/* Add Enquiry Model */}
      <Modal transparent visible={addEnquiryVisible} animationType="slide">
        <View style={Sstyles.overlay}>
          <View style={Sstyles.modal}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={Sstyles.title}>Add Enquiry Details</Text>
              <X
                size={30}
                color={'gray'}
                onPress={() => {
                  setaddEnquiryVisible(false);
                }}
              />
            </View>
   <View style={{width:'100%',borderWidth:0.2,backgroundColor:'black',
              height:0.5
            }}></View>
            <ScrollView style={{height: 500}}>
              <View style={{gap: 16, padding: 12}}>
                <Text style={{fontSize: 14,color:'black'}}>Full Name</Text>
                <TextInput
                  style={[Sstyles.input, {color: 'black'}]}
                  placeholderTextColor='gray'
                  value={newEnquiry?.customer}
                  onChangeText={text => handleEnquiryChange('customer', text)}
                />
                <Text style={{fontSize: 14,color:'black'}}>Contact Number</Text>
                <TextInput
                  style={[Sstyles.input, {color: 'black'}]}
                  placeholderTextColor={'gray'}
                  value={newEnquiry?.contact}
                  onChangeText={text => handleEnquiryChange('contact', text)}
                />
                <Text style={{fontSize: 14,color:'black'}}>Min-Budget</Text>
                <TextInput
                  style={[Sstyles.input, {color: 'black'}]}
                  placeholderTextColor={'gray'}
                  value={newEnquiry?.minbudget?.toString() || ''}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setNewEnquiry({
                      ...newEnquiry,
                      minbudget: text === '' ? null : Number(text),
                    });
                  }}
                />

                <Text style={{fontSize: 14,color:'black'}}>Max-Budget</Text>
                <TextInput
                  style={[Sstyles.input, {color: 'black'}]}
                  placeholderTextColor={'gray'}
                  value={newEnquiry?.maxbudget?.toString() || ''}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setNewEnquiry({
                      ...newEnquiry,
                      maxbudget: text === '' ? null : Number(text),
                    });
                  }}
                />

                <View style={{width: '100%', marginBottom: 16}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#00000066',
                    }}>
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
                    }}>
                    <Picker
                      selectedValue={newEnquiry.category}
                      onValueChange={itemValue =>
                        handleEnquiryChange('category', itemValue)
                      }
                      style={{
                        height: 50,
                        fontSize: 16,
                        fontWeight: '500',
                        color: 'black',
                      }}>
                      <Picker.Item label="Select Property Category" value="" />
                      <Picker.Item label="New Flat" value="NewFlat" />
                      <Picker.Item label="New Plot" value="NewPlot" />
                      <Picker.Item label="Rental Flat" value="RentalFlat" />
                      <Picker.Item label="Rental Shop" value="RentalShop" />
                      <Picker.Item label="Rental Office" value="RentalOffice" />
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
                <View style={{width: '100%', marginBottom: 16}}>
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
                      selectedValue={newEnquiry.state}
                      onValueChange={itemValue =>
                        handleEnquiryChange('state', itemValue)
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
                <View style={{width: '100%', marginBottom: 16}}>
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
                      selectedValue={newEnquiry.city}
                      onValueChange={itemValue =>
                        handleEnquiryChange('city', itemValue)
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
                <Text style={{fontSize: 14,color:'black'}}>Location</Text>
                <TextInput
                  style={[Sstyles.input, {color: 'black'}]}
                  placeholderTextColor={'gray'}
                  value={newEnquiry?.location}
                  onChangeText={text => {
                    handleEnquiryChange('location', text);
                  }}
                />
                <Text style={{fontSize: 14,color:'black'}}>Message</Text>
                <TextInput
                  style={[Sstyles.input, {color: 'black'}]}
                  placeholderTextColor={'gray'}
                  value={newEnquiry?.message}
                  onChangeText={text => {
                    handleEnquiryChange('message', text);
                  }}
                />
                <View style={Sstyles.buttonContainer}>
                  <TouchableOpacity
                    style={Sstyles.cancel}
                    onPress={() => {
                      setaddEnquiryVisible(false);
                    }}>
                    <Text style={Sstyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={Sstyles.save} onPress={addEnquiry}>
                    <Text style={Sstyles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Toast config={toastConfig} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginInline: 'auto',
    flexDirection: 'column',
    backgroundColor: 'white',
    gap: 5,
  },
  box1: {
    width: '100%',
    marginInline: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  box2: {
    width: '100%',
    marginTop: 20,
    marginInline: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    width: 171,
    height: 90,
    padding: 16,
    gap: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 16,
    backgroundColor: '#076300',
    // gradient workaround using overlay if needed
  },

  content: {
    width: 139,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 8,
  },
  label: {
    width: 106,
    height: 15,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    color: '#fff',
  },
  iconWrapper: {
    width: 24,
    height: 24,

    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',

    borderRadius: 80,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    padding: 10,
    shadowRadius: 15,
    elevation: 10, // For Android
  },
  vectorInner: {
    width: 14,
    height: 14,
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
  },

  text: {
    marginTop: 10,
    marginLeft: 10,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#0069E1',
    // textDecorationLine: 'underline',
  },

  frameContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4, // Android shadow
    zIndex: 1,
    padding:5,
    margin:'auto'
  },

  searchContainer: {
    flexDirection: 'row',
    //marginLeft: 25,

    margin:'auto',
    marginTop: 0,
    gap: 0, // Not supported in all RN versions; use margin as fallback if needed
    width: '65%',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 19,
    paddingHorizontal: 10,

   // gap: 8,
    marginInline: 1,
    marginTop: 2,
    width: 40,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
  },
  icon: {
    marginInline: -6,
    width: 20,
    height: 20,
  },

  containerOfInqury: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    // iOS Shadow
    // shadowColor: '#000',
  },
  inquiryText: {
    marginLeft: 7,
    fontSize: 19,
    fontWeight: '600',
    lineHeight: 19,
    color: '#000000',
  },
  addClientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    // width: '35.79%',
    height: 36,
    backgroundColor: '#0078DB',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  iconPlaceholder: {
    width: 16,
    height: 16,

    borderRadius: 4,
  },
  addClientText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    color:'black'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
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
  },
});
export default Home;
