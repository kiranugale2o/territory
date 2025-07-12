import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const UserProfilePopUp = () => {
  return (
    <View style={[styles.frame150]}>
      {/* Left: Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={require('../../../assets/community/image.png')}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Sophia Chen</Text>
        </View>
      </View>

      {/* Right: Buttons */}
      <View style={styles.buttonRow}>
        <View style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </View>
        <View style={styles.acceptButton}>
          <Text style={styles.buttonText}>Accept</Text>
        </View>
      </View>
    </View>
  );
};

export default UserProfilePopUp;

const styles = StyleSheet.create({
  frame150: {
    width: '95%',
    margin: 'auto',
    marginTop: 0,
    paddingVertical: 16,
    paddingLeft: 16,
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderStyle: 'solid',
  },
  profileContainer: {
    margin: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ccc', // fallback if image fails
  },
  userInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '400',
    color: '#000000',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingRight: 10,
    gap: 16,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#A6A6A6',
    borderRadius: 16,
  },
  acceptButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0078DB',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
