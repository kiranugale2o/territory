import React from 'react';
import { View, Text } from 'react-native';
import {
  Building,
  Calendar,
  RulerSquare,
  Car,
  BarChart2,
  Banknote,
  ClipboardList,
  Sofa,
  Droplet,
  Zap,
  ArrowRight,
  Home,
  SquareParking,
  Grid3x3,
  Grid2x2,
} from 'lucide-react-native';

const PropertyOverview = ({ propertyInfo }) => {
  const overviewData = [
    { icon: Building, label: 'Property Type', value: propertyInfo?.propertyType },
    { icon: Calendar, label: 'Built Year', value: propertyInfo?.builtYear },
    { icon: Grid3x3, label: 'Built-Up Area', value: propertyInfo?.builtUpArea },
    { icon: Home, label: 'Ownership Type', value: propertyInfo?.ownershipType },
    { icon: Grid2x2, label: 'Carpet Area', value: propertyInfo?.carpetArea },
    { icon: SquareParking, label: 'Parking Availability', value: propertyInfo?.parkingAvailability },
    { icon: BarChart2, label: 'Total Floors', value: propertyInfo?.totalFloors },
    { icon: BarChart2, label: 'Floor Number', value: propertyInfo?.floorNo },
    { icon: Banknote, label: 'Loan Availability', value: propertyInfo?.loanAvailability },
    { icon: ArrowRight, label: 'Property Facing', value: propertyInfo?.propertyFacing },
    { icon: ClipboardList, label: 'RERA Registered', value: propertyInfo?.reraRegistered },
    { icon: Sofa, label: 'Furnishing', value: propertyInfo?.furnishing },
    { icon: Droplet, label: 'Water Supply', value: propertyInfo?.waterSupply },
    { icon: Zap, label: 'Power Backup', value: propertyInfo?.powerBackup },
  ];

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        marginTop:10
      }}
    >

      
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 24 ,color:'black'}}>
        Property Overview
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {overviewData.map(({ icon: Icon, label, value }, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              width: '48%', // 2-column layout
              marginBottom: 16,
            }}
          >
            {Icon && (
              <Icon size={18} color="#000" style={{ marginTop: 2, marginRight: 8 }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#00000066' }}>{label}</Text>
              <Text style={{ fontSize: 14, color: '#000', fontWeight: '400' }}>
                {value || '—'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PropertyOverview;
