import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type OptionType = {
  label: string;
  value: string;
};

type CustomPickerProps = {
  placeholder: string;
  selectedValue: string;

  onValueChange: (value: string) => void;
  options: OptionType[];
  mytype: boolean;
};

const CustomPicker: React.FC<CustomPickerProps> = ({
  placeholder,
  selectedValue,
  onValueChange,

  options,
  mytype,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.selector,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}
        onPress={() => setModalVisible(true)}>
        <View
          style={{
            flexDirection: 'row',
            gap: 2,
          }}>
          <View
            style={[
              styles.ellipse,
              {
                backgroundColor: `${
                  selectedValue === 'Visit Schedule'
                    ? '#0078DB'
                    : `${
                        selectedValue === 'Technical Issue'
                          ? 'white'
                          : `${
                              selectedValue === 'Commission Issue'
                                ? 'white'
                                : `${
                                    selectedValue === 'Lead Issue'
                                      ? 'white'
                                      : 'white'
                                  }`
                            }`
                      }`
                }`,
                borderWidth:
                  selectedValue === 'Visit Schedule' ||
                  selectedValue === 'Visit Reschedule'
                    ? 1
                    : 0,
              },
            ]}
          />
          <Text
            style={{
              color: selectedValue ? 'black' : 'gray',
            }}>
            {selectedValue || placeholder}
          </Text>
        </View>

        <Svg width="12" height="12" viewBox="0 0 8 5" fill="none">
          <Path
            d="M0.667318 1.16667L4.00065 4.5L7.33398 1.16667"
            stroke="gray"
            stroke-opacity="0.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {options.map((option, i) => (
              <View
                key={i}
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <View
                  style={[
                    styles.ellipse,
                    {
                      backgroundColor: `${
                        option.value === 'Visit Schedule' ? '#0078DB' : 'white'
                      }`,
                      borderWidth:
                        option.value === 'Visit Schedule' ||
                        option.value === 'Visit Reschedule'
                          ? 1
                          : 0,
                    },
                  ]}
                />

                <TouchableOpacity
                  key={option.value}
                  style={styles.option}
                  onPress={() => {
                    onValueChange(option.value);
                    setModalVisible(false);
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                    }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  selector: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
  },
  ellipse: {
    width: 18,
    height: 18,
    borderRadius: 9, // To make it a circle
    // backgroundColor: 'rgba(232, 233, 234, 0.4)',

    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  option: {
    width: '80%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
