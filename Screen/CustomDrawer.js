// // ... (previous imports)

// const Home = (props) => {
//     const [data, setData] = useState([]);
//     const [email, setEmail] = useState([]);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [courses, setCourses] = useState([]);
//     const [newCourse, setNewCourse] = useState({
//       courseName: '',
//       description: '',
//     });
//     const [courseNameError, setCourseNameError] = useState('');
  
//     // ... (previous code)
  
//     const addCourse = async () => {
//       if (!newCourse.courseName.trim()) {
//         // Display an error if the courseName is empty
//         setCourseNameError('This field is required');
//         return;
//       }
  
//       try {
//         // Include creation timestamp and instructor information
//         const timestamp = serverTimestamp();
  
//         await addDoc(courseCollection, {
//           ...newCourse,
//           createdBy: uid,
//           createdAt: timestamp,
//         });
//         setModalVisible(false);
//         console.log('Course added successfully!');
//         // Fetch and update the courses after adding a new course
//         fetchAndSetCourses();
//       } catch (error) {
//         console.error('Error adding course: ', error);
//       }
//     };
  
//     return (
//       <View style={styles.container}>
//         {/* ... (previous code) */}
//         <Modal transparent={true} visible={isModalVisible} animationType="slide">
//           <View style={styles.modal}>
//             <TextInput
//               style={[
//                 styles.input,
//                 { height: 60, borderColor: courseNameError ? 'red' : '#E8EAF6' },
//               ]}
//               placeholder="Course Name"
//               value={newCourse.courseName}
//               onChangeText={(text) => {
//                 setNewCourse((prev) => ({ ...prev, courseName: text }));
//                 setCourseNameError(''); // Reset the error when typing
//               }}
//             />
//             {courseNameError ? (
//               <Text style={{ color: 'red' }}>{courseNameError}</Text>
//             ) : null}
//             {/* ... (previous code) */}
//           </View>
//         </Modal>
//         {/* ... (previous code) */}
//       </View>
//     );
//   };
  
//   export default Home;
  




// // // Timetable.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, setDoc, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from './Firebase'; // Import your Firebase configuration
import * as Notifications from 'expo-notifications';


const Timetable = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    // Fetch the list of courses for the current user when the component mounts
    fetchUserCourses();
  
    // Request notification permissions
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Notification permission not granted!');
      }
    })();
  }, []);

  const fetchUserCourses = async () => {
    try {
      const user = auth.currentUser;
      const uid = user.uid;

      const coursesCollection = collection(db, 'courses');
      const coursesQuery = query(coursesCollection, where('createdBy', '==', uid), orderBy('createdAt', 'desc'));
      const coursesSnapshot = await getDocs(coursesQuery);

      const coursesData = coursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleTimePickerChange = (event, selected) => {
    setShowTimePicker(false);
    if (selected !== undefined) {
      setSelectedTime(selected);
    }
  };

  const saveTimetableEntry = async () => {
    if (!selectedCourse) {
      // Handle the case where no course is selected
      return;
    }

    try {
      const timetableCollection = collection(db, 'timetables');
      const user = auth.currentUser;
      const uid = user.uid;

      const timetableData = {
        courseId: selectedCourse.id,
        createdBy: uid,
        day: selectedDay,
        time: selectedTime,
      };

      await addDoc(timetableCollection, timetableData);
      // You can add a success message or navigate to another screen after saving
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Timetable Reminder',
          body: `Don't forget your ${selectedCourse.courseName} class on ${selectedDay} at ${selectedTime.toLocaleTimeString()}`,
        },
        trigger: {
          hour: selectedTime.getHours(),
          minute: selectedTime.getMinutes(),
          repeats: true, // Repeat the notification if needed
          weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(selectedDay),
        },
      });
  
      // You can add a success message or navigate to another screen after saving
    
    } catch (error) {
      console.error('Error saving timetable entry:', error);
    }
  };

  return (
    <View>
      <Text>Select Course:</Text>
      <Picker
        selectedValue={selectedCourse}
        onValueChange={(itemValue) => setSelectedCourse(itemValue)}
      >
        <Picker.Item label="Select a course" value={null} />
        {courses.map((course) => (
          <Picker.Item key={course.id} label={course.courseName} value={course} />
        ))}
      </Picker>

      <Text>Select Day:</Text>
      <Picker
        selectedValue={selectedDay}
        onValueChange={(itemValue) => setSelectedDay(itemValue)}
      >
        <Picker.Item label="Monday" value="Monday" />
        <Picker.Item label="Tuesday" value="Tuesday" />
        <Picker.Item label="Sunday" value="" />
        {/* Add other days as needed */}
      </Picker>

      <Text>Select Time:</Text>
      <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimePickerChange}
        />
      )}

      <Button title="Save Timetable Entry" onPress={saveTimetableEntry} />
    </View>
  );
};

export default Timetable;




