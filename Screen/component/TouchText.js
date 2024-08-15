import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'

const TouchText = (props) => {

  const togglePasswordVisibility = () => {
    // Check if the password is empty before toggling visibility
    if (!password) {
        alert("Enter a password first!");
        return;
    }

    setShowPassword(!showPassword);
}
  return (
    <TouchableOpacity style={{...props.notaccount}} onPress={()=>props.onPress()} >
    <Text style={{alignSelf:'flex-end',marginTop:4,marginRight:20,...props.account}}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default TouchText

const styles = StyleSheet.create({})