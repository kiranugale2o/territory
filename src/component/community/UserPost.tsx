import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

type PostProps = {
  postId: number;
  userId: number;
  postContent: string;
  image: string | null;
  likes: number;
  created_at: string;
  fullname: string;
  city: string;
  userimage: string | null;
};

dayjs.extend(relativeTime);          // ⬅️  move extension outside component

const UserPostCard: React.FC<{ post: PostProps }> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const navigation = useNavigation(); // 👈 For navigation

  const addLike = async () => {
    setLiked(!liked);
    fetch('https://api.reparv.in/territoryapp/post/addlike', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.postId }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data.message))
      .catch((err) => console.error('Like failed:', err));
  };

  const handleImagePress = () => {
    navigation.navigate('PostDetailScreen', { post }); // 
  };

  return (
    <View style={styles.cardContainer}>
      {/* ── Header ────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <ImageBackground
            source={
              post.userimage
                ? { uri: `https://api.reparv.in${post.userimage}` }
                : require('../../../assets/community/user.png')
            }
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{post.fullname}</Text>
            <Text style={styles.timeAgo}>{dayjs(post.created_at).fromNow()}</Text>
          </View>
        </View>
      </View>

      {/* ── Clickable Image ───────────────── */}
      {post.image && (
        <TouchableOpacity onPress={handleImagePress}>
          <ImageBackground
            source={{ uri: `https://api.reparv.in${post.image}` }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* ── Footer (Like + Caption) ─────── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeIconRow} onPress={addLike}>
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill={liked ? '#FF3040' : 'none'}
            stroke={liked ? '#FF3040' : '#222'}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.likeCount}>
          {liked ? post.likes + 1 : post.likes}{' '}
          {post.likes + (liked ? 1 : 0) === 1 ? 'like' : 'likes'}
        </Text>
      </View>

      {post.postContent?.trim().length > 0 && (
        <Text style={styles.description}>
          <Text style={styles.name}>{post.fullname} </Text>
          {post.postContent}
        </Text>
      )}
    </View>
  );
};
export default UserPostCard;

/* ─────────────────── Styles ─────────────────── */
const styles = StyleSheet.create({
  /* overall white card that spans edge‑to‑edge like IG */
  cardContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 24,
    borderTopWidth:0.3,
    borderColor:'gray'
  },

  /* header: avatar + name / time */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },

  /* post image fills width, fixed aspect ratio like IG (1:1) */
//   postImage: {
//  //   width: '99%',
//     aspectRatio: 1,     // square image feed
//     backgroundColor: '#eee',
//   },

postImage: {
  width: '100%',
  height: 250,
  resizeMode: 'cover',
},

  /* footer row (icons then like count) */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 12,
  },
  likeIconRow: {
    padding: 4,
  },
  likeCount: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },

  /* caption text */
  description: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    lineHeight: 18,
    fontSize: 14,
    color: '#000',
  },
});
