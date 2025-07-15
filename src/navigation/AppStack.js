import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import ClientInfoCard from "../component/ClientInfoCard";
// import AddClientScreen from "../screen/Home/AddClientScreen";
// import Booking from "../screen/Booking";
// import Community from "../screen/Community";
import Profile from "../screen/Profile";
// import BookingFlats from "../screen/Booking/Flat";
// import UserProfile from "../screen/Community/Profile";
// import NewPost from "../screen/Community/NewPost";
// import Refer from "../screen/Profile/refer";
// import Tickets from "../screen/Profile/tickets";
// import territoryPartner from "../screen/Home/territoryPartner";
// import SelectterritoryPartner from "../screen/Home/SelectPartner";
// import ConfirmMeetingCard from "../screen/Home/ConfirmMeetingCard";
// import SuccessScreen from "../screen/Home/SuccessScreen";
// import FlatInfo from "../screen/Booking/FlatInfo";
// import CalenderComponent from "../screen/Calender";
import Svg, { Path } from "react-native-svg";
import React, { useContext, useEffect, useState } from "react";
import { Image, Keyboard, SafeAreaView, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
//import { AuthContext } from "../context/AuthContext";
import LinearGradient from "react-native-linear-gradient";
import Home from "../screen/Home";
import AddClientScreen from "../screen/Home/AddClientScreen";
import Schedule from "../screen/Home/schedule";
import Booking from "../screen/Booking";

import Community from "../screen/Community";
import UserProfile from "../screen/Community/Profile";
import NewPost from "../screen/Community/NewPost";
import Refer from "../screen/Profile/refer";
import Tickets from "../screen/Profile/tickets";
import CalenderComponent from "../screen/Calender";
import BookingFlats from "../screen/Booking/Flat";
import FlatInfo from "../screen/Booking/FlatInfo";
import PropertyDetails from "../screen/Home/propertyDetails";
import { AuthContext } from "../context/AuthContext";
import KYC from "../screen/Profile/kyc";
import PostDetailScreen from "../component/community/PostDetails";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Hide tab bar when keyboard is shown
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Show tab bar when keyboard is hidden
      }
    );

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#0078DB", // active tab label color

        tabBarInactiveTintColor: "gray", // inactive tab label color
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "normal",
        },
        tabBarStyle: {
          display: keyboardVisible ? "none" : "flex",

          height: 60, // <-- Increase tab bar height here
          paddingBottom: 5, // Optional: adjust padding
          paddingTop: 5, // Optional: spacing for icon and label
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{
          headerTitle: "Dashboard",
          headerShadowVisible: false,

          headerStyle: {
            backgroundColor: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <View>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9.30657 10.886C9.42351 10.8184 9.52062 10.7213 9.58812 10.6044C9.65562 10.4874 9.69115 10.3548 9.69112 10.2197V3.29785C9.69043 3.17523 9.66043 3.05456 9.60363 2.94589C9.54683 2.83722 9.46487 2.7437 9.36458 2.67314C9.2643 2.60259 9.14859 2.55703 9.02712 2.54027C8.90565 2.52352 8.78194 2.53605 8.66629 2.57682C6.42147 3.37131 4.53366 4.94049 3.34223 7.00228C2.1508 9.06406 1.7339 11.4832 2.16646 13.8249C2.18888 13.946 2.24005 14.0599 2.31567 14.1571C2.39129 14.2543 2.48914 14.3319 2.601 14.3834C2.7018 14.4306 2.81178 14.4549 2.92306 14.4546C3.05805 14.4546 3.19067 14.4191 3.30761 14.3517L9.30657 10.886ZM8.15292 4.46303V9.77558L3.54987 12.4318C3.53834 12.2867 3.53834 12.1406 3.53834 11.9983C3.5397 10.4393 3.97123 8.91088 4.78542 7.58138C5.59961 6.25188 6.76488 5.17283 8.15292 4.46303ZM21.9967 11.9983C21.9974 14.1932 21.2759 16.3274 19.9434 18.0716C18.6109 19.8157 16.7414 21.073 14.6235 21.6492C12.5055 22.2255 10.2568 22.0889 8.22428 21.2603C6.19173 20.4318 4.48831 18.9574 3.37683 17.0647C3.32501 16.9773 3.29104 16.8804 3.27687 16.7798C3.2627 16.6792 3.26861 16.5767 3.29427 16.4784C3.31992 16.3801 3.36481 16.2878 3.42634 16.2069C3.48787 16.126 3.56482 16.0582 3.65274 16.0072L11.2293 11.5974V2.7691C11.2293 2.56512 11.3103 2.3695 11.4546 2.22526C11.5988 2.08103 11.7944 2 11.9984 2C13.7432 2.00089 15.4574 2.45813 16.9708 3.32631C18.4842 4.1945 19.7442 5.44344 20.6258 6.94914C20.6363 6.96452 20.6459 6.97991 20.6556 6.99625C20.6652 7.01259 20.6748 7.03182 20.6834 7.04912C21.5461 8.55576 21.9989 10.2621 21.9967 11.9983Z"
                  fill={color}
                  fill-opacity="0.4"
                />
              </Svg>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Booking"
        component={Booking}
        options={{
          headerTitle: "Booking",
          headerShadowVisible: false,

          headerStyle: {
            backgroundColor: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <View>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M17 2H7C6.46957 2 5.96086 2.21071 5.58579 2.58579C5.21071 2.96086 5 3.46957 5 4V21C5 21.2652 5.10536 21.5196 5.29289 21.7071C5.48043 21.8946 5.73478 22 6 22H18C18.2652 22 18.5196 21.8946 18.7071 21.7071C18.8946 21.5196 19 21.2652 19 21V4C19 3.46957 18.7893 2.96086 18.4142 2.58579C18.0391 2.21071 17.5304 2 17 2ZM11 16H8V14H11V16ZM11 12H8V10H11V12ZM11 8H8V6H11V8ZM16 16H13V14H16V16ZM16 12H13V10H16V12ZM16 8H13V6H16V8Z"
                  fill={color}
                />
              </Svg>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Calender"
        component={CalenderComponent}
        options={{
          headerShadowVisible: false,

          headerStyle: {
            backgroundColor: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <View>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z"
                  fill={color}
                />
              </Svg>
            </View>
          ),
          headerTitle: "Calender",
        }}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          headerTitle: "Community",
          headerShadowVisible: false,

          headerStyle: {
            backgroundColor: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 22L18 18H8C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V15H17C17.55 15 18.0208 14.8042 18.4125 14.4125C18.8042 14.0208 19 13.55 19 13V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V22ZM4 12.175L5.175 11H15V4H4V12.175ZM2 17V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H15C15.55 2 16.0208 2.19583 16.4125 2.5875C16.8042 2.97917 17 3.45 17 4V11C17 11.55 16.8042 12.0208 16.4125 12.4125C16.0208 12.8042 15.55 13 15 13H6L2 17Z"
                fill={color}
              />
            </Svg>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true, // Show the header
          headerTitle: "Profile", // Display a custom title in the header
          headerStyle: {
            backgroundColor: "transparent", // Remove the background color
            shadowOpacity: 0, // Remove the shadow
            elevation: 0, // Remove the shadow for Android
          },
          headerTitleStyle: {
            color: "black", // Adjust the title color if needed
            fontSize: 18, // Adjust font size if needed
          },
          tabBarIcon: ({ color, size }) => (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7ZM8 13C6.67392 13 5.40215 13.5268 4.46447 14.4645C3.52678 15.4021 3 16.6739 3 18C3 18.7956 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21H18C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18C21 16.6739 20.4732 15.4021 19.5355 14.4645C18.5979 13.5268 17.3261 13 16 13H8Z"
                fill={color}
                fill-opacity="0.4"
              />
            </Svg>
          ),
        }}
      />
      {/* Other Tab Screens */}
    </Tab.Navigator>
  );
}

// Stack Navigator Component
function AppStack() {
  const auth = useContext(AuthContext);
  return (
    <Stack.Navigator initialRouteName="MainTabs">
      {/* Main App Tabs inside a screen */}
      <Stack.Screen
        name="MainTabs"
        component={MyTabs}
        options={{
          headerShown: false, // Hide stack header to avoid double headers
        }}
      />
      <Stack.Screen
        name="ViewSchedule"
        component={Schedule}
        options={{
          headerTitle: "Schedule",
          headerTitleStyle: {
            fontSize: 18, // smaller font size
            fontWeight: "500", // lighter font weight if needed
          },
        }}
      />
      {/* <Stack.Screen
        name="SelectterritoryPartner"
        component={Home}
        options={{ headerTitle: "Select territory Partner" }}
      />
      <Stack.Screen
        name="ConfirmSchedule"
        component={Home}
        options={{ headerTitle: "Confirm Your Meeting" }}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={Home}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="AddClient"
        component={AddClientScreen}
        options={{ headerTitle: "Add Client" }}
      />

      <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
      <Stack.Screen
        name="Flat"
        component={BookingFlats}
        options={{ headerTitle: `${auth?.flatName}` }}
      />
      <Stack.Screen
        name="FlatInfo"
        component={FlatInfo}
        // options={{ headerTitle: `${auth.flatName}` }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerTitle: "Profile" }}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPost}
        options={{ headerTitle: "New Post" }}
      />
      <Stack.Screen
        name="Referral"
        component={Refer}
        options={{
          headerTitle: "",
          headerShadowVisible: false, // React Navigation v6+
          headerStyle: {
            elevation: 0, // Android: remove shadow
            shadowOpacity: 0, // iOS: remove shadow
          },
          headerBackground: () => (
            <LinearGradient
              colors={["#0078DB", "#0078DB"]}
              start={{ x: 0.2, y: 0.1 }}
              end={{ x: 0.0, y: 0.4 }}
              style={{ flex: 1 }}
            />
          ),
          headerTintColor: "white", // back arrow & title color
        }}
      />
       <Stack.Screen name="PostDetailScreen" component={PostDetailScreen}  options={{ headerTitle: "Post Details" }} />

        <Stack.Screen
        name="KYC"
        component={KYC}
        options={{ headerTitle: "KYC Details" }}
      />
      <Stack.Screen
        name="Tickets"
        component={Tickets}
        options={{ headerTitle: "Tickets" }}
      />
    </Stack.Navigator>
  );
}

export default AppStack;
