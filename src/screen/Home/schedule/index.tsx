import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {Enquiry, RootStackParamList, SalesPerson} from '../../../types';
import {AuthContext} from '../../../context/AuthContext';
import Loader from '../../../component/loader';
import {formatUpdatedAt, toastConfig} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HandCoins, Loader2} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { formatIndianAmount } from '../../..';

const Schedule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
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
         console.log(data,'ss');
      setEnquiries(data);
   
      
    } catch (error) {
      console.error('API call failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(); // initial fetch
    const interval = setInterval(fetchEnquiries, 5000); // fetch every 30s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  if (loading) return <Loader />;

  return (
    <View
      style={{
        flex: 1,
        width: '100%',

        backgroundColor: 'white',
        flexDirection: 'column',
      }}>
      <View style={{}}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sliderContainer}
          style={{marginTop: 20}}>
          {enquiries !== null &&
            enquiries
              ?.slice()
              .reverse()
              .map(d =>
                d.territorystatus === 'New' ? (
                  <View key={d.enquirersid} style={styles.slide}>
                    <StatusCard enquiry={d} />
                  </View>
                ) : null,
              )}
        </ScrollView>
      </View>

      <Text style={styles.headerText}>Visit Scheduleds</Text>
      <View style={{flex: 1}}>
        <ScrollView>
          {enquiries !== null &&
            enquiries.map((d, i) => (
              <VisitCard enquiry={d} key={d.enquirersid} />
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Schedule;

const VisitCard: React.FC<Props> = ({enquiry}) => {
  const [data, setData] = useState<SalesPerson | null>(null);
  const [property, setProperty] = useState(null);
  const getProfile = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/admin/salespersons/get/${enquiry?.salespersonid}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();
  

      setData(data);
      // navigation.navigate("")
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  const {relative, fullDate, timeOnly} = formatUpdatedAt(enquiry.updated_at);

  const fetchProperty = async () => {
    try {
      const res = await fetch(
        `https://api.reparv.in/sales/properties/${enquiry?.propertyid}`,
      );
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      //console.log(data,"peeee");

      setProperty(data,"fff");
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };

  useEffect(() => {
    getProfile();
    fetchProperty();
  }, []);
  return (
    <View style={styles.wrapper}>
      <View style={[{ position: 'absolute',
    width: 27,
    height: 129,

   
    borderRadius: 8,},getStatusStyle(enquiry?.status)]} />

      
      <View style={styles.card}>
        <View style={styles.titleSection}>
         <Text style={[styles.title,getStatusStyleText(enquiry?.status),{backgroundColor:'white'}]}>
  {enquiry?.status}
</Text>
      <Text style={styles.subtitle}>
            Site Visit with
            {' ' + data?.fullname}
          </Text>
        </View>

        {/* Date, Time, Location */}
        <View style={Statusstyles.container}>
          {/* Date Row */}
          <View style={Statusstyles.row}>
            <View style={Statusstyles.iconText}>
              <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <G clipPath="url(#clip0_611_560)">
                  <Path
                    d="M10.875 12H1.125C0.5025 12 0 11.4975 0 10.875V1.875C0 1.2525 0.5025 0.75 1.125 0.75H10.875C11.4975 0.75 12 1.2525 12 1.875V10.875C12 11.4975 11.4975 12 10.875 12ZM1.125 1.5C0.915 1.5 0.75 1.665 0.75 1.875V10.875C0.75 11.085 0.915 11.25 1.125 11.25H10.875C11.085 11.25 11.25 11.085 11.25 10.875V1.875C11.25 1.665 11.085 1.5 10.875 1.5H1.125Z"
                    fill="#999999"
                  />
                  <Path
                    d="M3.375 3C3.165 3 3 2.835 3 2.625V0.375C3 0.165 3.165 0 3.375 0C3.585 0 3.75 0.165 3.75 0.375V2.625C3.75 2.835 3.585 3 3.375 3ZM8.625 3C8.415 3 8.25 2.835 8.25 2.625V0.375C8.25 0.165 8.415 0 8.625 0C8.835 0 9 0.165 9 0.375V2.625C9 2.835 8.835 3 8.625 3ZM11.625 4.5H0.375C0.165 4.5 0 4.335 0 4.125C0 3.915 0.165 3.75 0.375 3.75H11.625C11.835 3.75 12 3.915 12 4.125C12 4.335 11.835 4.5 11.625 4.5Z"
                    fill="#999999"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_611_560">
                    <Rect width={12} height={12} fill="white" />
                  </ClipPath>
                </Defs>
              </Svg>

              <Text style={Statusstyles.label}>Date:</Text>
            </View>
            <Text style={Statusstyles.value}>{fullDate}</Text>
          </View>

          {/* Time Row */}
          <View style={Statusstyles.row}>
            <View style={Statusstyles.iconText}>
              <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <Path
                  d="M6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0ZM6 1.2C4.72696 1.2 3.50606 1.70571 2.60589 2.60589C1.70571 3.50606 1.2 4.72696 1.2 6C1.2 7.27304 1.70571 8.49394 2.60589 9.39411C3.50606 10.2943 4.72696 10.8 6 10.8C7.27304 10.8 8.49394 10.2943 9.39411 9.39411C10.2943 8.49394 10.8 7.27304 10.8 6C10.8 4.72696 10.2943 3.50606 9.39411 2.60589C8.49394 1.70571 7.27304 1.2 6 1.2ZM6 2.4C6.14696 2.40002 6.2888 2.45397 6.39862 2.55163C6.50844 2.64928 6.57861 2.78385 6.5958 2.9298L6.6 3V5.7516L8.2242 7.3758C8.33181 7.48378 8.39428 7.62866 8.39894 7.78103C8.40359 7.9334 8.35007 8.08183 8.24925 8.19617C8.14843 8.31051 8.00787 8.38218 7.85612 8.39664C7.70436 8.4111 7.5528 8.36725 7.4322 8.274L7.3758 8.2242L5.5758 6.4242C5.48255 6.33087 5.42266 6.2094 5.4054 6.0786L5.4 6V3C5.4 2.84087 5.46321 2.68826 5.57574 2.57574C5.68826 2.46321 5.84087 2.4 6 2.4Z"
                  fill="#999999"
                />
              </Svg>

              <Text style={Statusstyles.label}>Time:</Text>
            </View>
            <Text style={Statusstyles.value}>{timeOnly}</Text>
          </View>

          {/* Location Row */}
          <View style={Statusstyles.row}>
            <View style={Statusstyles.iconText}>
              <Svg width="11" height="14" viewBox="0 0 11 14" fill="none">
                <Path
                  d="M6.25 4.75C6.25 4.94891 6.17098 5.13968 6.03033 5.28033C5.88968 5.42098 5.69891 5.5 5.5 5.5C5.30109 5.5 5.11032 5.42098 4.96967 5.28033C4.82902 5.13968 4.75 4.94891 4.75 4.75C4.75 4.55109 4.82902 4.36032 4.96967 4.21967C5.11032 4.07902 5.30109 4 5.5 4C5.69891 4 5.88968 4.07902 6.03033 4.21967C6.17098 4.36032 6.25 4.55109 6.25 4.75Z"
                  stroke="#999999"
                  stroke-linejoin="round"
                />
                <Path
                  d="M9.625 5.125C9.625 7.4035 8.125 10 5.5 13C2.875 10 1.375 7.4035 1.375 5.125C1.375 4.03098 1.8096 2.98177 2.58318 2.20818C3.35677 1.4346 4.40598 1 5.5 1C6.59402 1 7.64323 1.4346 8.41682 2.20818C9.1904 2.98177 9.625 4.03098 9.625 5.125Z"
                  stroke="#999999"
                  stroke-linejoin="round"
                />
              </Svg>

              <Text style={Statusstyles.label}>Location:</Text>
            </View>
            <Text style={Statusstyles.value}>
              {property?.propertyName}, {property?.address},{property?.city}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'New':
      return { backgroundColor: '#22C55E' }; // #0078DB
    case 'Visit Scheduled':
      return { backgroundColor: '#3B82F6' }; // blue
    case 'Token':
      return { backgroundColor: '#EAB308' }; // yellow
    case 'Follow Up':
      return { backgroundColor: '#8B5CF6' }; // purple
    case 'Cancelled':
      return { backgroundColor: '#EF4444' }; // red
    default:
      return { backgroundColor: '#D1D5DB' }; // gray fallback
  }
};

const getStatusStyleText = (status: string) => {
  switch (status) {
    case 'New':
      return { color: '#22C55E', backgroundColor: '#DCFCE7' }; // #0078DB
    case 'Visit Scheduled':
      return { color: '#3B82F6', backgroundColor: '#DBEAFE' }; // blue
    case 'Token':
      return { color: '#EAB308', backgroundColor: '#FEF9C3' }; // yellow
    case 'Follow Up':
      return { color: '#8B5CF6', backgroundColor: '#EDE9FE' }; // purple
    case 'Cancelled':
      return { color: '#EF4444', backgroundColor: '#FEE2E2' }; // red
    default:
      return { color: '#000000', backgroundColor: '#F3F4F6' }; // default gray
  }
};




const styles = StyleSheet.create({
  headerText: {
    margin: 'auto',
    marginTop: 10,
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    color: '#000000',
  },
  wrapper: {
    marginTop: 20,
    width: '95%',
    margin: 'auto',
  },
  yellowBar: {
    position: 'absolute',
    width: 27,
    height: 129,

   
    borderRadius: 8,
  },
  card: {
    // position: 'absolute',
    left: 3.96,
    width: '100%',
    margin: 'auto',
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 20,
    paddingTop: 16,
    paddingBottom: 17,
    justifyContent: 'space-between',
  },
  sliderContainer: {
    paddingHorizontal: 10,
  },
  slide: {
    width: 300, // or use Dimensions.get('window').width for full-screen width
    marginRight: 15,
  },
  titleSection: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#999999',
  },
  detailsSection: {
    gap: 8,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  icon: {
    width: 12,
    height: 12,
    tintColor: '#999999',
  },
  label: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
});

interface Props {
  enquiry: Enquiry;
}
const StatusCard: React.FC<Props> = ({enquiry}) => {
  const [data, setData] = useState<SalesPerson | null>(null);
  const [property, setProperty] = useState(null);
  const getProfile = async (id: any) => {
    try {
      const response = await fetch(
        `https://api.reparv.in/admin/salespersons/get/${id}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();
     
      setData(data);
    
      
      // navigation.navigate("")
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const fetchProperty = async () => {
    try {
      const res = await fetch(
        `https://api.reparv.in/sales/properties/${enquiry?.propertyid}`,
      );
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
     
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };

  const {relative, fullDate, timeOnly} = formatUpdatedAt(enquiry.updated_at);
  useEffect(() => {
    getProfile(enquiry?.enquirersid);
    fetchProperty();
  }, []);
 
  getProfile(enquiry?.enquirersid);
  const acceptEnquiry = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/enquirers/accept/${enquiry.enquirersid}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to accept enquiry.');
      }

      Toast.show({
        type: 'success',
        text1: 'Enquiry Accept',
      });
    } catch (error) {
      console.error('Error accepting enquiry:', error);
    }
  };

  const rejectEnquiry = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/enquirers/reject/${enquiry?.enquirersid}`,
        {
          method: 'PUT',
          credentials: 'include', // Send cookies (important for auth)
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to reject enquiry.');
      }
      Toast.show({
        type: 'error',
        text1: 'Enquiry Rejected',
      });
    } catch (error) {
      console.error('Error accepting enquiry:', error);
    }
  };

  return (
    <View style={Statusstyles.card}>
      {/* Top row: Icon + Status + Time */}
      <View style={Statusstyles.statusRow}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 0C18.6276 0 24 5.3724 24 12C24 18.6276 18.6276 24 12 24C5.3724 24 0 18.6276 0 12C0 5.3724 5.3724 0 12 0ZM12 4.8C11.6817 4.8 11.3765 4.92643 11.1515 5.15147C10.9264 5.37652 10.8 5.68174 10.8 6V12C10.8001 12.3182 10.9265 12.6234 11.1516 12.8484L14.7516 16.4484C14.9779 16.667 15.281 16.7879 15.5957 16.7852C15.9103 16.7825 16.2113 16.6563 16.4338 16.4338C16.6563 16.2113 16.7825 15.9103 16.7852 15.5957C16.7879 15.281 16.667 14.9779 16.4484 14.7516L13.2 11.5032V6C13.2 5.68174 13.0736 5.37652 12.8485 5.15147C12.6235 4.92643 12.3183 4.8 12 4.8Z"
            fill="#EAB308"
          />
        </Svg>

        <View style={Statusstyles.statusTextContainer}>
          <Text style={Statusstyles.statusText}>Awaiting Response</Text>
          <Text style={Statusstyles.timeAgo}>{relative}</Text>
        </View>
      </View>

      {/* Info message */}
      <Text style={Statusstyles.infoText}>
        {data?.fullname} is assign {property?.propertyName} property .
      </Text>

      {/* Date, Time, Location */}
      <View style={Statusstyles.container}>
        {/* Date Row */}
        <View style={Statusstyles.row}>
          <View style={Statusstyles.iconText}>
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <G clipPath="url(#clip0_611_560)">
                <Path
                  d="M10.875 12H1.125C0.5025 12 0 11.4975 0 10.875V1.875C0 1.2525 0.5025 0.75 1.125 0.75H10.875C11.4975 0.75 12 1.2525 12 1.875V10.875C12 11.4975 11.4975 12 10.875 12ZM1.125 1.5C0.915 1.5 0.75 1.665 0.75 1.875V10.875C0.75 11.085 0.915 11.25 1.125 11.25H10.875C11.085 11.25 11.25 11.085 11.25 10.875V1.875C11.25 1.665 11.085 1.5 10.875 1.5H1.125Z"
                  fill="#999999"
                />
                <Path
                  d="M3.375 3C3.165 3 3 2.835 3 2.625V0.375C3 0.165 3.165 0 3.375 0C3.585 0 3.75 0.165 3.75 0.375V2.625C3.75 2.835 3.585 3 3.375 3ZM8.625 3C8.415 3 8.25 2.835 8.25 2.625V0.375C8.25 0.165 8.415 0 8.625 0C8.835 0 9 0.165 9 0.375V2.625C9 2.835 8.835 3 8.625 3ZM11.625 4.5H0.375C0.165 4.5 0 4.335 0 4.125C0 3.915 0.165 3.75 0.375 3.75H11.625C11.835 3.75 12 3.915 12 4.125C12 4.335 11.835 4.5 11.625 4.5Z"
                  fill="#999999"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_611_560">
                  <Rect width={12} height={12} fill="white" />
                </ClipPath>
              </Defs>
            </Svg>

            <Text style={Statusstyles.label}>Assign Date:</Text>
          </View>
          <Text style={Statusstyles.value}>{fullDate}</Text>
        </View>

        <View style={Statusstyles.row}>
          <View style={Statusstyles.iconText}>
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <G clipPath="url(#clip0_611_560)">
                <Path
                  d="M10.875 12H1.125C0.5025 12 0 11.4975 0 10.875V1.875C0 1.2525 0.5025 0.75 1.125 0.75H10.875C11.4975 0.75 12 1.2525 12 1.875V10.875C12 11.4975 11.4975 12 10.875 12ZM1.125 1.5C0.915 1.5 0.75 1.665 0.75 1.875V10.875C0.75 11.085 0.915 11.25 1.125 11.25H10.875C11.085 11.25 11.25 11.085 11.25 10.875V1.875C11.25 1.665 11.085 1.5 10.875 1.5H1.125Z"
                  fill="#999999"
                />
                <Path
                  d="M3.375 3C3.165 3 3 2.835 3 2.625V0.375C3 0.165 3.165 0 3.375 0C3.585 0 3.75 0.165 3.75 0.375V2.625C3.75 2.835 3.585 3 3.375 3ZM8.625 3C8.415 3 8.25 2.835 8.25 2.625V0.375C8.25 0.165 8.415 0 8.625 0C8.835 0 9 0.165 9 0.375V2.625C9 2.835 8.835 3 8.625 3ZM11.625 4.5H0.375C0.165 4.5 0 4.335 0 4.125C0 3.915 0.165 3.75 0.375 3.75H11.625C11.835 3.75 12 3.915 12 4.125C12 4.335 11.835 4.5 11.625 4.5Z"
                  fill="#999999"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_611_560">
                  <Rect width={12} height={12} fill="white" />
                </ClipPath>
              </Defs>
            </Svg>

            <Text style={Statusstyles.label}>Visit Date:</Text>
          </View>
          <Text style={Statusstyles.value}>{enquiry?.visitdate}</Text>
        </View>

        {/* Time Row */}
        <View style={Statusstyles.row}>
          <View style={Statusstyles.iconText}>
            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <Path
                d="M6 0C9.3138 0 12 2.6862 12 6C12 9.3138 9.3138 12 6 12C2.6862 12 0 9.3138 0 6C0 2.6862 2.6862 0 6 0ZM6 1.2C4.72696 1.2 3.50606 1.70571 2.60589 2.60589C1.70571 3.50606 1.2 4.72696 1.2 6C1.2 7.27304 1.70571 8.49394 2.60589 9.39411C3.50606 10.2943 4.72696 10.8 6 10.8C7.27304 10.8 8.49394 10.2943 9.39411 9.39411C10.2943 8.49394 10.8 7.27304 10.8 6C10.8 4.72696 10.2943 3.50606 9.39411 2.60589C8.49394 1.70571 7.27304 1.2 6 1.2ZM6 2.4C6.14696 2.40002 6.2888 2.45397 6.39862 2.55163C6.50844 2.64928 6.57861 2.78385 6.5958 2.9298L6.6 3V5.7516L8.2242 7.3758C8.33181 7.48378 8.39428 7.62866 8.39894 7.78103C8.40359 7.9334 8.35007 8.08183 8.24925 8.19617C8.14843 8.31051 8.00787 8.38218 7.85612 8.39664C7.70436 8.4111 7.5528 8.36725 7.4322 8.274L7.3758 8.2242L5.5758 6.4242C5.48255 6.33087 5.42266 6.2094 5.4054 6.0786L5.4 6V3C5.4 2.84087 5.46321 2.68826 5.57574 2.57574C5.68826 2.46321 5.84087 2.4 6 2.4Z"
                fill="#999999"
              />
            </Svg>

            <Text style={Statusstyles.label}>Time:</Text>
          </View>
          <Text style={Statusstyles.value}>{timeOnly}</Text>
        </View>

        {/* Location Row */}
        <View style={Statusstyles.row}>
          <View style={Statusstyles.iconText}>
            <Svg width="11" height="14" viewBox="0 0 11 14" fill="none">
              <Path
                d="M6.25 4.75C6.25 4.94891 6.17098 5.13968 6.03033 5.28033C5.88968 5.42098 5.69891 5.5 5.5 5.5C5.30109 5.5 5.11032 5.42098 4.96967 5.28033C4.82902 5.13968 4.75 4.94891 4.75 4.75C4.75 4.55109 4.82902 4.36032 4.96967 4.21967C5.11032 4.07902 5.30109 4 5.5 4C5.69891 4 5.88968 4.07902 6.03033 4.21967C6.17098 4.36032 6.25 4.55109 6.25 4.75Z"
                stroke="#999999"
                stroke-linejoin="round"
              />
              <Path
                d="M9.625 5.125C9.625 7.4035 8.125 10 5.5 13C2.875 10 1.375 7.4035 1.375 5.125C1.375 4.03098 1.8096 2.98177 2.58318 2.20818C3.35677 1.4346 4.40598 1 5.5 1C6.59402 1 7.64323 1.4346 8.41682 2.20818C9.1904 2.98177 9.625 4.03098 9.625 5.125Z"
                stroke="#999999"
                stroke-linejoin="round"
              />
            </Svg>

            <Text style={Statusstyles.label}>Location:</Text>
          </View>
          <Text style={Statusstyles.value}>
            {property?.propertyName}, {property?.address},{property?.city}
          </Text>
        </View>

          <View style={Statusstyles.row}>
          <View style={Statusstyles.iconText}>
         <HandCoins strokeWidth={0.5} color={'gray'} />

            <Text style={[Statusstyles.label,{fontSize:14}]}>Commission Amount:</Text>
          </View>
          <Text style={Statusstyles.value}>₹{formatIndianAmount(enquiry?.commissionAmount * 0.2)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={Statusstyles.buttonContainer}>
        <TouchableOpacity
          style={Statusstyles.declineButton}
          onPress={rejectEnquiry}>
          <Text style={Statusstyles.declineText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Statusstyles.acceptButton}
          onPress={acceptEnquiry}>
          <Text style={Statusstyles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
      <Toast config={toastConfig} />
    </View>
  );
};

const Statusstyles = StyleSheet.create({
  card: {
    width: '95%',
    flexDirection: 'column',
    marginTop: 0,
    margin: 'auto',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderRadius: 12,
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#EAB308',
    borderRadius: 12,
  },
  statusTextContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  statusText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 15,
    color: '#FFCA00',
  },
  timeAgo: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  infoText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    width: 'auto',
  },
  container: {
    width: '70%',
    //ight: 52,

    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 0,
    paddingHorizontal: 0,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBox: {
    width: 12,
    height: 12,
    backgroundColor: '#999999',
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  value: {
    fontSize: 12,
    // lineHeight: 15,
    fontWeight: '600',
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    //marginTop: 8,
  },
  declineButton: {
    flex: 1,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderColor: '#FF4646',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: '#FF4646',
  },
  acceptButton: {
    flex: 1,
    height: 36,
    backgroundColor: '#0078DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
