import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
// import {auth} from './Screen/Firebase';
// import { signOut } from 'firebase/auth';
import Signup from "./Screen/Signup";
import Home from "./Screen/Home";
import Splash from "./Screen/Splash";
import Login from "./Screen/Login";
import ForgottonPassword from "./Screen/ForgottonPassword";
import Settings from "./Screen/Settings";
import Courses from "./Screen/Courses";
import HolidayScreen from "./Screen/HolidayScreen";

import ShareNotes from "./Screen/ShareNotes";
import Timetable from "./Screen/Timetable";
// import { getAuth,onAuthStateChanged } from 'firebase/auth';
import { Darkgreen } from "./Screen/component/Color";
import CustomDrawer from "./Screen/CustomDrawer";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  collection,
  addDoc,
  query,
  getDocs,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import CourseDetail from "./Screen/CourseDetail";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import ProfileImage from "./Screen/component/ProfileImage";
import NotesListScreen from "./Screen/ShareNotes";
import PDFViewerScreen from "./Screen/PDFViewerScreen";
import { AuthContext } from "./Screen/Context/AuthContext";
import Services from "./Screen/component/Services";
import Loading from "./Screen/component/Loading";
import Datesheet from "./Screen/DateSheet";
import StartScreen from "./Screen/StartScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgottonPassword"
        component={ForgottonPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
// const Tab = createBottomTabNavigator();

// const MainTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === "Home") {
//             iconName = focused ? "home" : "home-outline";
//             return <FontAwesome5 name={iconName} size={size} color={color} />;
//           } else if (route.name === "Courses") {
//             iconName = focused ? "book" : "book-outline";
//             return (
//               <MaterialCommunityIcons
//                 name={iconName}
//                 size={size}
//                 color={color}
//               />
//             );
//           }
//         },
//         tabBarActiveTintColor: Darkgreen,
//         tabBarInactiveTintColor: "gray",
//         tabBarStyle: {
//           backgroundColor: "#ffffff",
//           borderTopColor: "transparent",
//           elevation: 0, // remove shadow on Android
//           shadowOpacity: 0, // remove shadow on iOS
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: "bold",
//         },
//         tabBarShowLabel: true, // show tab labels
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={DrawerStack}
//         options={{ tabBarLabel: "Home" }}
//       />
//       <Tab.Screen
//         name="Courses"
//         component={Home}
//         options={{ tabBarLabel: "Courses" }}
//       />
//     </Tab.Navigator>
//   );
// };

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {/* <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Home"
        component={DrawerStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={DrawerStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Datesheet"
        component={DrawerStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Timetable"
        component={DrawerStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Holiday"
        component={HolidayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShareNotes"
        component={ShareNotes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="notesscreen"
        component={NotesListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="pdf"
        component={PDFViewerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const DrawerStack = () => {
  const { userData, setUserData } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [email, setEmail] = useState([]);

  const getname = async () => {
    const db = getFirestore();
    const uid = await Services.getUserAuth();
    const userdataa = doc(db, "userProfile", uid);
    const docSnap = await getDoc(userdataa);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log("Document data:", userData);

      // Assuming "Email" is a top-level field in the document
      const userEmail = userData.email;
      console.log("User Email:", userEmail);

      setData(userData);
      setEmail(userEmail);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getname();
  }, []);

  return (
    <Drawer.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#E0E0E0' }, // Change this to your desired color
      headerTintColor: 'black', // Change the header text color if needed
      drawerActiveTintColor: Darkgreen,
      drawerInactiveTintColor: 'black',
    }}
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <View
              style={{
                height: 230,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderBottomColor: "#f4f4f4",
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  height: 150,
                  width: 150,
                  borderRadius: 50,
                  marginTop: 10,
                }}
              >
                {data.profileImage ? (
                  // If there is a profile image, show it
                  <Image
                    style={{ height: 150, width: 150 }}
                    source={require("./assets/images.jpg")}
                  />
                ) : (
                  // If there is no profile image, show the default Image

                  <ProfileImage />
                )}
              </View>
              <Text
                style={{
                  fontSize: 22,
                  marginVertical: 6,
                  fontWeight: "bold",
                  color: "#111",
                }}
              >
                {data.displayName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#111",
                }}
              >
                {email}
              </Text>
            </View>
            <DrawerItemList {...props} />
            <View
              style={{
                height: 50,
                width: "100%",
                justifyContent: "center",
                // alignItems: "center",
                borderBottomColor: "#f4f4f4",
                borderTopColor: "#f4f4f4",
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginTop: 280,
              }}
            >
              <View>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    Services.Logout();
                    setUserData(null);
                  }}
                >
                  <AntDesign
                    name="logout"
                    size={18}
                    color="#808080"
                    style={{ marginLeft: 21 }}
                  />
                  <Text
                    style={{ fontSize: 15, marginLeft: 31, fontWeight: "bold" }}
                  >
                    Logout/Signout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        );
      }}
    >
      <Drawer.Screen
        name="TeachAssist"
        component={StartScreen}
        options={{
          drawerLabel: "TeachAssist",
          title: "TeachAssist",

          drawerIcon: () => (
            <FontAwesome5
              name="home"
              size={24}
              style={{ borderBottomColor: "#808080" }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Courses"
        component={Home}
        options={{
          drawerLabel: "Courses",
          title: "Courses",

          drawerIcon: () => (
            <FontAwesome5
              name="book-reader"
              size={24}
              style={{ borderBottomColor: "#808080" }}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Timetable"
        component={Timetable}
        options={{
          drawerLabel: "Timetable",
          title: "TimeTable",
          drawerIcon: () => (
            <MaterialIcons name="timer" size={20} color="#808080" />
          ),
        }}
      />
      <Drawer.Screen
        name="Datesheet"
        component={Datesheet}
        options={{
          drawerLabel: "Datesheet",
          title: "Datesheet",
          drawerIcon: () => (
            <MaterialIcons name="timer" size={20} color="#808080" />
          ),
        }}
      />
      <Drawer.Screen
        name="Holiday"
        component={HolidayScreen}
        options={{
          drawerLabel: "Holiday",
          title: "Holiday",
          drawerIcon: () => (
            <MaterialIcons name="beach-access" size={20} color="#808080" />
          ),
        }}
      />

      <Drawer.Screen
        name="Logout"
        component={() => null}
        options={{
          drawerLabel: "Logout",
          title: "Logout",
          drawerIcon: () => (
            <AntDesign name="logout" size={20} color="#808080" />
          ),
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            Services.Logout();
            setUserData(null);
          },
        })}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    Services.getUserAuth().then((resp) => {
      if (resp) {
        setUserData(resp);
        setLoading(false);
        console.log("from app.js uid is :", resp);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
    <StatusBar 
    barStyle="light-content" // options: 'default', 'light-content', 'dark-content'
    backgroundColor="#fff" // Set this to the color of your header or app background
  />
      <AuthContext.Provider value={{ userData, setUserData }}>
        {userData ? <HomeStack /> : <AuthStack />}
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarIcon: {
    marginBottom: -3,
  },
  drawerHeader: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
  drawerProfileImage: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginTop: 10,
  },
  drawerHeaderText: {
    fontSize: 22,
    marginVertical: 6,
    fontWeight: "bold",
    color: "#111",
  },
  drawerSubHeaderText: {
    fontSize: 12,
    color: "#111",
  },
  logoutButton: {
    flexDirection: "row",
    marginLeft: 21,
  },
  logoutButtonText: {
    fontSize: 15,
    marginLeft: 31,
    fontWeight: "bold",
  },
});
