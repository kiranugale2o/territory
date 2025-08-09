// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);

// import BackgroundFetch from "react-native-background-fetch";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BackgroundFetchHeadlessTask = async (event) => {
//   console.log('[BackgroundFetch] Headless task running:', event.taskId);

//   // ✅ Get all AsyncStorage keys
//   const keys = await AsyncStorage.getAllKeys();

//   for (const key of keys) {
//     if (key.startsWith("autoRejectExpiry-")) {
//       const expiry = await AsyncStorage.getItem(key);
//       if (expiry && Date.now() >= parseInt(expiry)) {
//         const enquiryId = key.split("-")[1];

//         // ✅ Call reject API directly
//         try {
//           await fetch(
//             `https://api.reparv.in/territory-partner/enquirers/reject/${enquiryId}`,
//             {
//               method: 'PUT',
//               credentials: 'include',
//               headers: { 'Content-Type': 'application/json' },
//             },
//           );
//           console.log(`⛔ Auto-rejected enquiry: ${enquiryId}`);
//           await AsyncStorage.removeItem(key);
//         } catch (e) {
//           console.error("Auto-reject failed:", e);
//         }
//       }
//     }
//   }

//   BackgroundFetch.finish(event.taskId);
// };

// BackgroundFetch.registerHeadlessTask(BackgroundFetchHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
