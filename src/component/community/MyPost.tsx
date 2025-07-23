import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { EllipsisVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

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

dayjs.extend(relativeTime); // ⬅️  move extension outside component

const MyPost: React.FC<{ post: PostProps }> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [opmodalVisible, setOpModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    // setSelectedValue(value);
    // setModalVisible(false);
    if (value === 'update') {
      setOpModalVisible(false);
      setVisible(true);
    } else {
      setDeleteVisible(true);
      setOpModalVisible(false);
    }
  };
  const optionsr = [
    { label: 'Delete', value: 'delete', color: 'black', select: false },
  ];

  const optionsl = [
    { label: 'Update', value: 'update', color: 'black', select: true },
  ];
  const addLike = async () => {
    setLiked(!liked);
    fetch('https://api.reparv.in/territoryapp/post/addlike', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.postId }),
    })
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(err => console.error('Like failed:', err));
  };

  const handleImagePress = () => {
    navigation.navigate('PostDetailScreen', { post }); //
  };

  const [content, setContent] = useState(post?.postContent || '');
  const [image, setImage] = useState<string | Asset | null>(
    post?.image || null,
  );
  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setImage(asset);
        }
      },
    );
  };

  const updatePost = async () => {
    const formData = new FormData();

    // Always append text
    formData.append('postContent', content ?? '');

    // Only append if it's a NEW image
    if (image && typeof image === 'object' && image?.uri) {
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName ?? 'photo.jpg',
      });
    }

    try {
      const response = await fetch(
        `https://api.reparv.in/territoryapp/post/updated/${post?.postId}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setVisible(false);

        Toast.show({
          type: 'success',
          text1: 'Post updated successfully',
        });
        navigation.goBack();
        console.log('✅ Post updated successfully:', data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to update post',
        });
        console.error('❌ Failed to update post:', data);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update post',
      });
      console.error('❌ API error:', error);
    }
  };

  const deletePost = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/territoryapp/post/deletepost/${post.postId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Post deleted successfully');
        // Optional: Refresh post list or update UI
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Something went wrong while deleting the post.');
    }
  };

  return (
    <>
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
              <Text style={styles.timeAgo}>
                {dayjs(post.created_at).fromNow()}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setOpModalVisible(true)}>
            <EllipsisVertical size={18} />
          </TouchableOpacity>
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

        <Modal transparent visible={opmodalVisible} animationType="fade">
          <View style={styles.centeredOverlay}>
            <View style={styles.optionPopup}>
              <Text style={[styles.popupTitle, { color: 'black' }]}>
                Select Action
              </Text>

              {[...optionsl, ...optionsr].map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.popupOption}
                  onPress={() => handleSelect(item.value)}
                >
                  <View style={styles.checkbox}>
                    {selectedValue === item.value && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.optionText, { color: item.color }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.closePopupBtn}
                onPress={() => setOpModalVisible(false)}
              >
                <Text style={styles.closePopupBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.container}>
            <Text style={styles.title}>Edit Post</Text>

            <TextInput
              value={content}
              onChangeText={setContent}
              placeholderTextColor={'gray'}
              placeholder="Update your post..."
              style={styles.input}
              multiline
            />

            {image ? (
              <Image
                source={{
                  uri:
                    typeof image === 'string'
                      ? `https://api.reparv.in${image}`
                      : image.uri,
                }}
                style={styles.imagePreview}
              />
            ) : (
              <Text style={styles.noImageText}>No image selected</Text>
            )}

            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.imageButton}
            >
              <Text style={styles.imageButtonText}>Change Image</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={[styles.button, { backgroundColor: 'gray' }]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={updatePost}
                style={[styles.button, styles.save]}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast config={toastConfig} />

      <Modal
        visible={deleteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setDeleteVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
              Delete Post
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: '#333',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Are you sure you want to delete this post?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10, // For RN >= 0.71
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDeleteVisible(false);
                }}
                style={{
                  backgroundColor: '#ccc',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: '#000', fontWeight: '500' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={deletePost}
                style={{
                  backgroundColor: 'red',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '500' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default MyPost;

/* ─────────────────── Styles ─────────────────── */
const styles = StyleSheet.create({
  /* overall white card that spans edge‑to‑edge like IG */
  cardContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 24,
    borderTopWidth: 0,
    //borderColor: 'gray',
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

  option: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  cancel: {
    textAlign: 'center',
    paddingVertical: 5,
    color: 'black',
    padding: 10,
    borderRadius: 55,
    margin: 'auto',
    marginBottom: 10,
    backgroundColor: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'gray',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#0078DB',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  modalContent: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  centeredOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  optionPopup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },

  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  popupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  closePopupBtn: {
    marginTop: 16,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  closePopupBtnText: {
    fontWeight: 'bold',
    color: '#000',
  },

  backdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 10,
  },

  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    color: 'black',
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  noImageText: {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 12,
  },
  imageButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#007bff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  save: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
