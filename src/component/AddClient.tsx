import React, {useContext, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';

type Field = {
  name: string;
  label: string;
  placeHolder: string;
  type?: string;
  options?: {
    label: string;
    value: string;
    color?: string;
    select?: boolean;
  }[];
};

type Props = {
  data: Field[];
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
      return '#FF4646';
    case 'visit Reschedule':
      return '#7E7E7E';
    case 'Received':
      return '#0068FF';
    default:
      return '#7E7E7E';
  }
};

const AddClient: React.FC<Props> = ({data}) => {
  const [formValues, setFormValues] = useState<{[key: string]: string}>({});
  const [dropdownOpenFor, setDropdownOpenFor] = useState<string | null>(null);

  const auth = useContext(AuthContext);

  const handleChange = (name: string, value: string) => {
    setFormValues(prev => ({...prev, [name]: value}));
    setDropdownOpenFor(null); // close dropdown when selected
  };

  const handleSubmit = () => {
    const clientData = {
      ...formValues,
      salespersonId: auth?.user?.id,
    };
    console.log(formValues);
    fetch('http://your-backend-url.com/api/clients', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(clientData),
    })
      .then(response => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  };

  const hexToRgba = (hex: string, opacity: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c
        .split('')
        .map(ch => ch + ch)
        .join('');
    }
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r},${g},${b},${opacity})`;
  };

  return (
    <ScrollView>
      <FlatList
        scrollEnabled={false}
        data={data}
        keyExtractor={(item, index) => `${item.label}-${index}`}
        contentContainerStyle={{padding: 10}}
        renderItem={({item}) => {
          const selectedValue = formValues[item.name] || '';
          const selectedOption = item.options?.find(
            opt => opt.value === selectedValue,
          );
          const displayLabel = selectedOption?.label || item.placeHolder;
          const displayColor =
            item.name === 'status' ? getColorByValue(selectedValue) : '#333';

          return (
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 16, color: 'gray'}}>{item.label}</Text>

              {item.type === 'select' ? (
                <View style={styles.wrapper}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.dropdownButton}
                    onPress={() =>
                      setDropdownOpenFor(prev =>
                        prev === item.name ? null : item.name,
                      )
                    }>
                    <Text
                      style={
                        item.name === 'status'
                          ? [
                              styles.selectedText,
                              {
                                color: displayColor,
                                backgroundColor: hexToRgba(displayColor, 0.15),
                              },
                            ]
                          : {color: 'gray'}
                      }>
                      {displayLabel}
                    </Text>
                  </TouchableOpacity>

                  {dropdownOpenFor === item.name && (
                    <View style={styles.dropdownList}>
                      {item.options?.map(opt => (
                        <TouchableOpacity
                          key={opt.value}
                          style={styles.optionItem}
                          onPress={() => handleChange(item.name, opt.value)}>
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: opt.color || '#000',
                              },
                            ]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : item.type === 'text' ? (
                <TextInput
                  placeholder={item.placeHolder}
                  placeholderTextColor="gray"
                  onChangeText={text => handleChange(item.name, text)}
                  style={styles.textInput}
                  value={formValues[item.name] || ''}
                />
              ) : (
                <TextInput
                  style={styles.textArea}
                  multiline
                  placeholderTextColor="gray"
                  numberOfLines={5}
                  placeholder={item.placeHolder}
                  value={formValues[item.name] || ''}
                  onChangeText={text => handleChange(item.name, text)}
                />
              )}
            </View>
          );
        }}
      />
      <View style={{alignItems: 'flex-end', padding: 20}}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  dropdownButton: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  selectedText: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,

    alignSelf: 'flex-start',

    padding: 5,
    borderRadius: 50,
  },
  dropdownList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.2)',
    // maxHeight: 200,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  optionText: {
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    color: 'black',
    backgroundColor: 'white',
    marginTop: 8,
  },
  textArea: {
    height: 120,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
    borderRadius: 8,
    backgroundColor: 'white',
    color: 'black',
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    width: 111,
    height: 48,
    backgroundColor: '#0078DB',
    borderColor: '#D5D7F6',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
});

export default AddClient;
