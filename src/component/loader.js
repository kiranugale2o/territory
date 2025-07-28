import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size={'large'} color="#0996f4ff" />}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)', // Optional: loader overlay background
  },
  lottie: {
    width: 550,
    height: 550,
  },
});
