import {
  Alert,
  Animated,
  Button,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { ClipPath, Path } from 'react-native-svg';
import TicketCard from '../../component/TicketCard';
// import BottomDrawer from '../../component/BottomDrawer';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import CustomPicker from '../../component/CustomPicker';
// import {createDrawerNavigator} from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Booking from '../Booking';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Home from '../Home';

// import BottomSheet from '@gorhom/bottom-sheet';
// import {useMemo, useRef} from 'react';
const Drawer = createDrawerNavigator();
const { height } = Dimensions.get('window');

const issue = {
  issueType: '',
  issueMessage: '',
};

// export interface Ticket {
//   ticketid: number;
//   ticketadder: string;
//   adminid: string;
//   departmentid: string;
//   employeeid: string;
//   ticketno: string;
//   issue: string;
//   details: string;
//   response: string | null;
//   status: 'Open' | 'Closed' | 'In_Progress';
//   updated_at: string; // e.g., '06 May 2025 | 08:48 AM'
//   created_at: string;
//   admin_name: string | null;
//   department: string | null;
//   employee_name: string | null;
//   uid: string | null;
// }
// interface NewTicket {
//   adminid: string | null;
//   departmentid: string | null;
//   employeeid: string;
//   issue: string;
//   details: string;
// }

const Tickets = () => {
  const [visible, setVisible] = useState(false);
  const [tickets, setTickets] = useState([]); // Removed Ticket[] type
  const [drawerHeight] = useState(new Animated.Value(height)); // Starting from bottom
  const [selectedValue, setSelectedValue] = useState('');
  const [ticketDes, setTicketDis] = useState('');
  const [sucessShow, setSuccessShow] = useState(false);
  const [mainScreen, setMain] = useState(true);
  const [buttonShow, setButtonShow] = useState(false);
  const [issueData, setIssueData] = useState(issue); // Assuming 'issue' is already defined
  const [isFocused, setIsFocused] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [newTicket, setNewTicketData] = useState({
    adminid: '',
    departmentid: '',
    employeeid: '',
    issue: '',
    details: '',
  });

  const options = [
    { label: 'Technical Issue', value: 'Technical Issue' },
    { label: 'Commission Issue', value: 'Commission Issue' },
    { label: 'Lead Issue', value: 'Lead Issue' },
  ];

  const drawerHeighte = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setVisible(true);
    Animated.timing(drawerHeighte, {
      toValue: height * 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerHeighte, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      setSelectedValue('');
      setIssueData({
        issueType: '',
        issueMessage: '',
      });
    });
  };

  const handleChange = (name, value) => {
    setIssueData({ ...issueData, [name]: value });
    if (issueData.issueType !== '' && issueData?.issueMessage !== '') {
      setButtonShow(true);
    } else {
      setButtonShow(false);
    }
  };
  const handleData = () => {
    console.log(issueData);
    setSuccessShow(true); // show success message
    setMain(false);
    setVisible(false);
    fetchTickets();
    setTimeout(() => {
      setSuccessShow(false); // show success message
      setMain(true); // hide main content
    }, 3000); // 5000 milliseconds = 5 seconds
  };

  const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

  //Fetch department data
  const fetchAdminData = async () => {
    try {
      const response = await fetch(
        'https://api.reparv.in/territory-partner/tickets/admins',
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
      console.log(newTicket.departmentid);
    }
  }, [newTicket.departmentid]);

  //Fetch department data
  const fetchDepartmentData = async () => {
    try {
      const response = await fetch(
        'https://api.reparv.in/territory-partner/tickets/departments',
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
  const fetchEmployeeData = async id => {
    try {
      const response = await fetch(
        'https://api.reparv.in/territory-partner/tickets/employees/' + id,
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

  const auth = useContext(AuthContext);
  const fetchTickets = async () => {
    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/tickets/`,
        {
          method: 'GET',
        },
      );

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const addTicket = async () => {
    console.log(newTicket);

    try {
      const response = await fetch(
        `https://api.reparv.in/territory-partner/tickets/add`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${auth?.user?.id}`, // token required for req.user.id to work
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTicket),
        },
      );

      if (response.status === 409) {
        Alert.alert('Ticket already exists!');
      } else if (!response.ok) {
        throw new Error(`Failed to save ticket. Status: ${response.status}`);
      } else {
        handleData();
      }

      // Clear form only after successful fetch
      setNewTicketData({
        adminid: '',
        departmentid: '',
        employeeid: '',
        issue: '',
        details: '',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error To Generate Ticket',
      });
      console.error('Error saving employee:', err);
    } finally {
    }
  };
  // const addTicket = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://api.reparv.in/territory-partner/tickets/add`,
  //       {
  //         method: 'POST',
  //         credentials: 'include',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(newTicket),
  //       },
  //     );

  //     if (response.status === 409) {
  //       Alert.alert('Ticket already exists!');
  //     } else if (!response.ok) {
  //       throw new Error(`Failed to save ticket. Status: ${response.status}`);
  //     } else {
  //       handleData();
  //     }

  //     // Clear form only after successful fetch
  //     setNewTicketData({
  //       adminid: '',
  //       departmentid: '',
  //       employeeid: '',
  //       issue: '',
  //       details: '',
  //     });
  //   } catch (err) {
  //     console.error('Error saving employee:', err);
  //   } finally {
  //   }
  // };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, []),
  );

  useEffect(() => {
    const interval = setInterval(fetchTickets, 5000); // fetch every 30s
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  useEffect(() => {
    //  fetchData();
    fetchAdminData();
    fetchDepartmentData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
      }}
    >
      {mainScreen && (
        <View
          style={{
            flex: 2,
            width: '100%',
            backgroundColor: 'white',
          }}
        >
          {/* Button to open the drawer */}
          <TouchableOpacity style={styles.button} onPress={openDrawer}>
            <View style={styles.innerContainer}>
              {/* White circle (Vector icon placeholder) */}
              <View style={styles.icon}>
                <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <Path
                    d="M6 8H1C0.71667 8 0.479337 7.904 0.288004 7.712C0.0966702 7.52 0.000670115 7.28267 3.44827e-06 7C-0.000663218 6.71734 0.0953369 6.48 0.288004 6.288C0.48067 6.096 0.718003 6 1 6H6V1C6 0.71667 6.096 0.479337 6.288 0.288004C6.48 0.0966702 6.71734 0.000670115 7 3.44827e-06C7.28267 -0.000663218 7.52034 0.0953369 7.713 0.288004C7.90567 0.48067 8.00134 0.718003 8 1V6H13C13.2833 6 13.521 6.096 13.713 6.288C13.905 6.48 14.0007 6.71734 14 7C13.9993 7.28267 13.9033 7.52034 13.712 7.713C13.5207 7.90567 13.2833 8.00134 13 8H8V13C8 13.2833 7.904 13.521 7.712 13.713C7.52 13.905 7.28267 14.0007 7 14C6.71734 13.9993 6.48 13.9033 6.288 13.712C6.096 13.5207 6 13.2833 6 13V8Z"
                    fill="white"
                  />
                </Svg>
              </View>
              {/* Button text */}
              <Text style={styles.buttonText}>New</Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              flex: 2,
              marginTop: 50,
              gap: 20,
            }}
          >
            <ScrollView>
              {Array.isArray(tickets) &&
                tickets.map((d, i) => (
                  <TicketCard
                    key={i}
                    issue={d.issue}
                    status={d.status}
                    ticketNo={d.ticketno}
                    adminName={d.admin_name}
                    employee={d.employee_name}
                    department={d.department}
                    adminid={d.adminid}
                    departmentid={d.departmentid}
                    employeeid={d.employeeid}
                    time={`Posted at ${d.created_at || 'Unknown time'}`}
                    ticket={d.ticketno}
                    ticketDes={d.details}
                    ticketId={d.ticketid}
                    newTicket={{
                      adminid: newTicket.adminid,
                      departmentid: newTicket.departmentid,
                      employeeid: newTicket.employeeid,
                      issue: newTicket.issue,
                      details: newTicket.details,
                    }}
                  />
                ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Bottom Drawer */}
      {visible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1}>
          <Animated.View style={[styles.drawer]}>
            {/* Drawer content */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.drawerContent}
            >
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    gap: 5,
                  }}
                >
                  <Text style={styles.title}>Create Quick Ticket</Text>
                  <Text style={styles.description}>
                    Write and address new queries and issues
                  </Text>
                </View>
                <TouchableOpacity onPress={closeDrawer}>
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill="gray"
                      fill-opacity="0.4"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 10,
                  color: '#00000066',
                  fontWeight: '500',
                }}
              >
                Issue Category
              </Text>

              {/* Select Issue */}
              <CustomPicker
                placeholder="Select Issue"
                selectedValue={selectedValue || newTicket.issue || ''}
                onValueChange={value => {
                  setSelectedValue(value);
                  setNewTicketData({ ...newTicket, issue: value });
                  handleChange('issueType', value);
                }}
                options={options}
                mytype={false}
              />

              <View style={{ width: '100%', marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#00000066',
                    fontWeight: '500',
                  }}
                >
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
                  }}
                >
                  <Picker
                    selectedValue={newTicket.adminid}
                    // enabled={newTicket.departmentid !== ''}
                    onValueChange={itemValue =>
                      setNewTicketData({ ...newTicket, adminid: itemValue })
                    }
                    style={{
                      fontSize: 16,
                      //  paddingVertical: 5,
                      // paddingHorizontal: 8,
                      color: '#000',
                    }}
                  >
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

              <View style={{ width: '100%', marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    // lineHeight: 18,
                    color: '#00000066',
                    fontWeight: '500',
                  }}
                >
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
                  }}
                >
                  <Picker
                    enabled={newTicket.adminid === ''}
                    selectedValue={newTicket.departmentid}
                    onValueChange={itemValue =>
                      setNewTicketData({
                        ...newTicket,
                        departmentid: itemValue,
                      })
                    }
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#000',
                      backgroundColor: 'transparent',
                    }}
                  >
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

              <View style={{ width: '100%' }}>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    color: '#00000066',
                    fontWeight: '500',
                  }}
                >
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
                  }}
                >
                  <Picker
                    enabled={newTicket.departmentid !== ''}
                    selectedValue={newTicket.employeeid}
                    onValueChange={itemValue =>
                      setNewTicketData({ ...newTicket, employeeid: itemValue })
                    }
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#000',
                      backgroundColor: 'transparent',
                    }}
                  >
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
              <Text style={styles.label}>Ticket Description:</Text>
              <TextInput
                style={[styles.textInput, { color: 'black' }]}
                placeholder={!isFocused ? 'Type ticket issue here..?' : ''}
                placeholderTextColor="gray"
                // value={ticketDes}
                // onFocus={() => setIsFocused(true)}
                // onBlur={() => setIsFocused(false)}
                onChangeText={value =>
                  setNewTicketData({ ...newTicket, details: value })
                }
                multiline
              />
              <TouchableOpacity
                // disabled={!buttonShow}
                onPress={addTicket}
                style={[styles.saveButton, { backgroundColor: '#0078DB' }]}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: `${!buttonShow ? 'white' : 'gray'}` },
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
              <View style={{ padding: 20 }}></View>
            </KeyboardAvoidingView>
          </Animated.View>
        </TouchableOpacity>
      )}

      {sucessShow && (
        <View style={Successtyles.container}>
          {/* Group 1000004239 (Circles) */}
          <View style={Successtyles.circleContainer}>
            {/* Ellipse 1511 */}
            <View style={Successtyles.ellipse1511} />
            {/* Ellipse 1513 */}
            <View style={Successtyles.ellipse1513} />
            {/* Ellipse 1512 */}
            <View style={Successtyles.ellipse1512} />
            {/* Success Icon */}
            <View style={Successtyles.successIcon}>
              <Svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <Path
                  d="M45 0C56.9347 0 68.3807 4.74106 76.8198 13.1802C85.2589 21.6193 90 33.0653 90 45C90 56.9347 85.2589 68.3807 76.8198 76.8198C68.3807 85.2589 56.9347 90 45 90C33.0653 90 21.6193 85.2589 13.1802 76.8198C4.74106 68.3807 0 56.9347 0 45C0 33.0653 4.74106 21.6193 13.1802 13.1802C21.6193 4.74106 33.0653 0 45 0ZM39.3943 53.8779L29.3979 43.875C29.0395 43.5166 28.614 43.2324 28.1458 43.0384C27.6776 42.8445 27.1757 42.7446 26.6689 42.7446C26.1621 42.7446 25.6603 42.8445 25.192 43.0384C24.7238 43.2324 24.2984 43.5166 23.94 43.875C23.2162 44.5988 22.8096 45.5804 22.8096 46.6039C22.8096 47.6275 23.2162 48.6091 23.94 49.3329L36.6686 62.0614C37.0259 62.4216 37.451 62.7075 37.9194 62.9026C38.3878 63.0977 38.8901 63.1981 39.3975 63.1981C39.9049 63.1981 40.4072 63.0977 40.8756 62.9026C41.344 62.7075 41.7691 62.4216 42.1264 62.0614L68.4836 35.6979C68.8467 35.341 69.1356 34.9157 69.3336 34.4466C69.5316 33.9775 69.6348 33.4739 69.6371 32.9647C69.6395 32.4556 69.541 31.951 69.3474 31.4801C69.1538 31.0092 68.8689 30.5812 68.509 30.221C68.1492 29.8607 67.7216 29.5753 67.2509 29.3811C66.7803 29.187 66.2758 29.0879 65.7666 29.0897C65.2575 29.0914 64.7537 29.194 64.2844 29.3914C63.815 29.5889 63.3895 29.8773 63.0321 30.24L39.3943 53.8779Z"
                  fill="#21BE79"
                />
              </Svg>
            </View>
          </View>

          {/* Success Text */}
          <Text style={Successtyles.title}>Your ticket has been raised</Text>
          <Text style={Successtyles.subtitle}>
            Our team will resolve it soon
          </Text>
        </View>
      )}

      <Toast />
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    left: '65%',

    top: 36,
    width: '25%',
    height: 40,
    backgroundColor: '#0078DB',
    borderRadius: 4,
    paddingVertical: 6,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8, // Note: "gap" support is limited in some React Native versions. Use spacing with margin if needed.
  },
  innerContainer: {
    flexDirection: 'row',
    marginInline: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 14,
    height: 14,
    marginInline: 'auto',
  },
  buttonText: {
    // width: 80,
    height: 26,
    marginInline: 'auto',
    fontFamily: 'Lato',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
    color: '#FFFFFF',
  },
  container: {},
  openButton: {
    backgroundColor: '#0078DB',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 90,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 60,
  },
  drawerContent: {
    marginTop: 20,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E2A40',
  },
  description: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  label: {
    fontSize: 14,
    color: '#2E2A40',
    marginVertical: 10,
  },
  inputBox: {
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },

  picker: {
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  selectedValue: {
    fontSize: 16,
    color: 'blue',
  },
  inputText: {
    color: 'rgba(0, 0, 0, 0.4)',
  },

  textInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FEFEFE',
    padding: 18,
    marginTop: 20,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,

    alignItems: 'center',
    backgroundColor: '#0078DB',
    padding: 12,
    borderRadius: 4,
  },
  closebuttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

const Drawerstyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 550,
    backgroundColor: '#F8F8F8',
  },
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
const Successtyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: 279,

    top: '40%',
    transform: [{ translateY: -279 / 2 - 0.5 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'absolute',
    width: 194,
    height: 194,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipse1511: {
    position: 'absolute',
    width: 194,
    height: 194,
    backgroundColor: '#E8F9F1',
    borderRadius: 194 / 2, // Circle
  },
  ellipse1513: {
    position: 'absolute',
    width: 162,
    height: 162,
    backgroundColor: '#D3F3E4',
    borderRadius: 162 / 2,
  },
  ellipse1512: {
    position: 'absolute',
    width: 125,
    height: 125,
    backgroundColor: '#C2EFDA',
    borderRadius: 125 / 2,
  },
  successIcon: {
    position: 'absolute',
    width: 90,
    height: 90,
    backgroundColor: '#FFFFFF',
    borderRadius: 90 / 2, // Circle
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#21BE79',
  },
  title: {
    position: 'absolute',
    top: 250,
    width: 'auto',
    height: 30,
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
  },
  subtitle: {
    position: 'absolute',
    top: 282,
    width: 'auto',
    height: 19,
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.4)',
  },
});

export default Tickets;
