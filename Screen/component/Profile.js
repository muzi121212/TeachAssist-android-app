// ProfileImage.js
import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from './Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileImage = () => {
  const [image, setImage] = useState(null);
  const [userImage, setUserImage] = useState(null);

  const pickImage = async () => {
    // Image picking logic remains the same
  };

  const uploadImage = async (userId, imageUrl) => {
    // Upload image logic remains the same
  };

  useEffect(() => {
    const fetchUserPic = async (userId) => {
      // Fetch user image logic remains the same
    };

    const handleUploadImage = async () => {
      // Image upload handling logic remains the same
    };

    if (image) {
      handleUploadImage();
      setImage(null);
    }

    if (auth.currentUser) {
      fetchUserPic(auth.currentUser.uid);
    }
  }, [image]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {userImage && (
        <Image style={{ height: 100, width: 100, borderRadius: 50 }} source={{ uri: userImage }} />
      )}
      <View
        style={{
          height: 100,
          width: 100,
          borderRadius: 50,
          position: 'absolute',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity onPress={pickImage}>
          <Entypo name="camera" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileImage;
