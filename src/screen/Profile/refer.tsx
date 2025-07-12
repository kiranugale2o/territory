import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//import {LinearGradient} from 'react-native-svg';
// import LinearGradient from 'react-native-linear-gradient';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
//import PushNotification from 'react-native-push-notification';

const Refer: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const leftPosition = screenWidth * 0.4; // 35% of screen width
 
  const [referData,setReferData]=useState(null)
   const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('tPersonToken'); // Retrieve stored JWT

      const response = await fetch('https://api.reparv.in/territory-partner/profile/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token
        },
      });

      const data = await response.json();
      console.log('Update response:', data);
     setReferData(data)
      // navigation.navigate("")
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

   useFocusEffect(
      useCallback(() => {
        getProfile();
      }, []),
    );
const referralText = `Hey! Join me on Reparv and earn ₹500 using my referral code: ${referData?.referalno}. Download here: https://partners.reparv.in/#registrationForm`;
  const logoUrl =
    'https://firebasestorage.googleapis.com/v0/b/movielover-838fb.appspot.com/o/ic_launcher.png?alt=media&token=fd337fe0-76d1-4dec-8b63-4bf3bd267afe'; // your hosted logo

  const onShare = async () => {
    try {
      // If you want to use the native share sheet:
      const result = await Share.share(
        {
          message: referralText,
          url: logoUrl,
        },
        {
          // On Android the message + url get concatenated automatically;
          // on iOS it shows as separate fields.
          dialogTitle: 'Share MyApp with friends',
        },
      );
      // You can inspect result.action if you need to know how user shared
    } catch (error) {
      console.warn('Error sharing', error);
    }
  };

  const onWhatsApp = async () => {
    // Use the web URL for maximum compatibility:
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      referralText,
    )}`;

    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert(
        'Unable to open WhatsApp',
        'Please install or update WhatsApp to share your referral link.',
      );
    }
  };

  

  return (
   <View style={{flex: 1, top: -100, backgroundColor: 'white', width: '100%'}}>
  <LinearGradient
    colors={['#004170', '#0078DB']}
    start={{x: 0.3, y: 0.1}}
    end={{x: 0.0, y: 0.6}}
    style={{
      width: '100%',
    }}>
    <View style={[styles.gradientBox]}>
      <View
        style={{
          width: '100%',
          marginInline: 'auto',
          alignContent: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={styles.Textcontainer}>
          <Text style={styles.text}>
            Get <Text style={{fontWeight: 800}}>₹500</Text> for each referral
          </Text>
        </View>

        <View>
          <Image
            style={{
              width: '60%',
              height: 200,
              top: 50,
              left: leftPosition,
            }}
            resizeMode="contain"
            source={require('../../../assets/profile/banner1.png')}
          />
        </View>

        {/* Total Earned Box */}
        <View style={styles.rectangle}>
          <View style={[styles.card]}>
            <Image
              source={require('../../../assets/profile/money.png')}
              style={{
                width: 50,
                height: 50,
                margin: 'auto',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              position: 'absolute',
              top: 1,
            }}>
            <Text style={styles.totalEarnedText}>Total Earned</Text>
            <Text style={styles.amountText}>₹500</Text>
          </View>
        </View>

        {/* Referral Number Box */}
        <View style={styles.referralBox}>
          <Text style={styles.referralLabel}>Your Referral No.</Text>
          <Text style={styles.referralValue}>{referData?.referalno}</Text>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          position: 'absolute',
          height: 18,
          left: 16,
          top: 327,
        }}>
        <Text style={styles.howItWorksText}>How it works?</Text>
      </View>

      <View
        style={{
          width: '95%',
          marginInline: 'auto',
        }}>
        {/* Step 1 */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            left: 5,
            top: 169,
          }}>
          <View style={styles.circle} />
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.shareText}>
            Share the Reparv App with your friends or family who are interested
            in joining as a Territory Partner.
          </Text>
          <View style={styles.line}></View>
        </View>

        {/* Step 2 */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            left: 5,
            top: 209,
          }}>
          <View style={styles.circle} />
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.shareText}>
            Your friend or family member signs up and completes their Territory
            Partner process.
          </Text>
          <View style={styles.line}></View>
        </View>

        {/* Step 3 */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            left: 6.5,
            top: 249,
          }}>
          <View style={styles.outerCircle} />
          <View style={styles.rotatedBox} />
          <View style={styles.vector}>
            <Svg width="18" height="14" viewBox="0 0 18 14" fill="">
              <Path
                d="M16.0007 0.136093L6.66784 10.2357L1.68412 5.96586L0.0449219 7.88264L5.96719 12.9589L6.89255 13.7652L7.72539 12.8663L17.8779 1.8678L16.0007 0.136093Z"
                fill="#FAFAFB"
              />
            </Svg>
          </View>
          <Text style={styles.shareText}>
            Earn ₹500 when they successfully join as a Territory Partner!
          </Text>
        </View>
      </View>
    </View>
  </LinearGradient>

  <View style={styles.whatsapp}>
    <View
      style={[
        styles.container,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        },
      ]}>
      <Text style={styles.termtext}>
        Your friends and family are
        <Text style={{color: '#0069E1'}}> waiting for an invite</Text>
      </Text>
      <Svg width="20" height="20" viewBox="0 0 8 14" fill="none">
        <Path
          d="M1 13L6 7L1 0.999999"
          stroke="#111417"
          stroke-width="2"
          stroke-linecap="round"
        />
      </Svg>
    </View>

    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        bottom: 2,
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <TouchableOpacity style={styles.button} onPress={onWhatsApp}>
        <Image
          source={require('../../../assets/profile/wh.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.btntext}>Refer Now</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.share} onPress={onShare}>
        <View style={styles.iconBox}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M13.5757 17.271L8.46571 14.484C7.97521 14.9709 7.35153 15.3017 6.6733 15.4346C5.99508 15.5676 5.29267 15.4968 4.65464 15.2311C4.0166 14.9654 3.4715 14.5168 3.08806 13.9418C2.70462 13.3668 2.5 12.6911 2.5 12C2.5 11.3089 2.70462 10.6332 3.08806 10.0582C3.4715 9.48317 4.0166 9.03455 4.65464 8.76889C5.29267 8.50322 5.99508 8.43241 6.6733 8.56536C7.35153 8.69832 7.97521 9.02909 8.46571 9.51599L13.5757 6.72899C13.4005 5.90672 13.527 5.04885 13.9323 4.31224C14.3376 3.57563 14.9945 3.00952 15.7828 2.71742C16.5712 2.42532 17.4383 2.42676 18.2257 2.72147C19.0131 3.01619 19.6681 3.58448 20.0709 4.32243C20.4737 5.06037 20.5975 5.91866 20.4195 6.74034C20.2415 7.56202 19.7737 8.29218 19.1016 8.79729C18.4295 9.3024 17.5981 9.54871 16.7593 9.49119C15.9206 9.43366 15.1305 9.07613 14.5337 8.48399L9.42371 11.271C9.5255 11.7513 9.5255 12.2477 9.42371 12.728L14.5337 15.516C15.1305 14.9238 15.9206 14.5663 16.7593 14.5088C17.5981 14.4513 18.4295 14.6976 19.1016 15.2027C19.7737 15.7078 20.2415 16.438 20.4195 17.2596C20.5975 18.0813 20.4737 18.9396 20.0709 19.6776C19.6681 20.4155 19.0131 20.9838 18.2257 21.2785C17.4383 21.5732 16.5712 21.5747 15.7828 21.2826C14.9945 20.9905 14.3376 20.4243 13.9323 19.6877C13.527 18.9511 13.4005 18.0933 13.5757 17.271Z"
              fill="#111417"
            />
          </Svg>
        </View>
      </TouchableOpacity>
    </View>
  </View>
</View>

  );
};

export default Refer;
const styles = StyleSheet.create({
  gradientBox: {
    // position: 'absolute',
    width: '95%',
    margin: 'auto',
    height: 290,
    left: 0,
    top: 32,
    borderRadius: 0, // optional, if needed
  },
  Textcontainer: {
    position: 'absolute',
    left: 16,
    top: 68,
  },
  text: {
    width: 167,
    height: 53,
    fontFamily: 'Inter', // Ensure Inter font is linked properly
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.02,
    color: 'white',
  },
  rectangle: {
    position: 'absolute',
    width: '100%',

    height: 98,
    flexDirection: 'row',
    top: 205,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Only for Android shadows
  },
  card: {
    position: 'absolute',
    top: 10, // same as y="3"
    left: 20, // same as x="4"
    width: 70,
    height: 70,
    backgroundColor: 'rgba(232, 233, 234, 0.4)',
    borderRadius: 98 / 2, // equivalent to rounded-full (pill shape)
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalEarnedText: {
    position: 'absolute',
    width: 68,
    height: 17,
    left: 102,
    top: 22,
    fontFamily: 'Roboto', // Make sure you have the Roboto font available
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 17,
    color: '#94A1B0', // Neutral/500 color
  },
  amountText: {
    position: 'absolute',
    width: 'auto',
    height: 28,
    left: 102,
    top: 39,
    fontFamily: 'Roboto', // Make sure you have the Roboto font available
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -0.02, // React Native uses a direct numerical value for letter-spacing
    color: '#22282F', // Neutral/800 color
  },
  howItWorksText: {
    fontFamily: 'Roboto', // Ensure Roboto is available in your project
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 18, // React Native supports lineHeight, same as in CSS
    color: '#000000', // Black color
  },
  circle: {
    position: 'absolute',
    width: 34,
    height: 34,

    borderRadius: 17, // Makes it a circle
    backgroundColor: '#EDF6FF',
    borderColor: '#45505D',
    borderWidth: 1,
  },
  stepNumber: {
    width: 'auto',
    height: 23,

    left: 13, // aligned within circle
    top: 5,
    fontFamily: 'Montserrat', // Make sure this is loaded
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 23,
    letterSpacing: -0.02,
    textAlign: 'center',
    color: '#45505D',
  },
  shareText: {
    position: 'absolute',
    width: '80%',
    height: 45,
    left: 59,
    fontFamily: 'Inter', // Ensure Inter is loaded in your project
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 15,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  line: {
    // position: 'absolute',
    width: 38,
    height: 0, // height is 0, but width is visually rotated
    left: -11,
    top: 52,
    borderBottomWidth: 1,
    borderColor: '#45505D',
    transform: [{rotate: '90deg'}],
  },
  outerCircle: {
    position: 'absolute',
    width: 38,
    height: 38,
    left: 8,
    top: 9,
    borderRadius: 19,
  },
  rotatedBox: {
    position: 'absolute',
    width: 27.82,
    height: 27.82,
    left: 4,
    top: 3.09,
    shadowOpacity: 8,

    backgroundColor: '#0078DB',
    borderRadius: 5,
    transform: [{rotate: '-60deg'}],
  },
  vector: {
    position: 'absolute',
    width: 17.83,
    height: 13.63,
    left: 9,
    top: 11,
    borderRadius: 2, // Just for placeholder effect
  },

  whatsapp: {
    position: 'absolute',
    width: '100%',
    height: 135,
    bottom: '-15%',
    left: 0,
    // bottom: -120,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,

    // iOS shadow properties
    shadowColor: '#000', // Shadow color (black)
    shadowOffset: {width: 0, height: 2}, // Horizontal and vertical shadow offset
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 6, // Radius of the shadow blur

    // Android shadow property
    elevation: 5, // Elevation gives shadow effect on Android
  },

  container: {
    margin: 20,
    width: '100%',
    height: 18,
    justifyContent: 'center',
  },
  termtext: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: '#111417',
  },
  button: {
    // position: 'absolute',
    // left: 16,
    margin: 'auto',
    bottom: 24,
    width: '75%',
    height: 56,
    backgroundColor: '#0078DB',
    borderRadius: 5,
    paddingHorizontal: 38,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: {
    width: 24,
    height: 24.11,
  },
  btntext: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    color: '#FFFFFF',
  },
  share: {
    // position: 'absolute',
    // left: 300,
    margin: 'auto',
    bottom: 24,
    width: '15%',
    height: 56,
    // justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 1,
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: '#EFF1F3',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  referralBox: {
  position: 'absolute',
  top: 190, // Adjust as needed
  right: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  paddingVertical: 8,
  paddingHorizontal: 14,
  elevation: 4,
  shadowColor: '#00000066',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 2,
  alignItems: 'center',
},
referralLabel: {
  fontSize: 12,
  color: '#6B6B6B',
},
referralValue: {
  fontSize: 18,
  fontWeight: '700',
  color: '#111417',
},

});

function SmallGreenShape() {
  return (
    <View
      style={{
        position: 'absolute',
        width: 26.61,
        height: 33.49,
        left: 56.41,
        top: 265.56,
        transform: [{rotate: '15deg'}], // Approximation of your matrix
      }}>
      {/* Vector 1 */}
      <View
        style={{
          position: 'absolute',
          left: '14.47%',
          top: '31.46%',
          width: '7%',
          height: '4%',
          backgroundColor: '#008035',
          transform: [{rotate: '15deg'}],
        }}
      />

      {/* Vector 2 */}
      <View
        style={{
          position: 'absolute',
          left: '15.02%',
          top: '31.91%',
          width: '6%',
          height: '4%',
          backgroundColor: '#0DB14B',
          transform: [{rotate: '15deg'}],
        }}
      />

      {/* Vector 3 */}
      <View
        style={{
          position: 'absolute',
          left: '15.68%',
          top: '33.12%',
          width: '7%',
          height: '4%',
          backgroundColor: '#008035',
          transform: [{rotate: '15deg'}],
        }}
      />

      {/* Vector 4 (Group) */}
      <View
        style={{
          position: 'absolute',
          left: '16.03%',
          top: '33.35%',
          width: '6%',
          height: '4%',
          backgroundColor: '#0DB14B',
          transform: [{rotate: '15deg'}],
        }}
      />

      {/* Vector 5 */}
      <View
        style={{
          position: 'absolute',
          left: '18.43%',
          top: '32.59%',
          width: '7%',
          height: '4%',
          backgroundColor: '#008035',
          transform: [{rotate: '15deg'}],
        }}
      />

      {/* Vector 6 */}
      <View
        style={{
          position: 'absolute',
          left: '14.49%',
          top: '34.71%',
          width: '7%',
          height: '4%',
          backgroundColor: '#008035',
          transform: [{rotate: '15deg'}],
        }}
      />
    </View>
  );
}
