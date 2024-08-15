import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const darkTheme = {
  background: "#1E1E1E",
  text: "#FFFFFF",
};

const Splash = (props) => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate("Login");
    }, 500);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.background }}>
      <View style={styles.container}>
        <Text style={styles.SplashText}>Teach Assist</Text>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darkTheme.background,
  },
  SplashText: {
    fontSize: 40,
    color: darkTheme.text,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
