import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
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
import { ArrowRightCircleIcon } from 'lucide-react-native';

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

  const getUserIdByRole = (u: any) => {
    if (u?.role === 'Sales Person') return u?.salespersonsid;
    if (u?.role === 'Onboarding Partner') return u?.partnerid;
    return u?.id;
  };

  const getUserRole = (r: any) => {
    if (r === 'Sales Person') return 'sales';
    if (r === 'Territory Partner') return 'territory';
    if (r === 'Onboarding Partner') return 'onboarding';
    return 'projectpartner';
  };

  const fetchUserPosts = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const id = getUserIdByRole(user);

      // Fetch both endpoints in parallel
      const [territoryRes, salesRes] = await Promise.all([
        fetch(`https://api.reparv.in/territoryapp/post/getUserPosts?id=${id}`, {
          signal: controller.signal,
        }),
        fetch(`https://api.reparv.in/salesapp/post/getUserPosts?id=${id}`, {
          signal: controller.signal,
        }),
      ]);

      if (!territoryRes.ok)
        throw new Error(`Territory API status ${territoryRes.status}`);
      if (!salesRes.ok) throw new Error(`Sales API status ${salesRes.status}`);

      const [territoryData, salesData] = await Promise.all([
        territoryRes.json(),
        salesRes.json(),
      ]);

      // Combine posts
      const combinedPosts = [...territoryData, ...salesData];

      // Optionally, sort by recency (newest first)
      combinedPosts.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      setPosts(combinedPosts);
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Failed to fetch user posts', e);
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

  const fetchFollowersAndFollowing = () => {
    const idToUse = getUserIdByRole(user);
    //192.168.132.151:3000
    https: fetch(
      `https://api.reparv.in/territoryapp/user/add/${idToUse}/${getUserRole(
        user?.role,
      )}/followers`,
    )
      .then(res => res.json())
      .then(setFollowers);

    fetch(
      `https://api.reparv.in/territoryapp/user/add/${idToUse}/${getUserRole(
        user?.role,
      )}/following`,
    )
      .then(res => res.json())
      .then(setFollowing);
  };

  const checkFollowingStatus = async () => {
    try {
      const res = await fetch(
        `https://api.reparv.in/territoryapp/user/add/${
          auth?.user?.id
        }/${getUserRole(auth?.user?.role)}/following`,
      );
      const data = await res.json();

      const followedUserId = getUserIdByRole(user);

      const isAlreadyFollowing = data.some((f: any) => {
        return f.id?.toString() === followedUserId?.toString();
      });

      setIsFollowing(isAlreadyFollowing);
    } catch (err) {
      console.error('Failed to check follow status:', err);
    }
  };

  const toggleFollow = async () => {
    const idToUse = getUserIdByRole(user);
    const userRole = getUserRole(user?.role);
    const payload = {
      follower_id: auth?.user?.id,
      following_id: idToUse,
      follower_type: 'territory',
      following_type: userRole,
    };

    const url = isFollowing
      ? 'https://api.reparv.in/territoryapp/user/add/unfollow'
      : 'https://api.reparv.in/territoryapp/user/add/follow';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        Toast.show({
          type: 'success',
          text1: isFollowing ? 'Unfollowed' : 'Followed',
          text2: data?.status ?? '',
        });
        setIsFollowing(!isFollowing);
        fetchFollowersAndFollowing();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Action failed.',
        });
      }
    } catch (error: any) {
      console.error('Follow/Unfollow Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: error.message,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts();
    }, []),
  );

  useEffect(() => {
    fetchFollowersAndFollowing();
    checkFollowingStatus();
  }, [user]);

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

  const NoPostPlaceholder = () => (
    <View style={styles.noPostBox}>
      <Svg
        width={44}
        height={44}
        viewBox="0 0 24 24"
        stroke="gray"
        fill="none"
        strokeWidth={2}
      >
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
          {auth?.user?.id !== getUserIdByRole(user) && (
            <TouchableOpacity
              onPress={toggleFollow}
              style={[styles.followBtn, isFollowing && styles.followBtnOutline]}
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
        <Info label="State" value={user?.state || '—'} />
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
            <ArrowRightCircleIcon />
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
/* ... keep your styles unchanged ... */

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
    backgroundColor: '#0078DB',
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
