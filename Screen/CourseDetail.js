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
import { Darkgreen, Primary, Secondary, Accent, Background, Surface, TextPrimary, TextSecondary } from "./component/Color";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Background }}>
      <View style={styles.container}>
        <View
          style={styles.header}
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
                  style={{ color: Surface, marginTop: 5 }}
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
                style={styles.headerTitle}
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
                  <Entypo name="dots-three-vertical" size={24} color={Accent} />
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
                style={styles.headerDesc}
              >
                {editableCourse.description}{" "}
              </Text>
            </View>

            <Text
              style={styles.headerSectionTitle}
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
                <Text style={[styles.CRText, {color: Accent}]}> {editableCourse.Email} </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", marginHorizontal: 12 }}>
              <Text style={styles.CRText}>Contact:</Text>
              <TouchableOpacity
                onPress={() => openWhatsAppChat(editableCourse.Contact)}
              >
                <Text style={[styles.CRText, {color: Secondary}]}> {editableCourse.Contact} </Text>
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
                stroke={Primary}
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
                  color: TextSecondary,
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
                  placeholderTextColor={TextSecondary}
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
                  style={styles.contentCard}
                >
                  <View style={{ marginHorizontal: 10, flexDirection: "row" }}>
                    <View
                      style={styles.contentIcon}
                    >
                      <Text
                        style={styles.contentIconText}
                      >
                        {item.content.charAt(0)}
                      </Text>
                    </View>
                    <View
                      style={styles.contentInfo}
                    >
                      <Text
                        numberOfLines={3}
                        style={styles.contentText}
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
                      style={{ color: item.completed ? Primary : Secondary, fontWeight: "bold" }}
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
                          color={Accent}
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
              placeholderTextColor={TextSecondary}
              value={courseeditModalVisi.courseName}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, courseName: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Class Representative Name"
              placeholderTextColor={TextSecondary}
              value={courseeditModalVisi.Name}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, Name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Class Representative Email"
              placeholderTextColor={TextSecondary}
              value={courseeditModalVisi.Email}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, Email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Class Representative Contact"
              placeholderTextColor={TextSecondary}
              value={courseeditModalVisi.contact}
              onChangeText={(text) =>
                setEditiableCourse({ ...editableCourse, Contact: text })
              }
            />

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Course Description"
              placeholderTextColor={TextSecondary}
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
    backgroundColor: Background,
  },
  header: {
    backgroundColor: Primary,
    height: "37%",
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    color: Surface,
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 2,
  },
  headerDesc: {
    color: Surface,
    marginTop: 20,
    textAlign: "justify",
    fontSize: 15,
    fontWeight: "400",
  },
  headerSectionTitle: {
    letterSpacing: 1,
    color: Accent,
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 12,
    marginTop: -4,
    marginBottom: 4,
  },
  addButtonText: {
    fontSize: 16,
    color: Surface,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: Surface,
    borderRadius: 16,
    padding: 24,
    borderColor: Accent,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 6,
  },
  modal: {
    flex: 1,
    backgroundColor: Background,
    padding: 20,
    borderRadius: 16,
    borderColor: Accent,
    borderWidth: 1,
  },
  input: {
    backgroundColor: Background,
    color: TextPrimary,
    borderWidth: 1,
    borderColor: Accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  addButtonText: {
    color: Surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 16,
    color: TextPrimary,
    marginVertical: 2,
  },
  CRText: {
    color: Surface,
    fontSize: 15,
  },
  editcoursedetail: {
    backgroundColor: Secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
    borderColor: Accent,
  },
  markmodal: {
    backgroundColor: Primary,
    height: 50,
    width: "95%",
    borderRadius: 12,
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  markmodaltext: {
    color: Surface,
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    color: Primary,
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
    backgroundColor: Primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: Surface,
    fontSize: 16,
  },
  contentCard: {
    minHeight: 100,
    width: "90%",
    backgroundColor: Surface,
    borderColor: Primary,
    marginVertical: 10,
    borderRadius: 14,
    alignSelf: "center",
    borderWidth: 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "center",
  },
  contentIcon: {
    height: 48,
    width: 48,
    backgroundColor: Primary,
    borderRadius: 24,
    marginTop: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  contentIconText: {
    color: Surface,
    fontWeight: "bold",
    fontSize: 24,
    alignSelf: "center",
    marginTop: 2,
  },
  contentInfo: {
    paddingHorizontal: 18,
    paddingRight: 50,
    marginTop: 24,
    flex: 1,
  },
  contentText: {
    color: TextPrimary,
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 10,
  },
});
