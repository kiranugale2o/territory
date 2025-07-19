import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  Modal,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SuccessModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 30,
            width: '95%',
            elevation: 5,
          }}
        >
          {/* <View style={styles.overlay}> */}
          {/* <View style={styles.card}> */}
          {/* Close Icon */}
          <Pressable onPress={onClose} style={styles.closeIcon}>
            <View style={styles.closeCircle} />
            <View style={styles.innerClose} />
          </Pressable>

          {/* Success Icon */}
          <View style={styles.successContainer}>
            <View style={styles.successMark}>
              <Image
                source={require('../../../assets/home/success.png')} // Replace with actual asset
                style={styles.sticker}
              />
            </View>
          </View>

          {/* Text Section */}
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Booking Successful!</Text>
            <Text style={styles.subtext}>
              Flat 102 has been successfully reserved for you for the next 24
              hours.
            </Text>
            <Text style={styles.note}>
              Your booking token is valid for 24 hours. Please complete the
              payment process within this timeframe to secure your property.
            </Text>
          </View>

          {/* Close Button */}
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
        {/* </View> */}
        {/* </View> */}
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  overlay: {
    // position: 'absolute',
    // width,
    // // height,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  card: {
    width: '95%',
    height: 305,
    margin: 'auto',
    top: 190,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sticker: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeCircle: {
    width: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  innerClose: {
    width: 16,
    height: 2,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMark: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#18C07A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 31,
    backgroundColor: '#18C07A',
  },
  checkIcon: {
    width: 18,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }],
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  note: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  button: {
    width: '98%',
    height: 48,
    margin: 'auto',
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Mukta',
  },
});
