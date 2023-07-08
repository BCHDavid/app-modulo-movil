import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DishesList from '../components/DishesList';

const backgroundImage = require('../images/Menu.jpg');

const IndexPlatos = ({ navigateTo }) => {
  const [searchWord, setSearchWord] = useState('');
  const handleChange = (text) => {
    setSearchWord(text);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      <ImageBackground source={backgroundImage} style={[styles.backgroundImage]}>
        <View style={[styles.headerContainer]}>
          <TouchableOpacity onPress={() => navigateTo('Login')}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <TextInput
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 10,
              borderRadius: 5,
              height: 40,
              width: 200,
              marginLeft: 15,
              marginRight: 35,
            }}
            placeholder="Search"
            value={searchWord}
            onChangeText={handleChange}
          />
          <TouchableOpacity
            style={{ marginRight: 30 }}
            onPress={() => {
              navigateTo('Cart Items');
            }}
          >
            <Ionicons name="cart-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => {
              navigateTo('Edit Information');
            }}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <DishesList filterKeyword={searchWord} navigateTo={navigateTo}/>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B8862B',
    height: 60,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
export default IndexPlatos;

