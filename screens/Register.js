import { View, Text, TextInput, ImageBackground, StyleSheet, Alert, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { saveClient } from '../api';
import { getClient } from '../api';

const backgroundImage = require('../images/Register.jpg');

const Register = ({ navigateTo }) => {
    const [inputsUser, setInputsUser] = useState({
        full_name: '',
        email: '',
        address: '',
        password: '',
        client_state: 1,
        confirpassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPassworConfirm] = useState(false);

    const handleChange = (name, value) => { setInputsUser({ ...inputsUser, [name]: value }) };
    const handleSubmit = async () => {
        if ((inputsUser.email && inputsUser.full_name && inputsUser.address && inputsUser.password && inputsUser.confirpassword) === '') {
            Alert.alert('Error', 'Please, fill in all fields')
        } else if (inputsUser.password !== inputsUser.confirpassword) {
            Alert.alert('Error', 'Passwords differ');
        } else if (!validateEmail(inputsUser.email)) {
            Alert.alert('Error', 'Please, insert a valid email');
        } else if (inputsUser.password.length < 8) {
            Alert.alert('Error', `Requiere at least 8 characters, you are missing ${8 - inputsUser.password.length} characters`);
        } else {

            const response = await getClient(inputsUser.email)
            if (!response.client) {
                await saveClient({
                    full_name: inputsUser.full_name,
                    email: inputsUser.email,
                    address: inputsUser.address,
                    password: inputsUser.password,
                    client_state: 1
                });
                setTimeout(() => {
                    navigateTo('Login');
                }, 1000);
            } else {
                Alert.alert('Error', `Email ${inputsUser.email} is in use`);
            };
        };
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordConfirmVisibility = () => {
        setShowPassworConfirm(!showPasswordConfirm);
    };
    const handleRedirect = () => {
        navigateTo('Login');
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#333333" />
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.botonLogin} onPress={handleRedirect}>
                    <Text style={styles.botonText}>Login</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.Input, {backgroundColor: '#999999'}]}
                    placeholder='Email'
                    onChangeText={(text) => handleChange('email', text)}
                    value={inputsUser.email}
                />
                <TextInput
                    style={[styles.Input, {backgroundColor: '#999999'}]}
                    placeholder='Full Name'
                    onChangeText={(text) => handleChange('full_name', text)}
                    value={inputsUser.full_name}
                />
                <TextInput
                    style={[styles.Input, {backgroundColor: '#999999'}]}
                    placeholder='Address'
                    onChangeText={(text) => handleChange('address', text)}
                    value={inputsUser.address}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.passwordInput, {backgroundColor: '#999999'}]}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => handleChange('password', text)}
                        value={inputsUser.password}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <FontAwesome
                            name={showPassword ? 'eye' : 'eye-slash'}
                            size={20}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.passwordInput, {backgroundColor: '#999999'}]}
                        placeholder='Confirm Password'
                        secureTextEntry={!showPasswordConfirm}
                        onChangeText={(text) => handleChange('confirpassword', text)}
                        value={inputsUser.confirpassword}
                    />
                    <TouchableOpacity onPress={togglePasswordConfirmVisibility} style={styles.eyeIcon}>
                        <FontAwesome
                            name={showPasswordConfirm ? 'eye' : 'eye-slash'}
                            size={20}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.botonRegister} onPress={handleSubmit}>
                    <Text style={styles.botonText}>Register</Text>
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
        alignItems: 'center',
    },
    Input: {
        width: '80%',
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 25,
        paddingHorizontal: 12,
        color: 'black',
        fontWeight: 'bold',
        borderRadius: 5
    },
    botonRegister: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#333333',
        borderRadius: 5,
        width: '30%',
        height: 35,
        marginBottom: 10,
    },
    botonLogin: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#333333',
        borderRadius: 5,
        width: '20%',
        height: 35,
        marginBottom: 10,
    },
    botonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    passwordContainer: {
        position: 'relative',
        width: '87%',
        marginBottom: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        height: 40,
        marginBottom: 15,
        paddingHorizontal: 12,
        color: 'black',
        fontWeight: 'bold',
        borderRadius: 5
    },
    eyeIcon: {
        position: 'absolute',
        top: 10,
        right: 20,
    },
});

export default Register;