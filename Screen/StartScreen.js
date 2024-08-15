// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import {
//   FontAwesome5,
//   MaterialIcons,
//   SimpleLineIcons,
// } from "@expo/vector-icons";

// const StartScreen = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <View style={styles.imagecontainer}>
//         {/* Header */}
//         <ImageBackground
//           source={require("../assets/header.jpg")} // Your background image path
//           style={styles.headerContainer}
//         >
//           <Text style={styles.headerText}>Welcome to the App</Text>
//         </ImageBackground>
//       </View>
//       {/* Buttons */}
//       <ScrollView contentContainerStyle={styles.buttonsContainer}>
//         {/* Courses Button */}
//         <ImageBackground
//           source={require("../assets/course1.jpg")} // Replace with the path to your image
//           style={[styles.box, styles.coursesBackground]}
//           imageStyle={{ borderRadius: 20 }}
//         >
//           <TouchableOpacity
//             onPress={() => navigation.navigate("Courses")}
//             style={styles.innerButton}
//           >
//             <FontAwesome5 name="book-reader" size={40} color="#fff" />
//             <Text style={styles.boxText}>Courses</Text>
//           </TouchableOpacity>
//         </ImageBackground>

//         {/* Timetable Button */}
//         <ImageBackground
//           source={require("../assets/icon1.jpg")} // Replace with the path to your image
//           style={[styles.box, styles.timetableBackground]}
//           imageStyle={{ borderRadius: 20 }}
//         >
//           <TouchableOpacity
//             onPress={() => navigation.navigate("Timetable")}
//             style={styles.innerButton}
//           >
//             <MaterialIcons name="timer" size={40} color="#fff" />
//             <Text style={styles.boxText}>Timetable</Text>
//           </TouchableOpacity>
//         </ImageBackground>

//         {/* Datesheet Button */}
//         <ImageBackground
//           source={require("../assets/icon.jpg")} // Replace with the path to your image
//           style={[styles.box, styles.datesheetBackground]}
//           imageStyle={{ borderRadius: 20 }}
//         >
//           <TouchableOpacity
//             onPress={() => navigation.navigate("Datesheet")}
//             style={styles.innerButton}
//           >
//             <MaterialIcons name="date-range" size={40} color="#fff" />
//             <Text style={styles.boxText}>Datesheet</Text>
//           </TouchableOpacity>
//         </ImageBackground>

//         {/* Settings Button */}
//         <ImageBackground
//           source={require("../assets/setting.jpg")} // Replace with the path to your image
//           style={[styles.box, styles.settingsBackground]}
//           imageStyle={{ borderRadius: 20 }}
//         >
//           <TouchableOpacity
//             onPress={() => navigation.navigate("Holiday")}
//             style={styles.innerButton}
//           >
//             <SimpleLineIcons name="umbrella" size={40} color="#fff" />
//             <Text style={styles.boxText}>Holiday</Text>
//           </TouchableOpacity>
//         </ImageBackground>
//       </ScrollView>
//     </View>
//   );
// };

// export default StartScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   headerContainer: {
//     height: 200,
//     justifyContent: "center",
//     alignItems: "center",
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,

//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     backgroundColor: "#730130",
//   },
//   imagecontainer: {
//     height: "30%",
//     borderWidth: 4,
//     borderColor: "#730130",
//     borderRadius: 12,
//     marginTop:20,
//     margin: 10,
//     padding: 5,
//     marginBottom: "8%",
//   },
//   headerText: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#fff",
//     letterSpacing: 2,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     padding: 10,
//   },
//   box: {
//     width: "48%", // Adjust width to occupy half of the available space with some space in between
//     height: 150,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     overflow: "hidden",
//     borderColor: "#730130",
//     borderWidth: 3,
//   },
//   innerButton: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity or color here
//     width: "100%",
//     height: "100%",
//     padding: 10,
//   },
//   boxText: {
//     marginTop: 10,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//     letterSpacing: 2,
//   },
//   coursesBackground: {
//     backgroundColor: "#a8a723",
//   },
//   timetableBackground: {
//     backgroundColor: "#b88228",
//   },
//   datesheetBackground: {
//     backgroundColor: "#03A9F4",
//   },
//   settingsBackground: {
//     backgroundColor: "#cc9d8a",
//   },
// });






import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  FontAwesome5,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

const StartScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/header.jpg")}
        style={styles.headerContainer}
      >
        <Text style={styles.headerText}>Welcome to the App</Text>
      </ImageBackground>
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        <ImageBackground
          source={require("../assets/course1.jpg")}
          style={[styles.box, styles.coursesBackground]}
          imageStyle={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Courses")}
            style={styles.innerButton}
          >
            <FontAwesome5 name="book-reader" size={40} color="#fff" />
            <Text style={styles.boxText}>Courses</Text>
          </TouchableOpacity>
        </ImageBackground>

        <ImageBackground
          source={require("../assets/icon1.jpg")}
          style={[styles.box, styles.timetableBackground]}
          imageStyle={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Timetable")}
            style={styles.innerButton}
          >
            <MaterialIcons name="timer" size={40} color="#fff" />
            <Text style={styles.boxText}>Timetable</Text>
          </TouchableOpacity>
        </ImageBackground>

        <ImageBackground
          source={require("../assets/icon.jpg")}
          style={[styles.box, styles.datesheetBackground]}
          imageStyle={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Datesheet")}
            style={styles.innerButton}
          >
            <MaterialIcons name="date-range" size={40} color="#fff" />
            <Text style={styles.boxText}>Datesheet</Text>
          </TouchableOpacity>
        </ImageBackground>

        <ImageBackground
          source={require("../assets/setting.jpg")}
          style={[styles.box, styles.settingsBackground]}
          imageStyle={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Holiday")}
            style={styles.innerButton}
          >
            <SimpleLineIcons name="umbrella" size={40} color="#fff" />
            <Text style={styles.boxText}>Holiday</Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerContainer: {
    height: Dimensions.get('window').height * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: "#730130",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  box: {
    width: "100%", // Full width
    height: Dimensions.get('window').height * 0.2, // Increase height
    marginBottom: 10,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    overflow: "hidden",
    borderColor: "#730130",
    borderWidth: 3,
  },
  innerButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    padding: 10,
  },
  boxText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
  },
  coursesBackground: {
    backgroundColor: "#a8a723",
  },
  timetableBackground: {
    backgroundColor: "#b88228",
  },
  datesheetBackground: {
    backgroundColor: "#03A9F4",
  },
  settingsBackground: {
    backgroundColor: "#cc9d8a",
  },
});
