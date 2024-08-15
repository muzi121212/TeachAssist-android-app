// PdfViewer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({ uri }) => {
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri, cache: true }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
});

export default PdfViewer;
