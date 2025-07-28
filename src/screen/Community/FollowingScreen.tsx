import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const FollowingScreen = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(
          `https://api.reparv.in/territoryapp/user/add/${
            auth?.user?.id
          }/${'territory'}/following`,
        );
        const data = await res.json();
        setFollowing(data);
      } catch (e) {
        console.error('Failed to fetch following', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 30 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={following}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item?.userimage
                  ? { uri: `https://api.reparv.in${item.userimage}` }
                  : require('../../../assets/community/user.png')
              }
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item?.fullname || 'Unnamed User'}
              </Text>
              {/* <Text style={styles.role}>{item.email || 'No email'}</Text> */}
            </View>

            {/* <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Following</Text>
          </TouchableOpacity> */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.4,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  role: {
    fontSize: 13,
    color: '#888',
  },
  followBtn: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: {
    color: '#333',
    fontWeight: '600',
  },
});

export default FollowingScreen;
