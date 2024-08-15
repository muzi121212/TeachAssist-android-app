
import { StyleSheet, Text, TextInput, View,TouchableOpacity, KeyboardAvoidingView,ScrollView, StatusBar, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react'
import { Darkgreen, lightgrey } from './component/Color';
import Touchablebutton from './component/Touchablebutton';
import TouchText from './component/TouchText';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './Firebase';
import { doc, addDoc, collection, getFirestore, setDoc, getDoc } from "firebase/firestore";
import messaging from '@react-native-firebase/messaging';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Services from './component/Services';
import { AuthContext } from './Context/AuthContext';

const darkTheme = {
  background: "#1E1E1E",
  text: "#FFFFFF",
  inputBackground: "#333333",
  borderColor: "#555555",
  buttonBackground: "#1E1E1E",
  buttonText: "#FFFFFF",
  placeholder: "#AAAAAA",
  iconColor: "#FFFFFF",
};

const Login = (props) => {
  const { userData, setUserData } = useContext(AuthContext);

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

      async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

    useEffect(() => {
     if (requestUserPermission()){
  //return fcm token for device
  messaging().getToken().then(token => {
    console.log(token)
  });
}
  else{
    console.log('failed token status', authStatus)
  }
    }, [])
    

    const onLogin = async () => {
      setLoading(true);
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user.uid;
    
        setUserData(user);
        await Services.setUserAuth(user);
        console.log('on signin uid is', user);
    
        const token = await messaging().getToken();
        const db = getFirestore();
        const loginDataRef = doc(db, 'loginData', user);
        
        // Get the existing document data
        const docSnap = await getDoc(loginDataRef);
        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const tokens = existingData.tokens || [];
    
          // Check if token already exists in array
          if (!tokens.includes(token)) {
            tokens.push(token);
            await setDoc(loginDataRef, { tokens }, { merge: true }); // Merge with existing data
          }
        } else {
          // Create a new document if it doesn't exist
          await setDoc(loginDataRef, {
            userId: user,
            tokens: [token]
          });
        }
    
        props.navigation.navigate('Home');
      } catch (error) {
        const errorMessage = error.message;
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    

  const togglePasswordVisibility = () => {
    if (!password) {
      alert("Enter a password first!");
      return;
    }
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.background }}>
      <StatusBar
        backgroundColor={darkTheme.background}
        barStyle={"light-content"}
        translucent={true}
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 90, alignItems: "center" }}>
            <Image
            source={require('../assets/icon2.png')} // Path to your image file
            style={{ width: 80, // Set your desired width
              height: 80, // Set your desired height
              resizeMode: 'contain', // Optionally, adjust how the image should be resized 
              marginBottom:50
              }}
          />
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: darkTheme.text,
                }}
              >
                TeachAssist
              </Text>
            </View>

            <Text style={[styles.emailtext, { color: darkTheme.text }]}>
              Email
            </Text>
            <View style={styles.textbox}>
              <TextInput
                style={[
                  styles.Textinputdesign,
                  {
                    backgroundColor: darkTheme.inputBackground,
                    borderColor: darkTheme.borderColor,
                    color: darkTheme.text,
                  },
                ]}
                placeholder="Enter your Email"
                placeholderTextColor={darkTheme.placeholder}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <Text style={[styles.emailtext, { color: darkTheme.text }]}>
              Password
            </Text>
            <View style={styles.textbox}>
              <TextInput
                secureTextEntry={showPassword}
                style={[
                  styles.Textinputdesign,
                  {
                    backgroundColor: darkTheme.inputBackground,
                    borderColor: darkTheme.borderColor,
                    color: darkTheme.text,
                  },
                ]}
                placeholder="Enter your Password"
                placeholderTextColor={darkTheme.placeholder}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <View
                style={{
                  position: "absolute",
                  marginTop: 16,
                  paddingLeft: 270,
                }}
              >
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <Entypo name="eye" size={28} color={darkTheme.iconColor} />
                  ) : (
                    <Entypo
                      name="eye-with-line"
                      size={24}
                      color={darkTheme.iconColor}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchText
              title="Reset Password?"
              onPress={() => props.navigation.navigate("ForgottonPassword")}
              account={{ color: "#ecf0f1" }}
            />

            <Touchablebutton
              title="Login"
              loading={loading}
              buttonStyle={{ backgroundColor: darkTheme.buttonBackground }}
              textStyle={{ color: darkTheme.buttonText, fontSize: 23 }}
              onPress={() => onLogin()}
            />
            

            <TouchText
              onPress={() => props.navigation.navigate("Signup")}
              notaccount={{ color: darkTheme.text }}
              account={{
                marginTop: 15,
                marginRight: 80,
                color: darkTheme.text,
              }}
              title="Don't have an account? Register"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  emailtext: {
    marginLeft: 35,
    marginTop: 30,
  },
  textbox: {
    alignItems: "center",
    marginTop: 8,
  },
  Textinputdesign: {
    height: 55,
    borderWidth: 2,
    width: "90%",
    borderRadius: 10,
    padding: 15,
  },
});




















// import { StyleSheet, Text, TextInput, View,TouchableOpacity, KeyboardAvoidingView,ScrollView } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context';
// import React, { useState, useEffect, useContext } from 'react'
// import { Darkgreen, lightgrey } from './component/Color';
// import Touchablebutton from './component/Touchablebutton';
// import TouchText from './component/TouchText';
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from './Firebase';
// import { doc, addDoc, collection, getFirestore, setDoc, getDoc } from "firebase/firestore";
// import messaging from '@react-native-firebase/messaging';
// import { Entypo } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Services from './component/Services';
// import { AuthContext } from './Context/AuthContext';



// const Login = (props) => {

//   const {userData,setUserData} = useContext(AuthContext)

//     const [email,setEmail] = useState(null);
//     const [password,setPassword] = useState(null);
//     const [loading,setLoading] =useState(false);
//     const [showPassword,setShowPassword] = useState(true)
    
//     async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }
// }

//     useEffect(() => {
//      if (requestUserPermission()){
//   //return fcm token for device
//   messaging().getToken().then(token => {
//     console.log(token)
//   });
// }
//   else{
//     console.log('failed token status', authStatus)
//   }
//     }, [])
    

//     const onLogin = async () => {
//       setLoading(true);
//       const auth = getAuth();
//       try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user.uid;
    
//         setUserData(user);
//         await Services.setUserAuth(user);
//         console.log('on signin uid is', user);
    
//         const token = await messaging().getToken();
//         const db = getFirestore();
//         const loginDataRef = doc(db, 'loginData', user);
        
//         // Get the existing document data
//         const docSnap = await getDoc(loginDataRef);
//         if (docSnap.exists()) {
//           const existingData = docSnap.data();
//           const tokens = existingData.tokens || [];
    
//           // Check if token already exists in array
//           if (!tokens.includes(token)) {
//             tokens.push(token);
//             await setDoc(loginDataRef, { tokens }, { merge: true }); // Merge with existing data
//           }
//         } else {
//           // Create a new document if it doesn't exist
//           await setDoc(loginDataRef, {
//             userId: user,
//             tokens: [token]
//           });
//         }
    
//         props.navigation.navigate('Home');
//       } catch (error) {
//         const errorMessage = error.message;
//         alert(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };
    

//     const togglePasswordVisibility = () => {
//       if (!password) {
//           alert("Enter a password first!");
//           return;
//       }
//       setShowPassword(!showPassword);
//   }

//   return (

//     <SafeAreaView style={{flex:1}}>
//     <KeyboardAvoidingView style={{flex:1}} >
//     <ScrollView style={{flex:1}}>
//     <View style={{flex:1}}>
//      <View style={{marginTop:160,alignItems:'center'}} >
//      <Text style={{fontSize:30,fontWeight:'bold',color:Darkgreen,}} >TeachAssist</Text>

//      </View>

//      <Text style={styles.emailtext}>Email</Text>

//      <View style={styles.textbox} >
//      <TextInput 
     
//      style={styles.Textinputdesign}
//      placeholder='Enter your Email'
//      keyboardType='email-address'
//      value={email}
//      onChangeText={(text)=>setEmail(text)}
//      />
//      </View>
     
//      <Text style={styles.emailtext}>Password</Text>

//      <View style={styles.textbox} >
//      <TextInput 
//      secureTextEntry={showPassword}
//      style={styles.Textinputdesign}
//      placeholder='Enter your Password'
//      value={password}
//      onChangeText={(text)=>setPassword(text)}
//      />
// <View style={{position:'absolute',marginTop:16,paddingLeft:270}}>
// <TouchableOpacity onPress={togglePasswordVisibility}  >
//     { showPassword ? <Entypo name="eye" size={28} color={Darkgreen} /> : <Entypo name="eye-with-line" size={24} color={Darkgreen} /> }
//      </TouchableOpacity>
//      </View>
     
//      </View>

// <TouchText title='Reset Password?'
// onPress={()=>props.navigation.navigate('ForgottonPassword')}
// />

// <Touchablebutton title="Login"
// loading={loading}
// logintext={{fontSize:25}}
// onPress={()=>onLogin()}/>

// <TouchText 
// onPress={()=>props.navigation.navigate('Signup')}
// notaccount={{}}
// account={{marginTop:15,marginRight:80}}
// title="Don't have an account? Register" />

//     </View>
//     </ScrollView>
//     </KeyboardAvoidingView>
//     </SafeAreaView>
//   )
// }

// export default Login

// const styles = StyleSheet.create({
// emailtext:{
//     marginLeft:35,
//         marginTop:30
// },
// textbox:{
//     alignItems:'center',
//     marginTop:8,
    
  
// },
// Textinputdesign:{
//     borderColor:Darkgreen,
//     height:55,
//     backgroundColor:'#E0E0E0',
//     borderWidth:1,
//     width:'90%',
//     borderRadius:10,
//     padding:15
// }
// })





