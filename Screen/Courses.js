import { StyleSheet, Text, View } from "react-native";
import React from "react";

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
    <View>
      <Text>Courses{name.name}</Text>
    </View>
  );
};

export default Courses;

const styles = StyleSheet.create({});
