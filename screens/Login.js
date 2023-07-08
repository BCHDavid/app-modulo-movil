import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { getClient } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('../images/Login.jpg');

const Login = ({ navigateTo }) => {
    const [inputUser, setInputUser] = useState({
        Email: '',
        Password: ''
    });
    const handleChange = (name, value) => {
        setInputUser({ ...inputUser, [name]: value });
    };
    const handleSubmit = async () => {
        if (inputUser.Email === '' || inputUser.Password === '') {
            Alert.alert('Error', 'Please, fill in all fields')
        } else {
            const response = await getClient(inputUser.Email);
            if (!response.client || response.client.email !== inputUser.Email) {
                Alert.alert('Error', 'Invalid email, please create a valid account');
            } else if (response.client.password !== inputUser.Password){
                Alert.alert('Error', `Wrong password for ${response.client.client_full_name}`);
            } else if (response.client.client_state === 'disable') {
                Alert.alert('Error',`User ${response.client.client_full_name} disable`)
            } else {
                const client = {
                    id: response.client.client_id,
                    full_name: response.client.client_full_name,
                    email: response.client.email,
                    address: response.client.address,
                    password: response.client.password,
                };
                await AsyncStorage.setItem('Client', JSON.stringify(client));
                setTimeout(() => {
                    navigateTo('IndexPlatos');
                }, 1000);
            };
        };
    };
    const handleRedirect = () => {
        navigateTo('Register');
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#333333" />
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.botonRegister} onPress={handleRedirect}>
                    <Text style={styles.botonText}>Register</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.Input}
                    placeholder="Email"
                    onChangeText={(text) => handleChange('Email', text)}
                    value={inputUser.Email}
                />
                <TextInput
                    style={styles.Input}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => handleChange('Password', text)}
                    value={inputUser.Password}
                />
                <TouchableOpacity style={styles.botonLogin} onPress={handleSubmit}>
                    <Text style={styles.botonText}>Login</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16
    },
    Input: {
        width: '80%',
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 25,
        paddingHorizontal: 12,
        borderRadius: 5
    },
    botonLogin: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#333333',
        borderRadius: 5,
        width: '25%',
        height: 35,
        marginBottom: 10
    },
    botonRegister: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#333333',
        borderRadius: 5,
        width: '25%',
        height: 35,
        marginBottom: 10,
    },
    botonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center'
    }
});

export default Login;
