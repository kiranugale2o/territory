import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import {useContext, useEffect} from 'react';
import {AuthContext} from '../../context/AuthContext';

type FlatInfoRouteProp = RouteProp<RootStackParamList, 'FlatInfo'>;

const FlatInfo: React.FC = () => {
  const route = useRoute<FlatInfoRouteProp>();
  const {flat} = route.params;
  const auth = useContext(AuthContext);
  useEffect(() => {
    auth?.setFlatName(flat.property_name);
  }, []);
  return (
    <View style={{flex: 1, width: '100%', backgroundColor: 'white'}}>
      <Text style={styles.imageText}>Images</Text>

      <View
        style={{
          width: '95%',
          flexDirection: 'row',
          gap: 10,
          marginInline: 'auto',
        }}>
        {/* Image.. */}

        <Image
          source={{uri: `https://api.reparv.in${flat.image}`}}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Image.. */}
        <Image
          source={require('../../../assets/booking/p1.png')}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Image.. */}
        <Image
          source={require('../../../assets/booking/p1.png')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={{flex: 2, width: '100%', top: 60}}>
        <Text style={[styles.title, {marginInline: 5}]}>Location</Text>

        <View style={styles.Locationcontainer}>
          <Image
            source={require('../../../assets/booking/image.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.title}>Specifications</Text>
          <View style={styles.row}>
            <Text style={styles.label2}>Property Name</Text>
            <Text style={styles.value}>{flat.property_name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label2}>Status</Text>
            <Text style={styles.value}>{flat.status}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label2}>Area</Text>
            <Text style={styles.value}>{flat.area} sqft</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label2}>Living Area</Text>
            <Text style={styles.value}>{flat.location}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label2}>Type</Text>
            <Text style={styles.value}>{flat.propertytypeid}</Text>
          </View>

          {/* <View style={styles.row}>
            <Text style={styles.label2}>Year Built</Text>
            <Text style={styles.value}>2013</Text>
          </View> */}
          <View style={styles.row}>
            <Text style={styles.label2}>Extra</Text>
            <Text style={styles.value}>{flat.extra}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label2}>city</Text>
            <Text style={styles.value}>{flat.city}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.selectPartnerButton}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageText: {
    width: 57,
    height: 19,
    left: 10,
    top: 20,
    fontFamily: 'Inter',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',

    color: '#000000',
  },

  image: {
    width: '30%',
    height: 79,
    left: 3,
    top: 40,
    borderRadius: 10, // Optional if image matches rectangle
  },

  Locationcontainer: {
    // backgroundColor: 'red',
    width: '100%',
  },
  mapImage: {
    width: '95%',
    height: 183,
    marginInline: 'auto',
    top: 5,
    borderRadius: 10, // Optional for rounded corners
  },
  cardContainer: {
    margin: 10,

    //  padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label2: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  selectPartnerButton: {
    // position: 'absolute',
    width: '100%',
    height: 48,
    backgroundColor: '#0068FF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bookButtonText: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    padding: 'auto',
    margin: 'auto',
    lineHeight: 26, // 160% of 16px
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default FlatInfo;
