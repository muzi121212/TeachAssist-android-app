

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
import { Darkgreen, Primary, Secondary, Accent, Background, Surface, TextPrimary, TextSecondary } from "./component/Color";

import React, { useState, useEffect } from "react";
import Services from "./component/Services";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Modalbtn from "./component/Modalbtn";

const App = () => {
  // Modify your state to include an object to hold notifications grouped by day
  const [groupedNotifications, setGroupedNotifications] = useState({});

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [userData, setUserData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotificationId, setEditNotificationId] = useState(null);
  // Get the width of the device screen
  const screenWidth = Dimensions.get("window").width;

  const [notificationDetails, setNotificationDetails] = useState({
    day: 0,
    time: new Date(),
    endTime: new Date(), // Add endTime to the notification details
    repeatWeekly: false,
  });
  const [showEndTimePicker, setShowEndTimePicker] = useState(false); // Add state for end time picker

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
    const formattedTime = new Date(`1970-01-01T${item.time}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedEndTime = new Date(`1970-01-01T${item.endTime}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
        <Text style={styles.timetableDetail}>Time: {formattedTime} - {formattedEndTime}</Text>
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
//#232B2B
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Background,
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
              {isEditing ? "Edit Notification" : "ADD NOTIFICATION"}
            </Text>
            <View style={styles.formContainer}>
              {/* Select Course */}
              <View style={styles.formGroup}>
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
              </View>

              {/* Select Day */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Select Day:</Text>
                <Picker
                  selectedValue={notificationDetails.day}
                  onValueChange={(itemValue) =>
                    setNotificationDetails((prevState) => ({
                      ...prevState,
                      day: itemValue,
                    }))
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select a day" value={null} />
                  <Picker.Item label="Sunday" value={0} />
                  <Picker.Item label="Monday" value={1} />
                  <Picker.Item label="Tuesday" value={2} />
                  <Picker.Item label="Wednesday" value={3} />
                  <Picker.Item label="Thursday" value={4} />
                  <Picker.Item label="Friday" value={5} />
                  <Picker.Item label="Saturday" value={6} />
                </Picker>
              </View>

              {/* Select Time */}
              <View style={styles.formGroup}>
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
                    value={notificationDetails.time || new Date()}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
               {/* Select end Time */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Select end Time:</Text>
                <TouchableOpacity
                  onPress={() => setShowEndTimePicker(true)}
                  style={styles.timePickerButton}
                >
                  <Text style={styles.timePickerText}>
                    {notificationDetails.time
                      ? notificationDetails.endTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Select a time"}
                  </Text>
                </TouchableOpacity>
                {showEndTimePicker && (
                  <DateTimePicker
                    value={notificationDetails.endTime || new Date()}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={handleEndTimeChange}
                  />
                )}
              </View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={scheduleNotification}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>
                  {isEditing ? "Update Notification" : "Add Notification"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeModal}
                style={[styles.modalButton, styles.modalButtonCancel]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        {renderGroupedTimetablePages()}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.floatingButton}
      >
        <Icon name="plus" size={24} color={Surface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timetableItem: {
    backgroundColor: Surface,
    padding: 18,
    marginVertical: 10,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  timetableCourse: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: Primary,
  },
  timetableDetail: {
    fontSize: 15,
    marginBottom: 4,
    color: TextPrimary,
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: 8,
    backgroundColor: Secondary,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: Surface,
    fontWeight: "bold",
  },
  dayHeadingContainer: {
    backgroundColor: Primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  dayText: {
    color: Surface,
    fontWeight: "bold",
    fontSize: 18,
  },
  additionalText: {
    color: Accent,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Surface,
    borderRadius: 16,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    color: Primary,
  },
  formContainer: {
    marginBottom: 16,
    backgroundColor: Background,
    borderRadius: 10,
    padding: 10,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: TextPrimary,
    fontWeight: "600",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  timePickerButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Accent,
    marginTop: 4,
  },
  timePickerText: {
    fontSize: 16,
    color: TextPrimary,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Primary,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  modalButtonCancel: {
    backgroundColor: Secondary,
  },
  modalButtonText: {
    color: Surface,
    fontWeight: "bold",
    fontSize: 16,
  },
  pageContainer: {
    flex: 1,
    padding: 20,
  },
  timetablePage: {
    flex: 1,
    width: "100%",
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: Primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
});

export default App;



