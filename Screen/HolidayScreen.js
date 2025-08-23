


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
import { Darkgreen, Primary, Secondary, Accent, Background, Surface, TextPrimary, TextSecondary } from "./component/Color";

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
                placeholderTextColor={TextSecondary}
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
    backgroundColor: Background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 18,
    marginVertical: 10,
    color: Primary,
  },
  formContainer: {
    marginBottom: 10,
    backgroundColor: Surface,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
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
    alignSelf: "center",
    color: Primary,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: TextPrimary,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: Accent,
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    color: TextPrimary,
    backgroundColor: Background,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  holidayList: {
    marginTop: 20,
    width: "100%",
  },
  holidayItem: {
    backgroundColor: Surface,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    marginBottom: 16,
  },
  holidayName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Primary,
  },
  holidayDate: {
    fontSize: 15,
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flexDirection: "row",
    backgroundColor: Secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  cancelButtonText: {
    color: Surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 5,
  },
  button: {
    backgroundColor: Primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: Surface,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HolidayScreen;


