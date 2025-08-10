import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { Accent, Secondary, TextPrimary } from './Color'

const TouchText = (props) => {
  return (
    <TouchableOpacity style={[styles.touch, props.notaccount]} onPress={props.onPress}>
      <Text style={[styles.text, props.account]}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default TouchText

const styles = StyleSheet.create({
  touch: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginRight: 20,
  },
  text: {
    color: Accent,
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
    letterSpacing: 0.2,
  },
})