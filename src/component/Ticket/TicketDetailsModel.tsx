import {Picker} from '@react-native-picker/picker';
import {X} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, TextInput} from 'react-native';

interface NewTicket {
  adminid: string;
  departmentid: string;
  employeeid: string;
  issue: string;
  details: string;
}

interface TicketDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  ticketData: {
    ticketNo: string;
    adminName: string;
    department: string;
    employee: string;
    issue: string;
    description: string;
  };
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  visible,
  onClose,
  ticketData,
}) => {
  const [adminData, setAdminData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [newTicket, setNewTicketData] = useState<NewTicket>({
    adminid: '',
    departmentid: '',
    employeeid: '',
    issue: '',
    details: '',
  });
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
                color:'blacks'
              }}>
              Ticket Details
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'column', marginBottom: 10, gap: 5}}>
            <Text style={{fontWeight: '600', width: 100, color: '#333'}}>
              Ticket No
            </Text>
            <View
              style={[
                {
                  backgroundColor: `${`#0078DB`}20`,
                  borderRadius: 20,
                  // width: '30%',
                  padding: 15,
                },
              ]}>
              <Text
                style={[
                  {
                    color: `#0078DB`,
                    width: '100%',
                  },
                ]}>
                {ticketData?.ticketNo}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'column', marginBottom: 10, gap: 5}}>
            <Text style={{fontWeight: '600', width: 100, color: '#333'}}>
              Issue
            </Text>
            <View
              style={[
                {
                  backgroundColor: `${`#0078DB`}20`,
                  borderRadius: 20,
                  // width: '30%',
                  padding: 15,
                },
              ]}>
              <Text
                style={[
                  {
                    color: `#0078DB`,
                    width: '100%',
                  },
                ]}>
                {ticketData?.issue}
              </Text>
            </View>
          </View>

          {ticketData?.adminName !== null && (
            <View style={{flexDirection: 'column', marginBottom: 10, gap: 5}}>
              <Text style={{fontWeight: '600', width: 100, color: '#333'}}>
                Admin
              </Text>
              <View
                style={[
                  {
                    backgroundColor: `${`#0078DB`}20`,
                    borderRadius: 20,
                    // width: '30%',
                    padding: 15,
                  },
                ]}>
                <Text
                  style={[
                    {
                      color: `#0078DB`,
                      width: '100%',
                    },
                  ]}>
                  {ticketData?.adminName}
                </Text>
              </View>
            </View>
          )}
          {ticketData?.department !== null && (
            <View style={{flexDirection: 'column', marginBottom: 10, gap: 5}}>
              <Text style={{fontWeight: '600', width: 100, color: '#333'}}>
                Department
              </Text>
              <View
                style={[
                  {
                    backgroundColor: `${`#0078DB`}20`,
                    borderRadius: 20,
                    // width: '30%',
                    padding: 15,
                  },
                ]}>
                <Text
                  style={[
                    {
                      color: `#0078DB`,
                      width: '100%',
                    },
                  ]}>
                  {ticketData?.department}
                </Text>
              </View>
            </View>
          )}

          {ticketData.employee !== null && (
            <View style={{flexDirection: 'column', marginBottom: 10, gap: 5}}>
              <Text style={{fontWeight: '600', width: 100, color: '#333'}}>
                Employee Name
              </Text>
              <View
                style={[
                  {
                    backgroundColor: `${`#0078DB`}20`,
                    borderRadius: 20,
                    // width: '30%',
                    padding: 15,
                  },
                ]}>
                <Text
                  style={[
                    {
                      color: `#0078DB`,
                      width: '100%',
                    },
                  ]}>
                  {ticketData?.employee}
                </Text>
              </View>
            </View>
          )}

          <View style={{flexDirection: 'column', marginBottom: 10, gap: 5}}>
            <Text style={{fontWeight: '600', width: 100, color: '#333'}}>
              Ticket description
            </Text>
            <View
              style={[
                {
                  backgroundColor: `${`#0078DB`}20`,
                  borderRadius: 20,
                  // width: '30%',
                  padding: 15,
                },
              ]}>
              <Text
                style={[
                  {
                    color: `#0078DB`,
                    width: '100%',
                  },
                ]}>
                {ticketData?.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TicketDetailsModal;
