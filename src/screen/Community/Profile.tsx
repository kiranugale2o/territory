import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../component/loader';
import UserPostCard from '../../component/community/UserPost';
import Svg, { Line, Path } from 'react-native-svg';
import { RootStackParamList } from '../../types';

const screenWidth = Dimensions.get('window').width;
const GRID_GAP = 2;
const COLS = 3;
const THUMB_SIZE = (screenWidth - GRID_GAP * (COLS + 1)) / COLS;

const UserProfile: React.FC = () => {
  type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;
  const { params } = useRoute<UserProfileRouteProp>();
  const { user } = params;

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const auth = useContext(AuthContext);

  /* Networking */

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.reparv.in/territory-partnerapp/post/getUserPosts?id=${user?.id}`,
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error('Failed to fetch user posts', e);
    } finally {
      setLoading(false);
    }
  };


  const fetchFollowersAndFollowing = () => {
    fetch(`https://api.reparv.in/territoryapp/user/${user?.id}/followers`)
      .then(res => res.json())
      .then(setFollowers);

    fetch(`https://api.reparv.in/territoryapp/user/${user?.id}/following`)
      .then(res => res.json())
      .then(setFollowing);
  };

  const checkFollowingStatus = async () => {
    try {
      const res = await fetch(
        `https://api.reparv.in/territoryapp/user/${auth?.user?.id}/following`,
      );
      const data = await res.json();
      const already = data.some((f: any) => f.id === user?.id);
      setIsFollowing(already);
    } catch (err) {
      console.error('Failed to check follow status:', err);
    }
  };

  const toggleFollow = async () => {
    const payload = {
      follower_id: auth?.user?.id,
      following_id: user?.id,
    };

    const url = isFollowing
      ? 'https://api.reparv.in/territoryapp/user/unfollow'
      : 'https://api.reparv.in/territoryapp/user/follow';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 200) {
        console.log(res,'fgg');
        
        const data = await res.json();
        // Toast.show({
        //   type: 'success',
        //   text1: isFollowing ? 'Unfollowed' : 'Followed',
        //   text2: data?.status ?? '',
        // });
        setIsFollowing(!isFollowing);
      } else {
         console.log(res,'fgg');
        // Toast.show({
        //   type: 'error',
        //   text1: 'Error',
        //   text2: 'Action failed.',
        // });
      }
    } catch (error: any) {
      // console.log(res,'fgg');
      console.error('Follow/Unfollow Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: error.message,
      });
    }

    fetchFollowersAndFollowing();
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts();
    }, []),
  );

  useEffect(() => {
    fetchFollowersAndFollowing();
    checkFollowingStatus();
  }, [user?.id]);

  const renderThumb = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedPost(item);
        setModalVisible(true);
      }}>
      <Image
        source={{ uri: `https://api.reparv.in${item.image}` }}
        style={styles.postThumb}
      />
    </TouchableOpacity>
  );

  const NoPostPlaceholder = () => (
    <View style={styles.noPostBox}>
      <Svg width={44} height={44} viewBox="0 0 24 24" stroke="gray" fill="none" strokeWidth={2}>
        <Line x1="2" y1="2" x2="22" y2="22" />
        <Path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16" />
        <Path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5" />
        <Path d="M14.121 15.121A3 3 0 1 1 9.88 10.88" />
      </Svg>
      <Text style={styles.noPostText}>No Posts Yet</Text>
    </View>
  );

  return (
    <View style={styles.page}>
      {/* Profile */}
      <View style={styles.profileHeader}>
        <Image
          source={
            user.userimage
              ? { uri: `https://api.reparv.in${user.userimage}` }
              : require('../../../assets/community/user.png')
          }
          style={styles.avatar}
        />
        <View style={styles.profileRight}>
          <Text style={styles.name}>{user.fullname}</Text>
          <View style={styles.statsRow}>
            <Stat label="Posts" value={posts.length} />
            <Stat label="Followers" value={followers.length} />
            <Stat label="Following" value={following.length} />
          </View>
          {auth?.user?.id !== user?.id && (
            <TouchableOpacity
              onPress={toggleFollow}
              style={[
                styles.followBtn,
                isFollowing && styles.followBtnOutline,
              ]}
            >
              <Text
                style={[
                  styles.followText,
                  isFollowing && styles.followTextOutline,
                ]}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoRow}>
         <Info label="City" value={user.city || '—'} />
        <Info label="State" value={ user?.state || '—'} />
       
      </View>

      {/* Posts */}
      {loading && <Loader />}
      {posts.length ? (
        <FlatList
          data={posts}
          numColumns={COLS}
          keyExtractor={(item, i) => i.toString()}
          renderItem={renderThumb}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        />
      ) : (
        !loading && <NoPostPlaceholder />
      )}

      {/* Modal View */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          {selectedPost && <UserPostCard post={selectedPost} />}
        </View>
      </Modal>

      <Toast />
    </View>
  );
};

export default UserProfile;

/* Components */
const Stat = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoPair}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/* Styles */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },

  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileRight: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  name: { fontSize: 20, fontWeight: '700', color: '#111' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#111' },
  statLabel: { fontSize: 13, color: '#666' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statBox: { alignItems: 'center', flex: 1 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  infoPair: { alignItems: 'center' },
  infoLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
  infoValue: { fontSize: 13, color: '#111' },

  followBtn: {
    marginTop: 12,
    alignSelf: 'stretch',
    backgroundColor: '#0095f6',
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  followBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  followTextOutline: {
    color: '#111',
  },

  grid: {
    paddingTop: GRID_GAP,
    paddingHorizontal: GRID_GAP,
    paddingBottom: 80,
  },
  postThumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    margin: GRID_GAP,
    backgroundColor: '#ddd',
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
    top: 20,
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
