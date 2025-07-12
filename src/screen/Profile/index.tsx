import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {RootStackParamList, SalesPerson} from '../../types';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Edit, Lock, SquarePen} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordUpdateModal from '../../component/PasswordUpdateModel';
const {width} = Dimensions.get('window');

const Profile: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Referral'
  >;
  const navigation = useNavigation<NavigationProp>();
  const auth = useContext(AuthContext);
  const [data, setData] = useState<SalesPerson | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(auth?.user?.name || '');
  const [userName, setuserName] = useState(auth?.user?.username || '');
  const [editedEmail, setEditedEmail] = useState(auth?.user?.email || '');
  const [editedMobile, setEditedMobile] = useState(auth?.user?.contact || '');

  const circleSize = 107;
  const [profileImage, setProfileImage] = useState<Asset | null>(null);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setProfileImage(asset);
          handleUpdate();
        }
      },
    );
  };
  console.log(profileImage, 'sd');

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('tPersonToken');

      const formData = new FormData();
      formData.append('username', userName);
      formData.append('fullname', editedName);
      formData.append('contact', editedMobile);
      formData.append('email', editedEmail);

      // Assuming you have the image info from an image picker, e.g. react-native-image-picker or expo-image-picker
      if (profileImage) {
        formData.append('image', {
          uri: profileImage.uri!,
          type: profileImage.type!,
          name: profileImage.fileName!,
        });
      }

      const response = await fetch('https://api.reparv.in/territory-partner/profile/edit', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type here! Let fetch set it automatically with the boundary
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Update response:', data);
      auth?.setImage(data?.userimage);
      getProfile();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('tPersonToken'); // Retrieve stored JWT

      const response = await fetch('https://api.reparv.in/territory-partner/profile/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token
        },
      });

      const data = await response.json();
      console.log('Update response:', data);
      auth?.setImage(data?.userimage);
      setData(data);
      // navigation.navigate("")
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, []),
  );
  const[isPasswordModalVisible,setPasswordModalVisible]=useState(false)
  return (
    <View style={styles.container}>
      
<View
  style={{
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    top: -50,
    right: 20,
    zIndex: 10,
    elevation: 10,
  }}>
  <TouchableOpacity
    style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
    onPress={() => {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress:auth?.logout, // ✅ Trigger logout here
          },
        ],
        { cancelable: true }
      );
    }}>
    <View style={styles.iconWrapper}>
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          d="M14.08 15.59L16.67 13H7V11H16.67L14.08 8.41L15.5 7L20.5 12L15.5 17L14.08 15.59ZM19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
          fill="#B91C1C"
        />
      </Svg>
    </View>
    <Text style={[styles.btntext, { marginTop: 2, color: '#B91C1C' }]}>Log Out</Text>
  </TouchableOpacity>
</View>

      <View style={styles.Imagecontainer}>
        {/* Border Circle */}
        <View style={styles.borderCircle}>
          {/* Inner Image Circle */}
          <Image
            source={
              profileImage?.uri
                ? {uri: profileImage?.uri}
                : data?.userimage ? {uri: `https://api.reparv.in${data?.userimage}`} : require('../../../assets/community/user.png')            }
            style={styles.imageCircle}
          />

          {/* Camera Icon */}
          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
            style={styles.iconContainer}>
            <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.67848 3.4719C6.67848 3.01183 7.02269 2.63844 7.44776 2.63844H12.5769C13.0019 2.63844 13.3461 3.01183 13.3461 3.4719C13.3461 3.93197 13.0019 4.30536 12.5769 4.30536H7.44776C7.02269 4.30536 6.67848 3.93197 6.67848 3.4719ZM8.16036 17.6407H11.8642C14.4655 17.6407 15.7665 17.6407 16.7008 17.0389C17.1028 16.7805 17.45 16.4454 17.7226 16.0529C18.3469 15.1528 18.3469 13.8984 18.3469 11.3897C18.3469 8.88104 18.3469 7.62752 17.7218 6.72655C17.4494 6.33409 17.1025 5.99906 16.7008 5.74057C15.7665 5.13881 14.4655 5.13881 11.8642 5.13881H8.16036C5.55914 5.13881 4.25812 5.13881 3.32381 5.74057C2.9221 5.99908 2.57519 6.3341 2.30283 6.72655C1.67773 7.62668 1.67773 8.88104 1.67773 11.3881V11.3897C1.67773 13.8984 1.67773 15.152 2.30199 16.0529C2.57203 16.443 2.91875 16.778 3.32381 17.0389C4.25812 17.6407 5.55914 17.6407 8.16036 17.6407ZM6.53929 11.3897C6.53929 9.53947 8.09452 8.04091 10.0123 8.04091C11.9301 8.04091 13.4853 9.5403 13.4853 11.3897C13.4853 13.2392 11.9293 14.7386 10.0123 14.7386C8.09452 14.7386 6.53929 13.2383 6.53929 11.3897ZM7.92866 11.3897C7.92866 10.2796 8.86213 9.38111 10.0123 9.38111C11.1625 9.38111 12.0959 10.2804 12.0959 11.3897C12.0959 12.4991 11.1625 13.3984 10.0123 13.3984C8.86213 13.3984 7.92866 12.4991 7.92866 11.3897ZM15.1056 8.04091C14.7222 8.04091 14.4113 8.34096 14.4113 8.71101C14.4113 9.08023 14.7222 9.38028 15.1056 9.38028H15.569C15.9524 9.38028 16.2632 9.08023 16.2632 8.71101C16.2632 8.34096 15.9524 8.04091 15.569 8.04091H15.1056Z"
                fill="#242760"
                fillOpacity={0.81}
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
<TouchableOpacity
      onPress={() => navigation.navigate('KYC')} // Replace 'KYC' with your actual screen name
      activeOpacity={0.8}
      style={{
        width: 320,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
        marginVertical: 10,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          lineHeight: 20,
          fontWeight: '600',
          color: '#0078DB',
        }}
      >
        KYC Details
      </Text>
    </TouchableOpacity>
      <View style={styles.card}>
        {/* Name */}
        <View style={styles.row}>
          <View style={styles.iconCircle}>
             <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path
                d="M10.0007 2.5C11.8423 2.5 13.334 3.99167 13.334 5.83333C13.334 7.675 11.8423 9.16667 10.0007 9.16667C8.15898 9.16667 6.66732 7.675 6.66732 5.83333C6.66732 3.99167 8.15898 2.5 10.0007 2.5ZM13.334 11.2833C13.334 12.1667 13.1007 14.225 11.509 16.525L10.834 12.5L11.6173 10.9333C11.1007 10.875 10.559 10.8333 10.0007 10.8333C9.44232 10.8333 8.90065 10.875 8.38398 10.9333L9.16732 12.5L8.49232 16.525C6.90065 14.225 6.66732 12.1667 6.66732 11.2833C4.67565 11.8667 3.33398 12.9167 3.33398 14.1667V17.5H16.6673V14.1667C16.6673 12.9167 15.334 11.8667 13.334 11.2833Z"
                fill="black"
              />
            </Svg>
          </View>
          <View>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{data?.username}</Text>
          </View>
        </View>

        <View style={styles.separator} />
 <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Svg width="16" height="13" viewBox="0 0 16 16" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.44444 3.55556C4.44444 2.61256 4.81905 1.70819 5.48584 1.0414C6.15264 0.374602 7.05701 0 8 0C8.94299 0 9.84736 0.374602 10.5142 1.0414C11.181 1.70819 11.5556 2.61256 11.5556 3.55556C11.5556 4.49855 11.181 5.40292 10.5142 6.06971C9.84736 6.73651 8.94299 7.11111 8 7.11111C7.05701 7.11111 6.15264 6.73651 5.48584 6.06971C4.81905 5.40292 4.44444 4.49855 4.44444 3.55556ZM4.44444 8.88889C3.2657 8.88889 2.13524 9.35714 1.30175 10.1906C0.468253 11.0241 0 12.1546 0 13.3333C0 14.0406 0.280952 14.7189 0.781049 15.219C1.28115 15.719 1.95942 16 2.66667 16H13.3333C14.0406 16 14.7189 15.719 15.219 15.219C15.719 14.7189 16 14.0406 16 13.3333C16 12.1546 15.5317 11.0241 14.6983 10.1906C13.8648 9.35714 12.7343 8.88889 11.5556 8.88889H4.44444Z"
                fill="#000D26"
              />
            </Svg>
          </View>
          <View>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{data?.fullname}</Text>
          </View>
        </View>
          <View style={styles.separator} />
        {/* Email */}
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Svg width="16" height="13" viewBox="0 0 16 13" fill="none">
              <Path
                d="M14.4 0H1.6C0.72 0 0.00799999 0.7 0.00799999 1.55556L0 10.8889C0 11.7444 0.72 12.4444 1.6 12.4444H14.4C15.28 12.4444 16 11.7444 16 10.8889V1.55556C16 0.7 15.28 0 14.4 0ZM14.4 3.11111L8 7L1.6 3.11111V1.55556L8 5.44444L14.4 1.55556V3.11111Z"
                fill="#000D26"
              />
            </Svg>
          </View>
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{data?.email}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Mobile */}
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M3.21778 6.92444C4.49778 9.44 6.56 11.4933 9.07556 12.7822L11.0311 10.8267C11.2711 10.5867 11.6267 10.5067 11.9378 10.6133C12.9333 10.9422 14.0089 11.12 15.1111 11.12C15.6 11.12 16 11.52 16 12.0089V15.1111C16 15.6 15.6 16 15.1111 16C6.76444 16 0 9.23556 0 0.888889C0 0.4 0.4 0 0.888889 0H4C4.48889 0 4.88889 0.4 4.88889 0.888889C4.88889 2 5.06667 3.06667 5.39556 4.06222C5.49333 4.37333 5.42222 4.72 5.17333 4.96889L3.21778 6.92444Z"
                fill="#000D26"
              />
            </Svg>
          </View>
          <View>
            <Text style={styles.label}>Mobile</Text>
            <Text style={styles.value}>{data?.contact}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Role */}
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path
                d="M10.0007 2.5C11.8423 2.5 13.334 3.99167 13.334 5.83333C13.334 7.675 11.8423 9.16667 10.0007 9.16667C8.15898 9.16667 6.66732 7.675 6.66732 5.83333C6.66732 3.99167 8.15898 2.5 10.0007 2.5ZM13.334 11.2833C13.334 12.1667 13.1007 14.225 11.509 16.525L10.834 12.5L11.6173 10.9333C11.1007 10.875 10.559 10.8333 10.0007 10.8333C9.44232 10.8333 8.90065 10.875 8.38398 10.9333L9.16732 12.5L8.49232 16.525C6.90065 14.225 6.66732 12.1667 6.66732 11.2833C4.67565 11.8667 3.33398 12.9167 3.33398 14.1667V17.5H16.6673V14.1667C16.6673 12.9167 15.334 11.8667 13.334 11.2833Z"
                fill="black"
              />
            </Svg>
          </View>
          <View>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{data?.role}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        {/* Ticket */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Tickets');
          }}
          style={styles.row}>
          <View style={styles.iconCircle}>
            <Svg width={15} height={18} viewBox="0 0 15 18" fill="none">
              <Path
                d="M4.1344 6.69289H3.05078V7.77625H4.1344V6.69289Z"
                fill="black"
              />
              <Path
                d="M4.1344 10.1767H3.05078V11.26H4.1344V10.1767Z"
                fill="black"
              />
              <Path
                d="M4.1344 13.6604H3.05078V14.7443H4.1344V13.6604Z"
                fill="black"
              />
              <Path
                d="M4.1344 3.20869H3.05078V4.29258H4.1344V3.20869Z"
                fill="black"
              />
              <Path
                d="M11.8601 0.666626H1.41403C0.912619 0.666626 0.5 1.07925 0.5 1.58066V16.3723C0.5 16.8737 0.912619 17.2863 1.41403 17.2863H9.13889C8.4787 16.7903 7.97557 16.0995 7.70371 15.3018H6.14615C5.92986 15.3018 5.75442 15.1263 5.75442 14.91C5.75442 14.6938 5.92986 14.5183 6.14615 14.5183H7.51745C7.49322 14.3368 7.47797 14.1525 7.47797 13.9645C7.47797 13.9381 7.48147 13.9126 7.48194 13.8863H6.14615C5.92986 13.8863 5.75442 13.7109 5.75442 13.4946C5.75442 13.2783 5.92986 13.1029 6.14615 13.1029H7.56916C7.66704 12.6411 7.84483 12.2097 8.08259 11.8185H6.14813C5.93185 11.8185 5.7564 11.6431 5.7564 11.4268C5.7564 11.2105 5.93185 11.0351 6.14813 11.0351H8.69175C8.93624 10.7902 9.21358 10.5795 9.5127 10.4016H6.14813C5.93185 10.4016 5.7564 10.2261 5.7564 10.0098C5.7564 9.79356 5.93185 9.61812 6.14813 9.61812H10.6155C10.7832 9.61812 10.9237 9.72461 10.9795 9.87274C11.1904 9.83957 11.405 9.81737 11.625 9.81737C12.022 9.81737 12.4085 9.87483 12.7741 9.97929V1.58066C12.7741 1.07925 12.3615 0.666626 11.8601 0.666626ZM4.91738 14.8748C4.91738 15.235 4.62463 15.5277 4.2645 15.5277H2.91973C2.5596 15.5277 2.26685 15.235 2.26685 14.8748V13.5298C2.26685 13.1697 2.5596 12.8769 2.91973 12.8769H4.2645C4.62463 12.8769 4.91738 13.1697 4.91738 13.5298V14.8748ZM4.91738 11.3906C4.91738 11.7507 4.62463 12.0435 4.2645 12.0435H2.91973C2.5596 12.0435 2.26685 11.7507 2.26685 11.3906V10.0461C2.26685 9.68596 2.5596 9.39321 2.91973 9.39321H4.2645C4.62463 9.39321 4.91738 9.68596 4.91738 10.0461V11.3906ZM4.91738 7.90689C4.91738 8.26702 4.62463 8.55977 4.2645 8.55977H2.91973C2.5596 8.55977 2.26685 8.26702 2.26685 7.90689V6.56238C2.26685 6.20225 2.5596 5.9095 2.91973 5.9095H4.2645C4.62463 5.9095 4.91738 6.20225 4.91738 6.56238V7.90689ZM4.91738 4.42319C4.91738 4.78331 4.62463 5.07606 4.2645 5.07606H2.91973C2.5596 5.07606 2.26685 4.78331 2.26685 4.42319V3.07815C2.26685 2.71802 2.5596 2.42527 2.91973 2.42527H4.2645C4.62463 2.42527 4.91738 2.71802 4.91738 3.07815V4.42319ZM9.31538 8.33487H6.14813C5.93185 8.33487 5.7564 8.15943 5.7564 7.94314C5.7564 7.72686 5.93185 7.55141 6.14813 7.55141H9.31538C9.53166 7.55141 9.7071 7.72686 9.7071 7.94314C9.7071 8.15943 9.53166 8.33487 9.31538 8.33487ZM10.6155 6.91791H6.14818C5.9319 6.91791 5.75646 6.74247 5.75646 6.52619C5.75646 6.3099 5.9319 6.13446 6.14818 6.13446H10.6155C10.8318 6.13446 11.0073 6.3099 11.0073 6.52619C11.0073 6.74247 10.8318 6.91791 10.6155 6.91791ZM5.75646 4.45886C5.75646 4.24257 5.9319 4.06713 6.14818 4.06713H9.31543C9.53172 4.06713 9.70716 4.24257 9.70716 4.45886C9.70716 4.67514 9.53172 4.85059 9.31543 4.85059H6.14818C5.9319 4.85059 5.75646 4.67514 5.75646 4.45886ZM10.6155 3.43415H6.14818C5.9319 3.43415 5.75646 3.25871 5.75646 3.04243C5.75646 2.82614 5.9319 2.6507 6.14818 2.6507H10.6155C10.8318 2.6507 11.0073 2.82614 11.0073 3.04243C11.0073 3.25871 10.8318 3.43415 10.6155 3.43415Z"
                fill="black"
              />
              <Path
                d="M11.6253 10.6008C9.77117 10.6008 8.26172 12.1103 8.26172 13.9644C8.26172 15.8238 9.77117 17.3333 11.6253 17.3333C13.4847 17.3333 14.9942 15.8238 14.9942 13.9644C14.9942 12.1103 13.4847 10.6008 11.6253 10.6008ZM13.2079 13.4578L11.6306 15.0299C11.5575 15.1083 11.4582 15.1448 11.3538 15.1448C11.2545 15.1448 11.1553 15.1083 11.0769 15.0299L10.4502 14.4032C10.2987 14.2465 10.2987 14.001 10.4502 13.8495C10.6016 13.6928 10.8523 13.6928 11.0038 13.8495L11.3538 14.1994L12.6491 12.9041C12.8058 12.7474 13.0512 12.7474 13.2079 12.9041C13.3594 13.0556 13.3594 13.3063 13.2079 13.4578Z"
                fill="black"
              />
            </Svg>
          </View>
          <View
            style={{
              width: '80%',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text style={styles.label}>Tickets</Text>

            <Svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.292893 13.7071C-0.0976311 13.3166 -0.0976312 12.6834 0.292893 12.2929L5.58579 7L0.292893 1.70711C-0.0976317 1.31658 -0.0976317 0.683417 0.292893 0.292892C0.683417 -0.0976315 1.31658 -0.0976315 1.70711 0.292892L8.41421 7L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071Z"
                fill="#111417"
              />
            </Svg>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        {/* Referral */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Referral');
          }}
          style={styles.row}>
          <View style={styles.iconCircle}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path
                d="M15.9126 10.0456L14.826 8.79926L13.6215 9.92333C13.4857 10.0501 13.4748 10.2666 13.5973 10.4071C13.7199 10.5479 13.9292 10.5589 14.0653 10.4321L14.4534 10.07C14.0106 13.2459 11.2045 15.5232 8.09468 15.1813C7.91286 15.1607 7.74991 15.2974 7.73037 15.4855C7.71117 15.6739 7.84298 15.8425 8.0248 15.8623C8.25597 15.888 8.48581 15.9004 8.71367 15.9004C11.901 15.9004 14.6588 13.4614 15.1115 10.1498L15.4208 10.5044C15.4861 10.5794 15.5765 10.6178 15.6669 10.6178C15.7461 10.6178 15.8252 10.5887 15.8885 10.5294C16.0243 10.4026 16.0352 10.1861 15.9126 10.0456Z"
                fill="#000D26"
              />
              <Path
                d="M8.41211 8.01604V8.35864H15.367V8.01604C15.367 6.35476 14.2728 4.95283 12.7907 4.54137C13.4534 4.19842 13.9098 3.48889 13.9098 2.67145C13.9098 1.51893 13.0033 0.581573 11.8896 0.581573C10.7754 0.581573 9.86933 1.51893 9.86933 2.67145C9.86933 3.48889 10.3254 4.19808 10.9881 4.54137C9.50602 4.95318 8.41211 6.35476 8.41211 8.01604Z"
                fill="#000D26"
              />
              <Path
                d="M9.11131 1.38921L8.05118 0.118835C7.93162 -0.0243706 7.72264 -0.0404719 7.58421 0.0832027C7.44577 0.206886 7.43021 0.423404 7.54976 0.566618L7.83459 0.907848C4.34058 0.640617 1.25492 3.32113 0.921418 6.94587C0.904195 7.1343 1.03766 7.30149 1.21982 7.31964C1.23041 7.32067 1.24101 7.32101 1.25161 7.32101C1.42051 7.32101 1.56458 7.18809 1.58114 7.01096C1.88252 3.7302 4.69594 1.31109 7.86406 1.59785L7.45041 1.96717C7.31197 2.09085 7.29674 2.30703 7.4163 2.45024C7.48187 2.5287 7.57427 2.56912 7.667 2.56912C7.74384 2.56912 7.82101 2.54171 7.88327 2.48587L9.11131 1.38921Z"
                fill="#000D26"
              />
              <Path
                d="M4.3786 12.1828C5.04131 11.8398 5.49768 11.1303 5.49768 10.3129C5.49768 9.16035 4.59123 8.22299 3.47745 8.22299C2.36334 8.22299 1.45722 9.16035 1.45722 10.3129C1.45722 11.1303 1.91326 11.8395 2.57596 12.1828C1.09391 12.5946 0 13.9962 0 15.6575V16.0001H6.9549V15.6575C6.9549 13.9962 5.86066 12.5942 4.3786 12.1828Z"
                fill="#000D26"
              />
            </Svg>
          </View>
          <View
            style={{
              width: '80%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              top: 0,
            }}>
            <View>
              <Text style={styles.label}>Referral</Text>
              <Text style={styles.value}>Invite friends & Earn Rewards</Text>
            </View>

            <Svg
              width="9"
              style={{
                top: 14,
              }}
              height="14"
              viewBox="0 0 9 14"
              fill="none">
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.292893 13.7071C-0.0976311 13.3166 -0.0976312 12.6834 0.292893 12.2929L5.58579 7L0.292893 1.70711C-0.0976317 1.31658 -0.0976317 0.683417 0.292893 0.292892C0.683417 -0.0976315 1.31658 -0.0976315 1.70711 0.292892L8.41421 7L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071Z"
                fill="#111417"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>

     

     {/* Logout button */}
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          
        }}>
        <TouchableOpacity style={[styles.button,]} onPress={()=>{setModalVisible(true)}}>
          <View style={styles.iconWrapper}>
           <Edit color={'black'}/>
          </View>
          <Text style={[styles.updateButtonText,{color:'black'}]}>Update Profile</Text>
        </TouchableOpacity>
          <TouchableOpacity style={[styles.button,{
          }]} onPress={()=>{setPasswordModalVisible(true)}}>
          <View style={styles.iconWrapper}>
          <Lock color={'black'}/>
          </View>
            <Text style={[styles.updateButtonText,{color:'black',width:100,marginInline:-20}]}>Update Password</Text>
  
        </TouchableOpacity>
        
      </View>

      {/* update Profile model */}
     
     <PasswordUpdateModal
  visible={isPasswordModalVisible}
  onClose={() => setPasswordModalVisible(false)}
  onUpdatePassword={(data) => {
    console.log('Password data:', data);
    // Call API here
  }}
/>


      <Modal
  visible={isModalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setModalVisible(false)}>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Edit Profile</Text>

      <Text style={styles.inputLabel}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={userName}
        onChangeText={setuserName}
      />

      <Text style={styles.inputLabel}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={'gray'}
        value={editedName}
        onChangeText={setEditedName}
      />

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
         placeholderTextColor={'gray'}
        value={editedEmail}
        onChangeText={setEditedEmail}
        keyboardType="email-address"
      />

      <Text style={styles.inputLabel}>Mobile</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={editedMobile}
         placeholderTextColor={'gray'}
        onChangeText={setEditedMobile}
        keyboardType="phone-pad"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.saveButton,{padding:10}]}
          onPress={() => {
            setModalVisible(false);
            handleUpdate();
          }}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setModalVisible(false)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputLabel:
{
color:'gray'
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  Imagecontainer: {
    width: 107,
    marginInline: 'auto',
    height: 110,
    alignItems: 'center',
  },
  borderCircle: {
    width: 107,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: '#242760',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCircle: {
    width: 103.73,
    height: 106.45,
    borderRadius: 52,
    resizeMode: 'cover',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 3,
    right: 1,
    borderRadius: 10,
    padding: 2,
  },
  card: {
    width: '99%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    marginTop: '0%',
    // elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    gap: 12,
  },
  iconCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#FAFAFB',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111417',
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingInline: 16,
    padding:5,
    width: 145,
    height: 44,
    top: -10,
    gap: 15, // Doesn't work on all versions, replace with marginRight if needed
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderRadius: 5,
  },
  iconWrapper: {
    // width: 24,
    // height: 24,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  btntext: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans', // Make sure it's linked or replace with fallback
    lineHeight: 16,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
     color:'black'
  },
  input: {
    borderWidth: 1,
     color:'black',
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin:'auto',
    gap:6
  },
  saveButton: {
    width:'40%',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
     width:'40%',
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    margin:'auto'
  },
  cancelButtonText: {
    color: '#fff',
    margin:'auto'
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: '#242760',
    padding: 10,
    borderRadius: 5,

    alignItems: 'center',
  },
  updateButtonText: {
   color:'black',
    fontWeight: 'bold',
  },
});

export default Profile;
