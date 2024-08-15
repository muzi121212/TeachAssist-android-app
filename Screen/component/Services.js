// import AsyncStorage from "@react-native-async-storage/async-storage";

// const setUserAuth = async(value) => {
// await AsyncStorage.setItem('userData',JSON.stringify(value))
// }

// const getUserAuth =async () => {
// const value = AsyncStorage.getItem('userData')
// console.log('async uid',value)
// return JSON.parse(value)
// }

// export default {
//     setUserAuth,
//     getUserAuth
// }



// import AsyncStorage from "@react-native-async-storage/async-storage";

// const setUserAuth =async(value) => {
// await AsyncStorage.setItem('userData',JSON.stringify(value))
// }


// const getUserAuth =async() => {
//   const value =  await AsyncStorage.getItem('userData')
//   console.log("from asyncstorage",value)
//   return JSON.parse(value)
// }

// const Logout = ()=>{
//   AsyncStorage.clear()
// }

// export default {
//     setUserAuth,
//     getUserAuth,
//     Logout
// }



import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import messaging from '@react-native-firebase/messaging';

const setUserAuth = async (value) => {
  await AsyncStorage.setItem('userData', JSON.stringify(value));
}

const getUserAuth = async () => {
  const value = await AsyncStorage.getItem('userData');
  console.log("from asyncstorage", value);
  return JSON.parse(value);
}

const Logout = async () => {
  try {
    // Get the user ID from AsyncStorage
    const user = await getUserAuth();
    if (!user) {
      // No user found, just sign out
      await signOut(auth);
      return;
    }

    // Clear AsyncStorage
    AsyncStorage.clear();

    // Sign out from Firebase Auth
    await signOut(auth);

    // Access Firestore
    const db = getFirestore();
    const loginDataRef = doc(db, 'loginData', user);

    // Get the document snapshot
    const docSnap = await getDoc(loginDataRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const tokens = userData.tokens || [];

      // Get the current device token
      const currentToken = await messaging().getToken();

      // Remove the current device token from the array
      const updatedTokens = tokens.filter(token => token !== currentToken);

      if (updatedTokens.length > 0) {
        // Update Firestore document with the new tokens array
        await updateDoc(loginDataRef, { tokens: updatedTokens });
      } else {
        // If no more tokens left, delete the document
        await deleteDoc(loginDataRef);
      }
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export default {
  setUserAuth,
  getUserAuth,
  Logout
};

