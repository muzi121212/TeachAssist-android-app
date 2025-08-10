


import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { Entypo,EvilIcons } from '@expo/vector-icons';
import { Darkgreen } from './component/Color';


const PDFViewerScreen = () => {
  const route = useRoute();
  const { pdfUri, document } = route.params;
  const { crWhatsappNumber, crEmail } = route.params;
  console.log(crWhatsappNumber)
  console.log(crEmail)

  const navigation = useNavigation();
  const [webViewKey, setWebViewKey] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const webViewRef = useRef(null)
console.log(pdfUri)
  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleRefresh = () => {
    handleLoadStart()
    setRefreshing(true);
    // Increment the key to force a WebView rerender
    setWebViewKey((prevKey) => prevKey + 1);
    setRefreshing(false);
    handleLoadEnd()
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleShareOptionSelected = (option) => {
    setShareModalVisible(false);
    if (option === 'whatsapp') {
      shareViaWhatsApp();
    } else if (option === 'email') {
      shareViaEmail();
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Notes for today's topic:`;
    const url = document.uri;
    const whatsappShareUrl = `whatsapp://send?text=${encodeURIComponent(message + '\n' + url)}`;
    Linking.openURL(whatsappShareUrl).catch((err) => console.error('Error opening WhatsApp:', err));
  };

  const shareViaEmail = () => {
    const message = `Notes for today's topic:`;
    const url = document.uri;
    const emailBody = `${message}\n${url}`;
    const emailSubject = "Subject"; // Provide subject if needed
    Linking.openURL(`mailto:${crEmail}?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`);
  };

  return (
    <View style={{ flex: 1 }}>

     <View style={{ height: 50, width: '100%', backgroundColor: Darkgreen, marginTop: 33, flexDirection: 'row', alignItems: 'center' }}>
     <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
       <Entypo name="chevron-left" size={24} color="white" />
     </TouchableOpacity>
     <Text numberOfLines={1} style={{ color: 'white', marginLeft: 10,paddingRight:90 }}>{document.name}</Text>
     <TouchableOpacity onPress={handleRefresh} style={{ marginLeft: 'auto', padding: 10 }}>
       {/* <Entypo name="share" size={24} color="white" /> */}
       <EvilIcons name='refresh' color={'white'} size={30}/>
     </TouchableOpacity>
   </View>

    
      <WebView
        ref={webViewRef}
        key={webViewKey}
        source={{ uri: pdfUri }}
        style={{ flex: 1, height: '100%', width: '100%' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
      />
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size={40} color={Darkgreen} />
        </View>
      )}
  <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Entypo name="share" size={24} color="white" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Entypo name="cycle" size={24} color="white" />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View> 
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
   <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => {
          setShareModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleShareOptionSelected('whatsapp')}>
              <Text style={styles.modalOptionText}>Share via WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleShareOptionSelected('email')}>
              <Text style={styles.modalOptionText}>Share via Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShareModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> 
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4285f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalCancel: {
    paddingVertical: 15,
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
});

export default PDFViewerScreen;
