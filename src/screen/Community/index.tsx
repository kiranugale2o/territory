import {
  ServerContainer,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import UserPostCard from '../../component/community/UserPost';
import UserProfilePopUp from '../../component/community/UserProfilePopUp';
import {RootStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {all} from 'axios';
import { AuthContext } from '../../context/AuthContext';
import MyPost from '../../component/community/MyPost';

interface SalesPerson {
  id: number;
  fullname: string;
  contact: string;
  email: string;
  userimage: string | null;
  username: string | null;
  password: string | null;
  role: 'Sales Person' | string;
  address: string;
  city: string;
  adharno: string;
  panno: string;
  rerano: string;
  experience: string;
  adharimage: string;
  panimage: string;
  status: 'Active' | 'Inactive' | string;
  loginstatus: 'active' | 'inactive' | string;
  paymentStatus: 'success' | 'failed' | string;
  paymentId: string;
  registrationAmount: number;
  updated_at: string; // Use Date if you parse to Date object
  created_at: string; // Use Date if you parse to Date object
}

const screenWidth = Dimensions.get('window').width;
const GRID_GAP = 2;
const COLS = 3;
const THUMB_SIZE = (screenWidth - GRID_GAP * (COLS + 1)) / COLS;

const Community: React.FC = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sign_In'>;
  const navigation = useNavigation<NavigationProp>();

  const [searchText, setSearchText] = useState('');
  const [posts, setPost] = useState([]);
  const [selectedTab, setSelectedTab] = useState<'discussions' | 'follow' | 'MyPost'>(
    'discussions',
  );
  const [isAdded, setIsAdded] = useState(false);
  const [users, setUsers] = useState<SalesPerson[]>([]);
const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
 
  const [userPosts, setUserPosts] = useState<any[]>([]);
     
    /* Networking */
  const auth=useContext(AuthContext)
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.reparv.in/territoryapp/post/getUserPosts?id=${auth?.user?.id}`,
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
       setUserPosts(data)
      } catch (e) {
        console.error('Failed to fetch user posts', e);
      } finally {
        setLoading(false);
      }
    };
  

  const fetchUsers = async () => {
  try {
    setLoading(true); // Start loading

    // Fetch all user endpoints in parallel
    const [salesRes, territoryRes, onboardingRes, partnerRes] = await Promise.all([
      
      fetch('https://api.reparv.in/territoryapp/user/'),
      fetch('https://api.reparv.in/salesapp/user/'),
      fetch('https://api.reparv.in/onboardingapp/user/'),
      fetch('https://api.reparv.in/projectpartnerRoute/user/')
    ]);

    // Parse JSON responses
    const [salesData, territoryData, onboardingData, partnerData] = await Promise.all([
      salesRes.json(),
      territoryRes.json(),
      onboardingRes.json(),
      partnerRes.json()
    ]);

    // Combine all users into a single array
    const combinedUsers = [
      ...salesData,
      ...territoryData,
      ...onboardingData,
      ...partnerData
    ];

    // Set combined data into state
    setUsers(combinedUsers);
    console.log(combinedUsers, 'Combined Users');
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    setLoading(false);
  }
};

  //if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  const getPosts = async () => {
    try {
      const response = await fetch('https://api.reparv.in/territoryapp/post/');

      // Optional: Check for HTTP error (like 500, 404 etc.)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check for API-level error in the response data
      if (data.message === 'Database error' && data.error) {
        throw new Error(`API error: ${data.message} (${data.error.code})`);
      }

       // Only if it's a valid post list
      const sortedPosts = sortPosts(data, auth?.user, following);
      setPost(sortedPosts);
// console.log(sortedPosts,'sortt');
    
    } catch (error) {
      console.error('Failed to fetch post:', error || error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingPosts = async () => {
  try {
    const res = await fetch(`https://api.reparv.in/territoryapp/user/${auth?.user?.id}/following-posts`);
    const data = await res.json();
    setPost(data);
    console.log(data,'ff');
    
  } catch (err) {
    console.error('Error fetching following posts:', err);
  } finally {
    setLoading(false);
  }
};




 useFocusEffect(
  useCallback(() => {
    if (selectedTab === 'discussions') {
       const fetchFollowersAndFollowing = () => {
    fetch(`https://api.reparv.in/territoryapp/user/${auth?.user?.id}/followers`)
      .then(res => res.json())
      .then(setFollowers);

    fetch(`https://api.reparv.in/territoryapp/user/${auth?.user?.id}/following`)
      .then(res => res.json())
      .then(setFollowing);
  };
      getPosts();       // All posts
    } else if (selectedTab === 'follow') {
      fetchFollowingPosts(); // Only posts from followed users
    }else{
      fetchUserPosts();
    }
    fetchUsers();        // Common for both
  }, [selectedTab]) // dependency on tab change
);


const sortPosts = (posts:any, currentUser:any, followedIds:any) => {
  return posts.sort((a:any, b:any) => {
    const score = (post:any) => {
      let s = 0;
      if (followedIds.includes(post.userId)) s += 1000; // highest weight
      if (post.address === currentUser.address) s += 500;
      s += Math.min(100, post.likes); // up to 100
      s += new Date(post.created_at).getTime() / 1000000000; // recency
      return s;
    };
    return score(b) - score(a); // Descending
  });
};

// useEffect(()=>{


// },[])



const renderThumb = ({ item }: { item: any }) => {
  const hasImage = !!item.image;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedPost(item);
        setModalVisible(true);
      }}
      style={styles.postThumbWrapper}
    >
      {hasImage ? (
        <Image
          source={{ uri: `https://api.reparv.in${item.image}` }}
          style={styles.postThumb}
        />
      ) : (
        <View style={[styles.postThumb, styles.textOnlyThumb]}>
          <Text style={styles.textOnlyContent} numberOfLines={4}>
            {item.postContent || 'No Content'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};



  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on fullname or city
 const filteredPosts = useMemo(() => {
  const lower = searchTerm.toLowerCase();

  if (Array.isArray(posts)) {
    return posts.filter(
      item =>
        item?.fullname?.toLowerCase().includes(lower) ||
        item?.city?.toLowerCase().includes(lower)
    );
  }

  return [];
}, [searchTerm, posts]);


  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View style={styles.frame135}>
        {/* Discussions */}
        <TouchableOpacity
          style={styles.frame120}
          onPress={() => setSelectedTab('discussions')}>
          <View
            style={[
              styles.iconCircle,
              selectedTab === 'discussions'
                ? styles.activeBg
                : styles.inactiveBg,
            ]}>
            <Svg width={21} height={20} viewBox="0 0 21 20" fill="none">
              <Path
                d="M2.16699 18.3333V3.33334C2.16699 2.87501 2.33019 2.48264 2.65658 2.15626C2.98296 1.82987 3.37533 1.66667 3.83366 1.66667H17.167C17.6253 1.66667 18.0177 1.82987 18.3441 2.15626C18.6705 2.48264 18.8337 2.87501 18.8337 3.33334V13.3333C18.8337 13.7917 18.6705 14.184 18.3441 14.5104C18.0177 14.8368 17.6253 15 17.167 15H5.50033L2.16699 18.3333ZM4.79199 13.3333H17.167V3.33334H3.83366V14.2708L4.79199 13.3333Z"
                fill={selectedTab === 'discussions' ? '#0078DB' : 'gray'}
              />
            </Svg>
          </View>
          <Text
            style={[
              styles.tabText,
              selectedTab === 'discussions'
                ? styles.activeText
                : styles.inactiveText,
            ]}>
            Discussions
          </Text>
        </TouchableOpacity>

        {/* Follow */}
        <TouchableOpacity
          style={styles.frame134}
          onPress={() => setSelectedTab('follow')}>
          <View
            style={[
              styles.iconCircle,
              selectedTab === 'follow' ? styles.activeBg : styles.inactiveBg,
            ]}>
            <Svg width={21} height={20} viewBox="0 0 21 20" fill="none">
              <Path
                d="M1.33301 16.6667V14.3333C1.33301 13.8611 1.45454 13.4271 1.69759 13.0312C1.94065 12.6354 2.26356 12.3333 2.66634 12.125C3.52745 11.6944 4.40245 11.3715 5.29134 11.1562C6.18023 10.941 7.08301 10.8333 7.99968 10.8333C8.91634 10.8333 9.81912 10.941 10.708 11.1562C11.5969 11.3715 12.4719 11.6944 13.333 12.125C13.7358 12.3333 14.0587 12.6354 14.3018 13.0312C14.5448 13.4271 14.6663 13.8611 14.6663 14.3333V16.6667H1.33301ZM16.333 16.6667V14.1667C16.333 13.5555 16.1629 12.9687 15.8226 12.4062C15.4823 11.8437 14.9997 11.3611 14.3747 10.9583C15.083 11.0417 15.7497 11.184 16.3747 11.3854C16.9997 11.5868 17.583 11.8333 18.1247 12.125C18.6247 12.4028 19.0066 12.7118 19.2705 13.0521C19.5344 13.3924 19.6663 13.7639 19.6663 14.1667V16.6667H16.333ZM7.99968 9.99999C7.08301 9.99999 6.29829 9.67361 5.64551 9.02083C4.99273 8.36805 4.66634 7.58333 4.66634 6.66666C4.66634 5.74999 4.99273 4.96527 5.64551 4.31249C6.29829 3.65972 7.08301 3.33333 7.99968 3.33333C8.91634 3.33333 9.70106 3.65972 10.3538 4.31249C11.0066 4.96527 11.333 5.74999 11.333 6.66666C11.333 7.58333 11.0066 8.36805 10.3538 9.02083C9.70106 9.67361 8.91634 9.99999 7.99968 9.99999ZM16.333 6.66666C16.333 7.58333 16.0066 8.36805 15.3538 9.02083C14.7011 9.67361 13.9163 9.99999 12.9997 9.99999C12.8469 9.99999 12.6525 9.98263 12.4163 9.94791C12.1802 9.91319 11.9858 9.87499 11.833 9.83333C12.208 9.38888 12.4962 8.89583 12.6976 8.35416C12.899 7.81249 12.9997 7.24999 12.9997 6.66666C12.9997 6.08333 12.899 5.52083 12.6976 4.97916C12.4962 4.43749 12.208 3.94444 11.833 3.49999C12.0275 3.43055 12.2219 3.38541 12.4163 3.36458C12.6108 3.34374 12.8052 3.33333 12.9997 3.33333C13.9163 3.33333 14.7011 3.65972 15.3538 4.31249C16.0066 4.96527 16.333 5.74999 16.333 6.66666ZM2.99967 15H12.9997V14.3333C12.9997 14.1805 12.9615 14.0417 12.8851 13.9167C12.8087 13.7917 12.708 13.6944 12.583 13.625C11.833 13.25 11.0761 12.9687 10.3122 12.7812C9.54829 12.5937 8.77745 12.5 7.99968 12.5C7.2219 12.5 6.45106 12.5937 5.68717 12.7812C4.92329 12.9687 4.16634 13.25 3.41634 13.625C3.29134 13.6944 3.19065 13.7917 3.11426 13.9167C3.03787 14.0417 2.99967 14.1805 2.99967 14.3333V15ZM7.99968 8.33333C8.45801 8.33333 8.85037 8.17013 9.17676 7.84374C9.50315 7.51736 9.66634 7.12499 9.66634 6.66666C9.66634 6.20833 9.50315 5.81597 9.17676 5.48958C8.85037 5.16319 8.45801 4.99999 7.99968 4.99999C7.54134 4.99999 7.14898 5.16319 6.82259 5.48958C6.4962 5.81597 6.33301 6.20833 6.33301 6.66666C6.33301 7.12499 6.4962 7.51736 6.82259 7.84374C7.14898 8.17013 7.54134 8.33333 7.99968 8.33333Z"
                fill={selectedTab === 'follow' ? '#0078DB' : 'gray'}
              />
            </Svg>
          </View>
          <Text
            style={[
              styles.tabText,

              selectedTab === 'follow'
                ? styles.activeText
                : styles.inactiveText,
              {marginTop: 5},
            ]}>
            Follow
          </Text>
        </TouchableOpacity>

         {/* My Post */}
        <TouchableOpacity
          style={styles.frame134}
          onPress={() => setSelectedTab('MyPost')}>
          <View
            style={[
              styles.iconCircle,
              selectedTab === 'MyPost' ? styles.activeBg : styles.inactiveBg,
            ]}>
            <Svg width={21} height={20} viewBox="0 0 21 20" fill="none">
              <Path
                d="M1.33301 16.6667V14.3333C1.33301 13.8611 1.45454 13.4271 1.69759 13.0312C1.94065 12.6354 2.26356 12.3333 2.66634 12.125C3.52745 11.6944 4.40245 11.3715 5.29134 11.1562C6.18023 10.941 7.08301 10.8333 7.99968 10.8333C8.91634 10.8333 9.81912 10.941 10.708 11.1562C11.5969 11.3715 12.4719 11.6944 13.333 12.125C13.7358 12.3333 14.0587 12.6354 14.3018 13.0312C14.5448 13.4271 14.6663 13.8611 14.6663 14.3333V16.6667H1.33301ZM16.333 16.6667V14.1667C16.333 13.5555 16.1629 12.9687 15.8226 12.4062C15.4823 11.8437 14.9997 11.3611 14.3747 10.9583C15.083 11.0417 15.7497 11.184 16.3747 11.3854C16.9997 11.5868 17.583 11.8333 18.1247 12.125C18.6247 12.4028 19.0066 12.7118 19.2705 13.0521C19.5344 13.3924 19.6663 13.7639 19.6663 14.1667V16.6667H16.333ZM7.99968 9.99999C7.08301 9.99999 6.29829 9.67361 5.64551 9.02083C4.99273 8.36805 4.66634 7.58333 4.66634 6.66666C4.66634 5.74999 4.99273 4.96527 5.64551 4.31249C6.29829 3.65972 7.08301 3.33333 7.99968 3.33333C8.91634 3.33333 9.70106 3.65972 10.3538 4.31249C11.0066 4.96527 11.333 5.74999 11.333 6.66666C11.333 7.58333 11.0066 8.36805 10.3538 9.02083C9.70106 9.67361 8.91634 9.99999 7.99968 9.99999ZM16.333 6.66666C16.333 7.58333 16.0066 8.36805 15.3538 9.02083C14.7011 9.67361 13.9163 9.99999 12.9997 9.99999C12.8469 9.99999 12.6525 9.98263 12.4163 9.94791C12.1802 9.91319 11.9858 9.87499 11.833 9.83333C12.208 9.38888 12.4962 8.89583 12.6976 8.35416C12.899 7.81249 12.9997 7.24999 12.9997 6.66666C12.9997 6.08333 12.899 5.52083 12.6976 4.97916C12.4962 4.43749 12.208 3.94444 11.833 3.49999C12.0275 3.43055 12.2219 3.38541 12.4163 3.36458C12.6108 3.34374 12.8052 3.33333 12.9997 3.33333C13.9163 3.33333 14.7011 3.65972 15.3538 4.31249C16.0066 4.96527 16.333 5.74999 16.333 6.66666ZM2.99967 15H12.9997V14.3333C12.9997 14.1805 12.9615 14.0417 12.8851 13.9167C12.8087 13.7917 12.708 13.6944 12.583 13.625C11.833 13.25 11.0761 12.9687 10.3122 12.7812C9.54829 12.5937 8.77745 12.5 7.99968 12.5C7.2219 12.5 6.45106 12.5937 5.68717 12.7812C4.92329 12.9687 4.16634 13.25 3.41634 13.625C3.29134 13.6944 3.19065 13.7917 3.11426 13.9167C3.03787 14.0417 2.99967 14.1805 2.99967 14.3333V15ZM7.99968 8.33333C8.45801 8.33333 8.85037 8.17013 9.17676 7.84374C9.50315 7.51736 9.66634 7.12499 9.66634 6.66666C9.66634 6.20833 9.50315 5.81597 9.17676 5.48958C8.85037 5.16319 8.45801 4.99999 7.99968 4.99999C7.54134 4.99999 7.14898 5.16319 6.82259 5.48958C6.4962 5.81597 6.33301 6.20833 6.33301 6.66666C6.33301 7.12499 6.4962 7.51736 6.82259 7.84374C7.14898 8.17013 7.54134 8.33333 7.99968 8.33333Z"
                fill={selectedTab === 'MyPost' ? '#0078DB' : 'gray'}
              />
            </Svg>
          </View>
          <Text
            style={[
              styles.tabText,

              selectedTab === 'MyPost'
                ? styles.activeText
                : styles.inactiveText,
              {marginTop: 5},
            ]}>
          My Posts
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'discussions' ? (
  <View style={{width: '100%', flex: 2, backgroundColor: 'white'}}>
    {/* Button for new */}
    <View style={styles.scontainer}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z"
            fill="rgba(0,0,0,0.4)"
          />
        </Svg>
        <TextInput
          style={styles.textInput}
          placeholder="Search"
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* New Post Button */}
      <TouchableOpacity
        style={styles.newPostButton}
        onPress={() => navigation.navigate('NewPost')}>
        <View style={styles.siconCircle}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 5v14M5 12h14"
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text style={styles.newPostText}>New Post</Text>
      </TouchableOpacity>
    </View>

    {/* Post Rendering */}
    <ScrollView>
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'column',
          gap: 20,
          marginTop: 20,
        }}>
        {posts !== null ? (
          <>
            {filteredPosts.map((d, index) => (
              <UserPostCard key={index} post={d} />
            ))}
          </>
        ) : (
          <Text style={{fontSize: 15}}>Not Found Any Post !</Text>
        )}
        {filteredPosts.length === 0 && (
          <Text
            style={{
              fontSize: 13,
              margin: 'auto',
              marginTop: 10,
              fontWeight: '600',
            }}>
            Not Found Any Post !
          </Text>
        )}
      </View>
    </ScrollView>
  </View>
) : selectedTab === 'follow' ? (
  <View
    style={{
      width: '100%',
      flex: 1,
      marginTop: 20,
      backgroundColor: 'white',
    }}>
    <View style={styles.container}>
      <View style={styles.row}>
        <Svg
                width="30"
                height="30"
                style={styles.icon}
                viewBox="0 0 30 30"
                fill="none">
                <Path
                  d="M1.25 25V21.5C1.25 20.7917 1.43229 20.1406 1.79688 19.5469C2.16146 18.9531 2.64583 18.5 3.25 18.1875C4.54167 17.5417 5.85417 17.0573 7.1875 16.7344C8.52083 16.4115 9.875 16.25 11.25 16.25C12.625 16.25 13.9792 16.4115 15.3125 16.7344C16.6458 17.0573 17.9583 17.5417 19.25 18.1875C19.8542 18.5 20.3385 18.9531 20.7031 19.5469C21.0677 20.1406 21.25 20.7917 21.25 21.5V25H1.25ZM23.75 25V21.25C23.75 20.3333 23.4948 19.4531 22.9844 18.6094C22.474 17.7656 21.75 17.0417 20.8125 16.4375C21.875 16.5625 22.875 16.776 23.8125 17.0781C24.75 17.3802 25.625 17.75 26.4375 18.1875C27.1875 18.6042 27.7604 19.0677 28.1563 19.5781C28.5521 20.0885 28.75 20.6458 28.75 21.25V25H23.75ZM11.25 15C9.875 15 8.69792 14.5104 7.71875 13.5312C6.73958 12.5521 6.25 11.375 6.25 10C6.25 8.625 6.73958 7.44792 7.71875 6.46875C8.69792 5.48958 9.875 5 11.25 5C12.625 5 13.8021 5.48958 14.7813 6.46875C15.7604 7.44792 16.25 8.625 16.25 10C16.25 11.375 15.7604 12.5521 14.7813 13.5312C13.8021 14.5104 12.625 15 11.25 15ZM23.75 10C23.75 11.375 23.2604 12.5521 22.2813 13.5312C21.3021 14.5104 20.125 15 18.75 15C18.5208 15 18.2292 14.974 17.875 14.9219C17.5208 14.8698 17.2292 14.8125 17 14.75C17.5625 14.0833 17.9948 13.3438 18.2969 12.5312C18.599 11.7188 18.75 10.875 18.75 10C18.75 9.125 18.599 8.28125 18.2969 7.46875C17.9948 6.65625 17.5625 5.91667 17 5.25C17.2917 5.14583 17.5833 5.07812 17.875 5.04688C18.1667 5.01562 18.4583 5 18.75 5C20.125 5 21.3021 5.48958 22.2813 6.46875C23.2604 7.44792 23.75 8.625 23.75 10ZM3.75 22.5H18.75V21.5C18.75 21.2708 18.6927 21.0625 18.5781 20.875C18.4635 20.6875 18.3125 20.5417 18.125 20.4375C17 19.875 15.8646 19.4531 14.7188 19.1719C13.5729 18.8906 12.4167 18.75 11.25 18.75C10.0833 18.75 8.92708 18.8906 7.78125 19.1719C6.63542 19.4531 5.5 19.875 4.375 20.4375C4.1875 20.5417 4.03646 20.6875 3.92188 20.875C3.80729 21.0625 3.75 21.2708 3.75 21.5V22.5ZM11.25 12.5C11.9375 12.5 12.526 12.2552 13.0156 11.7656C13.5052 11.276 13.75 10.6875 13.75 10C13.75 9.3125 13.5052 8.72396 13.0156 8.23438C12.526 7.74479 11.9375 7.5 11.25 7.5C10.5625 7.5 9.97396 7.74479 9.48438 8.23438C8.99479 8.72396 8.75 9.3125 8.75 10C8.75 10.6875 8.99479 11.276 9.48438 11.7656C9.97396 12.2552 10.5625 12.5 11.25 12.5Z"
                  fill="#0078DB"
                />
              </Svg>
       
        <Text style={styles.title}>Follow Sale People</Text>
      </View>
      <Text style={styles.subText}>Connect with people</Text>
    </View>

    <View style={{width: '100%', marginTop: 20}}>
      <ScrollView>
        {users.map((d, i) => (
          d?.status === 'Active' && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UserProfile', {user: d});
              }}
              key={i}
              style={styles.container3}>
              <View style={styles.profileContainer}>
                <Image
                  source={
                    d.userimage
                      ? {uri: `https://api.reparv.in${d.userimage}`}
                      : require('../../../assets/community/user.png')
                  }
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{d.fullname}</Text>
                    <Text style={{fontSize
                    :13,color:'black'
                  }}>{d.role}</Text>
                
                </View>
              </View>
            </TouchableOpacity>
          )
        ))}
      </ScrollView>
    </View>
  </View>
) : selectedTab === 'MyPost' ? (
 <View style={{ flex: 1, backgroundColor: '#f8f8f8', width: '100%' }}>
      {/* Header */}
      <View
        style={{
          height: Platform.OS === 'ios' ? 100 : 70,
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: '#fff',
          borderBottomWidth: 0.3,
          borderBottomColor: '#ccc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 32 }}>
          {/* <Icon name="chevron-back" size={24} color="#000" /> */}
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#000',
            flex: 1,
            textAlign: 'center',
            marginLeft: -32,
          }}
        >
          My Posts
        </Text>

        <TouchableOpacity onPress={() => {}} style={{ width: 32, alignItems: 'flex-end' }}>
          {/* <Icon name="add-outline" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <ActivityIndicator size="large" color="#999" />
        </View>
      )}

      {/* Post List or Placeholder */}
      {!loading && (
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          {userPosts.length > 0 ? (
            userPosts.map((d, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <MyPost post={d} />
              
              </View>
            ))
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 80,
              }}
            >
              {/* <Image
                source={require('../../../assets/icons/nopost.png')}
                style={{ width: 100, height: 100, marginBottom: 12, tintColor: '#aaa' }}
                resizeMode="contain"
              /> */}
              <Text style={{ fontSize: 16, color: '#999' }}>No posts yet</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
) : null}


    </View>
  );
};

const styles = StyleSheet.create({
  frame135: {
    width: '100%',
    height: 52,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    
   gap: 38,
  },
  frame120: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  frame134: {
    flexDirection: 'row',
    alignItems: 'center',
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
    
  },
  activeText: {
    fontWeight: '700',
    color: '#0078DB',
  },
  inactiveText: {
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  scontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    gap: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
    height: 72,
    zIndex: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    width: '50%',
    height: 40,
    flexGrow: 1,
  },
  textInput: {
    fontSize: 16,
    color: 'black',
    flex: 1,
    padding: 0,
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#0078DB',
    borderRadius: 20,
    width: 130,
    height: 40,
  },
  siconCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  newPostText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  container: {
    width: '90%',
    top: 15,
    marginInline: 'auto',
    padding: 0,
    gap: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 182,
    height: 30,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 19,
    color: 'black',
  },
  subText: {
    width: '100%',
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  container3: {
    boxSizing: 'border-box',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 31,
    width: '100%',
    height: 74,
    marginInline: 'auto',
    borderTopWidth: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 177,
    height: 42,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ccc', // fallback color
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    height: 19,
    width: 127,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19,
    color: '#000000',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  postTime: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
  },
   postThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    margin: GRID_GAP,
    backgroundColor: '#ddd',
  },
postThumbWrapper: {
  margin: GRID_GAP,
  width: THUMB_SIZE,
  height: THUMB_SIZE,
},

textOnlyThumb: {
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 6,
},

textOnlyContent: {
  fontSize: 12,
  color: '#333',
  textAlign: 'center',
},

  noPostBox: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  noPostText: { fontSize: 18, color: '#4b5563' },

  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  closeText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default Community;
