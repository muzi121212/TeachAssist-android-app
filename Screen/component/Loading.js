import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Darkgreen } from './Color'

const Loading = (props) => {
const[loading,setLoading] = useState(false)

  return (
    <View style={{justifyContent:'center',alignItems:'center',flex:1, backgroundColor:'#fff'}}>
      <ActivityIndicator size={40} color={Darkgreen} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})