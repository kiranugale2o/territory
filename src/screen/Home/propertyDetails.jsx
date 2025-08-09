import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  Linking,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import PropertyOverviewCard from '../../component/PropertyOverviewCard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PropertyInfo, RootStackParamList } from '../../types';
import { FormatPrice } from '../../utils';
import { CheckCheck, MapPin, Star, X, XCircle } from 'lucide-react-native';
import Wings from '../../component/Wings';
import SuccessModal from '../../component/PaymentModules/SuccessModel';
import ConfirmBookingPopup from '../../component/ConfirmBookingPopup';
import { AuthContext } from '../../context/AuthContext';
import { payNow } from '../../utils/razorpay';
import SiteVisitModal from '../../component/SiteVisitPopUp';
import PropertyOverview from '../../component/PropertyOverviewCard';

const { width } = Dimensions.get('window');

// Local image imports
const icons = {
  location: require('../../../assets/icons/location.png'),
  area: require('../../../assets/icons/area.png'),
  garage: require('../../../assets/icons/home.png'),
  balcony: require('../../../assets/icons/balcony.png'),
  built: require('../../../assets/icons/built.png'),
  furniture: require('../../../assets/icons/furniture.png'),
  amenities: require('../../../assets/icons/gym.png'),
  construction: require('../../../assets/icons/construction.png'),
  elevator: require('../../../assets/icons/elevator.png'),
  cctv: require('../../../assets/icons/cctv.png'),
  security: require('../../../assets/icons/security.png'),
};

const PropertyDetails = () => {
  const route = useRoute();
  const { propertyid, enquirersid, salespersonid, booktype } = route.params;

  const navigation = useNavigation();

  const [showDrawer, setshowDrawer] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const auth = useContext(AuthContext);
  const [showSiteVisitPopup, setShowSiteVisitPopup] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [showBenifits, setShowBenifits] = useState(false);
  const [propertyData, setPropertyData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch(
          `https://api.reparv.in/sales/propertyinfo/${propertyid}`,
        );
        const data = await response.json();
        setPropertyData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyid]);

  const scrollRef = useRef < ScrollView > null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Features');
  const scrollTo = index => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      scrollTo(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollTo(currentIndex - 1);
    }
  };

  const images = [
    propertyData?.frontView ? JSON.parse(propertyData.frontView)[0] : null,
    propertyData?.sideView ? JSON.parse(propertyData.sideView)[0] : null,
    propertyData?.hallView ? JSON.parse(propertyData.hallView)[0] : null,
    propertyData?.kitchenView ? JSON.parse(propertyData.kitchenView)[0] : null,
    propertyData?.bedroomView ? JSON.parse(propertyData.bedroomView)[0] : null,
    propertyData?.nearestLandmark
      ? JSON.parse(propertyData.nearestLandmark)[0]
      : null,
    propertyData?.developedAmenities
      ? JSON.parse(propertyData.developedAmenities)[0]
      : null,
  ];

  const primaryItems = [
    {
      icon: icons.location,
      text: propertyData?.locationFeature,
    },
    { icon: icons.area, text: propertyData?.sizeAreaFeature },
    { icon: icons.garage, text: propertyData?.parkingFeature },
    { icon: icons.balcony, text: propertyData?.terraceFeature },
    { icon: icons.built, text: propertyData?.ageOfPropertyFeature },
    {
      icon: icons.furniture,
      text: propertyData?.furnishingFeature,
    },
  ];

  const secondaryItems = [
    { icon: icons.amenities, text: propertyData?.amenitiesFeature },
    { icon: icons.construction, text: propertyData?.floorNumberFeature },
    { icon: icons.elevator, text: propertyData?.propertyStatusFeature },
    { icon: icons.cctv, text: propertyData?.securityBenefit },
    { icon: icons.security, text: propertyData?.securityBenefit },
  ];

  //benifits
  const column1 = [
    {
      icon: require('../../../assets/icons/verified_user.png'),
      text: 'CCTV, gated community, intercom',
    },
    {
      icon: require('../../../assets/icons/payments.png'),
      text: 'potential for good returns',
    },
    {
      icon: require('../../../assets/icons/trending_up.png'),
      text: 'potential for property value increase',
    },
  ];

  const column2 = [
    {
      icon: require('../../../assets/icons/near_me.png'),
      text: propertyData?.amenitiesFeature,
    },
    {
      icon: require('../../../assets/icons/star.png'),
      text: propertyData?.qualityBenefit,
    },
    {
      icon: require('../../../assets/icons/solar_power.png'),
      text: propertyData?.ecofriendlyBenefit,
    },
  ];
  const [showSuccess, setShowSuccess] = useState(false);

  const parse = val => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };
  //console.log(propertyData);

  const basePrice = parse(propertyData?.totalOfferPrice);

  const stampDuty = (parse(propertyData?.stampDuty) * basePrice) / 100;
  const registrationFee =
    (parse(propertyData?.registrationFee) * basePrice) / 100;
  const gst = (parse(propertyData?.gst) * basePrice) / 100;

  const advocateFee = parse(propertyData?.advocateFee);
  const msebWater = parse(propertyData?.msebWater);
  const maintenance = parse(propertyData?.maintenance);
  const other = parse(propertyData?.other);

  const totalPrice =
    basePrice +
    stampDuty +
    registrationFee +
    gst +
    advocateFee +
    msebWater +
    maintenance +
    other;

  const showApprovedBy = propertyData?.propertyCategory !== 'FarmLand';
  const showRERA = ['NewFlat', 'NewPlot'].includes(
    propertyData?.propertyCategory,
  );

  return (
    <>
      <ScrollView style={{ flex: 1, width: '100%', backgroundColor: 'white' }}>
        <View style={styles.container}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            onScroll={e => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {images
              .filter(img => img && img !== '')
              .map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: `https://api.reparv.in${img}` }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
          </ScrollView>

          {/* Back Arrow */}
          {currentIndex > 0 && (
            <TouchableOpacity onPress={handlePrev} style={styles.leftArrow}>
              <View>
                <Svg width={26} height={24} viewBox="0 0 26 24" fill="none">
                  <Rect
                    x="0.5"
                    y="0"
                    width="25"
                    height="24"
                    rx="12"
                    fill="white"
                    fillOpacity={0.6}
                  />
                  <Path
                    d="M15.084 18L8.83398 12L15.084 6L16.5423 7.4L11.7507 12L16.5423 16.6L15.084 18Z"
                    fill="black"
                    fillOpacity={0.6}
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          )}

          {/* Forward Arrow */}
          {currentIndex < images.length - 1 && (
            <TouchableOpacity onPress={handleNext} style={styles.rightArrow}>
              <View>
                <Svg width={26} height={24} viewBox="0 0 26 24" fill="none">
                  <Rect
                    width="25"
                    height="24"
                    rx="12"
                    transform="matrix(-1 0 0 1 25.5 0)"
                    fill="white"
                    fillOpacity={0.6}
                  />
                  <Path
                    d="M10.916 18L17.166 12L10.916 6L9.45768 7.4L14.2493 12L9.45768 16.6L10.916 18Z"
                    fill="black"
                    fillOpacity={0.6}
                  />
                </Svg>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            marginTop: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start', // ✅ aligns all to the start
            gap: 1, // optional, if your RN version supports it
          }}
        >
          {[
            { key: 'frontView', label: 'Front View' },
            { key: 'sideView', label: 'Side View' },
            { key: 'balconyView', label: 'Balcony View' },
            { key: 'bedroomView', label: 'Bedroom View' },
            { key: 'bathroomView', label: 'Bathroom View' },
            { key: 'kitchenView', label: 'Kitchen View' },
            { key: 'hallView', label: 'Hall View' },
            { key: 'nearestLandmark', label: 'Landmark' },
            { key: 'developedAmenities', label: 'Amenities' },
          ].map(({ key, label }) => {
            const value = propertyData?.[key];

            // Skip if value is missing or empty string
            if (!value || value === '') return null;

            let parsed = [];
            try {
              parsed = JSON.parse(value);
            } catch {
              return null; // Skip invalid JSON
            }

            // Skip if array is empty or first value is falsy
            if (!parsed || parsed.length === 0 || !parsed[0]) return null;

            const imageUri = `https://api.reparv.in${parsed[0]}`;

            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSelectedImageUri(imageUri);
                  setModalVisible(true);
                }}
                style={{
                  width: 100,
                  margin: 6,
                  flexDirection: 'column',
                  borderRadius: 10,
                  overflow: 'hidden',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: 71, borderRadius: 10 }}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 4,
                    color:'gray',
                    textAlign: 'center',
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Image Show model */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.8)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{ position: 'absolute', top: 40, right: 20, zIndex: 2 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'white', fontSize: 28 }}>✕</Text>
            </TouchableOpacity>
            {selectedImageUri && (
              <Image
                source={{ uri: selectedImageUri }}
                style={{ width: '90%', height: '70%', borderRadius: 10 }}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>

        {/* Flat Selection & Wings */}
        {typeof propertyData?.propertyCategory === 'string' &&
          ['NewPlot', 'NewFlat', 'CommercialFlat', 'CommercialPlot'].includes(
            propertyData.propertyCategory,
          ) && (
            <View
              style={{
                flex: 1,
                width: '95%',
                marginTop: 20,
                marginHorizontal: 'auto',
                backgroundColor: '#fff0f0', // light red background
                borderColor: '#d32f2f', // red border
                borderWidth: 1,
                borderRadius: 12,

                padding: 12,
                shadowColor: '#d32f2f',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 6,
                elevation: 5,
              }}
            >
              {typeof propertyData?.propertyCategory === 'string' &&
                [
                  'NewPlot',
                  'NewFlat',
                  'CommercialFlat',
                  'CommercialPlot',
                ].includes(propertyData.propertyCategory) && (
                  <Wings
                    pdata={propertyData}
                    eid={enquirersid}
                    sid={salespersonid}
                  />
                )}
            </View>
          )}

        <View style={styles.cardContainer}>
          {/* Heading Section */}
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>{propertyData?.propertyName}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginVertical: 0 }}>
            {/* Available */}
            <View
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                backgroundColor: '#eeffec',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#047857', marginRight: 8 }}>
                Available
              </Text>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  paddingVertical: 2,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: 'black' }}>
                  {propertyData?.availableCount}
                </Text>
              </View>
            </View>

            {/* Booked */}
            <View
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                backgroundColor: '#fee2e2',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#ef4444', marginRight: 8 }}>Booked</Text>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  paddingVertical: 2,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: 'black' }}>
                  {propertyData?.bookedCount}
                </Text>
              </View>
            </View>
          </View>
          {/* Details Section */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 4,
            }}
          >
            {/* Approved By */}
            {showApprovedBy && (
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 4,
                  paddingHorizontal: 12,
                  backgroundColor: '#eeffec',
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <CheckCheck size={17} color="#047857" />
                <Text style={{ fontSize: 11, color: '#4B5563' }}>
                  {propertyData?.propertyApprovedBy}
                </Text>
              </View>
            )}

            {/* RERA Approved */}
            {showRERA && (
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 4,
                  paddingHorizontal: 12,
                  backgroundColor: '#eeffec',
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <CheckCheck size={17} color="#047857" />
                <Text style={{ fontSize: 11, color: '#4B5563' }}>
                  RERA Approved
                </Text>
              </View>
            )}

            {/* Distance From City Center */}
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 12,
                backgroundColor: '#0000000F',
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 11, color: '#4B5563' }}>
                {propertyData?.distanceFromCityCenter} KM Distance from city
                center
              </Text>
            </View>
          </View>

          {/* Additional Info Row */}
          <View
            style={{
              width: '100%',
              margin: 'auto',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <View style={styles.row}>
              <MapPin size={17} />
              <Text style={[styles.text, { fontSize: 16 }]}>
                {propertyData?.city}, Maharashtra
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${8010881965}`);
              }}
              style={[
                // styles.row2,
                {
                  gap: 2,
                  flexDirection: 'row',
                  width: 105,
                  alignSelf: 'flex-end',
                },
              ]}
            >
              <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                <Path
                  d="M13.8 14C12.4111 14 11.0389 13.6972 9.68333 13.0917C8.32778 12.4861 7.09444 11.6278 5.98333 10.5167C4.87222 9.40556 4.01389 8.17222 3.40833 6.81667C2.80278 5.46111 2.5 4.08889 2.5 2.7C2.5 2.5 2.56667 2.33333 2.7 2.2C2.83333 2.06667 3 2 3.2 2H5.9C6.05556 2 6.19444 2.05278 6.31667 2.15833C6.43889 2.26389 6.51111 2.38889 6.53333 2.53333L6.96667 4.86667C6.98889 5.04444 6.98333 5.19444 6.95 5.31667C6.91667 5.43889 6.85556 5.54444 6.76667 5.63333L5.15 7.26667C5.37222 7.67778 5.63611 8.075 5.94167 8.45833C6.24722 8.84167 6.58333 9.21111 6.95 9.56667C7.29444 9.91111 7.65556 10.2306 8.03333 10.525C8.41111 10.8194 8.81111 11.0889 9.23333 11.3333L10.8 9.76667C10.9 9.66667 11.0306 9.59167 11.1917 9.54167C11.3528 9.49167 11.5111 9.47778 11.6667 9.5L13.9667 9.96667C14.1222 10.0111 14.25 10.0917 14.35 10.2083C14.45 10.325 14.5 10.4556 14.5 10.6V13.3C14.5 13.5 14.4333 13.6667 14.3 13.8C14.1667 13.9333 14 14 13.8 14Z"
                  fill="#0078DB"
                />
              </Svg>

              <Text style={[styles.text, { color: '#0078DB', fontSize: 13 }]}>
                Call Agent
              </Text>
            </TouchableOpacity>
          </View>
          {/* Verified Badge */}
          <View
            style={{
              width: '95%',
              margin: 'auto',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <View style={styles.assuredWrapper}>
              <View style={styles.assured}>
                <Image
                  source={require('../../../assets/booking/verify.png')}
                  style={styles.verifiedIcon}
                />
                <Text style={styles.assuredText}>REPARV Assured</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setShowBenifits(true);
              }}
              style={styles.row2}
            >
              <Text
                style={[
                  {
                    color: 'black',
                    fontSize: 13,
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                Know Benefites
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pricing and EMI Details Card */}
          <View
            style={{
              marginTop: 10,
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 0.1,
              padding: 16,
              width: '95%',
              alignSelf: 'center',
              elevation: 0.5,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 1,
              shadowOffset: { width: 0, height: 1 },
              marginBottom: 40, // Add some bottom spacing
            }}
          >
            {/* Top Row: Price and EMI */}
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View>
                <Text style={{ fontSize: 13, color: 'gray' }}>
                  EMI starts at
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}
                >
                  ₹{propertyData?.emi.toLocaleString('en-IN')} /mo
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                <View style={styles.emibox}>
                  <Text style={styles.label}>Check eligibility</Text>
                  <Svg
                    style={{ marginTop: 6 }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <Path d="M18 8L22 12L18 16" />
                    <Path d="M2 12H22" />
                  </Svg>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: '#E0E0E0',
                marginVertical: 12,
              }}
            />

            {/* Bottom Row: Size and Booking Info */}
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: '600', color: '#000' }}
                >
                  ₹
                  {Number(propertyData?.totalOfferPrice || 0).toLocaleString(
                    'en-IN',
                  )}
                </Text>
                <Text style={{ fontSize: 13, color: 'gray' }}>
                  +Other Charged
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => {
                    setshowDrawer(!showDrawer);
                  }}
                  style={styles.emibox}
                >
                  <Text style={[styles.label, { marginTop: 20 }]}>
                    Pricing Breakup
                  </Text>

                  <Svg
                    style={{ marginTop: 20 }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <Path d="M18 8L22 12L18 16" />
                    <Path d="M2 12H22" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{ width: '95%', margin: 'auto', marginTop: 0, padding: 5 }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>
            Property Details
          </Text>
          <View style={{}}>
            <Text style={{ fontSize: 14, fontWeight: '500', marginTop: 15 }}>
              {propertyData?.propertyName}
            </Text>
          </View>
        </View>

        {/* property overView */}
        {/* <PropertyOverviewCard data={propertyData}></PropertyOverviewCard> */}
        <PropertyOverview propertyInfo={propertyData}></PropertyOverview>
        {/* Featured and benifits */}
        <View style={{ width: '95%', margin: 'auto', marginTop: 10 }}>
          <View style={{ alignSelf: 'stretch' }}>
            <Text style={[styles.heading]}>Features and Benefits</Text>
          </View>

          <View style={styles.frame135}>
            {/* Features*/}
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity
                style={styles.frame120}
                onPress={() => setSelectedTab('Features')}
              >
                <View
                  style={[
                    styles.iconCircle,
                    selectedTab === 'Features'
                      ? styles.activeBg
                      : styles.inactiveBg,
                  ]}
                ></View>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'Features'
                      ? styles.activeText
                      : styles.inactiveText,
                  ]}
                >
                  Features
                </Text>
              </TouchableOpacity>
              <View
                style={[
                  selectedTab === 'Features'
                    ? { borderColor: '#0078DB' }
                    : { borderColor: 'gray' },
                  { borderWidth: 0.5, marginTop: 5, width: 130 },
                ]}
              ></View>
            </View>
            {/* Benefits */}
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity
                style={styles.frame134}
                onPress={() => setSelectedTab('Benefits')}
              >
                <View
                  style={[
                    styles.iconCircle,
                    selectedTab === 'Benefits'
                      ? styles.activeBg
                      : styles.inactiveBg,
                  ]}
                ></View>
                <Text
                  style={[
                    styles.tabText,

                    selectedTab === 'Benefits'
                      ? styles.activeText
                      : styles.inactiveText,
                    { marginTop: 5 },
                  ]}
                >
                  Benefits
                </Text>
              </TouchableOpacity>
              <View
                style={[
                  selectedTab === 'Benefits'
                    ? { borderColor: '#0078DB' }
                    : { borderColor: 'gray' },
                  { borderWidth: 0.5, marginTop: 5, width: 130 },
                ]}
              ></View>
            </View>
          </View>

          {selectedTab === 'Features' ? (
            <>
              <View
                style={{
                  flexDirection: 'column',
                  padding: 4,
                  gap: 16,
                  width: 301,
                }}
              >
                {[primaryItems, secondaryItems].map((items, groupIndex) => (
                  <View
                    key={groupIndex}
                    style={{ flexDirection: 'column', gap: 16 }}
                  >
                    {items.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Image
                          source={item.icon}
                          style={{
                            width: 16,
                            height: 16,
                            resizeMode: 'contain',
                            tintColor: '#00345F',
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: '400',
                            fontSize: 12,
                            lineHeight: 15,
                            textTransform: 'capitalize',
                            color: '#00345F',
                          }}
                        >
                          {item.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <View style={{ flexDirection: 'column', gap: 16 }}>
                {/* Column 1 */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: 5,
                    gap: 16,
                    width: 234,
                    height: 80,
                  }}
                >
                  {column1.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 0,
                        gap: 8,
                        width: 234,
                        height: 16,
                        alignSelf: 'stretch',
                      }}
                    >
                      <Image
                        source={item.icon}
                        style={{
                          width: 16,
                          height: 16,
                          resizeMode: 'contain',
                          tintColor: '#00345F',
                        }}
                      />
                      <Text
                        style={{
                          width: 'auto',
                          height: 15,
                          fontFamily: 'Inter',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          fontSize: 12,
                          lineHeight: 15,
                          textTransform: 'capitalize',
                          color: '#00345F',
                        }}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Column 2 */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: 0,
                    gap: 16,
                    width: 218,
                    height: 80,
                  }}
                >
                  {column2.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 0,
                        gap: 8,
                        width: 218,
                        height: 16,
                        alignSelf: 'stretch',
                      }}
                    >
                      <Image
                        source={item.icon}
                        style={{
                          width: 16,
                          height: 16,
                          resizeMode: 'contain',
                          tintColor: '#00345F',
                        }}
                      />
                      <Text
                        style={{
                          width: 'auto',
                          height: 15,
                          fontFamily: 'Inter',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          fontSize: 12,
                          lineHeight: 15,
                          textTransform: 'capitalize',
                          color: '#00345F',
                        }}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
        <View style={{ padding: 20 }}></View>
      </ScrollView>

      {/* {showDrawer && ( */}
      <Modal visible={showDrawer} transparent animationType="slide">
        <ScrollView style={dstyles.drawer}>
          {/* Header */}
          <View style={dstyles.header}>
            <Text style={dstyles.title}>Price Summary</Text>
            <TouchableOpacity onPress={() => setshowDrawer(!showDrawer)}>
              <X size={20} />
            </TouchableOpacity>
          </View>

          <Text style={dstyles.subtext}>Check your complete price breakup</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={dstyles.scrollArea}
          >
            {/* Base Price */}
            <ItemRow
              label="Base Price"
              value={<FormatPrice price={basePrice} />}
            />
            {/* Stamp Duty */}
            <ItemRow
              label="Stamp Duty"
              value={`${propertyData?.stampDuty} %`}
            />
            <InfoText text="Stamp duty is a state government tax paid by the buyer to legally register property ownership. In Maharashtra, it ranges from 5% to 7% of the property value." />
            {/* Registration Fee */}
            <ItemRow
              label="Registration Fee"
              value={`${propertyData?.registrationFee} %`}
            />
            <InfoText text="Property registration charges are government fees paid to legally record a property in the buyer’s name 1% registration charge (capped at ₹30,000), and women buyers receive a 1% concession." />
            {/* GST */}
            <ItemRow label="GST" value={`${propertyData?.gst} %`} />
            <InfoText text="GST on property is applicable at 5% for under-construction homes (without ITC benefit) and 1% for affordable housing, while no GST is charged on ready-to-move-in properties." />
            {/* Advocate Fee */}
            <ItemRow
              label="Advocate Fee"
              value={<FormatPrice price={parse(propertyData?.advocateFee)} />}
            />
            <InfoText text="Advocate fees for property purchase covering legal due diligence, agreement drafting, and registration assistance." />
            {/* MSEB & Water */}
            <ItemRow
              label="MSEB & Water"
              value={<FormatPrice price={parse(propertyData?.msebWater)} />}
            />
            <InfoText text="MSEB (electricity) and water connection fees are government charges paid during property possession." />
            {/* Maintainance */}
            <ItemRow
              label="Maintainance"
              value={<FormatPrice price={parse(propertyData?.maintenance)} />}
            />
            <InfoText text="Maintenance charges are monthly fees paid by property owners for upkeep of common areas and amenities" />
            {/* other */}
            <ItemRow
              label="Other"
              value={<FormatPrice price={parse(propertyData?.other)} />}
            />
            <InfoText text="Other charges in property transactions can include society formation fees, parking fees, legal charges, which vary based on the property's location and services provided." />

            <View style={dstyles.row}>
              <Text
                style={[
                  dstyles.label,
                  {
                    fontSize: 16,
                    fontWeight: 600,
                  },
                ]}
              >
                Total Property Price
              </Text>
              <Text
                style={[
                  dstyles.label,
                  {
                    fontSize: 16,
                    fontWeight: 600,
                  },
                ]}
              >
                {<FormatPrice price={totalPrice} />}
              </Text>
            </View>

            <View
              style={{
                height: 50,
                padding: 10,
              }}
            ></View>
          </ScrollView>
        </ScrollView>
      </Modal>
      {/* )} */}

      {/* Project benifits */}
      <PriceBenModal
        visible={showBenifits}
        onClose={() => setShowBenifits(false)}
      />

      {typeof propertyData?.propertyCategory === 'string' &&
        !['NewPlot', 'NewFlat', 'CommercialFlat', 'CommercialPlot'].includes(
          propertyData.propertyCategory,
        ) && (
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => {
                  if (enquirersid !== null) {
                    setShowPopup(true);
                  } else {
                    setShowSiteVisitPopup(true);
                  }
                }}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}

      <SiteVisitModal
        visible={showSiteVisitPopup}
        onClose={() => setShowSiteVisitPopup(false)}
        id={propertyid}
      />

      {/* After Booking */}
      {showPopup && (
        <ConfirmBookingPopup
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          onConfirm={() => {
            setShowPopup(false);
            payNow(
              auth?.user?.email,
              auth?.user?.contact,
              auth?.user?.name,
              auth,
              propertyid, // pid
              auth?.user?.id, // sid
              enquirersid, // eid
            );
          }}
        />
      )}

      {/* SuccessFull model */}
      <Modal visible={auth?.isPaymentSuccess} transparent animationType="fade">
        <SuccessModal onClose={() => auth?.setIsPaymentSuccess(false)} />
      </Modal>
    </>
  );
};

const ItemRow = ({ label, value }) => (
  <View style={dstyles.row}>
    <Text style={dstyles.label}>{label}</Text>
    <Text style={dstyles.value}>{value}</Text>
  </View>
);

const InfoText = ({ text }) => <Text style={styles.infoText}>{text}</Text>;

const dstyles = StyleSheet.create({
  drawer: {
    flex: 1,

    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 16,
    padding: 24,
    borderWidth: 0.5,
    paddingVertical: 40,
    paddingBottom: 50,
    width: '100%',
    height: 650,
    //eight: '90%',
    position: 'absolute',
    bottom: 0,
    shadowOpacity: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  subtext: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
    marginBottom: 16,
  },
  scrollArea: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  infoText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.4)',
    //ineHeight: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    height: 249,
    width: '100%',
  },
  scrollView: {
    flexGrow: 0,
  },
  image: {
    width: width,
    height: 249,
  },

  leftArrow: {
    position: 'absolute',
    top: '45%',
    left: 10,
    zIndex: 10,
  },
  rightArrow: {
    position: 'absolute',
    top: '45%',
    right: 10,
    zIndex: 10,
  },
  box: {
    // width: '25%',
    width: 100,
    //orderWidth: 0.5,
    borderRadius: 10,
    //orderColor: 'gray',
    //flexGrow: 1,
    // order: 0, // 'order' is not supported in React Native, skip or manage via layout
  },
  boximage: {
    width: '100%',
    height: 71,
    borderRadius: 10,
  },
  cardContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: 'gray',
    // borderWidth: 0.5,
    marginTop: 20,
    gap: 16, // Use marginBottom on children if your RN version < 0.71
    width: '95%',
    alignSelf: 'center', // instead of margin: 'auto'
  },

  headingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 5,
    gap: 16,
    width: '95%',
  },

  headingText: {
    fontFamily: 'Inter', // Ensure font is linked in RN
    fontWeight: '700',
    fontSize: 18,

    color: '#000000',
  },

  detailsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    gap: 16,
    width: '95%',
  },

  facilitiesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //alignItems: 'center',
    paddingHorizontal: 5,
    width: '100%',
    gap: 4,
  },

  badge: {
    flexDirection: 'row',

    paddingHorizontal: 10,
    width: 'auto',
    flexWrap: 'wrap',
    gap: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 6,
    height: 24,
  },

  badgeText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 17 * 1.4, // 140%
    color: 'rgba(0, 9, 41, 0.4)',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    height: 24,
    gap: 16,
  },

  infoText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,

    lineHeight: 18, // 150%
    color: 'rgba(0, 0, 0, 0.6)',
  },

  underlineText: {
    textDecorationLine: 'underline',
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 8,
    width: 137,
    height: 24,
    backgroundColor: 'rgba(11, 181, 1, 0.1)', // gradient fallback
    borderRadius: 4,
    marginTop: 8,
  },

  verifiedText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 15,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',

    justifyContent: 'space-between',
    gap: 5, // Requires React Native 0.71+, otherwise use margin
    width: 'auto',
    alignSelf: 'center', // Equivalent to `margin: 0 auto` in web
  },

  text: {
    width: 120,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2, // works on RN 0.71+, otherwise use marginLeft
    textDecorationLine: 'underline',
    alignSelf: 'center', // centers it horizontally like margin: 0 auto
  },
  assuredWrapper: {
    marginTop: 1,
  },
  assured: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 181, 1, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  assuredText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  emibox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1, // Only works in React Native 0.71+, otherwise use marginRight
    width: 127,
    height: 15,
  },
  label: {
    //ontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 15,
    color: '#000000',
    width: 91,
    height: 15,
  },
  arrow: {
    width: 28,
    height: 0,
    borderTopWidth: 1.5,
    borderColor: '#000000',
  },
  /* ===== Container ===== */
  btnc: {
    // Figma → RN
    padding: 0,

    marginInline: 'auto',
    marginTop: -30,
    width: '90%',
    height: 47,
  },

  /* ===== Button ===== */
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 47,
    backgroundColor: '#0078DB',
    borderRadius: 6,
  },

  /* ===== Text inside the button ===== */
  buttonText: {
    fontFamily: 'Inter', // make sure the font is loaded (e.g. via Expo)
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    color: '#FFFFFF',
    textAlign: 'center',
    // The explicit width/height from Figma are rarely needed for text,
    // but include them here in case you want the exact footprint:
    width: 153,
    height: 19,
  },
  heading: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 19,
    textAlign: 'left',
    color: '#000',
  },
  frame135: {
    width: '100%',
    height: 52,
    backgroundColor: 'white',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 58,
  },
  frame120: {
    flexDirection: 'row',
    alignItems: 'center',

    borderColor: 'rgba(0, 0, 0, 0.1)',
    gap: 4,
  },
  frame134: {
    flexDirection: 'row',
    alignItems: 'center',

    borderColor: '#0078DB',
    gap: 4,
  },
  iconCircle: {
    width: 20,
    height: 20,
    marginTop: 5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBg: {
    color: '#0078DB',
  },
  inactiveBg: {},
  tabText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 12,
  },
  activeText: {
    fontWeight: '700',
    color: '#0078DB',
  },
  inactiveText: {
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  safeArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '90%',
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 34,
    width: '100%',
    backgroundColor: '#0078DB',
    borderRadius: 6,
  },
  bookButtonText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default PropertyDetails;

const PriceBenModal = ({ visible, onClose }) => {
  const benefits = [
    {
      title: 'Trusted Investment Guidance',
      description:
        'We prioritize your needs and budget to help you invest wisely—no hidden agendas, just honest support.',
    },
    {
      title: 'Expert Partner Network',
      description:
        'Our trained Sales, Territory, Onboarding, and Project Partners offer personalized service, ensuring a smooth buying experience.',
    },
    {
      title: 'End-to-End Assistance',
      description:
        'From property visits to home loans and registration, we handle it all—so you can relax and focus on your dream home.',
    },
    {
      title: 'Verified Properties Only',
      description:
        'Every listing on Reparv is thoroughly verified for legal clarity, RERA compliance, and construction quality.',
    },
    {
      title: 'Transparent Process',
      description:
        'No confusing jargon or last-minute surprises—we keep you informed at every step with clear documentation.',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={priceBen.overlay}>
        <View style={priceBen.modal}>
          <View style={priceBen.header}>
            <View style={priceBen.titleRow}>
              {/* <Icon name="verified" size={24} color="#0078DB" /> */}
              <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                <Path
                  d="M9.10195 23L7.20195 19.8L3.60195 19L3.95195 15.3L1.50195 12.5L3.95195 9.7L3.60195 6L7.20195 5.2L9.10195 2L12.502 3.45L15.902 2L17.802 5.2L21.402 6L21.052 9.7L23.502 12.5L21.052 15.3L21.402 19L17.802 19.8L15.902 23L12.502 21.55L9.10195 23ZM11.452 16.05L17.102 10.4L15.702 8.95L11.452 13.2L9.30195 11.1L7.90195 12.5L11.452 16.05Z"
                  fill="url(#paint0_linear_1558_2024)"
                />
                <Defs>
                  <LinearGradient
                    id="paint0_linear_1558_2024"
                    x1="23.502"
                    y1="12.5"
                    x2="1.50195"
                    y2="12.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <Stop stop-color="#FFFFFF" />
                    <Stop offset="1" stop-color="#0078DB" />
                  </LinearGradient>
                </Defs>
              </Svg>

              <Text style={priceBen.title}>Why buy from REPARV?</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <XCircle />
            </TouchableOpacity>
          </View>

          {benefits.map((item, index) => (
            <View style={priceBen.benefitRow} key={index}>
              <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <Path
                  d="M4.38398 14.5007L5.46732 9.81732L1.83398 6.66732L6.63398 6.25065L8.50065 1.83398L10.3673 6.25065L15.1673 6.66732L11.534 9.81732L12.6173 14.5007L8.50065 12.0173L4.38398 14.5007Z"
                  fill="#EFBF35"
                />
              </Svg>

              <View style={priceBen.benefitTextContainer}>
                <Text style={priceBen.benefitTitle}>{item.title}</Text>
                <Text style={priceBen.benefitDesc}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const priceBen = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modal: {
    width: '100%',
    padding: 24,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  benefitTextContainer: {
    flex: 1,
    gap: 4,
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  benefitDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.4)',
  },
});
