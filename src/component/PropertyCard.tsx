// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import Svg, {Path} from 'react-native-svg';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {useNavigation} from '@react-navigation/native';
// import {PropertyInfo, RootStackParamList} from '../types';

// interface Property {
//   propertyid: number;
//   builderid: number;
//   partnerid: number | null;
//   employeeid: number | null;
//   projectpartnerid: number | null;
//   guestUserId: number | null;
//   propertyCategory: string;
//   propertyType: string;
//   propertyName: string;
//   emi: number;
//   totalSalesPrice: string;
//   totalOfferPrice: string;
//   propertyApprovedBy: string;
//   distanceFromCityCenter: string;
//   reraStatus: string | null;
//   perYearReturn: string | null;
//   stampDuty: string;
//   registrationFee: string;
//   gst: string;
//   advocateFee: string;
//   msebWater: string;
//   maintenance: string;
//   other: string;
//   address: string;
//   location: string;
//   state: string;
//   city: string;
//   pincode: number;
//   frontView: string;
//   sideView: string;
//   hallView: string;
//   kitchenView: string;
//   bedroomView: string;
//   bathroomView: string | null;
//   balconyView: string | null;
//   nearestLandmark: string;
//   developedAmenities: string;
//   builtYear: string;
//   furnishing: string;
//   ownershipType: string;
//   carpetArea: string;
//   builtUpArea: string;
//   totalFloors: string;
//   floorNo: string;
//   parkingAvailability: string;
//   propertyFacing: string;
//   reraRegistered: string;
//   loanAvailability: string;
//   waterSupply: string;
//   powerBackup: string;
//   locationFeature: string;
//   sizeAreaFeature: string;
//   parkingFeature: string;
//   terraceFeature: string;
//   ageOfPropertyFeature: string;
//   furnishingFeature: string;
//   amenitiesFeature: string;
//   propertyStatusFeature: string;
//   floorNumberFeature: string;
//   smartHomeFeature: string;
//   securityBenefit: string;
//   primeLocationBenefit: string;
//   rentalIncomeBenefit: string;
//   qualityBenefit: string;
//   capitalAppreciationBenefit: string;
//   ecofriendlyBenefit: string;
//   seoSlug: string;
//   seoTittle: string;
//   seoDescription: string;
//   propertyDescription: string;
//   rejectreason: string | null;
//   status: string;
//   approve: string;
//   updated_at: string;
//   created_at: string;
// }

// interface Props {
//   pdata: PropertyInfo;
// }
// const PropertyCard: React.FC<Props> = ({pdata}) => {
//   type NavigationProp = NativeStackNavigationProp<
//     RootStackParamList,
//     'FlatInfo'
//   >;
//   const navigation = useNavigation<NavigationProp>();

//   const baseURL = 'https://api.reparv.in'; // or whatever your actual base domain is

//   const getFrontImageUrl = (frontView: string): string | null => {
//     try {
//       const images = JSON.parse(frontView); // parses the string into an array
//       if (Array.isArray(images) && images.length > 0) {
//         return `${baseURL}${images[0]}`;
//       }
//       return null;
//     } catch (e) {
//       console.error('Error parsing frontView:', e);
//       return null;
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => {
//         navigation.navigate('PropertyDetails', {
//           propertyid: pdata.propertyid,
//           enquirersid: null,
//           salespersonid: null,
//           booktype: 'customer',
//         });
//       }}>
//       <ImageBackground
//         source={
//           getFrontImageUrl(pdata.frontView)
//             ? {uri: getFrontImageUrl(pdata.frontView)!}
//             : require('../../assets/home/notfound.png')
//         }
//         style={styles.image}
//         imageStyle={styles.imageRadius}>
//         <View style={styles.overlay} />
//       </ImageBackground>

//       <View style={styles.infoSection}>
//         <View style={styles.textWrapper}>
//           <Text style={styles.title}>{pdata.propertyName}</Text>
//           <View style={styles.pricingRow}>
//             <Text style={styles.emi}>
//               EMI ₹{pdata.emi}
//               /m
//             </Text>
//             <View style={styles.priceBox}>
//               <Text style={styles.strikePrice}>₹{pdata?.totalSalesPrice}</Text>
//               <Text style={styles.actualPrice}>₹{pdata?.totalOfferPrice}</Text>
//               <Text style={styles.extra}>+Other Charges</Text>
//             </View>
//           </View>

//           <View style={styles.facilities}>
//             <View style={styles.tag}>
//               <Text style={styles.tagText}>{pdata?.propertyApprovedBy}</Text>
//             </View>
//             <View style={styles.tag}>
//               <Text style={styles.tagText}>
//                 {pdata?.distanceFromCityCenter}Km From {pdata?.city}
//               </Text>
//             </View>
//             {(pdata?.propertyCategory === 'NewFlat' ||
//               pdata?.propertyCategory === 'NewPlot') && (
//               <View style={styles.tag}>
//                 <Text style={styles.tagText}>RERA Approved</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         <View style={styles.assuredWrapper}>
//           <View style={styles.assured}>
//             <Image
//               source={require('../../assets/booking/verify.png')}
//               style={styles.verifiedIcon}
//             />
//             <Text style={styles.assuredText}>REPARV Assured</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.footer}>
//         <View style={styles.locationIcon}>
//           <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
//             <Path
//               d="M8.00033 8.00016C8.36699 8.00016 8.68088 7.86961 8.94199 7.6085C9.2031 7.34738 9.33366 7.0335 9.33366 6.66683C9.33366 6.30016 9.2031 5.98627 8.94199 5.72516C8.68088 5.46405 8.36699 5.3335 8.00033 5.3335C7.63366 5.3335 7.31977 5.46405 7.05866 5.72516C6.79755 5.98627 6.66699 6.30016 6.66699 6.66683C6.66699 7.0335 6.79755 7.34738 7.05866 7.6085C7.31977 7.86961 7.63366 8.00016 8.00033 8.00016ZM8.00033 12.9002C9.35588 11.6557 10.3614 10.5252 11.017 9.5085C11.6725 8.49183 12.0003 7.58905 12.0003 6.80016C12.0003 5.58905 11.6142 4.59738 10.842 3.82516C10.0698 3.05294 9.12255 2.66683 8.00033 2.66683C6.8781 2.66683 5.93088 3.05294 5.15866 3.82516C4.38644 4.59738 4.00033 5.58905 4.00033 6.80016C4.00033 7.58905 4.3281 8.49183 4.98366 9.5085C5.63921 10.5252 6.64477 11.6557 8.00033 12.9002ZM8.00033 14.6668C6.21144 13.1446 4.87533 11.7307 3.99199 10.4252C3.10866 9.11961 2.66699 7.91127 2.66699 6.80016C2.66699 5.1335 3.2031 3.80572 4.27533 2.81683C5.34755 1.82794 6.58921 1.3335 8.00033 1.3335C9.41144 1.3335 10.6531 1.82794 11.7253 2.81683C12.7975 3.80572 13.3337 5.1335 13.3337 6.80016C13.3337 7.91127 12.892 9.11961 12.0087 10.4252C11.1253 11.7307 9.78921 13.1446 8.00033 14.6668Z"
//               fill="black"
//               fillOpacity={0.4}
//             />
//           </Svg>
//         </View>
//         <Text style={styles.location}>
//           {pdata?.location},{pdata?.city}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     marginTop: 20,
//     width: '90%',
//     borderRadius: 12,
//     margin: 'auto',
//     overflow: 'hidden',
//     backgroundColor: '#fff',
//   },
//   image: {
//     width: '100%',
//     height: 191,
//   },
//   imageRadius: {
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: '#130F26',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     opacity: 0.3,
//   },
//   infoSection: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderColor: 'rgba(0, 0, 0, 0.06)',
//     borderWidth: 1,
//     borderTopWidth: 0,
//   },
//   textWrapper: {
//     gap: 16,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//   },
//   pricingRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   emi: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//   },
//   priceBox: {
//     alignItems: 'flex-end',
//   },
//   strikePrice: {
//     fontSize: 12,
//     color: 'rgba(0,0,0,0.4)',
//     textDecorationLine: 'line-through',
//   },
//   actualPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#000',
//   },
//   extra: {
//     fontSize: 12,
//     color: 'rgba(0,0,0,0.4)',
//     textDecorationLine: 'underline',
//   },
//   facilities: {
//     flexDirection: 'row',
//     gap: 8,
//     marginTop: 12,
//   },
//   tag: {
//     backgroundColor: 'rgba(0,0,0,0.06)',
//     borderRadius: 6,
//     paddingHorizontal: 4,
//     height: 25,
//     justifyContent: 'center',
//   },
//   tagText: {
//     fontSize: 10,
//     color: 'rgba(0, 9, 41, 0.4)',
//   },
//   assuredWrapper: {
//     borderColor: 'rgba(0, 0, 0, 0.06)',
//     borderTopWidth: 1,
//     marginTop: 12,
//   },
//   assured: {
//     marginTop: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(11, 181, 1, 0.1)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     width: '45%',
//   },
//   verifiedIcon: {
//     width: 16,
//     height: 16,
//     marginRight: 8,
//   },
//   assuredText: {
//     fontSize: 12,
//     color: 'rgba(0, 0, 0, 0.6)',
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     height: 34,
//     backgroundColor: 'rgba(0, 0, 0, 0.06)',
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   locationIcon: {
//     width: 16,
//     height: 16,
//     marginRight: 8,
//     tintColor: 'rgba(0, 0, 0, 0.4)',
//   },
//   location: {
//     fontSize: 12,
//     color: '#000929',
//     opacity: 0.5,
//   },
// });

// export default PropertyCard;

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { PropertyInfo, RootStackParamList } from '../types';
import { CheckCheck } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

interface Property {
  propertyid: number;
  builderid: number;
  partnerid: number | null;
  employeeid: number | null;
  projectpartnerid: number | null;
  guestUserId: number | null;
  propertyCategory: string;
  propertyType: string;
  propertyName: string;
  emi: number;
  totalSalesPrice: string;
  totalOfferPrice: string;
  propertyApprovedBy: string;
  distanceFromCityCenter: string;
  reraStatus: string | null;
  perYearReturn: string | null;
  stampDuty: string;
  registrationFee: string;
  gst: string;
  advocateFee: string;
  msebWater: string;
  maintenance: string;
  other: string;
  address: string;
  location: string;
  state: string;
  city: string;
  pincode: number;
  frontView: string;
  sideView: string;
  hallView: string;
  kitchenView: string;
  bedroomView: string;
  bathroomView: string | null;
  balconyView: string | null;
  nearestLandmark: string;
  developedAmenities: string;
  builtYear: string;
  furnishing: string;
  ownershipType: string;
  carpetArea: string;
  builtUpArea: string;
  totalFloors: string;
  floorNo: string;
  parkingAvailability: string;
  propertyFacing: string;
  reraRegistered: string;
  loanAvailability: string;
  waterSupply: string;
  powerBackup: string;
  locationFeature: string;
  sizeAreaFeature: string;
  parkingFeature: string;
  terraceFeature: string;
  ageOfPropertyFeature: string;
  furnishingFeature: string;
  amenitiesFeature: string;
  propertyStatusFeature: string;
  floorNumberFeature: string;
  smartHomeFeature: string;
  securityBenefit: string;
  primeLocationBenefit: string;
  rentalIncomeBenefit: string;
  qualityBenefit: string;
  capitalAppreciationBenefit: string;
  ecofriendlyBenefit: string;
  seoSlug: string;
  seoTittle: string;
  seoDescription: string;
  propertyDescription: string;
  rejectreason: string | null;
  status: string;
  approve: string;
  updated_at: string;
  created_at: string;
}

interface Props {
  pdata: PropertyInfo;
}
const PropertyCard: React.FC<Props> = ({ pdata }) => {
  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'FlatInfo'
  >;
  const navigation = useNavigation<NavigationProp>();

  const baseURL = 'https://api.reparv.in'; // or whatever your actual base domain is

  const getFrontImageUrl = (frontView: string): string | null => {
    try {
      const images = JSON.parse(frontView); // parses the string into an array
      if (Array.isArray(images) && images.length > 0) {
        return `${baseURL}${images[0]}`;
      }
      return null;
    } catch (e) {
      console.error('Error parsing frontView:', e);
      return null;
    }
  };

  const showApprovedBy = pdata?.propertyCategory !== 'FarmLand';
  const showRERA = ['NewFlat', 'NewPlot'].includes(pdata?.propertyCategory);
  const auth = useContext(AuthContext);
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        auth?.setPropertyName(pdata?.propertyName);
        navigation.navigate('PropertyDetails', {
          propertyid: pdata.propertyid,
          enquirersid: null,
          salespersonid: null,
          booktype: 'customer',
        });
      }}
    >
      <ImageBackground
        source={
          getFrontImageUrl(pdata.frontView)
            ? { uri: getFrontImageUrl(pdata.frontView)! }
            : require('../../assets/home/notfound.png')
        }
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.infoSection}>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{pdata.propertyName}</Text>
          <View style={styles.pricingRow}>
            <Text style={styles.emi}>
              EMI{' '}
              {Number(pdata?.emi).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              })}
              /m
            </Text>
            <View style={styles.priceBox}>
              <Text style={styles.strikePrice}>₹{pdata?.totalSalesPrice}</Text>
              <Text style={styles.actualPrice}>
                {Number(pdata?.totalOfferPrice).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                })}
              </Text>
              <Text style={styles.extra}>+Other Charges</Text>
            </View>
          </View>
          {/*  */}
        </View>

        {/* <View style={styles.assuredWrapper}>
          <View style={styles.assured}>
            <Image
              source={require('../../assets/booking/verify.png')}
              style={styles.verifiedIcon}
            />
            <Text style={styles.assuredText}>REPARV Assured</Text>
          </View>
        </View> */}
        {/* Details Section */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 4,
          }}
        >
          {/* Approved By */}
          {showApprovedBy && (
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 4,
                paddingHorizontal: 12,
                backgroundColor: '#eeffec',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <CheckCheck size={17} color="#047857" />
              <Text style={{ fontSize: 11, color: '#4B5563' }}>
                {pdata?.propertyApprovedBy}
              </Text>
            </View>
          )}

          {/* RERA Approved */}
          {showRERA && (
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 4,
                paddingHorizontal: 12,
                backgroundColor: '#eeffec',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <CheckCheck size={17} color="#047857" />
              <Text style={{ fontSize: 11, color: '#4B5563' }}>
                RERA Approved
              </Text>
            </View>
          )}

          {/* Distance From City Center */}
          <View
            style={{
              paddingVertical: 4,
              paddingHorizontal: 12,
              backgroundColor: '#0000000F',
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 11, color: '#4B5563' }}>
              {pdata?.distanceFromCityCenter} KM Distance from city center
            </Text>
          </View>
        </View>

        {/* Verified Badge */}
        <View
          style={{
            width: '100%',
            borderTopWidth: 0.2,
            borderColor: 'gray',
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: '95%',
              margin: 'auto',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <View style={styles.assuredWrapper}>
              <View style={styles.assured}>
                <Image
                  source={require('../../assets/booking/verify.png')}
                  style={styles.verifiedIcon}
                />
                <Text style={styles.assuredText}>REPARV Assured</Text>
              </View>
            </View>

            <View style={styles.row2}>
              <Text
                style={[
                  {
                    color: 'black',
                    fontSize: 13,
                  },
                ]}
              >
                {pdata?.propertyCategory}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.locationIcon}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
              d="M8.00033 8.00016C8.36699 8.00016 8.68088 7.86961 8.94199 7.6085C9.2031 7.34738 9.33366 7.0335 9.33366 6.66683C9.33366 6.30016 9.2031 5.98627 8.94199 5.72516C8.68088 5.46405 8.36699 5.3335 8.00033 5.3335C7.63366 5.3335 7.31977 5.46405 7.05866 5.72516C6.79755 5.98627 6.66699 6.30016 6.66699 6.66683C6.66699 7.0335 6.79755 7.34738 7.05866 7.6085C7.31977 7.86961 7.63366 8.00016 8.00033 8.00016ZM8.00033 12.9002C9.35588 11.6557 10.3614 10.5252 11.017 9.5085C11.6725 8.49183 12.0003 7.58905 12.0003 6.80016C12.0003 5.58905 11.6142 4.59738 10.842 3.82516C10.0698 3.05294 9.12255 2.66683 8.00033 2.66683C6.8781 2.66683 5.93088 3.05294 5.15866 3.82516C4.38644 4.59738 4.00033 5.58905 4.00033 6.80016C4.00033 7.58905 4.3281 8.49183 4.98366 9.5085C5.63921 10.5252 6.64477 11.6557 8.00033 12.9002ZM8.00033 14.6668C6.21144 13.1446 4.87533 11.7307 3.99199 10.4252C3.10866 9.11961 2.66699 7.91127 2.66699 6.80016C2.66699 5.1335 3.2031 3.80572 4.27533 2.81683C5.34755 1.82794 6.58921 1.3335 8.00033 1.3335C9.41144 1.3335 10.6531 1.82794 11.7253 2.81683C12.7975 3.80572 13.3337 5.1335 13.3337 6.80016C13.3337 7.91127 12.892 9.11961 12.0087 10.4252C11.1253 11.7307 9.78921 13.1446 8.00033 14.6668Z"
              fill="black"
              fillOpacity={0.4}
            />
          </Svg>
        </View>
        <Text style={styles.location}>
          {pdata?.location},{pdata?.city}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    width: '95%',
    borderRadius: 12,
    marginInline: 'auto',
    margin: 'auto',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 191,
  },
  imageRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#0000000F',
    padding: 6,
    marginTop: 10,

    borderRadius: 10,
    alignItems: 'center',
    gap: 2, // works on RN 0.71+, otherwise use marginLeft
    textDecorationLine: 'underline',
    alignSelf: 'center', // centers it horizontally like margin: 0 auto
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#130F26',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    opacity: 0.3,
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  textWrapper: {
    gap: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emi: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  strikePrice: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    textDecorationLine: 'line-through',
  },
  actualPrice: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000',
  },
  extra: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    textDecorationLine: 'underline',
  },
  facilities: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 6,
    paddingHorizontal: 4,
    height: 25,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 10,
    color: 'rgba(0, 9, 41, 0.4)',
  },
  assuredWrapper: {
    marginTop: 1,
  },
  assured: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 181, 1, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  assuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 34,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: 'rgba(0, 0, 0, 0.4)',
  },
  location: {
    fontSize: 12,
    color: '#000929',
    opacity: 0.5,
  },
});

export default PropertyCard;
0;
