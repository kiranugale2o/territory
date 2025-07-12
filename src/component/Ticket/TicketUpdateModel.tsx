import {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomPicker from '../CustomPicker';
import {Picker} from '@react-native-picker/picker';
import {X} from 'lucide-react-native';

interface TicketUpdateProp {
  visible: boolean;
  onClose: () => void;
  ticketData: {
    ticketNo: string;
    adminName: string;
    department: string;
    employee: string;
    issue: string;
    description: string;
    adminid: string;
    departmentid: string;
    employeeid: string;
    ticketId: any;
  };
}

interface NewTicket {
  adminid: string;
  departmentid: string;
  employeeid: string;
  issue: string;
  details: string;
}
const TicketUpdateModel: React.FC<TicketUpdateProp> = ({
  visible,
  onClose,
  ticketData,
}) => {
  const [newTicket, setNewTicketData] = useState<NewTicket>({
    adminid: ticketData.adminid,
    departmentid: ticketData.departmentid,
    employeeid: ticketData.employeeid,
    issue: ticketData.issue,
    details: ticketData.description,
  });

  useEffect(() => {
    setNewTicketData({
      adminid: ticketData.adminid,
      departmentid: ticketData.departmentid,
      employeeid: ticketData.employeeid,
      issue: ticketData.issue,
      details: ticketData.description,
    });
  }, [visible]);

  const options = [
    {label: 'Technical Issue', value: 'Technical Issue'},
    {label: 'Commission Issue', value: 'Commission Issue'},
    {label: 'Lead Issue', value: 'Lead Issue'},
  ];

  interface Admin {
    id: number;
    name: string;
  }

  const [adminData, setAdminData] = useState<Admin[]>([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  //Fetch department data
  const fetchAdminData = async () => {
    try {
      const response = await fetch(
        'https://api.reparv.in/sales/tickets/admins',
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch Admins.');
      const data = await response.json();
      setAdminData(data);
      console.log(adminData, 'sss');
    } catch (err) {
      console.error('Error fetching Admins:', err);
    }
  };

  useEffect(() => {
    if (newTicket.adminid !== '') {
      setNewTicketData(prev => ({
        ...prev,
        departmentid: '',
        employeeid: '',
      }));
    }
  }, [newTicket.adminid]);

  useEffect(() => {
    if (newTicket.departmentid) {
      fetchEmployeeData(newTicket.departmentid);
      console.log(newTicket.departmentid, 'dddddddddd');
    }
  }, [newTicket.departmentid]);

  //Fetch department data
  const fetchDepartmentData = async () => {
    try {
      const response = await fetch(
        'https://api.reparv.in/sales/tickets/departments',
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch departments.');
      const data = await response.json();
      setDepartmentData(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  //Fetch department data
  const fetchEmployeeData = async (id: any) => {
    try {
      const response = await fetch(
        'https://api.reparv.in/sales/tickets/employees/' + id,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch departments.');
      const data = await response.json();
      setEmployeeData(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchDepartmentData();
  }, []);

  useEffect(() => {
    if (!newTicket.adminid && adminData.length > 0) {
      setNewTicketData(prev => ({
        ...prev,
        adminid: adminData[0].id,
      }));
    }
  }, [adminData]);

  const addTicket = async () => {
    const endpoint = `edit/${ticketData.ticketId}`;
    console.log('new', newTicket);

    try {
      const response = await fetch(
        `https://api.reparv.in/sales/tickets/${endpoint}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newTicket),
        },
      );

      if (response.status === 409) {
        Alert.alert('Something went wrong');
      } else if (!response.ok) {
        throw new Error(`Failed to save ticket. Status: ${response.status}`);
      } else {
        Alert.alert('Ticket updated successfully!');
        onClose();
      }

      setNewTicketData({
        adminid: '',
        departmentid: '',
        employeeid: '',
        issue: '',
        details: '',
      });
    } catch (err: any) {
      console.error('Error saving employee:', err.message);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 30,
            width: '95%',
            elevation: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 16,
                textAlign: 'center',
                 color:'black'
              }}>
              Ticket Details
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 14,
              marginTop: 10,
              color: '#00000066',
              fontWeight: '500',
            }}>
            Issue Category
          </Text>

          {/* Select Issue */}
          <CustomPicker
            placeholder="Select Issue"
            selectedValue={newTicket.issue}
            onValueChange={value => {
              setNewTicketData({...newTicket, issue: value});
            }}
            options={options}
            mytype={false}
          />

          <View style={{width: '100%', marginTop: 10}}>
            <Text
              style={{
                fontSize: 14,
                color: '#00000066',
                fontWeight: '500',
              }}>
              Select Admin
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: '#00000033',
                borderRadius: 4,
                // marginTop: 10,
                backgroundColor:
                  newTicket.departmentid === '' ? '#f2f2f2' : '#fff',
              }}>
              <Picker
                selectedValue={newTicket.adminid}
                // enabled={newTicket.adminid !== '' ? false : true}
                onValueChange={itemValue =>
                  setNewTicketData({...newTicket, adminid: itemValue})
                }
                style={{
                  fontSize: 16,
                  //  paddingVertical: 5,
                  // paddingHorizontal: 8,
                  color: '#000',
                }}>
                <Picker.Item label="Select Admin" value="" />
                {adminData?.map((admin, index) => (
                  <Picker.Item
                    key={index}
                    label={admin.name}
                    value={admin.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{width: '100%', marginTop: 10}}>
            <Text
              style={{
                fontSize: 14,
                // lineHeight: 18,
                color: '#00000066',
                fontWeight: '500',
              }}>
              Department
            </Text>

            <View
              style={{
                width: '100%',
                marginTop: 10,
                //  padding: 5,
                borderWidth: 1,
                borderColor: '#00000033',
                borderRadius: 4,
                backgroundColor:
                  newTicket.adminid !== '' ? '#f0f0f0' : 'transparent',
              }}>
              <Picker
                enabled={newTicket.adminid === ''}
                selectedValue={newTicket.departmentid}
                onValueChange={itemValue =>
                  setNewTicketData({...newTicket, departmentid: itemValue})
                }
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#000',
                  backgroundColor: 'transparent',
                }}>
                <Picker.Item label="Select Department" value="" />
                {departmentData?.map((department, index) => (
                  <Picker.Item
                    key={index}
                    label={department.department}
                    value={department.departmentid}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{width: '100%'}}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                color: '#00000066',
                fontWeight: '500',
              }}>
              Employee
            </Text>

            <View
              style={{
                width: '100%',
                marginTop: 10,

                borderWidth: 1,
                borderColor: '#00000033',
                borderRadius: 4,
                backgroundColor:
                  newTicket.departmentid === '' ? '#f0f0f0' : 'transparent',
              }}>
              <Picker
                enabled={newTicket.departmentid !== ''}
                selectedValue={newTicket.employeeid}
                onValueChange={itemValue =>
                  setNewTicketData({...newTicket, employeeid: itemValue})
                }
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#000',
                  backgroundColor: 'transparent',
                }}>
                <Picker.Item label="Select Employee" value="" />
                {employeeData?.map((employee, index) => (
                  <Picker.Item
                    key={index}
                    label={employee.name}
                    value={employee.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
          {/* </View> */}
          <Text
            style={{
              fontSize: 14,
              color: '#2E2A40',
              marginVertical: 10,
            }}>
            Ticket Description:
          </Text>
          <TextInput
            style={[
              {
                color: 'black',
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1,
                borderRadius: 4,
                //addingVertical: 30,
                height: 50,
              },
            ]}
            // placeholder={!isFocused ? 'Type ticket issue here..?' : ''}
            placeholderTextColor="
            black
            "
            value={newTicket.details}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={value =>
              setNewTicketData({...newTicket, details: value})
            }
            multiline
          />

          <View
            style={{
              marginTop: 20,
              width: '90%',
              margin: 'auto',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              onPress={addTicket}
              style={{
                backgroundColor: '#0078DB',
                padding: 10,
                width: '50%',
                margin: 'auto',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  margin: 'auto',
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TicketUpdateModel;
// const styles = StyleSheet.create({
//   button: {
//     left: '65%',

//     top: 36,
//     width: '25%',
//     height: 40,
//     backgroundColor: '#0078DB',
//     borderRadius: 4,
//     paddingVertical: 6,

//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 8, // Note: "gap" support is limited in some React Native versions. Use spacing with margin if needed.
//   },
//   innerContainer: {
//     flexDirection: 'row',
//     marginInline: 'auto',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 8,
//   },
//   icon: {
//     width: 14,
//     height: 14,
//     marginInline: 'auto',
//   },
//   buttonText: {
//     // width: 80,
//     height: 26,
//     marginInline: 'auto',
//     fontFamily: 'Lato',
//     fontWeight: '600',
//     fontSize: 16,
//     lineHeight: 26,
//     color: '#FFFFFF',
//   },
//   container: {},
//   openButton: {
//     backgroundColor: '#0078DB',
//     padding: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginBottom: 90,
//   },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     padding: 60,
//   },
//   drawerContent: {
//     marginTop: 20,
//   },
//   drawer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingTop: 10,
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#2E2A40',
//   },
//   description: {
//     fontSize: 12,
//     color: 'rgba(0, 0, 0, 0.4)',
//   },
//   label: {
//     fontSize: 14,
//     color: '#2E2A40',
//     marginVertical: 10,
//   },
//   inputBox: {
//     borderColor: 'rgba(0, 0, 0, 0.2)',
//     borderWidth: 1,
//     borderRadius: 4,
//     padding: 10,
//     marginBottom: 20,
//   },

//   picker: {
//     width: 200,
//     height: 50,
//     marginBottom: 20,
//   },
//   selectedValue: {
//     fontSize: 16,
//     color: 'blue',
//   },
//   inputText: {
//     color: 'rgba(0, 0, 0, 0.4)',
//   },

//   textInput: {
//     minHeight: 100,
//     borderWidth: 1,
//     borderColor: 'rgba(0, 0, 0, 0.2)',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     textAlignVertical: 'top',
//   },
//   saveButton: {
//     backgroundColor: '#FEFEFE',
//     padding: 18,
//     marginTop: 20,
//     borderRadius: 4,
//     borderColor: 'rgba(0, 0, 0, 0.2)',
//     borderWidth: 1,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: 'rgba(0, 0, 0, 0.4)',
//     fontWeight: '600',
//   },
//   closeButton: {
//     marginTop: 20,

//     alignItems: 'center',
//     backgroundColor: '#0078DB',
//     padding: 12,
//     borderRadius: 4,
//   },
//   closebuttonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
// });
