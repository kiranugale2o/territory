import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {X} from 'lucide-react-native'; // Optional close icon

const {width} = Dimensions.get('window');

interface ConfirmBookingPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmBookingPopup: React.FC<ConfirmBookingPopupProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <X size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Confirm Booking</Text>
              <Text style={styles.subtitle}>
                You are about to book A-101 with an initial payment.
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Booking Amount</Text>
              <Text style={styles.value}>₹1.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>GST (18%)</Text>
              <Text style={styles.value}>₹0.18</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹1.18</Text>
            </View>

            <Text style={styles.note}>
              By proceeding, you agree to pay the booking amount of ₹1 + 18%
              GST. The remaining amount will be due as per the payment schedule.
            </Text>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirm Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmBookingPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupContainer: {
    width: '95%',
    height: 407,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    alignItems: 'center',
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  contentContainer: {
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: '#000000',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    marginTop: 4,
  },
  row: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  value: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'right',
  },
  totalLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalValue: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'right',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginVertical: 8,
  },
  note: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.4)',
    lineHeight: 15,
    textAlign: 'center',
    marginVertical: 12,
  },
  confirmBtn: {
    width: '90%',
    height: 48,
    backgroundColor: '#0068FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmText: {
    fontFamily: 'Mukta',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  cancelBtn: {
    width: '90%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'Mukta',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});
