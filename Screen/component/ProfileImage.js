// import { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image,Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker'
// import { auth, db, storage } from '../Firebase';
// import { Entypo } from '@expo/vector-icons';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { doc, getDoc, setDoc } from 'firebase/firestore';

// const ProfileImage = (props) => {

//     const [image, setImage] = useState(null)
//     const [userImage, setUserImage] = useState(null)

//     const pickimage = async () => {

//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//         if (status !== 'granted') {
//           // Permission denied
//           Alert.alert('Permission Denied', 'Please allow access to the media library to pick an image.');
//           return;
//         }
    
    
    
//         let result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//         })
    
//         console.log(result)
//         if (!result.canceled) {
//           setImage(result.assets[0].uri)
//         }
    
//       }
//       const uploadImage = async (userId, imageUrl) => {
//         const userRef = doc(db, 'userProfile', userId)
//         try {
//           await setDoc(userRef, { Profilepic: imageUrl }, { merge: true })
//           console.log('store in firestoe')
//         } catch (error) {
//           console.error('error updating', error)
//         }
//       }
//       useEffect(() => {
//         const fetcuserpic = async (userId) => {
//           const userRef = doc(db, 'userProfile', userId)
//           const userDoc = await getDoc(userRef)
    
//           if (userDoc.exists()) {
//             const userData = userDoc.data()
//             if (userData.Profilepic) {
//               setUserImage(userData.Profilepic)
//             }
//           }
//         }
    
    
    
//         const handleuploadImage = async () => {
    
    
    
//           if (!image) return;
    
//           const blobImage = await fetch(image).then((response) => response.blob());
//           const metadata = {
//             contentType: 'image/jpeg',
//           }
//           console.log('User UID:', auth.currentUser.uid);
//           // const storagePath = 'ProfileImages/' + auth.currentUser.uid + '_' + Date.now();
          
    
//           const storageRef = ref(storage, 'profileImages/' + auth.currentUser.uid +  '_' + Date.now());
    
//           const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);
    
//           // Listen for state changes, errors, and completion of the upload.
//           uploadTask.on('state_changed',
//             (snapshot) => {
//               // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//               const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//               console.log('Upload is ' + progress + '% done');
//               switch (snapshot.state) {
//                 case 'paused':
//                   console.log('Upload is paused');
//                   break;
//                 case 'running':
//                   console.log('Upload is running');
//                   break;
//               }
//             },
//             (error) => {
//               // A full list of error codes is available at
//               // https://firebase.google.com/docs/storage/web/handle-errors
//               switch (error.code) {
//                 case 'storage/unauthorized':
//                   // User doesn't have permission to access the object
//                   break;
//                 case 'storage/canceled':
//                   // User canceled the upload
//                   break;
    
//                 // ...
    
//                 case 'storage/unknown':
//                   // Unknown error occurred, inspect error.serverResponse
//                   break;
//               }
//             },
//             async () => {
//               // Upload completed successfully, now we can get the download URL
//               const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
//               console.log('File available at', downloadURL);
    
//               setUserImage(downloadURL)
//               uploadImage(auth.currentUser.uid, downloadURL)
    
//             }
//           )
//         }
    
    
//         if (image ) {
//           handleuploadImage();
//           setImage(null)
//         }
//         if (auth.currentUser) {
//           fetcuserpic(auth.currentUser.uid)
//         }
    
//       }, [image])
    
    
    
//       return (
//         <SafeAreaView style={styles.container} >
//         <View style={styles.container}>
  
//           {userImage && (
//             <Image style={{ height: 80, width: 80, borderRadius: 50 }} source={{ uri: userImage }} />
//           ) }
//           <View style={{ height: 80, width: 80, borderRadius: 50,position:'absolute',alignItems:'flex-end',justifyContent:'flex-end' }}  >
//               <TouchableOpacity onPress={pickimage}>
            
//             <Entypo name="camera" size={20} color="black" />
  
           
//               </TouchableOpacity>
//               </View>    
            
  
//         </View>
//       </SafeAreaView>
//       );
//     }
    


// export default ProfileImage

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
     
  
//     },
  
//   });




// Setting.js
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Services from './Services';
import { Entypo } from '@expo/vector-icons';


export default function ProfileImage (props) {
  const [image, setImage] = useState(null);
  const [userImage, setUserImage] = useState(null);

const Imagess = '../../assets/images.jpg';

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      try {
        const userId = await Services.getUserAuth(); // Get the UID using the function from services.js
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.Profilepic) {
            setUserImage(userData.Profilepic);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile picture:', error);
      }
    };

    fetchUserProfilePic();
   
  }, []);

  // Function to pick an image from the device's library
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to the media library to pick an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      
    }
  };

  // Function to upload the picked image to Firebase Storage and update user profile picture in Firestore
  const uploadImage = async (userId, imageUrl) => {
    const userRef = doc(db, 'users', userId);
    try {
      await setDoc(userRef, { Profilepic: imageUrl }, { merge: true });
      console.log('Stored in Firestore');
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  // Function to handle the upload of the picked image
  const handleUploadImage = async () => {
    if (!image) return;

    const blobImage = await fetch(image).then((response) => response.blob());
    const metadata = {
      contentType: 'image/jpeg',
    };

    const userId = await Services.getUserAuth(); // Get the UID using the function from services.js
    const storageRef = ref(storage, 'profileImages/${userId}_${Date.now()');
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Track upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.error('Error uploading image:', error);
      },
      async () => {
        // Upload completed successfully, get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        setUserImage(downloadURL);
        uploadImage(userId, downloadURL);
      }
    );


  };

useEffect(()=>{
  if(image){
    handleUploadImage()
  }
},[image])

  return (
          <SafeAreaView style={styles.container} >
        <View style={styles.container}>
  
          {userImage && (
            <Image style={{ height: 100, width: 100, borderRadius: 50 }} source={{ uri: userImage }} />
          ) }
          <View style={{ height: 100, width: 100,position:'absolute',alignItems:'flex-end',justifyContent:'flex-end',paddingRight:10 }}  >
              <TouchableOpacity onPress={pickImage}>
            
            <Entypo name="camera" size={20} color="black" />
  
           
              </TouchableOpacity>
              </View>    
            
  
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

