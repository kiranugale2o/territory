import {
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { calanderOprtions, formatDateToShort } from '../utils';
import Svg, { Path } from 'react-native-svg';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

interface MeetingFollowUp {
  followupid: number;
  visitdate: string | null; // `null` when no visit date is set
  remark: string;
  status: string; // e.g., "Cancelled"
  changestatus: number; // likely a flag (0 or 1)
  propertyName: string;
  customer: string;
  contact: string;
  fullname: string;
}
const CalanderCard = ({ d }: { d: MeetingFollowUp }) => {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(d.status);
  const selected = !calanderOprtions.find(opt => opt.value === selectedValue)
    ?.select;

  const selectColor = calanderOprtions.find(
    opt => opt.value === selectedValue,
  )?.color;

  let selectedLabel = calanderOprtions.find(
    opt => opt.value === selectedValue,
  )?.label;

  const handleSelect = async (value: string) => {
    setSelectedValue(value);
    try {
      const response = await fetch(
        `https://api.reparv.in/sales/calender/meeting/status/${d.followupid}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: value }),
        },
      );

      if (!response.ok) throw new Error('Failed to Update Status.');

      const data = await response.json(); // Fetch response data

      if (data.updated && data.status === value) {
        // Check if update happened
        Toast.show({
          type: 'success',
          text1: 'Status Changed Successfully to ' + value,
        });
      } else {
        console.log('No status change detected.', data);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
    setVisible(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Project Visit</Text>
          <Text style={styles.date}>
            {d?.visitdate
              ? formatDateToShort(d.visitdate.slice(0, 10))
              : 'No visit date'}
          </Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Project Name</Text>
          <Text style={styles.text}>{d?.propertyName}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Client Name</Text>
          <Text style={styles.text}>{d?.customer}</Text>
        </View>
      </View>

      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          },
        ]}
      >
        <View style={[styles.column, { width: '40%' }]}>
          <Text style={styles.label}>Number</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${d.contact}`);
            }}
            style={[styles.phoneRow, { width: 290 }]}
          >
            <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <Path
                d="M11.1616 10.7645L10.7571 11.1909C10.7571 11.1909 9.79447 12.2036 7.16782 9.43841C4.54117 6.67321 5.50384 5.66049 5.50384 5.66049L5.75806 5.39131C6.3865 4.7306 6.44605 3.66895 5.89761 2.89341L4.77762 1.3094C4.09851 0.349391 2.78741 0.222331 2.00964 1.04116L0.61409 2.50941C0.229204 2.916 -0.0285723 3.44118 0.00253865 4.02471C0.0825381 5.51837 0.720756 8.73064 4.27984 12.4784C8.05493 16.4521 11.5971 16.6102 13.0451 16.4672C13.5038 16.422 13.902 16.1754 14.2229 15.8366L15.4851 14.5076C16.3384 13.6107 16.0984 12.0718 15.0069 11.4441L13.3091 10.4662C12.5927 10.0549 11.7216 10.1754 11.1616 10.7645Z"
                fill="#0068FF"
              />
            </Svg>
            <Text style={styles.phone}>{d.contact}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Remark</Text>
          <View style={[styles.chip]}>
            <Text style={[styles.chipText]}>{d.remark}</Text>
          </View>
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
          >
            <Text style={styles.label}>Status</Text>
            <View
              style={[
                styles.container2,
                {
                  backgroundColor: `${selectColor}20`,
                  borderRadius: 20,
                  marginTop: 5,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: `${selectColor}`,
                  },
                ]}
              >
                {selectedLabel}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={visible} animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.cancel}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalContainer}>
            {[calanderOprtions].map((list, i) => (
              <FlatList
                key={i}
                data={list}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item.value)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        selectedValue === item.value && styles.checked,
                      ]}
                    >
                      {selectedValue === item.value && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                    <Text style={[styles.optionText, { color: item.color }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ))}
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

export default CalanderCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
  },
  column: {
    width: '33%',
    //alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.4)',
    fontFamily: 'Inter',
  },

  dbutton: {
    width: '100%',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
  },
  dbuttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
    fontFamily: 'Inter',
    borderColor: 'gray',
  },
  dselectedText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '400',
  },
  text: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  date: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
    textAlign: 'left',
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  chip: {
    // backgroundColor: '#E9F2FF',
    // paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 30,
    marginTop: 6,
  },
  chipText: {
    color: 'black',
    fontSize: 12,

    fontWeight: '700',
    // fontFamily: 'Roboto',
  },
  container2: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,

    backgroundColor: 'white',
    borderRadius: 30,
    height: 28,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  phone: {
    fontSize: 16,
    color: '#0068FF',
    fontWeight: '500',
    marginRight: 6,
    fontFamily: 'Roboto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  cancel: {
    textAlign: 'center',
    paddingVertical: 5,
    width: 30,
    margin: 'auto',
    color: 'black',
    padding: 10,
    borderRadius: 55,
    marginBottom: 10,
    backgroundColor: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: 'gray',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#0078DB',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
});
