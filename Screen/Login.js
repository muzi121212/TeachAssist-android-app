import { StyleSheet, Text, TextInput, View,TouchableOpacity, KeyboardAvoidingView,ScrollView, StatusBar, Image, ActivityIndicator } from 'react-native'
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
import { theme } from './component/Theme';
import { CustomInput } from './component/CustomInput';

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
  const user = userCredential.user;

  // Check if the user's email is verified
  if (!user.emailVerified) {
    alert("Please verify your email before logging in.");
    setLoading(false);
    return;
  }

  // Set user data and auth
  setUserData(user.uid);
  await Services.setUserAuth(user.uid);
  console.log('On sign-in, UID is:', user.uid);

  // Get FCM token
  const token = await messaging().getToken();

  // Firestore reference
  const db = getFirestore();
  const loginDataRef = doc(db, 'loginData', user.uid);

  // Check for existing login data
  const docSnap = await getDoc(loginDataRef);
  if (docSnap.exists()) {
    const existingData = docSnap.data();
    const tokens = existingData.tokens || [];

    // Add token only if it doesn't already exist
    if (!tokens.includes(token)) {
      tokens.push(token);
      await setDoc(loginDataRef, { tokens }, { merge: true });
    }
  } else {
    // Create new login data
    await setDoc(loginDataRef, {
      userId: user.uid,
      tokens: [token],
    });
  }

  // Navigate to Home screen
  props.navigation.navigate('Home');

}catch (error) {
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="dark-content"
      />
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome </Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <CustomInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              showPassword={showPassword}
              isPassword
            />

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => props.navigation.navigate("ForgottonPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.text.light} />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => props.navigation.navigate("Signup")}
            >
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerTextBold}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl * 2
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: theme.spacing.lg
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary
  },
  form: {
    alignItems: 'center',
    marginTop: theme.spacing.xl
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginVertical: theme.spacing.md
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    ...theme.typography.caption
  },
  button: {
    width: '90%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    ...theme.shadows.medium
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: 18,
    fontWeight: 'bold'
  },
  registerButton: {
    marginTop: theme.spacing.xl
  },
  registerText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary
  },
  registerTextBold: {
    color: theme.colors.primary,
    fontWeight: 'bold'
  }
});





