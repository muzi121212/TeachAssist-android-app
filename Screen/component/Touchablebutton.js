import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Primary, TextPrimary, Accent } from "./Color";

const Touchablebutton = (props) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ marginTop: 40, alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={[
          styles.button,
          props.style,
        ]}
        activeOpacity={0.85}
      >
        {props.loading ? (
          <ActivityIndicator color={"white"} size={28} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              props.registerText,
              props.logintext,
              props.forgottext,
            ]}
          >
            {props.title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Touchablebutton;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: "90%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.5,
  },
});
