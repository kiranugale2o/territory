import {Picker} from '@react-native-picker/picker';
import {EllipsisVertical} from 'lucide-react-native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import TicketDetailsModal from './Ticket/TicketDetailsModel';
import TicketUpdateModel from './Ticket/TicketUpdateModel';
import ConfirmDeleteModal from './Ticket/ConfirmDeleteModal';

type TicketCardProps = {
  issue: string;
  status: 'Open' | 'Closed' | 'In_Progress';
  ticketNo: string;
  adminName: string;
  employee: string;
  department: string;
  ticket: string;
  time: string;
  ticketDes: string;
  ticketId: number;
  adminid: number;
  departmentid: number;
  employeeid: number;
  newTicket: {
    adminid: string;
    departmentid: string;
    employeeid: string;
    issue: string;
    details: string;
    adminData: string;
  };
};
const TicketCard: React.FC<TicketCardProps> = ({
  issue,
  status,
  ticketNo,
  adminName,
  employee,
  department,
  ticket,
  time,
  ticketDes,
  ticketId,
  adminid,
  departmentid,
  employeeid,
  newTicket,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const [TicketViewVisible, setTicketViewVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState({
    ticketNo: '',
    department: '',
    issue: '',
    description: '',
    adminid: '',
    departmentid: '',
    employeeid: '',
    ticketId: '',
  });
  const [updateView, setUpdateView] = useState(false);
  const options = ['View', 'Update', 'Delete'];
  const handleSelect = (option: any) => {
    setSelectedOption(option);
    if (option === 'View') {
      setSelectedTicket({
        ticketNo,
        adminName,
        department,
        employee,
        issue,
        description: ticketDes,
      });
      setTicketViewVisible(true);
    }

    if (option === 'Delete') {
      setShowDeleteModal(true);
    }

    if (option === 'Update') {
      setSelectedTicket({
        ticketNo,
        adminName,
        department,
        employee,
        issue,
        description: ticketDes,
        adminid,
        departmentid,
        employeeid,
        ticketId,
      });
      setUpdateView(true);
    }
    setModalVisible(false); // close after selection
    // You can call API here to submit
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    // Your delete logic
    del(ticketId);
    setShowDeleteModal(false);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const del = async (id: any) => {
    // (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const response = await fetch(
        `https://api.reparv.in/partner/tickets/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (response.ok) {
        //alert('Ticket deleted successfully!');
        // fetchData();
      } else {
        //lertlert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting :', error);
    }
  };

  return (
    <View style={[styles.cardWrapper,  borderColorStyles[status] ]}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={[styles.statusDot, dotColorStyles[status]]} />
        <Text style={styles.ticketTitle}>Ticket #{ticket}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <EllipsisVertical size={20} />
        </TouchableOpacity>
      </View>

      {/* Modal for select menu */}
      {/* Popup Modal with direct checkbox-like list */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.popupMenu}>
            <Text style={styles.popupTitle}>Action</Text>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.optionItem}
                onPress={() => handleSelect(option)}>
                <View style={styles.checkbox}>
                  {selectedOption === option && (
                    <View style={styles.checkedDot} />
                  )}
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Ticket Content */}
      <Text style={styles.issueTitle}>{issue}</Text>
      <Text style={styles.issueDesc}>{ticketDes}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.postedAt}>{time}</Text>
        <Text style={[styles.statusText, statusTextColor[status]]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>

      <TicketDetailsModal
        visible={TicketViewVisible}
        onClose={() => setTicketViewVisible(false)}
        ticketData={selectedTicket}
      />

      <TicketUpdateModel
        visible={updateView}
        onClose={() => setUpdateView(false)}
        ticketData={selectedTicket}
      />

      <ConfirmDeleteModal
        visible={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
    </View>
  );
};

const dotColorStyles = StyleSheet.create({
  Open: {backgroundColor: '#0078DB'},
  Closed: {backgroundColor: '#FF4D4F'},
   Resolved: { backgroundColor: '#0BB501' },
  In_Progress: {backgroundColor: 'yellow'},
  Pending:{backgroundColor:'red'}
});

const borderColorStyles = StyleSheet.create({
  Open:        { borderLeftColor: '#0078DB' },
  Closed:      { borderLeftColor: '#FF4D4F' },
  Resolved:    { borderLeftColor: '#0BB501' },
  In_Progress: { borderLeftColor: 'yellow' },
  Pending:     { borderLeftColor: 'red' },
});


const statusTextColor = StyleSheet.create({
  Open: {color: '#0078DB'},
  Resolved:   {color: '#0BB501'},
  Closed: {color: '#FF4D4F'},
  In_Progress: {color: 'yellow'},
Pending: {color: 'red'},
});

const styles = StyleSheet.create({
 cardWrapper: {
  marginTop: 15,
  marginHorizontal: 'auto',
  width: '90%',
  backgroundColor: '#FFFFFF',

  borderWidth: 1,
  borderColor: '#E7E7E7',
  borderLeftWidth: 5,              // Emphasized left border

  borderTopLeftRadius: 12,         // Rounded only left side
  borderBottomLeftRadius: 12,

  borderTopRightRadius: 4,         // Optional: slightly round other corners
  borderBottomRightRadius: 4,

  padding: 12,
},


  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 16,
    height: 16,
    backgroundColor: '#FFCA00',
    borderRadius: 8,
    marginRight: 8,
  },
  ticketTitle: {
    //fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
    color: '#2E2C34',
    flex: 1,
  },
  editIcon: {
    width: 12,
    height: 12,
    opacity: 9,
    color: 'red',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupMenu: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color:'black'
  },
  picker: {
    height: 50,
    width: '100%',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    color:'black'
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedDot: {
    width: 10,
    height: 10,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  optionText: {
    fontSize: 14,
    color:'black'
  },
  issueTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
    color: '#2E2C34',
    marginBottom: 4,
  },
  issueDesc: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '500',
    color: '#84818A',
    lineHeight: 14,
    marginBottom: 12,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
    marginVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedAt: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '500',
    color: '#84818A',
  },
  statusText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFCA00',
    
  },
});

export default TicketCard;
