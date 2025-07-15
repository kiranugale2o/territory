import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';

type Option = {
  label: string;
  value: string;
  color?: string;
};

type CustomPickerProps = {
  item: {
    name: string;
    placeHolder: string;
    options: Option[];
  };
  formValues: Record<string, string>;
  handleChange: (name: string, value: string) => void;
};

const getColorByValue = (value: string) => {
  switch (value) {
    case 'visit':
      return '#0068FF';
    case 'token':
      return '#FFCA00';
    case 'ongoing':
      return '#5D00FF';
    case 'cancelled':
      return 'red';
    case 'visit Reschedule':
      return 'gray';
    case 'Received':
      return '#0078DB';
    default:
      return 'gray';
  }
};

const CustomPicker: React.FC<CustomPickerProps> = ({
  item,
  formValues,
  handleChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedValue = formValues[item.name] || '';
  const selectedColor = getColorByValue(selectedValue);

  const onSelect = (value: string) => {
    setModalVisible(false);
    handleChange(item.name, value);
  };

  const selectedLabel =
    item.options?.find(opt => opt.value === selectedValue)?.label ||
    item.placeHolder;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.selectedText,
            {color: item.name === 'status' ? selectedColor : '#333'},
          ]}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={item.options || []}
              keyExtractor={opt => opt.value}
              renderItem={({item: opt}) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => onSelect(opt.value)}>
                  <Text
                    style={[styles.optionText, {color: opt.color || '#000'}]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              )}
              ListHeaderComponent={() => (
                <Text style={[styles.optionText, {color: '#999', padding: 8}]}>
                  {item.placeHolder}
                </Text>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  dropdownButton: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  selectedText: {
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 300,
    paddingVertical: 10,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
  },
});

export default CustomPicker;
