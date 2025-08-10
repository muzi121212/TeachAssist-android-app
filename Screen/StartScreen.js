import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Services from './component/Services';

const { width } = Dimensions.get('window');

const StartScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [courseNames, setCourseNames] = useState({});

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  const fetchUpcomingClass = async () => {
    try {
      const uid = await Services.getUserAuth();
      const db = getFirestore();
      
      // First fetch all courses to get course names
      const courseCollection = collection(db, "courses");
      const courseQuery = query(courseCollection, where("Uid", "==", uid));
      const courseSnapshot = await getDocs(courseQuery);
      const courseMap = {};
      courseSnapshot.docs.forEach(doc => {
        courseMap[doc.id] = doc.data().courseName;
      });
      setCourseNames(courseMap);

      // Then fetch notifications as before
      const timetableCollection = collection(db, "notifications");
      const q = query(timetableCollection, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      const today = new Date();
      const currentDay = today.getDay();
      const currentTime = today.getHours() * 60 + today.getMinutes();

      let nextClass = null;
      let minTimeDiff = Infinity;

      querySnapshot.docs.forEach(doc => {
        const notification = doc.data();
        const [hours, minutes] = notification.time.split(':').map(Number);
        const classTime = hours * 60 + minutes;
        
        if (notification.day === currentDay && classTime > currentTime) {
          const timeDiff = classTime - currentTime;
          if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            nextClass = notification;
          }
        } else if (notification.day > currentDay || (notification.day < currentDay)) {
          const daysUntilClass = notification.day > currentDay 
            ? notification.day - currentDay 
            : 7 - currentDay + notification.day;
          const totalMinutes = daysUntilClass * 24 * 60 + classTime - currentTime;
          if (totalMinutes < minTimeDiff) {
            minTimeDiff = totalMinutes;
            nextClass = notification;
          }
        }
      });

      setUpcomingClass(nextClass);
    } catch (error) {
      console.error("Error fetching upcoming class:", error);
    }
  };

  useEffect(() => {
    fetchUpcomingClass();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUpcomingClass().then(() => setRefreshing(false));
  }, []);

  const QuickAccessCard = ({ icon, title, subtitle, onPress, color }) => (
    <TouchableOpacity 
      style={[styles.quickAccessCard, { backgroundColor: color }]}
      onPress={onPress}
    >
      {icon}
      <Text style={styles.quickAccessTitle}>{title}</Text>
      <Text style={styles.quickAccessSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={require('../assets/icon.jpg')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Access Section */}
      <View style={styles.quickAccessContainer}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          <QuickAccessCard
            icon={<MaterialIcons name="class" size={24} color="#FFF" />}
            title="Courses"
            subtitle="View your courses"
            onPress={() => navigation.navigate('Courses')}
            color="#4CAF50"
          />
          <QuickAccessCard
            icon={<MaterialIcons name="event" size={24} color="#FFF" />}
            title="Timetable"
            subtitle="Check schedule"
            onPress={() => navigation.navigate('Timetable')}
            color="#2196F3"
          />
        </View>
      </View>

      {/* Upcoming Events Section */}
      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Upcoming Class</Text>
        <View style={styles.eventCard}>
          {upcomingClass ? (
            <>
              <View style={styles.eventHeader}>
                <Ionicons name="time" size={24} color="#4CAF50" />
                <Text style={styles.eventDate}>
                  {getDayName(upcomingClass.day)}
                </Text>
              </View>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>
                  {courseNames[upcomingClass.courseId] || "Unknown Course"}
                </Text>
                <Text style={styles.eventTime}>
                  {upcomingClass.time} - {upcomingClass.endTime}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.noClassText}>No upcoming classes</Text>
          )}
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.quickLinksContainer}>
        <TouchableOpacity 
          style={styles.quickLink}
          onPress={() => navigation.navigate('Datesheet')}
        >
          <FontAwesome5 name="calendar-alt" size={20} color="#4CAF50" />
          <Text style={styles.quickLinkText}>Date Sheet</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickLink}
          onPress={() => navigation.navigate('Holiday')}
        >
          <FontAwesome5 name="umbrella-beach" size={20} color="#4CAF50" />
          <Text style={styles.quickLinkText}>Holidays</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerContainer: {
    backgroundColor: '#4CAF50',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dateText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 5,
  },
  profileButton: {
    padding: 2,
    backgroundColor: '#FFF',
    borderRadius: 27,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  quickAccessContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  quickAccessTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  quickAccessSubtitle: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 5,
  },
  eventsContainer: {
    padding: 20,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventDate: {
    marginLeft: 10,
    color: '#666',
  },
  eventContent: {
    marginLeft: 34,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  quickLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 20,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    width: (width - 60) / 2,
    elevation: 2,
  },
  quickLinkText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  noClassText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  }
});

export default StartScreen;