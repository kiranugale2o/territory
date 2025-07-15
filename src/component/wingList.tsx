import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {payNow} from '../utils/razorpay';
import SuccessModal from './PaymentModules/SuccessModel';
import ConfirmBookingPopup from './ConfirmBookingPopup';
import {X} from 'lucide-react-native';

const width = Dimensions.get('window').width;
type Flat = {
  propertyinfoid: number;
  propertyid: number;
  wing: string;
  floor: string;
  flatno: string;
  status: string;
  flatfacing: string;
  type: string;
  carpetarea: number;
  superbuiltup: number;
  facing: string;
  sqftprice: number;
  mouza: string;
  khasrano: string;
  clubhousecharge: number;
  parkingcharge: number;
  watercharge: number;
  societydeposit: number;
  maintanance: number;
  documentcharge: number;
  updated_at: string; // ISO date string
  created_at: string; // ISO date string
};

type WingsFlatsListProps = {
  data: Flat[];
  sid: number;
  eid: number;
  pid: number;
};

const NUM_COLUMNS = 5; // Updated to show 5 columns
const BOX_WIDTH = 35;
const BOX_HEIGHT = 30;

const WingsFlatsList: React.FC<WingsFlatsListProps> = ({
  data,
  sid,
  eid,
  pid,
}) => {
  const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const auth = useContext(AuthContext);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successModel, setModel] = useState(false);
  const [selectedFlatInfo, setSelectedFlatInfo] = useState<Flat | null>(null);
  const handlePayment = () => {
    payNow(
      auth?.user?.email,
      auth?.user?.contact,
      auth?.user?.name,
      auth,
      pid,
      sid,
      eid,
    );
  };

  // Group flats by wing
  const groupedByWing: {[key: string]: Flat[]} = data.reduce((acc, item) => {
    if (!acc[item.wing]) acc[item.wing] = [];
    acc[item.wing].push(item);
    return acc;
  }, {} as {[key: string]: Flat[]});

  // Select only one flat
  const selectFlat = (id: number) => {
    setSelectedFlatId(prev => (prev === id ? null : id));

    const selectedFlat = data.find(item => item.propertyinfoid === id);
    if (selectedFlat) {
      setSelectedFlatInfo(selectedFlat);
      auth?.setPropertyinfoId(selectedFlat.propertyinfoid);
    }
    console.log(selectedFlat);
    setShowDrawer(true);
  };

  const details = [
    ['Carpet Area', `${selectedFlatInfo?.carpetarea} Sq.ft.`],
    ['Super Buildup', `${selectedFlatInfo?.superbuiltup} sq.ft.`],
    ['Type Of Flat', `${selectedFlatInfo?.type}`],
    ['Floor', selectedFlatInfo?.floor],
    ['Wing', selectedFlatInfo?.wing],
    ['Flat Facing', selectedFlatInfo?.flatfacing],
    ['Facing', selectedFlatInfo?.facing],
    ['Sq.Ft. Price', `₹${selectedFlatInfo?.sqftprice}`],
    ['Mouza', selectedFlatInfo?.mouza],
    ['Khasara No.', selectedFlatInfo?.khasrano],
    ['Club House Charge', `₹${selectedFlatInfo?.clubhousecharge}`],
    ['Parking Charge', `₹${selectedFlatInfo?.parkingcharge}`],
    ['Water & Electric Charge', `₹${selectedFlatInfo?.watercharge}`],
    ['Society Deposit', `₹${selectedFlatInfo?.societydeposit}`],
    ['Maintenance', `₹${selectedFlatInfo?.maintanance}`],
    ['Document Charges', `₹${selectedFlatInfo?.documentcharge}`],
  ];
  const wings = Object.entries(groupedByWing);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        style={styles.container}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}>
        {wings.map(([wing, flats]) => {
          const columns: Flat[][] = Array.from({length: NUM_COLUMNS}, () => []);
          flats.forEach((flat, idx) => {
            columns[idx % NUM_COLUMNS].push(flat);
          });

          return (
            <View key={wing} style={styles.wingSection}>
              <Text style={styles.wingTitle}>Wing {wing}</Text>
              <View style={styles.columnsContainer}>
                {columns.map((colFlats, colIdx) => (
                  <View key={`${wing}_col_${colIdx}`} style={styles.column}>
                    {colFlats.map(flat => {
                      const isSelected = selectedFlatId === flat.propertyinfoid;
                      const isDisabled = flat?.status === 'Booked';
                      return (
                        <TouchableOpacity
                          key={`${flat.propertyinfoid}_${flat.flatno}`}
                          style={[
                            styles.flatCard,
                            isSelected && styles.selectedFlatCard,
                            isDisabled && styles.disabledFlatCard, // 🟡 Optional: visual disabled style
                          ]}
                          onPress={() => {
                            if (!isDisabled) {
                              selectFlat(flat.propertyinfoid);
                            }
                          }}
                          activeOpacity={isDisabled ? 1 : 0.7}
                          disabled={isDisabled} // 🔒 Disable touch event
                        >
                          <Text
                            style={[
                              styles.flatText,
                              isSelected && styles.selectedFlatText,
                              isDisabled && styles.disabledFlatText, // 🟡 Optional: grey out text
                            ]}>
                            {flat.flatno}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <Modal transparent visible={showDrawer} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={WingDetailsStyle.card}>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => setShowDrawer(false)}>
              <X size={20} />
            </TouchableOpacity>
            <View style={WingDetailsStyle.separator}></View>
            <Text style={WingDetailsStyle.title}>Flat Details</Text>

            {details.map(([label, value], index) => (
              <View key={index} style={WingDetailsStyle.detailRow}>
                <Text style={WingDetailsStyle.label}>{label}</Text>
                <Text style={WingDetailsStyle.value}>{value}</Text>
              </View>
            ))}

            <View style={WingDetailsStyle.detailRow}>
              <Text style={WingDetailsStyle.label}>Total Value</Text>
              <Text style={[WingDetailsStyle.value, {color: '#0068FF'}]}>
                ₹7,265,000
              </Text>
            </View>
            <View style={WingDetailsStyle.container}>
              <TouchableOpacity
                onPress={() => {
                  setShowPopup(true);
                  setShowDrawer(false);
                }}
                style={WingDetailsStyle.button}>
                <Text style={WingDetailsStyle.buttonText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showPopup && (
        <ConfirmBookingPopup
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          onConfirm={() => {
            setShowPopup(false);
            handlePayment();
          }}
        />
      )}

      <Modal visible={auth?.isPaymentSuccess} transparent animationType="fade">
        <SuccessModal onClose={() => auth?.setIsPaymentSuccess(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  disabledFlatCard: {
    backgroundColor: '#e0e0e0', // light grey
    borderColor: '#ccc',
  },

  disabledFlatText: {
    color: '#999', // grey text
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  container: {
    padding: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 1,
    gap: 10,
  },
  wingSection: {
    // width: 180, // Slightly wider to fit more columns
    marginRight: 20,
  },
  wingTitle: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    gap: 8,
  },
  flatCard: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    backgroundColor: '#C2F3C2',
    //borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFlatCard: {
    backgroundColor: '#0078DB',
    //  borderColor: '#2E7D32',
  },
  flatText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  selectedFlatText: {
    color: '#FFF',
  },
});

const WingDetailsStyle = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 16,
    padding: 24,
    borderWidth: 0.5,
    paddingVertical: 40,
    paddingBottom: 50,
    width: width,
    height: 550,
    //eight: '90%',
    position: 'absolute',
    bottom: 0,
    shadowOpacity: 1,
  },
  separator: {
    width: 24,
    height: 0,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.4)',
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  detailRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  value: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },

  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 80,
    padding: 16,

    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '90%',
    height: 48,
    backgroundColor: '#0078DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Mukta',
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default WingsFlatsList;
