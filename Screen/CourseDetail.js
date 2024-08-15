import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Darkgreen } from "./component/Color";
import Modalbtn from "./component/Modalbtn";
import Loading from "./component/Loading";
import { Entypo } from "@expo/vector-icons";
import Menu, {
  MenuProvider,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

const CourseDetail = ({ route }) => {
  const { course, onCourseUpdate, onCourseDelete } = route.params;
  const navigation = useNavigation();

  const [content, setContent] = useState("");
  const [courseContent, setCourseContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalContent, setTotalContent] = useState(0);
  const [completedContent, setCompletedContent] = useState(0);
  const [ongoingContent, setOngoingContent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editModalVisi, setEditModalVisi] = useState(false);

  const [courseeditModalVisi, setCourseeditModalVisi] = useState(false);

  const [editableCourse, setEditiableCourse] = useState({
    courseName: course.courseName,
    description: course.description,
    Name: course.Name,
    Email: course.Email,
    Contact: course.Contact,
  });

  const crWhatsAppNumber = (editableCourse.Contact); // Your CR WhatsApp number
  console.log(crWhatsAppNumber)
  const crEmail = (editableCourse.Email); // Your CR email


  const addContent = async () => {
    try {
      setIsModalVisible(false);
      const db = getFirestore();
      const contentCollection = collection(db, "courseContent");
      const timestamp = serverTimestamp();

      await addDoc(contentCollection, {
        content: content,
        courseId: course.id,
        createdAt: timestamp,
        completed: false,
        status: "None",
      });

      console.log("Content added successfully!");

      fetchAndSetCourseContent();
    } catch (error) {
      console.error("Error adding content: ", error);
    }
  };

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      const contentCollection = collection(db, "courseContent");
      const q = query(
        contentCollection,
        where("courseId", "==", course.id),
        orderBy("createdAt")
      );

      const querySnapshot = await getDocs(q);

      const contentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update total, completed, and ongoing content counts.
      const total = contentList.length;
      const completed = contentList.filter((item) => item.completed).length;
      const ongoing = contentList.filter(
        (item) => item.status !== "completed" && item.status !== "None"
      ).length;

      setTotalContent(total);
      setCompletedContent(completed);
      setOngoingContent(ongoing);

      setLoading(false);
      console.log("Content for the current course: ", contentList);
      return contentList;
    } catch (error) {
      console.error("Error fetching content: ", error);
    }
  };

  const fetchAndSetCourseContent = async () => {
    const fetchedContent = await fetchCourseContent();
    setCourseContent(fetchedContent);
  };

  useEffect(() => {
    fetchAndSetCourseContent();
  }, []);

  const updateContentStatus = async (contentId, newStatus) => {
    try {
      const db = getFirestore();
      const contentDocRef = doc(db, "courseContent", contentId);

      await updateDoc(contentDocRef, {
        status: newStatus,
        completed: newStatus === "completed",
      });

      console.log("Content status updated!");
      fetchAndSetCourseContent();
    } catch (error) {
      console.error("Error updating content status: ", error);
    }
  };

  const calculatePercentage = () => {
    const totalItems = courseContent.length;
    const completedItems = courseContent.filter(
      (item) => item.completed
    ).length;

    if (totalItems === 0) {
      return 0;
    }

    const percentage = (completedItems / totalItems) * 100; // Ensure the percentage is within the valid range (0 to 100)

    return Math.min(Math.max(percentage, 0), 100);
  };

  const getDashArray = () => {
    const percentage = calculatePercentage();

    // Calculate the circumference of the circle (2 * π * r)
    const circumference = Math.PI * 80; // Assuming the radius is 40%

    // Calculate the dash length based on the percentage
    const dashLength = (percentage / 100) * circumference;

    // Calculate the gap length for the remaining percentage
    const gapLength = circumference - dashLength;

    // Set the dash array to create a grey area for the remaining percentage
    return `${dashLength}, ${gapLength}, ${circumference}`;
  };

  const handleContentPress = (selectedItem) => {
    setSelectedContent(selectedItem);
    setModalVisible(true);
  };

  const handleModalOptionPress = (option) => {
    updateContentStatus(selectedContent.id, option);
    setModalVisible(false);
  };

  const handleEditContent = (item) => {
    setEditedContent(item.content);
    setSelectedContent(item);
    setEditModalVisi(true);
  };

  const handlesaveEdit = async (item) => {
    try {
      const db = getFirestore();
      const contentDocRef = doc(db, "courseContent", selectedContent.id);
      await updateDoc(contentDocRef, {
        content: editedContent,
      });
      console.log("content edit success");
      fetchAndSetCourseContent();
      setEditModalVisi(false);
    } catch (error) {
      console.log("error updating", error);
    }
  };

  const handledeleteCntent = async (item) => {
    try {
      const db = getFirestore();
      const contentDocRef = doc(db, "courseContent", item.id);
      await deleteDoc(contentDocRef);
      console.log("content delete success");
      fetchAndSetCourseContent();
      setEditModalVisi(false);
    } catch (error) {
      console.log("error deleting", error);
    }
  };

  const handeleditCourse = () => {
    
    setCourseeditModalVisi(true);
  };

  const handlesaveEditCourse = async (item) => {
    try {
      const db = getFirestore();
      const contentDocRef = doc(db, "courses", course.id);
      await updateDoc(contentDocRef, {
        courseName: editableCourse.courseName,
        description: editableCourse.description,
        Name: editableCourse.Name,
        Email: editableCourse.Email,
        Contact: editableCourse.Contact,
      });

      onCourseUpdate({
        ...course,
        courseName: editableCourse.courseName,
        description: editableCourse.description,
        Name: editableCourse.Name,
        Email: editableCourse.Email,
        Contact: editableCourse.Contact,
      });

      console.log("Course edit success");

      setCourseeditModalVisi(false);
    } catch (error) {
      console.log("error updating course", error);
    }
  };

  const handledeleteCourse = async (item) => {
    try {
      const db = getFirestore();

      await Promise.all(
        courseContent.map(async (contentItem) => {
          const contentDocRef = doc(db, "courseContent", contentItem.id);
          await deleteDoc(contentDocRef);
          console.log(contentDocRef);
        })
      );
      const contentDocRef = doc(db, "courses", course.id);
      await deleteDoc(contentDocRef);
      console.log("coourse delete success");

      //update the coures int the profile screen y refecthing them
      route.params.onCourseDelete(course);

      navigation.navigate("Home");
    } catch (error) {
      console.log("error deleting", error);
    }
  };

  const openWhatsAppChat = (phoneNumber) => {
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;

    Linking.openURL(whatsappUrl).catch((err) =>
      console.error("Error opening WhatsApp:", err)
    );
  };
  const openEmailCompose = (emailAddress) => {
    const emailUrl = `mailto:${emailAddress}`;

    Linking.openURL(emailUrl).catch((err) =>
      console.error("error loading email:", err)
    );
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "#2a2a2a",
            height: "37%",
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        >
          <MenuProvider>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 5,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Ionicons
                  name="chevron-back-sharp"
                  size={34}
                  style={{ color: "white", marginTop: 5 }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignSelf: "center",
                position: "absolute",
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: 20,
                  letterSpacing: 3,
                }}
              >
                {editableCourse.courseName}{" "}
              </Text>
            </View>

            <View
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <Menu>
                <MenuTrigger>
                  <Entypo name="dots-three-vertical" size={24} color="white" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption
                    onSelect={() => handledeleteCourse()}
                    text="Delete Course"
                  />
                  <MenuOption
                    onSelect={() => handeleditCourse()}
                    text="Edit Course"
                  />
                  {/* <MenuOption onSelect={() => navigation.navigate('ShareNotes')} text='Notes'/> */}
                  <MenuOption
                    onSelect={() =>
                      navigation.navigate("ShareNotes", { courseId: course.id, crEmail, crWhatsAppNumber })
                    }
                    text="Add Notes"
                  />
                </MenuOptions>
              </Menu>
            </View>
            <View style={{ height: 140, marginHorizontal: 12 }}>
              <Text
                style={{ color: "white", marginTop: 20, textAlign: "justify" }}
              >
                {editableCourse.description}{" "}
              </Text>
            </View>

            <Text
              style={{
                letterSpacing: 1,
                color: "#ffffff",
                fontSize: 20,
                fontWeight: "bold",
                marginHorizontal: 12,
                marginTop: -4,
              }}
            >
              Class Representative Details
            </Text>

            <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
              <Text style={styles.CRText}>Name:</Text>
              <Text style={styles.CRText}> {editableCourse.Name} </Text>
            </View>

            <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
              <Text style={styles.CRText}>Email:</Text>
              <TouchableOpacity
                onPress={() => openEmailCompose(editableCourse.Email)}
              >
                <Text style={[styles.CRText, {color: 'pink'}]}> {editableCourse.Email} </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
              <Text style={styles.CRText}>Contact:</Text>
              <TouchableOpacity
                onPress={() => openWhatsAppChat(editableCourse.Contact)}
              >
                <Text style={[styles.CRText, {color:'green'}]}> {editableCourse.Contact} </Text>
              </TouchableOpacity>
            </View>
          </MenuProvider>
        </View>

        <View style={{ flexDirection: "row", marginTop: "5%" }}>
          <View style={{ marginLeft: "5%" }}>
            <Text style={styles.textStyle}>Total Content: {totalContent}</Text>
            <Text style={styles.textStyle}>
              Completed Content: {completedContent}
            </Text>
            <Text style={styles.textStyle}>
              Ongoing Content: {ongoingContent}
            </Text>
          </View>
          <View style={{ marginHorizontal: "16%" }}>
            <Svg height="100" width="100">
              {/* Grey background circle */}
              <Circle
                cx="50%"
                cy="50%"
                r="40%"
                stroke="rgba(128, 128, 128, 0.3)"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Green progress circle with dash array */}
              <Circle
                cx="50%"
                cy="50%"
                r="40%"
                stroke="#ffffff"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={getDashArray()}
                strokeLinecap="square"
              />
              <Text
                style={{
                  position: "relative",
                  top: "40%",
                  fontSize: 20,
                  color: "#aaa",
                  alignSelf: "center",
                  marginTop: "17%",
                }}
              >
                {Math.round(calculatePercentage())}%
              </Text>
            </Svg>
          </View>
        </View>

        <Modalbtn onPress={() => setIsModalVisible(!isModalVisible)} />

        <Modal visible={isModalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.headerText}>Add Content</Text>

                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add your Content"
                  placeholderTextColor="#aaa"
                  multiline={true}
                  value={content}
                  onChangeText={(text) => setContent(text)}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={addContent}>
                    <Text style={styles.buttonText}>Add Content</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <MenuProvider>
          <FlatList
            data={courseContent}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleContentPress(item)}>
                <View
                  key={item.id}
                  style={{
                    height: 110,
                    width: "90%",
                    backgroundColor: "#333",
                    borderColor: "white",
                    marginVertical: 10,
                    borderRadius: 10,
                    alignSelf: "center",
                    borderWidth: 1,
                  }}
                >
                  <View style={{ marginHorizontal: 10, flexDirection: "row" }}>
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        backgroundColor: "rgba(49, 119, 115, 1)",
                        borderRadius: 50,
                        marginTop: 28,
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
                        {item.content.charAt(0)}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 18,
                        paddingRight: 50,
                        marginTop: 24,
                      }}
                    >
                      <Text
                        numberOfLines={3}
                        style={{
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: 13,
                          marginRight: 10,
                        }}
                      >
                        {item.content}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 3,
                      marginHorizontal: 76,
                    }}
                  >
                    <Text>Status: </Text>
                    <Text
                      style={{ color: item.completed ? "green" : "orange" }}
                    >
                      {item.status ? item.status : "None"}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignSelf: "flex-end",
                      position: "absolute",
                      marginTop: "3%",
                      marginRight: "1%",
                    }}
                  >
                    <Menu>
                      <MenuTrigger>
                        <Entypo
                          name="dots-three-vertical"
                          size={22}
                          color={Darkgreen}
                        />
                      </MenuTrigger>
                      <MenuOptions>
                        <MenuOption
                          onSelect={() => handleEditContent(item)}
                          text="Edit"
                        />
                        <MenuOption
                          onSelect={() => handledeleteCntent(item)}
                          text="Delete"
                        />
                      </MenuOptions>
                    </Menu>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </MenuProvider>

        {/* Content edit modal */}

        <Modal
          animationType="slide"
          transparent={false}
          visible={editModalVisi}
          onRequestClose={() => setEditModalVisi(false)}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Edit Content here </Text>
            {/* <TextInput 
style={{height:40,width:'90%',borderBottomWidth:1}}
value={editedContent}
onChangeText={(text) => setEditedContent(text)}
/> */}

            <TextInput
              style={[styles.input, { height: 80, marginTop: 5 }]}
              placeholder="Edit Content"
              value={editedContent}
              multiline={true}
              textAlignVertical="top"
              onChangeText={(text) => setEditedContent(text)}
            />
            {/* <Button title='Save' onPress={handlesaveEdit}/>
<Button title='cancel' onPress={() => setEditModalVisi(false)}/> */}

            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <TouchableOpacity
                style={styles.editcoursedetail}
                onPress={handlesaveEdit}
              >
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editcoursedetail}
                onPress={() => setEditModalVisi(false)}
              >
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={courseeditModalVisi}
          onRequestClose={() => setCourseeditModalVisi(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.headerText}>Edit Course</Text>

            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Course Name"
              placeholderTextColor="#aaa"
              value={courseeditModalVisi.courseName}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, courseName: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Class Representative Name"
              placeholderTextColor="#aaa"
              value={courseeditModalVisi.Name}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, Name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Class Representative Email"
              placeholderTextColor="#aaa"
              value={courseeditModalVisi.Email}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, Email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Class Representative Contact"
              placeholderTextColor="#aaa"
              value={courseeditModalVisi.contact}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, Contact: text })
              }
            />

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Course Description"
              placeholderTextColor="#aaa"
              value={courseeditModalVisi.description}
              multiline={true}
              textAlignVertical="top"
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, description: text })
              }
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editcoursedetail}
                onPress={handlesaveEditCourse}
              >
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editcoursedetail}
                onPress={() => setCourseeditModalVisi(false)}
              >
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.markmodal}
                  onPress={() => handleModalOptionPress("completed")}
                >
                  <Text style={styles.markmodaltext}>Mark as Completed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.markmodal}
                  onPress={() => handleModalOptionPress("ongoing")}
                >
                  <Text style={styles.markmodaltext}>Mark as Ongoing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.markmodal}
                  onPress={() => handleModalOptionPress("None")}
                >
                  <Text style={styles.markmodaltext}>Mark as None</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default CourseDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 20,
    borderColor: "#333",
    borderWidth: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 10,
    borderColor: "#333",
    borderWidth: 1,
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 18,
    color: "#ffffff",
    marginVertical: 2,
  },
  CRText: {
    color: "#ffffff",
    fontSize: 15,
  },
  editcoursedetail: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
    borderColor: "white",
  },
  markmodal: {
    backgroundColor: Darkgreen,
    height: 50,
    width: "95%",
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  markmodaltext: {
    color: "white",
    fontSize: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 2,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
