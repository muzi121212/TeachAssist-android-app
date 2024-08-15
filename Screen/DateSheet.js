


// import {
//   View,
//   Text,
//   Button,
//   Alert,
//   Modal,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { db, auth } from "./Firebase";
// import {
//   doc,
//   setDoc,
//   collection,
//   addDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
//   query,
//   where,
//   orderBy,
//   getFirestore,
// } from "firebase/firestore";
// import React, { useState, useEffect } from "react";
// import Services from "./component/Services";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import Modalbtn from "./component/Modalbtn";

// const DateSheet = () => {
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [timetable, setTimetable] = useState([]);
//   const [userData, setUserData] = useState();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editNotificationId, setEditNotificationId] = useState(null);

//   const [notificationDetails, setNotificationDetails] = useState({
//     date: new Date(),
//     time: new Date(),
//     repeatWeekly: false,
//   });

//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);

//   useEffect(() => {
//     Services.getUserAuth().then((resp) => {
//       if (resp) {
//         setUserData(resp);
//         console.log("from datesheet.js uid is :", resp);
//       } else {
//         setUserData(null);
//       }
//     });
//   }, []);

//   useEffect(() => {
//     fetchCourses();
//     fetchTimetable();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const uid = await Services.getUserAuth();
//       const db = getFirestore();
//       const courseCollection = collection(db, "courses");
//       const q = query(courseCollection, where("Uid", "==", uid));
//       const querySnapshot = await getDocs(q);

//       const courses = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCourses(courses);
//       console.log("Courses for the current user: ", courses);
//       return courses;
//     } catch (error) {
//       console.error("Error fetching courses: ", error);
//     }
//   };

//   const fetchTimetable = async () => {
//     try {
//       const uid = await Services.getUserAuth();
//       const db = getFirestore();
//       const timetableCollection = collection(db, "datesheet");
//       const q = query(timetableCollection, where("userId", "==", uid));
//       const querySnapshot = await getDocs(q);

//       const timetableData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setTimetable(timetableData);
//       console.log("Timetable for the current user: ", timetableData);
//       return timetableData;
//     } catch (error) {
//       console.error("Error fetching timetable: ", error);
//     }
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setNotificationDetails((prevState) => ({
//         ...prevState,
//         date: selectedDate,
//       }));
//     }
//   };
//   const handleTimeChange = (event, selectedTime) => {
//     setShowTimePicker(false);
//     if (selectedTime) {
//       const date = new Date(selectedTime);
//       const minutes = date.getMinutes();
      
//       // Round minutes to nearest 5-minute interval
//       const roundedMinutes = Math.round(minutes / 5) * 5;
  
//       // If roundedMinutes is 60, increment the hour and reset minutes to 0
//       if (roundedMinutes === 60) {
//         date.setHours(date.getHours() + 1);
//         date.setMinutes(0);
//       } else {
//         date.setMinutes(roundedMinutes);
//       }
  
//       setNotificationDetails((prevState) => ({
//         ...prevState,
//         time: date,
//       }));
//     }
//   };
  
//   const scheduleNotification = async () => {
//     try {
//       const { date, time } = notificationDetails;
//       const userId = await Services.getUserAuth();
//       const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
//         .toString()
//         .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
//       const formattedTime = `${time.getHours()}:${time
//         .getMinutes()
//         .toString()
//         .padStart(2, "0")}`;
//       const notificationData = {
//         courseId: selectedCourse.id,
//         userId,
//         date: formattedDate,
//         time: formattedTime,
//       };

//       const notificationsRef = collection(db, "datesheet");
//       if (isEditing && editNotificationId) {
//         await updateDoc(
//           doc(notificationsRef, editNotificationId),
//           notificationData
//         );
//         Alert.alert(
//           "Notification Updated",
//           "The notification has been updated successfully."
//         );
//       } else {
//         await addDoc(notificationsRef, notificationData);
//         Alert.alert(
//           "Notification Scheduled",
//           "The notification has been scheduled successfully."
//         );
//       }
//       fetchTimetable();
//       setModalVisible(false);
//     } catch (error) {
//       console.error("Error scheduling notification:", error);
//       Alert.alert(
//         "Error",
//         "Failed to schedule the notification. Please try again."
//       );
//     }
//   };

//   const deleteNotification = async (id) => {
//     try {
//       await deleteDoc(doc(db, "datesheet", id));
//       fetchTimetable();
//       Alert.alert(
//         "Notification Deleted",
//         "The notification has been deleted successfully."
//       );
//     } catch (error) {
//       console.error("Error deleting notification:", error);
//       Alert.alert(
//         "Error",
//         "Failed to delete the notification. Please try again."
//       );
//     }
//   };

//   const renderTimetableItem = ({ item }) => {
//     const course = courses.find((course) => course.id === item.courseId);
//     return (
//       <View style={[styles.pageContainer, ]}>
//       <TouchableOpacity
//         onLongPress={() => {
//           setIsEditing(true);
//           setEditNotificationId(item.id);
//           setSelectedCourse(course);
//           setNotificationDetails({
//             date: new Date(item.date),
//             time: new Date(`1970-01-01T${item.time}:00`),
//             repeatWeekly: false,
//           });
//           setModalVisible(true);
//         }}
//         style={styles.timetableItem}
//       >
//         <Text style={styles.timetableCourse}>{course?.courseName}</Text>
//         <Text style={styles.timetableDetail}>Date: {item.date}</Text>
//         <Text style={styles.timetableDetail}>Time: {item.time}</Text>
//         <TouchableOpacity
//           onPress={() => deleteNotification(item.id)}
//           style={styles.deleteButton}
//         >
//           <Text style={styles.deleteButtonText}>Delete</Text>
//         </TouchableOpacity>
//       </TouchableOpacity>
//       </View>
//     );
//   };

//   const closeModal = () => {
//     setIsEditing(false);
//     setEditNotificationId(null);
//     setSelectedCourse(null);
//     setNotificationDetails({
//       date: new Date(),
//       time: new Date(),
//       repeatWeekly: false,
//     });
//     setModalVisible(false);
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#1E1E1E",
//       }}
//     >
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>
//               {isEditing ? "Edit Notification" : "Add Notification"}
//             </Text>
//             <View style={styles.formContainer}>
//               <Text style={styles.label}>Select Course:</Text>
//               <Picker
//                 selectedValue={selectedCourse}
//                 onValueChange={(itemValue) => setSelectedCourse(itemValue)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Select a course" value={null} />
//                 {courses.map((course) => (
//                   <Picker.Item
//                     key={course.id}
//                     label={course.courseName}
//                     value={course}
//                   />
//                 ))}
//               </Picker>
//               <Text style={styles.label}>Select Date:</Text>
//               <Button
//                 title="Select Date"
//                 onPress={() => setShowDatePicker(true)}
//               />
//               {showDatePicker && (
//                 <DateTimePicker
//                   testID="datePicker"
//                   value={notificationDetails.date}
//                   mode="date"
//                   display="default"
//                   onChange={handleDateChange}
//                 />
//               )}
//               <Text style={styles.label}>Select Time:</Text>
//               <Button
//                 title="Select Time"
//                 onPress={() => setShowTimePicker(true)}
//               />
//               {showTimePicker && (
//                 <DateTimePicker
//                   testID="timePicker"
//                   value={notificationDetails.time}
//                   mode="time"
//                   is24Hour={true}
//                   display="default"
//                   onChange={handleTimeChange}
//                 />
//               )}
//               <View style={styles.modalButtonContainer}>
//                 <Button
//                   title={
//                     isEditing ? "Update Notification" : "Schedule Notification"
//                   }
//                   onPress={scheduleNotification}
//                 />
//                 <Button title="Cancel" onPress={closeModal} color="red" />
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       <Modalbtn onPress={() => setModalVisible(true)} />
//       <FlatList
//         data={timetable}
//         keyExtractor={(item) => item.id}
//         renderItem={renderTimetableItem}
//         style={styles.timetableList}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   formContainer: {
//     marginBottom: 10,
//     backgroundColor: "white",
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
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   picker: {
//     width: "100%",
//     height: 50,
//     marginBottom: 10,
//   },
//   timetableList: {
//     marginTop: 20,
//     width: "100%",
//   },
//   timetableItem: {
//     backgroundColor: "white",
//     padding: 16,
//     borderRadius: 10,
//     elevation: 4,
//     marginBottom: 16,
//   },
//   timetableCourse: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   timetableDetail: {
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
//   pageContainer: {
//     flex: 1,
//     paddingHorizontal:20
//   },
// });

// export default DateSheet;

import {
  View,
  Text,
  Button,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db, auth } from "./Firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getFirestore,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import Services from "./component/Services";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Modalbtn from "./component/Modalbtn";

const DateSheet = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [userData, setUserData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotificationId, setEditNotificationId] = useState(null);

  const [notificationDetails, setNotificationDetails] = useState({
    date: new Date(),
    time: new Date(),
    repeatWeekly: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    Services.getUserAuth().then((resp) => {
      if (resp) {
        setUserData(resp);
        console.log("from datesheet.js uid is :", resp);
      } else {
        setUserData(null);
      }
    });
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchTimetable();
  }, []);

  const fetchCourses = async () => {
    try {
      const uid = await Services.getUserAuth();
      const db = getFirestore();
      const courseCollection = collection(db, "courses");
      const q = query(courseCollection, where("Uid", "==", uid));
      const querySnapshot = await getDocs(q);

      const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courses);
      console.log("Courses for the current user: ", courses);
      return courses;
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  const fetchTimetable = async () => {
    try {
      const uid = await Services.getUserAuth();
      const db = getFirestore();
      const timetableCollection = collection(db, "datesheet");
      const q = query(timetableCollection, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      const timetableData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTimetable(timetableData);
      console.log("Timetable for the current user: ", timetableData);
      return timetableData;
    } catch (error) {
      console.error("Error fetching timetable: ", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNotificationDetails((prevState) => ({
        ...prevState,
        date: selectedDate,
      }));
    }
  };
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const date = new Date(selectedTime);
      const minutes = date.getMinutes();
      
      // Round minutes to nearest 5-minute interval
      const roundedMinutes = Math.round(minutes / 5) * 5;
  
      // If roundedMinutes is 60, increment the hour and reset minutes to 0
      if (roundedMinutes === 60) {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
      } else {
        date.setMinutes(roundedMinutes);
      }
  
      setNotificationDetails((prevState) => ({
        ...prevState,
        time: date,
      }));
    }
  };
  
  const scheduleNotification = async () => {
    try {
      const { date, time } = notificationDetails;
      const userId = await Services.getUserAuth();
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      const formattedTime = `${time.getHours()}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const notificationData = {
        courseId: selectedCourse.id,
        userId,
        date: formattedDate,
        time: formattedTime,
      };

      const notificationsRef = collection(db, "datesheet");
      if (isEditing && editNotificationId) {
        await updateDoc(
          doc(notificationsRef, editNotificationId),
          notificationData
        );
        Alert.alert(
          "Notification Updated",
          "The notification has been updated successfully."
        );
      } else {
        await addDoc(notificationsRef, notificationData);
        Alert.alert(
          "Notification Scheduled",
          "The notification has been scheduled successfully."
        );
      }
      fetchTimetable();
      setModalVisible(false);
    } catch (error) {
      console.error("Error scheduling notification:", error);
      Alert.alert(
        "Error",
        "Failed to schedule the notification. Please try again."
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      await deleteDoc(doc(db, "datesheet", id));
      fetchTimetable();
      Alert.alert(
        "Notification Deleted",
        "The notification has been deleted successfully."
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      Alert.alert(
        "Error",
        "Failed to delete the notification. Please try again."
      );
    }
  };

  const renderTimetableItem = ({ item }) => {
    const course = courses.find((course) => course.id === item.courseId);
    const formattedTime = new Date(`1970-01-01T${item.time}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
      <View style={[styles.pageContainer, ]}>
      <TouchableOpacity
        onLongPress={() => {
          setIsEditing(true);
          setEditNotificationId(item.id);
          setSelectedCourse(course);
          setNotificationDetails({
            date: new Date(item.date),
            time: new Date(`1970-01-01T${item.time}:00`),
            repeatWeekly: false,
          });
          setModalVisible(true);
        }}
        style={styles.timetableItem}
      >
        <Text style={styles.timetableCourse}>{course?.courseName}</Text>
        <Text style={styles.timetableDetail}>Date: {item.date}</Text>
        <Text style={styles.timetableDetail}>Time: {formattedTime}</Text>
        <TouchableOpacity
          onPress={() => deleteNotification(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      </View>
    );
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditNotificationId(null);
    setSelectedCourse(null);
    setNotificationDetails({
      date: new Date(),
      time: new Date(),
      repeatWeekly: false,
    });
    setModalVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1E1E1E",
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Notification" : "Add Notification"}
            </Text>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Select Course:</Text>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a course" value={null} />
                {courses.map((course) => (
                  <Picker.Item
                    key={course.id}
                    label={course.courseName}
                    value={course}
                  />
                ))}
              </Picker>
              <Text style={styles.label}>Select Date:</Text>
              <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.timePickerButton}
            >
              <Text style={styles.datePickerText}>
                {notificationDetails.date
                  ? notificationDetails.date.toLocaleDateString()
                  : "Select a date"}
              </Text>
            </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="datePicker"
                  value={notificationDetails.date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <Text style={styles.label}>Select Time:</Text>
              <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timePickerButton}
            >
              <Text style={styles.timePickerText}>
                {notificationDetails.time
                  ? notificationDetails.time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select a time"}
              </Text>
            </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  testID="timePicker"
                  value={notificationDetails.time}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
              <View style={styles.modalButtonContainer}>
                <Button
                  title={
                    isEditing ? "Update Notification" : "Schedule Notification"
                  }
                  onPress={scheduleNotification}
                />
                <Button title="Cancel" onPress={closeModal} color="red" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modalbtn onPress={() => setModalVisible(true)} />
      <FlatList
        data={timetable}
        keyExtractor={(item) => item.id}
        renderItem={renderTimetableItem}
        style={styles.timetableList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 10,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 10,
  },
  timetableList: {
    marginTop: 20,
    width: "100%",
  },
  timetableItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  timetableCourse: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timetableDetail: {
    fontSize: 14,
    color: "gray",
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: 8,
    backgroundColor: "#ff0000",
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal:20
  },
  timePickerButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  timePickerText: {
    fontSize: 16,
    color: "#000",
  },
});

export default DateSheet;
