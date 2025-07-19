import React, { useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns';

import { Calendar1 } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
//import { FilterIcon } from 'lucide-react-native';

const shortcuts = [
  { label: 'Today', getValue: () => [new Date(), new Date()] },
  {
    label: 'This week',
    getValue: () => [startOfWeek(new Date()), endOfWeek(new Date())],
  },
  {
    label: 'This month',
    getValue: () => [startOfMonth(new Date()), endOfMonth(new Date())],
  },
  {
    label: 'This year',
    getValue: () => [
      new Date(new Date().getFullYear(), 0, 1),
      new Date(new Date().getFullYear(), 11, 31, 23, 59, 59),
    ],
  },
  { label: 'Set up', getValue: () => [new Date(), new Date()] },
];

const formatDate = d => format(d, 'dd/MM/yyyy');

const EnquiryCustomeDatePicker = () => {
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState({ startDate: null, endDate: null });
  const [selectedShortcut, setSelectedShortcut] = useState(null);

  // build <Calendar> marking object each render
  const markedDates = useMemo(() => {
    const { startDate, endDate } = range;
    if (!startDate) return {};

    // helper to iterate dates
    const dates = {};
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = format(d, 'yyyy-MM-dd');
      dates[key] = {
        color: '#16a34a',
        textColor: '#fff',
        startingDay: key === format(start, 'yyyy-MM-dd'),
        endingDay: key === format(end, 'yyyy-MM-dd'),
      };
    }
    return dates;
  }, [range]);

  const auth = useContext(AuthContext);

  const onDaySelect = day => {
    const date = day.dateString; // Format: 'yyyy-MM-dd'
    const { startDate, endDate } = range;

    if (!startDate || (startDate && endDate)) {
      // First tap OR restarting the range
      setRange({ startDate: date, endDate: null });
      auth?.setDateRange({ startDate: date, endDate: date });
    } else {
      // Second tap
      if (date < startDate) {
        // Tapped before start -> swap
        setRange({ startDate: date, endDate: startDate });
        auth?.setDateRange({ startDate: date, endDate: startDate });
      } else {
        // Normal range
        setRange({ startDate, endDate: date });
        auth?.setDateRange({ startDate, endDate: date }); // ✅ This was missing
      }
    }
  };

  const applyShortcut = sc => {
    const [start, end] = sc.getValue().map(d => format(d, 'yyyy-MM-dd'));
    setRange({ startDate: start, endDate: end });
    auth?.setDateRange({ startDate: start, endDate: end });
    setSelectedShortcut(sc.label);
  };

  const reset = () => {
    setRange({ startDate: null, endDate: null });
    auth?.setDateRange({ startDate: null, endDate: null });
    setSelectedShortcut(null);
  };

  const formattedLabel =
    range.startDate && range.endDate
      ? `${formatDate(new Date(range.startDate))} - ${formatDate(
          new Date(range.endDate),
        )}`
      : 'Select Date Range';

  //console.log(auth?.dateRange,'dd');

  return (
    <View style={styles.container}>
      {/* Toggle button */}
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        {/* <Text style={styles.toggleText}>{formattedLabel}</Text> */}
        {/* Change this to your own SVG/PNG asset */}
        {/* <Image
          source={require('../assets/overview/calender.png')}
          style={styles.icon}
        /> */}
        <Calendar1 />
      </TouchableOpacity>

      {/* Modal with picker */}
      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />

        <View style={styles.modalContent}>
          {/* Short‑cut column */}
          <ScrollView style={styles.shortcutCol}>
            {shortcuts.map(sc => (
              <TouchableOpacity
                key={sc.label}
                style={[
                  styles.shortcutItem,
                  selectedShortcut === sc.label && styles.shortcutActive,
                ]}
                onPress={() => applyShortcut(sc)}
              >
                {/* fake radio */}
                <View
                  style={[
                    styles.radioOuter,
                    selectedShortcut === sc.label && styles.radioOuterActive,
                  ]}
                >
                  {selectedShortcut === sc.label && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.shortcutText,
                    selectedShortcut === sc.label && styles.shortcutTextActive,
                  ]}
                >
                  {sc.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Calendar */}
          <Calendar
            style={styles.calendar}
            markingType="period"
            markedDates={markedDates}
            onDayPress={onDaySelect}
            enableSwipeMonths
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              reset();
              setVisible(false);
            }}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.apply}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default EnquiryCustomeDatePicker;

// ────────────────────────────────────────────────
//  Styles
// ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  toggle: {
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0000001A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 19,
    paddingHorizontal: 16,
    gap: 8,
    marginInline: 10,
    marginTop: 2,
    width: 40,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  icon: { width: 18, height: 18, resizeMode: 'contain' },

  // modal
  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  modalContent: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    width: 320,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 12,
  },
  shortcutCol: {
    width: 110,
    backgroundColor: '#F9FAFB',
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  shortcutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  shortcutActive: {
    backgroundColor: '#DCFCE7',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0078DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#0078DB' },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0078DB',
  },
  shortcutText: { fontSize: 14, color: '#111827' },
  shortcutTextActive: { color: '#15803D', fontWeight: '600' },

  calendar: {},

  modalWrapper: {
    //position: 'absolute',
    //top: 120,
    alignSelf: 'center',
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 12,
  },
  modalContent: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    //justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 16,
  },

  cancel: {
    fontSize: 14,
    color: '#374151',
  },
  apply: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#0078DB',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
});
