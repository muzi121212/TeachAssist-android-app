import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { theme } from './Theme';

export const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  togglePasswordVisibility,
  showPassword,
  keyboardType = 'default',
  isPassword = false
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.secondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
        {isPassword && (
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
          >
            <Entypo 
              name={showPassword ? "eye" : "eye-with-line"} 
              size={24} 
              color={theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginVertical: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small
  },
  eyeIcon: {
    position: 'absolute',
    right: theme.spacing.md,
    height: '100%',
    justifyContent: 'center'
  }
});