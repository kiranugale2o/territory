import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Linking,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Svg, {Path} from 'react-native-svg';
import CustomPicker from '../../component/CustomPicker';
import DateSelectPopup from '../../component/DateSelectedPopup';
import {RootStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import PostNotification from '../../component/PostNotification';
import {AuthContext} from '../../context/AuthContext';
import {calanderOprtions, formatDateToShort} from '../../utils';
import CalanderCard from '../../component/CalanderCard';

/* ----------------------------------------------------------------- */
/* ----------  TYPES & CONSTANTS  ---------------------------------- */
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export interface MeetingFollowUp {
  followupid: number;
  visitdate: string | null;
  remark: string;
  status: string;
  changestatus: number;
  propertyName: string;
  customer: string;
  contact: string;
  fullname: string;
}

const ScheduleData = {
  cname: '',
  cnumber: '',
  eventstatus: '',
  pname: '',
  pdate: '',
};

const screenHeight = Dimensions.get('window').height;
const {height} = Dimensions.get('window');

/* ----------------------------------------------------------------- */
/* ----------  COMPONENT  ------------------------------------------ */
const CalenderComponent: React.FC = () => {
  /* ----- Navigation & Context ----- */
  const navigation = useNavigation<NavigationProp>();
  const auth = useContext(AuthContext);

  /* ----- UI / Drawer states ----- */
  const [visible, setVisible] = useState(false);
  const drawerHeighte = useRef(new Animated.Value(0)).current;

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [ticketDes, setTicketDis] = useState<string>('');
  const [sucessShow, setSuccessShow] = useState<boolean>(false);
  const [mainScreen, setMain] = useState<boolean>(true);
  const [buttonShow, setButtonShow] = useState<boolean>(false);
  const [scheduleVisit, setScheduleVisit] =
    useState<typeof ScheduleData>(ScheduleData);

  /* ----- Calendar & Meetings ----- */
  const todayStr = new Date().toISOString().split('T')[0];
  const [meeting, setMeetings] = useState<MeetingFollowUp[]>([]);
  const [updatedMeeting, setUpdatedMeetings] = useState<MeetingFollowUp[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [popupVisible, setPopupVisible] = useState(false);

  /* ----------------------------------------------------------------- */
  /* ----------  DATA FETCH  ----------------------------------------- */
  const fetchMeetings = async () => {
    try {
      const response = await fetch(
        'https://api.reparv.in/territory-partner/calender/meetings',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth?.token}`,
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        console.error('API error:', data.message);
        Alert.alert('Error', data.message);
        return;
      }
      setMeetings(data);
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Error', 'Failed to fetch meetings');
    }
  };

  /* ----- First fetch (runs once) ----- */
  useEffect(() => {
    fetchMeetings();
  }, []);

  /* ----- When meetings arrive: pre‑filter for today ----- */
  useEffect(() => {
    if (meeting.length > 0) {
      const todayVisits = meeting.filter(
        m => m.visitdate?.slice(0, 10) === todayStr,
      );
      setUpdatedMeetings(todayVisits);
      setSelectedDate(todayStr);
    } else {
      setUpdatedMeetings([]);
      setSelectedDate(todayStr);
    }
  }, [meeting, todayStr]);

  /* ----------------------------------------------------------------- */
  /* ----------  CALENDAR MARKING  ----------------------------------- */
  const markedDates = useMemo(() => {
    const marks: {[key: string]: any} = {};

    meeting.forEach(item => {
      const date = item.visitdate?.slice(0, 10);
      if (!date) return;
      const isPast = new Date(date) < new Date(todayStr);
      marks[date] = {
        ...(marks[date] || {}),
        dots: [{key: 'visit', color: isPast ? 'red' : 'gold'}],
      };
    });

    /* Highlight today */
    marks[todayStr] = {
      ...(marks[todayStr] || {}),
      selected: true,
      selectedColor: '#0078DB',
      selectedTextColor: '#fff',
    };

    /* Highlight user‑selected date if different from today */
    if (selectedDate && selectedDate !== todayStr) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#00A36C',
        selectedTextColor: '#fff',
        dots: [], // remove dot so text is legible
      };
    }
    return marks;
  }, [meeting, selectedDate, todayStr]);

  /* ----------------------------------------------------------------- */
  /* ----------  EVENT HANDLERS  ------------------------------------- */
  const handleDayPress = (day: any) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);

    const list = meeting.filter(m => m.visitdate?.slice(0, 10) === dateStr);
    setUpdatedMeetings(list);
  };

  /* ----------------------------------------------------------------- */
  /* ----------  RENDER  --------------------------------------------- */
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* ---------------- Calendar ---------------- */}
      <View style={styles.container}>
        <View style={styles.calendarWrapper}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              calendarBackground: '#FFFFFF',
              textSectionTitleColor: '#000',
              dayTextColor: '#000',
              todayTextColor: '#000',
              textDisabledColor: 'gray',
              arrowColor: '#000',
              monthTextColor: '#000',
              textMonthFontWeight: '700',
              textDayFontWeight: '500',
              textDayFontSize: 13,
              textMonthFontSize: 14,
              textDayHeaderFontSize: 12,
            }}
            style={styles.calendar}
          />
        </View>

        {/* -------- Upcoming Visits Heading -------- */}
        <Text style={[styles.heading, {marginTop: 24}]}>Upcoming Visits</Text>

        {/* -------- Visit Cards / Fallback -------- */}
        <ScrollView
          style={{marginTop: 12}}
          contentContainerStyle={{paddingBottom: 40}}>
          {updatedMeeting.length ? (
            updatedMeeting.map((d, i) => <CalanderCard key={i} d={d} />)
          ) : (
            <Text style={styles.noVisitText}>No visit scheduled</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

/* ----------------------------------------------------------------- */
/* ----------  STYLES  --------------------------------------------- */
const styles = StyleSheet.create({
  /* container piece reused from your original code */
  container: {
    flex: 1,
    padding: 16,
  },
  calendarWrapper: {
    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 0.5,
    borderRadius: 16,
    elevation: 1,
    paddingVertical: 10,
  },
  calendar: {
    width: 320,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  noVisitText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: 'gray',
  },
});

export default CalenderComponent;
