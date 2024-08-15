
import {
  View,
  Text,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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
  getFirestore,
} from "firebase/firestore";
import { Darkgreen } from "./component/Color";

import React, { useState, useEffect } from "react";
import Services from "./component/Services";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const App = () => {
  const [groupedNotifications, setGroupedNotifications] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [userData, setUserData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotificationId, setEditNotificationId] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  const [notificationDetails, setNotificationDetails] = useState({
    day: 0,
    time: new Date(),
    endTime: new Date(), // Add endTime to the notification details
    repeatWeekly: false,
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false); // Add state for end time picker

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
      const timetableCollection = collection(db, "notifications");
      const q = query(timetableCollection, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      const timetableData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort notifications by day
      timetableData.sort((a, b) => a.day - b.day);

      setTimetable(timetableData);
      console.log("Timetable for the current user: ", timetableData);
      return timetableData;
    } catch (error) {
      console.error("Error fetching timetable: ", error);
    }
  };

  useEffect(() => {
    const groupNotificationsByDay = () => {
      const grouped = {};
      timetable.forEach((notification) => {
        const dayName = getDayName(notification.day);
        if (!grouped[dayName]) {
          grouped[dayName] = [];
        }
        grouped[dayName].push(notification);
      });
      setGroupedNotifications(grouped);
    };

    groupNotificationsByDay();
  }, [timetable]);

  const renderGroupedTimetablePages = () => {
    return Object.entries(groupedNotifications).map(([day, notifications]) => (
      <View key={day} style={[styles.pageContainer, { width: screenWidth }]}>
        <Text style={styles.dayHeadingContainer}>
          <Text style={styles.dayText}>{day}</Text>
          <Text style={styles.additionalText}>
            scroll for next notification
          </Text>
        </Text>
        <ScrollView style={styles.timetablePage}>
          {notifications.map((notification) =>
            renderTimetableItem({ item: notification })
          )}
        </ScrollView>
      </View>
    ));
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const roundedTime = new Date(selectedTime);
      const minutes = roundedTime.getMinutes();
      const roundedMinutes = Math.round(minutes / 5) * 5;
      roundedTime.setMinutes(roundedMinutes);
      setNotificationDetails((prevState) => ({
        ...prevState,
        time: roundedTime,
      }));
    }
  };

  const handleEndTimeChange = (event, selectedEndTime) => {
    setShowEndTimePicker(false);
    if (selectedEndTime) {
      const roundedEndTime = new Date(selectedEndTime);
      const minutes = roundedEndTime.getMinutes();
      const roundedMinutes = Math.round(minutes / 5) * 5;
      roundedEndTime.setMinutes(roundedMinutes);
      setNotificationDetails((prevState) => ({
        ...prevState,
        endTime: roundedEndTime,
      }));
    }
  };

  const scheduleNotification = async () => {
    try {
      const { day, time, endTime } = notificationDetails;
      const userId = await Services.getUserAuth();
      const formattedTime = `${time.getHours()}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const formattedEndTime = `${endTime.getHours()}:${endTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`; // Format end time

      const notificationData = {
        courseId: selectedCourse.id,
        userId,
        day,
        time: formattedTime,
        endTime: formattedEndTime, // Store end time
      };

      const notificationsRef = collection(db, "notifications");
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
      await deleteDoc(doc(db, "notifications", id));
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

  const getDayName = (dayNumber) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayNumber];
  };

  const renderTimetableItem = ({ item }) => {
    const course = courses.find((course) => course.id === item.courseId);
    return (
      <TouchableOpacity
        onLongPress={() => {
          setIsEditing(true);
          setEditNotificationId(item.id);
          setSelectedCourse(course);
          setNotificationDetails({
            day: item.day,
            time: new Date(`1970-01-01T${item.time}:00`),
            endTime: new Date(`1970-01-01T${item.endTime}:00`), // Set endTime for editing
            repeatWeekly: false,
          });
          setModalVisible(true);
        }}
        style={styles.timetableItem}
      >
        <Text style={styles.timetableCourse}>{course?.courseName}</Text>
        <Text style={styles.timetableDetail}>Day: {getDayName(item.day)}</Text>
        <Text style={styles.timetableDetail}>Time: {item.time}</Text>
        <Text style={styles.timetableDetail}>End Time: {item.endTime}</Text>
        <TouchableOpacity
          onPress={() => deleteNotification(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setIsEditing(false);
    setEditNotificationId(null);
    setSelectedCourse(null);
    setNotificationDetails({
      day: 0,
      time: new Date(),
      endTime: new Date(), // Reset end time to default
      repeatWeekly: false,
    });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setModalVisible(true);
            setIsEditing(false);
          }}
        >
          <Text style={styles.buttonText}>Add Notification</Text>
        </TouchableOpacity>
      </View>
      {renderGroupedTimetablePages()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Notification" : "Add Notification"}
            </Text>
            <Text style={styles.label}>Select Course:</Text>
            <Picker
              selectedValue={selectedCourse}
              onValueChange={(itemValue) => setSelectedCourse(itemValue)}
              style={styles.picker}
            >
              {courses.map((course) => (
                <Picker.Item
                  key={course.id}
                  label={course.courseName}
                  value={course}
                />
              ))}
            </Picker>
            <Text style={styles.label}>Select Day:</Text>
            <Picker
              selectedValue={notificationDetails.day}
              onValueChange={(itemValue) =>
                setNotificationDetails((prev) => ({
                  ...prev,
                  day: itemValue,
                }))
              }
              style={styles.picker}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <Picker.Item key={i} label={getDayName(i)} value={i} />
              ))}
            </Picker>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.label}>
                Select Time: {notificationDetails.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={notificationDetails.time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
              <Text style={styles.label}>
                Select End Time: {notificationDetails.endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={notificationDetails.endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleEndTimeChange}
              />
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={scheduleNotification}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? "Update Notification" : "Schedule Notification"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Darkgreen,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  dayHeadingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dayText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  additionalText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  timetablePage: {
    marginBottom: 20,
  },
  timetableItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  timetableCourse: {
    fontSize: 18,
    fontWeight: "bold",
  },
  timetableDetail: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF5733",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: "#FFFFFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
  },
});

export default App;
