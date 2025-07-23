//import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface UserType {
  id: number;
  name: string;
  contact: string;
  email: string;
  userimage: string | null;
  username: string;
  password: string;
  role: string;
  address: string;
  city: string;
  adharno: string;
  panno: string;
  rerano: string;
  experience: string;
  adharimage: string;
  panimage: string;
  status: string;
  loginstatus: string;
  paymentStatus: string | null;
  paymentId: string | null;
  registrationAmount: number | null;
  updated_at: string;
  created_at: string;
}

// Define the shape of your context
interface AuthContextType {
  isLoggedIn: boolean;
  isLoding: boolean;
  isPaymentSuccess: boolean;
  flatName: string | null;
  userName: string | null;
  token: string | null;
  user: UserType | null;
  image: string | null;
  propertyinfoId: number | null;
  dateRange: DateRangeType;
  propertyName: string | null;
  isNotification: boolean;
  setNotification: (value: boolean) => void;
  setUser: (user: UserType | null) => void;
  setToken: (token: string | null) => void;
  setFlatName: (flatName: string | null) => void;
  setUserName: (flatName: string | null) => void;
  setIsLoggedIn: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setIsPaymentSuccess: (value: boolean) => void;
  login: () => void;
  logout: () => void;
  setImage: (image: string | null) => void;
  setPropertyinfoId: (value: number) => void;
  setDateRange: (range: DateRangeType) => void;
  setPropertyName: (propertyName: string | null) => void;
}

// Create the context with default values (or undefined)
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Props type for the provider
interface AuthProviderProps {
  children: ReactNode;
}

interface DateRangeType {
  startDate: Date | string | null;
  endDate: Date | string | null;
}

// Provider components
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotification, setNotification] = useState(false);
  const [isLoding, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState<string | null>('');
  const [user, setUser] = useState<UserType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [flatName, setFlatName] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [propertyinfoId, setPropertyinfoId] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });
  const login = () => {
    setToken('');
    setIsLoggedIn(true);
  };

  const logout = () => {
    AsyncStorage.removeItem('tPersonToken');
    AsyncStorage.removeItem('tPersonInfo');
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
  };

  const isLoggedInUser = async () => {
    try {
      setLoading(true); // start loading
      const userToken = await AsyncStorage.getItem('tPersonToken');
      const userInfo = await AsyncStorage.getItem('tPersonInfo');
      if (userToken) {
        setToken(userToken);
        setIsLoggedIn(true);
      }

      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.log(`login error ${error}`);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    isLoggedInUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoding,
        setLoading,
        token,
        flatName,
        dateRange,
        propertyName,
        setFlatName,
        user,
        isNotification,
        setNotification,
        userName,
        setUserName,
        setUser,
        setToken,
        setIsLoggedIn,
        login,
        logout,
        image,
        setImage,
        isPaymentSuccess,
        setIsPaymentSuccess,
        propertyinfoId,
        setPropertyinfoId,
        setDateRange,
        setPropertyName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
