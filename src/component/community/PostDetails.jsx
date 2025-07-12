import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Svg, { Path } from 'react-native-svg';

dayjs.extend(relativeTime);

const PostDetailScreen = ({ route }) => {
  const { post } = route.params;

  return (
    <ScrollView style={styles.container}>
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
        {post.city && <Text style={styles.city}>{post.city}</Text>}
      </View>

      {/* ── Post Image ────────────────────── */}
      {post.image && (
        <Image
          source={{ uri: `https://api.reparv.in${post.image}` }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* ── Likes + Actions ───────────────── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeIconRow}>
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="#FF3040"
            stroke="#FF3040"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</Text>
      </View>

      {/* ── Caption ───────────────────────── */}
      {post.postContent?.trim().length > 0 && (
        <Text style={styles.description}>
          <Text style={styles.name}>{post.fullname} </Text>
          {post.postContent}
        </Text>
      )}

      {/* ── Comments (placeholder) ─────────── */}
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>Comments</Text>
        <Text style={styles.commentPlaceholder}>No comments yet.</Text>
      </View>
    </ScrollView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  city: {
    fontSize: 13,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#eee',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  likeIconRow: {
    padding: 4,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  commentSection: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  commentTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
    color: '#222',
  },
  commentPlaceholder: {
    fontSize: 14,
    color: '#666',
  },
});
