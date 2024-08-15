

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   Alert,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   TextInput,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { db } from "./Firebase"; // Ensure your Firebase setup is correct
// import {
//   doc,
//   setDoc,
//   collection,
//   addDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
//   getFirestore,
//   query,
//   orderBy,
// } from "firebase/firestore";
// import Modalbtn from "./component/Modalbtn";

// const HolidayScreen = () => {
//   const [date, setDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);
//   const [holidays, setHolidays] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editHolidayId, setEditHolidayId] = useState(null);
//   const [holidayName, setHolidayName] = useState("");

//   useEffect(() => {
//     fetchHolidays();
//   }, []);

//   const fetchHolidays = async () => {
//     try {
//       const db = getFirestore();
//       const holidayCollection = collection(db, "holidays");
//       const q = query(holidayCollection, orderBy("date"));
//       const querySnapshot = await getDocs(q);

//       const holidaysData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setHolidays(holidaysData);
//       console.log("Holidays: ", holidaysData);
//       return holidaysData;
//     } catch (error) {
//       console.error("Error fetching holidays: ", error);
//     }
//   };

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShowPicker(false);
//     setDate(currentDate);
//   };

//   const addHoliday = async () => {
//     try {
//       const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
//       const holidayData = {
//         date: formattedDate,
//         name: holidayName || "Public Holiday",
//       };

//       if (isEditing && editHolidayId) {
//         await updateDoc(doc(db, "holidays", editHolidayId), holidayData);
//         Alert.alert(
//           "Holiday Updated",
//           "The holiday has been updated successfully."
//         );
//       } else {
//         await addDoc(collection(db, "holidays"), holidayData);
//         Alert.alert(
//           "Holiday Added",
//           `Holiday on ${formattedDate} added successfully.`
//         );
//       }
//       fetchHolidays();
//       closeModal();
//     } catch (error) {
//       console.error("Error adding holiday:", error);
//       Alert.alert("Error", "Failed to add holiday. Please try again.");
//     }
//   };

//   const deleteHoliday = async (id) => {
//     try {
//       await deleteDoc(doc(db, "holidays", id));
//       fetchHolidays();
//       Alert.alert(
//         "Holiday Deleted",
//         "The holiday has been deleted successfully."
//       );
//     } catch (error) {
//       console.error("Error deleting holiday:", error);
//       Alert.alert("Error", "Failed to delete the holiday. Please try again.");
//     }
//   };

//   const renderHolidayItem = ({ item }) => (
//     <TouchableOpacity
//       onLongPress={() => {
//         setIsEditing(true);
//         setEditHolidayId(item.id);
//         setDate(new Date(item.date));
//         setHolidayName(item.name);
//         setModalVisible(true);
//       }}
//       style={styles.holidayItem}
//     >
//       <Text style={styles.holidayName}>{item.name}</Text>
//       <Text style={styles.holidayDate}>
//         Date: {new Date(item.date).toDateString()}
//       </Text>
//       <TouchableOpacity
//         onPress={() => deleteHoliday(item.id)}
//         style={styles.deleteButton}
//       >
//         <Text style={styles.deleteButtonText}>Delete</Text>
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   const closeModal = () => {
//     setIsEditing(false);
//     setEditHolidayId(null);
//     setDate(new Date());
//     setHolidayName("");
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>
//               {isEditing ? "Edit Holiday" : "Add Holiday"}
//             </Text>
//             <View style={styles.formContainer}>
//               <Text style={styles.label}>Holiday Name:</Text>
//               <TextInput
//                 style={styles.input}
//                 value={holidayName}
//                 onChangeText={setHolidayName}
//               />
//               <Button title="Select Date" onPress={() => setShowPicker(true)} />
//               {showPicker && (
//                 <DateTimePicker
//                   value={date}
//                   mode="date"
//                   display="default"
//                   onChange={onChange}
//                 />
//               )}
//               <Text style={styles.selectedDate}>
//                 Selected Date: {date.toDateString()}
//               </Text>
//               <View style={styles.modalButtonContainer}>
//                 <TouchableOpacity style={styles.button} onPress={addHoliday}>
//                   <Text style={styles.buttonText}>
//                     {isEditing ? "Update Holiday" : "Add Holiday"}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={closeModal}
//                   style={styles.cancelButton}
//                 >
//                   <Icon
//                     name="times"
//                     size={20}
//                     color="white"
//                     style={styles.icon}
//                   />
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modalbtn onPress={() => setModalVisible(true)} />
//       <FlatList
//         data={holidays}
//         keyExtractor={(item) => item.id}
//         renderItem={renderHolidayItem}
//         style={styles.holidayList}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#1E1E1E",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   selectedDate: {
//     fontSize: 18,
//     marginVertical: 10,
//   },
//   formContainer: {
//     marginBottom: 10,
//     backgroundColor: "grey",
//     padding: 16,
//     borderRadius: 10,
//     elevation: 4,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContainer: {
//     width: "90%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     elevation: 10,
//   },
//   modalTitle: {
//     fontSize: 30,
//     fontWeight: "900",
//     marginBottom: 8,
//     letterSpacing: 1,
//     alignSelf: "center",
//     color: "#36454F",
//     textDecorationLine: "underline",
//   },
//   label: {
//     fontSize: 17,
//     marginBottom: 5,
//     fontWeight: "700",
//     fontStyle: "italic",
//   },
//   input: {
//     width: "100%",
//     height: 40,
//     borderColor: "white",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 10,
//     paddingLeft: 8,
//   },
//   holidayList: {
//     marginTop: 20,
//     width: "100%",
//   },
//   holidayItem: {
//     backgroundColor: "#ffffff",
//     padding: 16,
//     borderRadius: 10,
//     elevation: 4,
//     marginBottom: 16,
//   },
//   holidayName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "black",
//   },
//   holidayDate: {
//     fontSize: 14,
//     color: "gray",
//   },
//   deleteButton: {
//     alignSelf: "flex-end",
//     padding: 8,
//     backgroundColor: "#ff0000",
//     borderRadius: 4,
//   },
//   deleteButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   modalButtonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   cancelButton: {
//     flexDirection: "row",
//     backgroundColor: "#CC0000",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 10,
//     marginVertical: 10,
//   },
//   cancelButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   icon: {
//     marginRight: 5,
//   },
//   button: {
//     backgroundColor: "#007BFF", // Primary color
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: "#fff", // Text color
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default HolidayScreen;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "./Firebase"; // Ensure your Firebase setup is correct
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  getFirestore,
  query,
  orderBy,
} from "firebase/firestore";
import Modalbtn from "./component/Modalbtn";

const HolidayScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editHolidayId, setEditHolidayId] = useState(null);
  const [holidayName, setHolidayName] = useState("");

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const db = getFirestore();
      const holidayCollection = collection(db, "holidays");
      const q = query(holidayCollection, orderBy("date"));
      const querySnapshot = await getDocs(q);

      const holidaysData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHolidays(holidaysData);
      console.log("Holidays: ", holidaysData);
      return holidaysData;
    } catch (error) {
      console.error("Error fetching holidays: ", error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const addHoliday = async () => {
    try {
      const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const holidayData = {
        date: formattedDate,
        name: holidayName || "Public Holiday",
      };

      if (isEditing && editHolidayId) {
        await updateDoc(doc(db, "holidays", editHolidayId), holidayData);
        Alert.alert(
          "Holiday Updated",
          "The holiday has been updated successfully."
        );
      } else {
        await addDoc(collection(db, "holidays"), holidayData);
        Alert.alert(
          "Holiday Added",
          `Holiday on ${formattedDate} added successfully.`
        );
      }
      fetchHolidays();
      closeModal();
    } catch (error) {
      console.error("Error adding holiday:", error);
      Alert.alert("Error", "Failed to add holiday. Please try again.");
    }
  };

  const deleteHoliday = async (id) => {
    try {
      await deleteDoc(doc(db, "holidays", id));
      fetchHolidays();
      Alert.alert(
        "Holiday Deleted",
        "The holiday has been deleted successfully."
      );
    } catch (error) {
      console.error("Error deleting holiday:", error);
      Alert.alert("Error", "Failed to delete the holiday. Please try again.");
    }
  };

  const renderHolidayItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => {
        setIsEditing(true);
        setEditHolidayId(item.id);
        setDate(new Date(item.date));
        setHolidayName(item.name);
        setModalVisible(true);
      }}
      style={styles.holidayItem}
    >
      <Text style={styles.holidayName}>{item.name}</Text>
      <Text style={styles.holidayDate}>
        Date: {new Date(item.date).toDateString()}
      </Text>
      <TouchableOpacity
        onPress={() => deleteHoliday(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setIsEditing(false);
    setEditHolidayId(null);
    setDate(new Date());
    setHolidayName("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Holiday" : "Add Holiday"}
            </Text>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Holiday Name:</Text>
              <TextInput
                style={styles.input}
                value={holidayName}
                onChangeText={setHolidayName}
                placeholder="Enter holiday name"
                placeholderTextColor="#888"
              />
              <Button title="Select Date" onPress={() => setShowPicker(true)} />
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
              <Text style={styles.selectedDate}>
                Selected Date: {date.toDateString()}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.button} onPress={addHoliday}>
                  <Text style={styles.buttonText}>
                    {isEditing ? "Update Holiday" : "Add Holiday"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.cancelButton}
                >
                  <Icon
                    name="times"
                    size={20}
                    color="white"
                    style={styles.icon}
                  />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modalbtn onPress={() => setModalVisible(true)} />
      <FlatList
        data={holidays}
        keyExtractor={(item) => item.id}
        renderItem={renderHolidayItem}
        style={styles.holidayList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 18,
    marginVertical: 10,
    color: "#36454F",
  },
  formContainer: {
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
    color: "#333",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: "#333",
  },
  holidayList: {
    marginTop: 20,
    width: "100%",
  },
  holidayItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  holidayName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  holidayDate: {
    fontSize: 14,
    color: "#777",
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: 8,
    backgroundColor: "#FF3B30",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 5,
  },
  button: {
    backgroundColor: "#007BFF", // Primary color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff", // Text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HolidayScreen;
