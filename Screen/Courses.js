import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Primary, Surface, Background, TextPrimary, TextSecondary, Accent } from "./component/Color";

const Courses = () => {
  const [name, setname] = useState("");

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setname(snapshot.data());
        } else {
          console.log("user does not exist");
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.name}>{name.name}</Text>
      </View>
    </View>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: Surface,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 220,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Primary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  name: {
    fontSize: 18,
    color: TextPrimary,
    marginTop: 4,
  },
});
