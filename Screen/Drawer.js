import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItemList,DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import Home from './Home';
import Settings from './Settings';
import Courses from './Courses';

const Drawer = createDrawerNavigator();


function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Image style={{position:'absolute',height:100,width:100}} source={require('../assets/icon.png')}/>
    </DrawerContentScrollView>
  );
}

const DrawerScreen = () => {
  return (
    <Drawer.Navigator   drawerContent={(props)=> <CustomDrawerContent {...props}/>}>
      <Drawer.Screen
        name="Home"
        component={Home}
       
      />
      <Drawer.Screen
      name="Settings"
      component={Settings}
     
    />
 
      </Drawer.Navigator>
  )
}

export default DrawerScreen

const styles = StyleSheet.create({})