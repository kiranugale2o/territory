import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Svg, {Path} from 'react-native-svg';

const NewPost: React.FC = () => {
  const [postText, setPostText] = useState('');
  const [imageUri, setImageUri] = useState<Asset | null>(null);
  const [show, setShow] = useState<boolean>(false);
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'NewPost'
  >;
  const navigation = useNavigation<NavigationProp>();

  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  // Use this hook to handle leaving the page with unsaved changes
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (postText.trim() === '') {
        return; // If there's no text, allow leaving
      }

      // Prevent the default back navigation action
      e.preventDefault();
      setIsModalVisible(true); // Show the confirmation modal
    });

    return unsubscribe; // Clean up listener when the component unmounts
  }, [navigation, postText]);

  // Cancel action for modal
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  // Discard action for modal
  const handleDiscard = () => {
    setIsModalVisible(false);
    setImageUri(null);
    setPostText('');
    navigation.navigate('NewPost');
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setImageUri(asset);
        }
      },
    );
  };

  const auth = useContext(AuthContext);

  const handlePost = () => {
    const formData = new FormData();
    formData.append('userId', auth?.user?.id);
    if (imageUri) {
      formData.append('image', {
        uri: imageUri.uri!,
        type: imageUri.type!,
        name: imageUri.fileName!,
      });
    }

    formData.append('postContent', postText);
    formData.append('like', '0');

    fetch('https://api.reparv.in/territoryapp/post/add', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        // ⚠️ Do NOT set Content-Type manually, let fetch handle it for FormData
      },
    })
      .then(response => response.json())
      .then(data => {
        Toast.show({
          type: 'success',
          text1: `Post Created !`,
          text2: 'Your post has been published to the community',
        });
        // navigation.navigate('Community');
        setImageUri(null);
        setPostText('');

        setTimeout(() => {
          navigation.goBack();
        }, 700); // Adjust delay if needed (in ms)
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Somthing Went Wrong Try again!',
        });

        console.error('Error:', error);
      });
  };
  console.log(imageUri);

  return (
    <View style={{flex: 1, width: '100%', backgroundColor: 'white'}}>
      <View style={[styles.wrapper]}>
        <View style={styles.card}>
          <ScrollView>
            <TextInput
              style={styles.postText}
              placeholder="What’s on your mind?"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              multiline
              value={postText}
              onChangeText={setPostText}></TextInput>
            {imageUri && (
              <Image source={{uri: imageUri.uri}} style={styles.postImage} />
            )}
          </ScrollView>
        </View>

        <View
          style={{
            width: '90%',
          }}>
          <TouchableOpacity style={styles.mediaRow} onPress={pickImage}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19ZM6 17H18L14.25 12L11.25 16L9 13L6 17ZM8.5 10C8.91667 10 9.27083 9.85417 9.5625 9.5625C9.85417 9.27083 10 8.91667 10 8.5C10 8.08333 9.85417 7.72917 9.5625 7.4375C9.27083 7.14583 8.91667 7 8.5 7C8.08333 7 7.72917 7.14583 7.4375 7.4375C7.14583 7.72917 7 8.08333 7 8.5C7 8.91667 7.14583 9.27083 7.4375 9.5625C7.72917 9.85417 8.08333 10 8.5 10Z"
                fill="black"
                fillOpacity={0.4}
              />
            </Svg>
            <Text style={styles.mediaText}>Add Media</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.postButton,
            postText || imageUri ? styles.enabledButton : styles.disabledButton,
          ]}
          onPress={handlePost}
          disabled={!postText && !imageUri}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>

        {/* Discard Post Modal */}
        <DiscardPostModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onDiscard={handleDiscard}
        />

        {/* <PostNotification show={show} /> */}
      </View>
      <Toast config={toastConfig} />
    </View>
  );
};

export default NewPost;
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',

    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    top: 10,
  },
  card: {
    width: '95%',
    height: 190,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    gap: 12,
    marginInline: 'auto',
    justifyContent: 'space-between',
  },
  input: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 19,
    height: 100,
    padding: 30,
    color: '#000',
    flex: 1,
    textAlignVertical: 'top',
  },
  postText: {
    width: '100%',
    // height: 99,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#000000',
  },
  postImage: {
    width: 126,
    height: 100,
    marginInline: 'auto',
    resizeMode: 'cover',
  },

  placeholderText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 26,
  },
  mediaIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  mediaText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  postButton: {
    marginTop: 24,
    width: 120,
    height: 40,
    backgroundColor: '#0078DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  postButtonText: {
    fontFamily: 'Lato',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    color: '#FFFFFF',
  },
  enabledButton: {
    backgroundColor: '#00C851', // #0078DB color when active
  },

  disabledButton: {
    backgroundColor: '#A6A6A6', // Gray when disabled
  },
});

// DesCard

import {Modal} from 'react-native';
import {RootStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import PostNotification from '../../component/PostNotification';
import {AuthContext} from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../utils';

interface DiscardPostModalProps {
  visible: boolean;
  onCancel: () => void;
  onDiscard: () => void;
}

const DiscardPostModal: React.FC<DiscardPostModalProps> = ({
  visible,
  onCancel,
  onDiscard,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles2.overlay}>
        <View style={styles2.modalContainer}>
          <Text style={styles2.title}>
            Are you sure you want to discard this post?
          </Text>
          <View style={styles2.actions}>
            <TouchableOpacity style={styles2.cancelButton} onPress={onCancel}>
              <Text style={styles2.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles2.discardButton, {flexDirection: 'row', gap: 5}]}
              onPress={onDiscard}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                  fill="#E3E3E3"
                />
              </Svg>
              <Text style={styles2.discardText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles2 = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    marginInline: 'auto',
    height: 142,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    width: '95%',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19,
    color: '#000000',
    textAlign: 'left',
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  cancelButton: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelText: {
    fontFamily: 'Lato',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    color: '#000000',
  },
  discardButton: {
    width: 120,
    height: 40,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardText: {
    fontFamily: 'Lato',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    color: '#FFFFFF',
  },
});
