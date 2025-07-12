import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      {/* Menu Button (Hamburger) */}
      <TouchableOpacity style={styles.menuIconContainer}>
        <Image
          source={require('../../../assets/booking/p1.png')} // Replace with your actual icon
          style={styles.menuIcon}
        />
      </TouchableOpacity>

      {/* Location Block */}
      <View style={styles.locationBlock}>
        <Image
          source={require('../../../assets/booking/p1.png')} // Replace with actual location icon
          style={styles.locationIcon}
        />
        <View>
          <Text style={styles.deliveryToText}>Delivery to</Text>
          <Text style={styles.addressText}>Address here....</Text>
        </View>
        <Image
          source={require('../../../assets/booking/p1.png')}
          style={styles.arrowDown}
        />
      </View>

      {/* Cart Section */}
      <View style={styles.cartContainer}>
        <View style={styles.cartBackground} />
        <Image
          source={require('../../../assets/booking/p1.png')}
          style={styles.cartIcon}
        />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 64,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  menuIconContainer: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  locationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 141,
  },
  locationIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  deliveryToText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#333333',
  },
  addressText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#333333',
  },
  arrowDown: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
  cartContainer: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBackground: {
    position: 'absolute',
    width: 34,
    height: 34,
    backgroundColor: 'rgba(243, 139, 8, 0.1)',
    borderRadius: 4,
  },
  cartIcon: {
    width: 24,
    height: 24,
    tintColor: '#F38B08',
  },
  cartBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#AB6104',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderColor: '#FFFFFF',
    borderWidth: 1,
  },
  cartBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
});

export default Header;
