import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignIn from "../auth/signIn";
import ForgotPassword from "../auth/ForgetPassword";
import EmailVerification from "../auth/EmailVarification";
import PasswordResetMessage from "../auth/PasswordResetMessage";
import SetNewPassword from "../auth/SetPassword";
import PasswordChangedSuccess from "../auth/PasswordChangedSuccess";
const Stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Sign_In">
      {/* Auth Screens */}
      <Stack.Screen
        name="Sign_In"
        component={SignIn}
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: "#EAF6FF",
          },
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerification}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="PasswordResetMessage"
        component={PasswordResetMessage}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="SetNewPassword"
        component={SetNewPassword}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="PasswordChangedSuccess"
        component={PasswordChangedSuccess}
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
