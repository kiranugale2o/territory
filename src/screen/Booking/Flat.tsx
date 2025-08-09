import {ActivityIndicator, FlatList, ScrollView, Text, View} from 'react-native';
import PropertyCard from '../../component/PropertyCard';
import {PropertyInfo, RootStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../context/AuthContext';
import Loader from '../../component/loader';

type FlatRouteProp = RouteProp<RootStackParamList, 'Flat'>;

const BookingFlats: React.FC = () => {
  const route = useRoute<FlatRouteProp>();
  const {flatType} = route.params;
  console.log(flatType);

  const [flats, setFlats] = useState<any[]>([]);
  const [fliterFlats, setFilterFlats] = useState<any[]>([]);
  // Replace `any` with an actual `Flat` type/interface if available
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);

  const fetchFlats = async () => {
    try {
      const response = await fetch('https://api.reparv.in/sales/properties');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: PropertyInfo[] = await response.json();

      const newFlatProperties = data.filter(
        item => item.propertyCategory === flatType,
      );

      setFlats(newFlatProperties);
     //console.log(newFlatProperties);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // You can stop a loader here if you have one
      console.log('Fetch attempt finished');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  if (loading) return <Loader />;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
      }}>
      {/* Cards */}
      {/* .filter(property => property?.propertyCategory === 'Resale') */}
    <FlatList
  data={Array.isArray(flats) ? flats : []}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => <PropertyCard pdata={item} />}
  ListEmptyComponent={
    <View style={{ alignItems: 'center', marginTop: 100 }}>
      <Text style={{ fontSize: 22 }}>No Property Found!</Text>
    </View>
  }
/>
    </View>
  );
};

export default BookingFlats;
