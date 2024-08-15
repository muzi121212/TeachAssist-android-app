import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import React, { useState } from "react";
import { Darkgreen } from "./component/Color";
import Touchablebutton from "./component/Touchablebutton";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const darkTheme = {
  background: "#1E1E1E",
  text: "#FFFFFF",
  inputBackground: "#333333",
  borderColor: "#555555",
  buttonBackground: "#4CAF50",
  buttonText: "#FFFFFF",
  placeholder: "#AAAAAA",
  iconColor: "#FFFFFF",
};

const ForgottonPassword = (props) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);

  const forgot = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        alert("Password reset email sent");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.background }}>
      <View style={{ flex: 1 }}>
     

        <View style={{ marginTop: 120, alignItems: "center" }}>
        <Image
        source={require('../assets/icon2.png')} // Path to your image file
        style={{ width: 80, // Set your desired width
          height: 80, // Set your desired height
          resizeMode: 'contain', // Optionally, adjust how the image should be resized 
          marginBottom:80
          }}
      />
          <Text
            style={{ fontSize: 30, fontWeight: "bold", color: darkTheme.text }}
          >
            Reset Password
          </Text>
        </View>

        <Text style={[styles.emailtext, { color: darkTheme.text }]}>Email</Text>

        <View style={styles.textbox}>
          <TextInput
            style={[
              styles.Textinputdesign,
              {
                backgroundColor: darkTheme.inputBackground,
                borderColor: darkTheme.borderColor,
                color: darkTheme.text,
              },
            ]}
            placeholder="Enter your Email Address"
            placeholderTextColor={darkTheme.placeholder}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <Touchablebutton
          title="Reset Password"
          buttonStyle={{ backgroundColor: darkTheme.buttonBackground }}
          textStyle={{ color: darkTheme.buttonText, fontSize: 20 }}
          onPress={forgot}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgottonPassword;

const styles = StyleSheet.create({
  emailtext: {
    marginLeft: 35,
    marginTop: 30,
  },
  textbox: {
    alignItems: "center",
    marginTop: 8,
  },
  Textinputdesign: {
    height: 55,
    borderWidth: 2,
    width: "90%",
    borderRadius: 10,
    padding: 15,
  },
});
