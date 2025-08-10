import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator
} from "react-native";
import React, { useState } from "react";
import { Darkgreen, Primary, Secondary, Accent, Background, Surface, TextPrimary, TextSecondary } from "./component/Color";
import Touchablebutton from "./component/Touchablebutton";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from './component/Theme';
import { CustomInput } from './component/CustomInput';

const darkTheme = {
  background: "#1E1E1E",
  text: "#FFFFFF",
  inputBackground: "#333333",
  borderColor: "#555555",
  buttonBackground: "#4CAF50",
  buttonText: "#FFFFFF",
  placeholder: "#AAAAAA",
  iconColor: "#FFFFFF",
};

const ForgottonPassword = (props) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const forgot = () => {
    const auth = getAuth();
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        alert("Password reset email sent");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Reset Password
          </Text>
          <Text style={styles.subtitle}>
            Enter your email to receive instructions
          </Text>
        </View>

        <CustomInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={forgot}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.text.light} />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgottonPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl * 2
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: theme.spacing.xl
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl
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
  backButton: {
    marginTop: theme.spacing.xl
  },
  backButtonText: {
    color: theme.colors.primary,
    ...theme.typography.body,
    fontWeight: '500'
  }
});
