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

const FollowersScreen = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch(
          `https://api.reparv.in/territoryapp/user/add/${auth?.user?.id}/${'territory'}/followers`
        );
        const data = await res.json();
        setFollowers(data);
        console.log(followers,'folooo');
        
      } catch (e) {
        console.error('Failed to fetch followers', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 30 }} />;
  }

  return (
     <View style={{flex:1,backgroundColor:'white'}}>
    <FlatList
      data={followers}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item }) => (
        <View style={styles.followerItem}>
          <Image
            source={
              item?.userimage
                ? { uri: `https://api.reparv.in${item.userimage}` }
                : require('../../../assets/community/user.png')
            }
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{item.fullname}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>

          {/* Optional Follow Button 
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity> 
          */}
        </View>
      )}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  followerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111',
  },
  email: {
    color: '#666',
    fontSize: 13,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  followText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FollowersScreen;
