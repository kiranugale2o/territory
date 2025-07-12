import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";

const days = Array.from({ length: 31 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const years = ["2023", "2024", "2025", "2026", "2027"];

export default function DateSelectPopup({ visible, onCancel, onOk }) {
  const now = new Date();

  const [selectedDay, setSelectedDay] = useState(
    now.getDate().toString().padStart(2, "0")
  );
  const [selectedMonth, setSelectedMonth] = useState(months[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear().toString());

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const itemHeight = 40;
  const visibleItems = 3;
  const pickerHeight = itemHeight * visibleItems;

  const renderPicker = (data, selected, setSelected, ref) => (
    <View style={[styles.pickerContainer, { height: pickerHeight }]}>
      <FlatList
        ref={(r) => (ref.current = r)}
        data={data}
        keyExtractor={(item) => item}
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
        onMomentumScrollEnd={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const index = Math.round(offsetY / itemHeight);
          setSelected(data[index]);
        }}
        renderItem={({ item }) => (
          <View
            style={{
              height: itemHeight,
              justifyContent: "center",
            }}
          >
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
      <View
        style={[styles.highlightLine, { top: pickerHeight / 2 - itemHeight / 2 }]}
      />
      <View
        style={[styles.highlightLine, { top: pickerHeight / 2 + itemHeight / 2 }]}
      />
    </View>
  );

  useEffect(() => {
    if (dayRef.current) {
      const dayIndex = days.indexOf(selectedDay);
      if (dayIndex >= 0) {
        dayRef.current.scrollToIndex({ index: dayIndex, animated: false });
      }
    }
    if (monthRef.current) {
      const monthIndex = months.indexOf(selectedMonth);
      if (monthIndex >= 0) {
        monthRef.current.scrollToIndex({ index: monthIndex, animated: false });
      }
    }
    if (yearRef.current) {
      const yearIndex = years.indexOf(selectedYear);
      if (yearIndex >= 0) {
        yearRef.current.scrollToIndex({ index: yearIndex, animated: false });
      }
    }
  }, [visible, selectedDay, selectedMonth, selectedYear]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.centered}>
        <View style={styles.popup}>
          <Text style={styles.selectedDate}>
            {`${selectedDay} ${selectedMonth} ${selectedYear}`}
          </Text>

          <View style={styles.dateRow}>
            {renderPicker(days, selectedDay, setSelectedDay, dayRef)}
            {renderPicker(months, selectedMonth, setSelectedMonth, monthRef)}
            {renderPicker(years, selectedYear, setSelectedYear, yearRef)}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onOk({
                  day: selectedDay,
                  month: selectedMonth,
                  year: selectedYear,
                })
              }
            >
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popup: {
    width: 274,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    gap: 24,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.02,
    color: "#000",
    textAlign: "center",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
  },
  pickerContainer: {
    width: 74,
    position: "relative",
    overflow: "hidden",
  },
  item: {
    width: 74,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  faded: {
    color: "rgba(0, 0, 0, 0.4)",
  },
  selected: {
    color: "#000",
    fontWeight: "600",
  },
  highlightLine: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});
