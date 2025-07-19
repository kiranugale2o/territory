import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const itemHeight = 40;
const visibleItems = 3;
const pickerHeight = itemHeight * visibleItems;

const DateSelectPopup = ({ visible, onCancel, onOk }) => {
  /* ---------- helpers ---------- */
  const today = useMemo(() => new Date(), []);
  const thisYear = today.getFullYear();
  const thisMonthIx = today.getMonth(); // 0‑based
  const thisDay = today.getDate(); // 1‑31

  /** How many days in a month? */
  const daysInMonth = useCallback(
    (monthIx, year) => new Date(year, monthIx + 1, 0).getDate(),
    [],
  );

  /* ---------- state ---------- */
  const [year, setYear] = useState(thisYear.toString());
  const [month, setMonth] = useState(monthLabels[thisMonthIx]);
  const [day, setDay] = useState(String(thisDay).padStart(2, '0'));

  /* ---------- refs (for scrollToIndex) ---------- */
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  /* ---------- dynamic data ---------- */
  /** years: thisYear … 2027 */
  const years = useMemo(
    () =>
      Array.from({ length: 2027 - thisYear + 1 }, (_, i) =>
        (thisYear + i).toString(),
      ),
    [thisYear],
  );

  /** months depends on the selected year */
  const months = useMemo(() => {
    if (parseInt(year, 10) === thisYear) {
      return monthLabels.slice(thisMonthIx); // current month → Dec
    }
    return monthLabels; // all months
  }, [year, thisYear, thisMonthIx]);

  /** days depend on selected month & year */
  const days = useMemo(() => {
    const monthIx = monthLabels.indexOf(month);
    const totalDays = daysInMonth(monthIx, parseInt(year, 10));
    const startFrom =
      parseInt(year, 10) === thisYear && monthIx === thisMonthIx
        ? thisDay // today, not past
        : 1;
    return Array.from({ length: totalDays - startFrom + 1 }, (_, i) =>
      String(startFrom + i).padStart(2, '0'),
    );
  }, [month, year, daysInMonth, thisYear, thisMonthIx, thisDay]);

  /* ---------- keep selection valid ---------- */
  useEffect(() => {
    if (!years.includes(year)) {
      setYear(years[0]);
    }
  }, [years, year]);

  useEffect(() => {
    if (!months.includes(month)) {
      setMonth(months[0]);
    }
  }, [months, month]);

  useEffect(() => {
    if (!days.includes(day)) {
      setDay(days[0]);
    }
  }, [days, day]);

  /* ---------- jump to the correct rows when the modal opens ---------- */
  useEffect(() => {
    if (!visible) return;
    const yIndex = years.indexOf(year);
    const mIndex = months.indexOf(month);
    const dIndex = days.indexOf(day);

    if (yearRef.current && yIndex >= 0)
      yearRef.current.scrollToIndex({ index: yIndex, animated: false });
    if (monthRef.current && mIndex >= 0)
      monthRef.current.scrollToIndex({ index: mIndex, animated: false });
    if (dayRef.current && dIndex >= 0)
      dayRef.current.scrollToIndex({ index: dIndex, animated: false });
  }, [visible, years, months, days, year, month, day]);

  /* ---------- generic wheel renderer ---------- */
  const renderPicker = (data, selected, setSelected, ref) => (
    <View style={[styles.pickerContainer, { height: pickerHeight }]}>
      <FlatList
        ref={r => (ref.current = r)}
        data={data}
        keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentContainerStyle={{
          paddingVertical: (pickerHeight - itemHeight) / 2,
        }}
        onMomentumScrollEnd={e => {
          const offsetY = e.nativeEvent.contentOffset.y;
          const idx = Math.round(offsetY / itemHeight);
          setSelected(data[idx]);
        }}
        renderItem={({ item }) => (
          <View style={{ height: itemHeight, justifyContent: 'center' }}>
            <Text
              style={[
                styles.item,
                item === selected ? styles.selected : styles.faded,
              ]}
            >
              {item}
            </Text>
          </View>
        )}
      />
      {/* top & bottom separator lines */}
      <View
        style={[
          styles.highlightLine,
          { top: pickerHeight / 2 - itemHeight / 2 },
        ]}
      />
      <View
        style={[
          styles.highlightLine,
          { top: pickerHeight / 2 + itemHeight / 2 },
        ]}
      />
    </View>
  );

  /* ---------- render ---------- */
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.centered}>
        <View style={styles.popup}>
          <Text style={styles.selectedDate}>{`${day} ${month} ${year}`}</Text>

          <View style={styles.dateRow}>
            {renderPicker(days, day, setDay, dayRef)}
            {renderPicker(months, month, setMonth, monthRef)}
            {renderPicker(years, year, setYear, yearRef)}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onOk({ day, month, year })}>
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateSelectPopup;

/* ───────────────────────── styles (unchanged) ───────────────────────── */
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popup: {
    width: 274,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    gap: 24,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.02,
    color: 'black',
    textAlign: 'center',
  },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 2 },
  pickerContainer: { width: 74, position: 'relative', overflow: 'hidden' },
  item: { width: 74, textAlign: 'center', fontSize: 16, fontWeight: '500' },
  faded: { color: 'rgba(0,0,0,0.4)' },
  selected: { color: 'black', fontWeight: '600' },
  highlightLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#000',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 24 },
  buttonText: { fontSize: 16, fontWeight: '500', color: '#000' },
});
