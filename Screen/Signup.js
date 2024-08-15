import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Darkgreen } from "./component/Color";
import Touchablebutton from "./component/Touchablebutton";
import TouchText from "./component/TouchText";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "./Firebase";
import { Entypo } from "@expo/vector-icons";

const darkTheme = {
  background: "#1E1E1E",
  text: "#FFFFFF",
  inputBackground: "#333333",
  inputBorder: "#555555",
  buttonBackground: "#317773",
  buttonText: "#FFFFFF",
  iconColor: "#FFFFFF",
};

const Signup = (props) => {
  const [displayName, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [confirmShowPassword, setConfirmShowPassword] = useState(true);

  const AddData = async () => {
    const db = getFirestore();
    const userdata = doc(db, "userProfile", auth.currentUser.uid);
    await setDoc(userdata, {
      displayName,
      email,
    });
    alert("Data added");
  };

  const onSignup = async () => {
    if (password === confirmPassword) {
      try {
        setLoading(true);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user);
            props.navigation.navigate("Login");
            alert("Please verify your email to continue");
            AddData();
            setLoading(false);
          })
          .catch((error) => {
            alert(error.message);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilityConfirm = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 40, alignItems: "center" }}>
            <Image
            source={require('../assets/icon2.png')} // Path to your image file
            style={{ width: 80, // Set your desired width
              height: 80, // Set your desired height
              resizeMode: 'contain', // Optionally, adjust how the image should be resized 
              marginBottom:30
              }}
          />
              <Text style={[styles.registerText, { color: darkTheme.text }]}>
                Register
              </Text>
            </View>

            <Text style={[styles.emailtext, { color: darkTheme.text }]}>
              Name
            </Text>
            <View style={styles.textbox}>
              <TextInput
                style={[
                  styles.Textinputdesign,
                  {
                    backgroundColor: darkTheme.inputBackground,
                    borderColor: darkTheme.inputBorder,
                    color: darkTheme.text,
                  },
                ]}
                placeholder="Enter your Name"
                placeholderTextColor={darkTheme.text}
                value={displayName}
                onChangeText={(text) => setName(text)}
              />
            </View>

            <Text style={[styles.emailtext, { color: darkTheme.text }]}>
              Email
            </Text>
            <View style={styles.textbox}>
              <TextInput
                style={[
                  styles.Textinputdesign,
                  {
                    backgroundColor: darkTheme.inputBackground,
                    borderColor: darkTheme.inputBorder,
                    color: darkTheme.text,
                  },
                ]}
                placeholder="Enter your Email"
                placeholderTextColor={darkTheme.text}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <Text style={[styles.emailtext, { color: darkTheme.text }]}>
              Password
            </Text>
            <View style={styles.textbox}>
              <TextInput
                secureTextEntry={showPassword}
                style={[
                  styles.Textinputdesign,
                  {
                    backgroundColor: darkTheme.inputBackground,
                    borderColor: darkTheme.inputBorder,
                    color: darkTheme.text,
                  },
                ]}
                placeholder="Enter your Password"
                placeholderTextColor={darkTheme.text}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <View
                style={{
                  position: "absolute",
                  marginTop: 16,
                  paddingLeft: 270,
                }}
              >
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <Entypo name="eye" size={28} color={darkTheme.iconColor} />
                  ) : (
                    <Entypo
                      name="eye-with-line"
                      size={24}
                      color={darkTheme.iconColor}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.emailtext, { color: darkTheme.text }]}>
              Confirm Password
            </Text>
            <View style={styles.textbox}>
              <TextInput
                secureTextEntry={confirmShowPassword}
                style={[
                  styles.Textinputdesign,
                  {
                    backgroundColor: darkTheme.inputBackground,
                    borderColor: darkTheme.inputBorder,
                    color: darkTheme.text,
                  },
                ]}
                placeholder="Enter your Password again"
                placeholderTextColor={darkTheme.text}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <View
                style={{
                  position: "absolute",
                  marginTop: 16,
                  paddingLeft: 270,
                }}
              >
                <TouchableOpacity onPress={togglePasswordVisibilityConfirm}>
                  {confirmShowPassword ? (
                    <Entypo name="eye" size={28} color={darkTheme.iconColor} />
                  ) : (
                    <Entypo
                      name="eye-with-line"
                      size={24}
                      color={darkTheme.iconColor}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Touchablebutton
              loading={loading}
              title="Register"
              buttonStyle={{
                backgroundColor: "#2c3e50",
                borderRadius: 10,
                paddingVertical: 15,
              }}
              textStyle={{ color: "#ecf0f1", fontSize: 25, fontWeight: "bold" }}
              onPress={onSignup}
            />

            <TouchText
              onPress={() => props.navigation.navigate("Login")}
              notaccount={{ color: "#bdc3c7" }}
              account={{ marginTop: 15, marginRight: 80, color: "#ecf0f1" }}
              title="Already have an account? Login"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  registerText: {
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: -20,
    letterSpacing: 2,
  },
  emailtext: {
    marginLeft: 35,
    marginTop: 20,
  },
  textbox: {
    alignItems: "center",
    marginTop: 5,
  },
  Textinputdesign: {
    height: 55,
    borderWidth: 2,
    width: "90%",
    borderRadius: 10,
    padding: 15,
  },
});
