import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { theme } from './component/Theme';
import { CustomInput } from './component/CustomInput';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "./Firebase";

const Signup = (props) => {
  const [displayName, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [confirmShowPassword, setConfirmShowPassword] = useState(true);

  const AddData = async () => {
    const db = getFirestore();
    const userdata = doc(db, "userProfile", auth.currentUser.uid);
    await setDoc(userdata, {
      displayName,
      email,
    });
    alert("Data added");
  };

  const onSignup = async () => {
    if (password === confirmPassword) {
      try {
        setLoading(true);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user);
            props.navigation.navigate("Login");
            alert("Please verify your email to continue");
            AddData();
            setLoading(false);
          })
          .catch((error) => {
            alert(error.message);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibilityConfirm = () => {
    setConfirmShowPassword(!confirmShowPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.content} behavior="padding">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your name"
              value={displayName}
              onChangeText={setName}
            />

            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <CustomInput
              label="Password"
              placeholder="Create password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              showPassword={showPassword}
              isPassword
            />

            <CustomInput
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={confirmShowPassword}
              togglePasswordVisibility={togglePasswordVisibilityConfirm}
              showPassword={confirmShowPassword}
              isPassword
            />

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.text.light} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => props.navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    marginVertical: theme.spacing.xl
  },
  logo: {
    width: 80,
    height: 80,
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
  button: {
    width: '90%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
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
  loginButton: {
    marginTop: theme.spacing.xl
  },
  loginText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary
  },
  loginTextBold: {
    color: theme.colors.primary,
    fontWeight: 'bold'
  }
});

export default Signup;
