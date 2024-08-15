import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Darkgreen } from "./Color";

const Touchablebutton = (props) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ marginTop: 55, alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={{
          height: 50,
          width: "90%",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Darkgreen,
        }}
      >
        {props.loading ? (
          <ActivityIndicator color={"white"} size={30} />
        ) : (
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "white",
              ...props.registerText,
              ...props.logintext,
              ...props.forgottext,
            }}
          >
            {props.title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Touchablebutton;

const styles = StyleSheet.create({});
