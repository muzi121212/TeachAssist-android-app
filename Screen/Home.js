import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  collection,
  addDoc,
  query,
  getDocs,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import { auth } from "./Firebase";
import { AntDesign } from "@expo/vector-icons";
import { Darkgreen } from "./component/Color";
import { getAuth } from "firebase/auth";
import Modalbtn from "./component/Modalbtn";
import Loading from "./component/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Services from "./component/Services";
import { AuthContext } from "./Context/AuthContext";

const Home = (props) => {
  const { userData, setUserData } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [email, setEmail] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    description: "",
  });
  const [classRep, setClassRep] = useState({
    Name: "",
    Email: "",
    Contact: "",
  });
  const [courseNameError, setCourseNameError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [uid, setUid] = useState(null); // Initialize uid state

  const [descriptionStyle, setDescriptionStyle] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [previousCRNames, setPreviousCRNames] = useState([]);
  const [showsuggestio, setShowsuggestio] = useState(false);

  const updateDescription = (text) => {
    // Counting words
    // const words = text.trim().split(/\s+/).filter(Boolean);
    // setWordCount(words.length);

    // Check if the description exceeds 200 characters
    const isExceedingLimit = text.length > 300;

    // Set the style dynamically based on the condition
    const descriptionStyle = isExceedingLimit ? { color: "red" } : {};

    // Limiting description to 200 characters
    const limitedDescription = isExceedingLimit ? text.substring(0, 300) : text;
    setNewCourse((prev) => ({ ...prev, description: limitedDescription }));

    const currentCount = isExceedingLimit ? 300 : text.length;

    setWordCount(currentCount);

    // Apply the style to the TextInput
    setDescriptionStyle(descriptionStyle);
  };

  const user = getAuth().currentUser;

  const db = getFirestore();
  const courseCollection = collection(db, "courses");

  const [selectedCourse, setSelectedCourse] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
    // Reset the error when the modal is closed
    setCourseNameError("");
    setClassRep({
      Name: "",
      Email: "",
      Contact: "",
    });
    setNewCourse({
      courseName: "",
      description: "",
    });
    setWordCount("");
  };

  const addCourse = async () => {
    if (!newCourse.courseName) {
      // Display an error if the courseName is empty
      setCourseNameError("This field is required");
      return;
    }
    try {
      // Include creation timestamp and instructor information
      const timestamp = serverTimestamp();
      const uid = await Services.getUserAuth();
      console.log("uid from profile screen adding:", uid);
      const db = getFirestore();
      const courseData = {
        courseName: newCourse.courseName,
        description: newCourse.description || "", // Set to empty string if undefined
        Name: classRep.Name || "", // Set to empty string if undefined
        Email: classRep.Email || "", // Set to empty string if undefined
        Contact: classRep.Contact || "", // Set to empty string if undefined
        Uid: uid,
        createdAt: timestamp,
      };

      if (classRep.Name && !previousCRNames.includes(classRep.Name)) {
        setPreviousCRNames((prevNames) => [...prevNames, classRep.Name]);
      }

      await addDoc(courseCollection, courseData);

      // Reset the form fields to objects with empty strings
      setClassRep({
        Name: "",
        Email: "",
        Contact: "",
      });
      setNewCourse({
        courseName: "",
        description: "",
      });

      setModalVisible(false);

      console.log("Course added successfully!");
      // Fetch and update the courses after adding a new course
      fetchAndSetCourses();
    } catch (error) {
      console.error("Error adding course: ", error);
    }
  };
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const uid = await Services.getUserAuth();

      const db = getFirestore();
      const courseCollection = collection(db, "courses");
      const q = query(
        courseCollection,
        where("Uid", "==", uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const courses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      console.log("Courses for the current user: ", courses);
      return courses;
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  const fetchAndSetCourses = async () => {
    const fetchedCourses = await fetchCourses();
    setCourses(fetchedCourses);
  };

  const handlecourseupdate = (updateCurse) => {
    const updateCurses = courses.map((course) =>
      course.id === updateCurse.id ? updateCurse : course
    );
    setCourses(updateCurses);
  };

  const handlecoursedelete = (deletecourse) => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id != deletecourse.id)
    );
  };

  useEffect(() => {
    fetchAndSetCourses();
  }, []);

  // Function to handle selection of CR name suggestion
  const handleCRNameSelection = (name) => {
    const selectedCR = previousCRNames.find((cr) => cr === name);
    if (selectedCR) {
      // Find CR details from previous entries
      const selectedCRDetails = courses.find(
        (course) => course.Name === selectedCR
      );
      if (selectedCRDetails) {
        // Fill up contact and email based on selected CR
        setClassRep((prevCR) => ({
          ...prevCR,
          Name: selectedCR,
          Email: selectedCRDetails.Email,
          Contact: selectedCRDetails.Contact,
        }));
      }
    }
    setShowsuggestio(false);

    // const selectedCrDetails = courses.find(course => course.Name === name)

    // if(selectedCrDetails){
    // setClassRep(prevCR => ({
    //   ...prevCR,
    //   Name:selectedCrDetails.Name,
    //   Email:selectedCrDetails.Email,
    //   Contact:selectedCrDetails.Contact
    // }))
    // }
    // setShowsuggestio(false)
  };

  const handlecrnamechange = (text) => {
    setClassRep((prev) => ({ ...prev, Name: text }));
    if (text) {
      setShowsuggestio(true);
    } else {
      setShowsuggestio(false);
    }
  };

  const handlecrnamefocus = () => {
    if (previousCRNames.length > 0) {
      setShowsuggestio(true);
    }
  };

  const handlecrnamehide = () => {
    setShowsuggestio(false);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("CourseDetail", {
            course: item,
            onCourseUpdate: handlecourseupdate,
            onCourseDelete: handlecoursedelete,
            Textofcourse: fetchAndSetCourses,
          })
        }
      >
        <View
          style={{
            height: 120,
            width: "93%",
            backgroundColor: "rgba(49, 119, 115, .1)",
            borderColor: Darkgreen,
            marginVertical: 10,
            borderRadius: 10,
            alignSelf: "center",
            borderWidth: 2,
          }}
        >
          <View style={{ marginHorizontal: 10, flexDirection: "row" }}>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: "rgba(49, 119, 115, 1)",
                borderRadius: 50,
                marginTop: 33,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 30,
                  alignSelf: "center",
                  marginTop: 4,
                }}
              >
                {item.courseName.charAt(0)}
              </Text>
            </View>
            <View
              style={{ paddingHorizontal: 20, paddingRight: 50, marginTop: 20 }}
            >
              <Text
                numberOfLines={1}
                style={{ color: Darkgreen, fontWeight: "bold", fontSize: 20 }}
              >
                {item.courseName}
              </Text>
              <Text
                numberOfLines={3}
                style={{ color: Darkgreen, fontSize: 12 }}
              >
                {item.description}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {/* Add Course Modal */}
      <Modalbtn onPress={() => setModalVisible(!isModalVisible)} />

      <KeyboardAvoidingView>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
        >
          <TouchableWithoutFeedback onPress={() => closeModal()}>
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: courseNameError ? "red" : "#E8EAF6",
                    },
                  ]}
                  placeholder="Course Name"
                  value={newCourse.courseName}
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => {
                    setNewCourse((prev) => ({ ...prev, courseName: text }));
                    setCourseNameError(""); // Reset the error when typing
                  }}
                />
                {courseNameError ? (
                  <Text style={styles.errorText}>{courseNameError}</Text>
                ) : null}

                <TextInput
                  style={[styles.input, { height: 50 }]}
                  placeholder="Cr Name"
                  placeholderTextColor="#aaa"
                  value={classRep.Name}
                  onChangeText={(text) => handlecrnamechange(text)}
                  onFocus={handlecrnamefocus}
                  onBlur={handlecrnamehide}
                />
                {showsuggestio && (
                  <View style={styles.suggestionsContainer}>
                    {previousCRNames.map((crName, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleCRNameSelection(crName)}
                        style={styles.suggestionItem}
                      >
                        <Text>{crName}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TextInput
                  style={[styles.input, { height: 50 ,}]}
                  placeholder="Class Representative Email"
                  value={classRep.Email}
                  placeholderTextColor="#aaa"
                  onChangeText={(text) =>
                    setClassRep((prev) => ({ ...prev, Email: text }))
                  }
                />
                <TextInput
                  style={[styles.input, { height: 50 }]}
                  placeholder="Class Representative Contact Number"
                  value={classRep.Contact}
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setClassRep((prev) => ({ ...prev, Contact: text }))
                  }
                />

                <TextInput
                  placeholder="Course Description"
                  value={newCourse.description}
                  textAlignVertical="top"
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => updateDescription(text)}
                  multiline={true}
                  style={[styles.input, { height: 100 }]}
                />
                <Text style={styles.wordCount}>{wordCount}/300</Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={addCourse}
                  >
                    <Text style={styles.addButtonText}>Add Course</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.addButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>

      <ScrollView style={{ flex: 1 }}>
        <View>
          {selectedCourse ? (
            <View>
              <Text>Selected Course Details:</Text>
              <Text>{selectedCourse.courseName}</Text>
              <Text>{selectedCourse.description}</Text>
            </View>
          ) : (
            <FlatList
              data={courses}
              numColumns={1}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              extraData={courses}
              onCourseDelete={(deletecourse) =>
                handlecoursedelete(deletecourse)
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 62,
    backgroundColor: Darkgreen,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background color
  },
  modalContent: {
    backgroundColor: "#444444", // Dark modal content background color
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  input: {
    color: '#fff',
    borderWidth: 1,
    borderColor: "#E8EAF6",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
   
    
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginHorizontal: 17,
    marginTop: -7,
  },
  suggestionsContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    padding: 10,
    marginTop: -10,
    marginBottom: 10,
  },
  suggestionItem: {
    paddingVertical: 5,
  },
  wordCount: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,

    alignSelf: "center",
  },
  addButton: {
    backgroundColor: "#3B444B", // Change to orange color
    borderRadius: 12,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  cancelButton: {
    backgroundColor: "#CC0000", // Change to orange color
    borderRadius: 12,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Home;
