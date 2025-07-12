import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import AddClient from '../../component/AddClient';
import {addClientFields} from '../../utils/addClientData';

const AddClientScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{padding: 10}}>
        <AddClient data={addClientFields} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddClientScreen;
