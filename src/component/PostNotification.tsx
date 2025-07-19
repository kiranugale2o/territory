import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type PostNotificationProps = {
  show: boolean;
};

const PostNotification: React.FC<PostNotificationProps> = ({ show }) => {
  return (
    <View style={[styles.overlay, { display: `${show ? 'flex' : 'none'}` }]}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M9.54961 18L3.84961 12.3L5.27461 10.875L9.54961 15.15L18.7246 5.97501L20.1496 7.40001L9.54961 18Z"
              fill="#0078DB"
            />
          </Svg>

          <Text style={styles.title}>Post Created!</Text>
        </View>
        <Text style={styles.subtitle}>
          Your post has been published to the community.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    position: 'absolute',
    alignSelf: 'center',
    top: 10,
    // left: '10%',
    // right: '10%',
    width: '95%',
    height: 106,
    marginInline: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 24,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 16,
    color: '#000000',
    lineHeight: 19,
    width: 326,
    height: 38,
  },
});

export default PostNotification;
