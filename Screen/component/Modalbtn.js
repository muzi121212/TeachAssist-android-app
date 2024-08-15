import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Darkgreen } from "./Color";

const Modalbtn = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 62,

        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
      onPress={() => props.onPress()}
    >
      <AntDesign
        style={{ ...props.pickdoc }}
        name="pluscircle"
        size={60}
        color="rgba(49, 119, 115, 1)"
      />
    </TouchableOpacity>
  );
};

export default Modalbtn;

const styles = StyleSheet.create({});
