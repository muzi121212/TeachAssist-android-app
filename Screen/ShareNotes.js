






import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert, FlatList, Modal, TextInput, Button } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'; // Import Popup Menu
import * as DocumentPicker from 'expo-document-picker';
import { auth, db, storage } from './Firebase';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getFirestore } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Services from './component/Services'; // Import the services file
import Modalbtn from './component/Modalbtn';
import Loading from './component/Loading';
import * as Permissions from 'expo-permissions'; // Import Permissions module
import { Darkgreen } from './component/Color';
import { Primary, Secondary, Accent, Background, Surface, TextPrimary, TextSecondary } from './component/Color';
import CircularProgressIndicator from 'react-native-circular-progress-indicator';
import CircularProgress from 'react-native-circular-progress-indicator';


export default function Notes(props) {
  const [documents, setDocuments] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
const route = useRoute()
  const { courseId } = route.params;
  const { crWhatsappNumber, crEmail } = route.params;
console.log(crWhatsappNumber)



  // useEffect(() => {
  //   // Check for permissions when the component mounts
  //   checkPermissions();
  // }, []);

  // const checkPermissions = async () => {
  //   // Check if storage permissions are granted
  //   const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  //   if (status !== 'granted') {
  //     // Permissions not granted, notify the user
  //     Alert.alert('Permission required', 'Please enable storage permissions to pick documents.');
  //   }
  // };



  const pickDocument = async () => {

    

    const result = await DocumentPicker.getDocumentAsync({
           type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    multiple: true,
    });

    if (!result.canceled) {
      setDocuments(result.assets.map(asset => ({ uri: asset.uri, name: asset.name })));
    } else {
      Alert.alert('You Did not select any document');
    }
  };

  // const uploadDocument = async (userId, documentInfo) => {
  //   const userDocumentsCollection = collection(db, 'userDocuments');

  //   try {
  //     const docRef = await addDoc(userDocumentsCollection, {
  //       userId: userId,
  //       documentUrl: documentInfo.uri,
  //       documentName: documentInfo.name,
  //     });
  //     console.log('Document stored in Firestore with ID: ', docRef.id);
  //   } catch (error) {
  //     console.error('Error adding document to Firestore', error);
  //   }
  // };

  const fetchUserDocuments = async (userId) => {
    setLoading(true)
    const userDocumentsCollection = collection(db, 'userDocuments');
    const querySnapshot = await getDocs(userDocumentsCollection);

    const documents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId &&  data.courseId === courseId) {
        documents.push({ id: doc.id, name: data.documentName, uri: data.documentUrl });
      }
    });

    setUserDocuments(documents);
    setLoading(false)
  };

  useEffect(() => {
    if (documents.length > 0) {
      handleUploadDocuments();
      setDocuments([]);
    }

    Services.getUserAuth().then((uid) => {
      if (uid) {
        fetchUserDocuments(uid, courseId);
      }
    });
  }, [documents]);
  const handleUploadDocuments = async () => {
    if (documents.length === 0) return;
    setUploading(true);

    const uploadPromises = documents.map(async (document) => {
      const blobDocument = await fetch(document.uri).then((response) => response.blob());
      const metadata = {
        contentType: getContentType(document.name),
      };

      const uid = await Services.getUserAuth();
      if (uid) {
        const storageRef = ref(storage, `userDocuments/${uid}_${Date.now()}`);

        const uploadTask = uploadBytesResumable(storageRef, blobDocument, metadata);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
              setUploadProgress(progress);
            },
            (error) => {
              console.error('Document upload error', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Document available at', downloadURL);

              const docRef = await addDoc(collection(db, 'userDocuments'), {
                userId: uid,
                courseId: courseId,
                documentUrl: downloadURL,
                documentName: document.name,
              });

              console.log('Document stored in Firestore with ID: ', docRef.id);
              setUserDocuments((prevDocs) => [
                ...prevDocs,
                { id: docRef.id, name: document.name, uri: downloadURL },
              ]);
              resolve();
            }
          );
        });
      }
    });

    await Promise.all(uploadPromises);
    setUploadProgress(100);
    setUploadComplete(true);
    setUploading(false);
  };

const getContentType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'ppt':
      return 'application/vnd.ms-powerpoint';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'pptx':
          return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    default:
      return 'application/octet-stream'; // Default content type if extension not recognized
  }
};


  const editDocumentName = async (docId, newName) => {
    try {

      const originalDocument = userDocuments.find(doc => doc.id === docId)

      if(!originalDocument){
console.log('document not found')
      }

      const originalExt = originalDocument.name.split('.').pop().toLowerCase();

      const newExt = newName.split('.').pop().toLowerCase();
      if(newExt !== originalExt){
newName=newName+ '.' + originalExt;
      }

      const userDocumentsCollection = collection(db, 'userDocuments');
      const documentRef = doc(userDocumentsCollection, docId);

      await updateDoc(documentRef, {
        documentName: newName,
      });

      // Update the userDocuments state with the new document name
      setUserDocuments((prevUserDocuments) =>
        prevUserDocuments.map((doc) => {
          if (doc.id === docId) {
            return { ...doc, name: newName };
          } else {
            return doc;
          }
        })
      );

      console.log('Document name updated successfully!');
    } catch (error) {
      console.error('Error updating document name:', error);
    }
  };

  const openModal = (initialName, docId) => {
    setSelectedDocumentId(docId);
    setNewDocumentName(initialName);
    setIsModalVisible(true);
  };

  const saveDocumentName = async () => {
    try {
      await editDocumentName(selectedDocumentId, newDocumentName);
      setIsModalVisible(false);
      setNewDocumentName('');
    } catch (error) {
      console.error('Error updating document name:', error);
    }
  };

  const deleteDocument = async (docId) => {
    console.log('Deleting document with ID:', docId); // Add this line
    try {
      const db = getFirestore();
      const userDocumentcollection = collection(db, 'userDocuments');
      console.log('Deleting document  ID:', userDocumentcollection);
      const doRef = doc(userDocumentcollection, docId);
      console.log('Deleting document  :', doRef);
      await deleteDoc(doRef);
  
      setUserDocuments(userDocuments.filter((doc) => doc.id !== docId));
      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  
  if(loading){
    return <Loading/>
    }
    
    if (uploading) {
      return (
        <View style={styles.uploadProgressContainer}>
          <CircularProgress
            size={120}
            value={uploadProgress}
            titleColor='white'
            valueSuffix={'%'}
            duration={2000} // Adjust duration as needed
            
            inactiveStrokeColor="gray"
            
          
            percent={uploadProgress}
            activeStrokeSecondaryColor="transparent"
            // progressFormatter={(value: number) => {
            //   'worklet';
                
            //   return value.toFixed(2); // 2 decimal places
            // }}
          />
          <Text style={{color:'white',marginTop:10}} >Uploading,Please wait</Text>
        </View>
      );
    }
    
  

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Background }]}> 
    <MenuProvider>
      <View style={styles.container}>
        <View style={{ marginTop: 50, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginLeft: 7 }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={Primary} />
          </TouchableOpacity>

          <Text style={{ marginLeft: 13, fontSize: 22, fontWeight: 'bold', color: Primary }}>Notes</Text>
        </View>

        {/* {uploadProgress > 0 && uploadProgress < 100 && (
          <View style={{
            position:'absolute',top:'50%',left:0,right:0,alignItems:'center',justifyContent:'center'
          }}>
            <Text style={{fontSize:20,fontWeight:'bold'}} >{uploadProgress}%</Text>
          </View>
        )}
        {uploadComplete && (
          <View  style={{position:'absolute',top:'50%',left:0,right:0,alignItems:'center',justifyContent:'center'}}>
           <Ionicons name='checkmark-circle-outline' size={50} color={Darkgreen} />
          </View>
        )} */}

<Modalbtn 

onPress={pickDocument}/>


        <View style={{ height: 2, width: '100%', backgroundColor: Primary , marginTop: 9 }}></View>

        {userDocuments.length > 0 && (
          <FlatList
            data={userDocuments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.noteCard}>  
                <View style={styles.noteRow}>
                  <FontAwesome name="file-text" size={20} color={Primary} />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('pdf', {
                        crEmail,
                        crWhatsappNumber,
                        document: item,
                        pdfUri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
                          item.uri
                        )}`,
                      })
                    }
                  >
                    <Text numberOfLines={1} style={styles.noteName}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.noteMenu}>
                  <Menu >
                    <MenuTrigger>
                      <Ionicons  name="ellipsis-vertical" size={24} color={Accent}  />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption onSelect={() => openModal(item.name, item.id)} text="Rename" />
                      <MenuOption onSelect={() => deleteDocument(item.id)} text="Delete " />
                    </MenuOptions>
                  </Menu>
                </View>
              </View>
            )}
          />
        )}
        

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter new document name"
                placeholderTextColor={TextSecondary}
                value={newDocumentName}
                onChangeText={(text) => setNewDocumentName(text)}
              />
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalButton} onPress={saveDocumentName}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={()=>setIsModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      </MenuProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Background,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Surface,
    padding: 24,
    borderRadius: 16,
    elevation: 6,
    minWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: TextPrimary,
    backgroundColor: Background,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: Primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalButtonCancel: {
    backgroundColor: Secondary,
  },
  modalButtonText: {
    color: Surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadProgressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  noteCard: {
    borderWidth: 1.5,
    borderColor: Primary,
    backgroundColor: Surface,
    minHeight: 60,
    width: '90%',
    marginTop: 12,
    borderRadius: 16,
    marginLeft: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'center',
  },
  noteRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20,
    alignItems: 'center',
  },
  noteName: {
    marginLeft: 20,
    paddingRight: 90,
    color: TextPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  noteMenu: {
    alignSelf: 'flex-end',
    marginTop: -22,
    marginRight: 6,
  },
});

