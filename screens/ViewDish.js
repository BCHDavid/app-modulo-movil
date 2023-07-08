import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, Alert, StatusBar, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDish } from '../api';
import { Modal } from 'react-native';

const backgroundImage = require('../images/ViewDish.jpg');

const ViewDish = ({ navigateTo }) => {
    const [dish, setDish] = useState({
        dish_id: '',
        dish_name: '',
        image: '',
        description: '',
        price: ''
    });
    const [showImageModal, setShowImageModal] = useState(false);
    const [showCantModal, setShowCantModal] = useState(false);
    const [quantity, setQuantity] = useState('');
    useEffect(() => {
        const getDishFromStorage = async () => {
            try {
                const dishData = await AsyncStorage.getItem('dishSelect');
                if (dishData) {
                    const parsedDishData = JSON.parse(dishData);
                    setDish(parsedDishData);
                    const data = await getDish(parsedDishData.dish_id);
                    setDish(prevState => ({
                        ...prevState,
                        image: data.dish.image
                    }));
                };
            } catch (error) {
                console.log('Error al obtener el plato:', error);
            };
        };
        getDishFromStorage();
    }, []);
    const addToCart = async (key, value) => {
        try {
            const cartItems = await AsyncStorage.getItem(key);
            if (cartItems) {
                const parsedCartItems = JSON.parse(cartItems);
                parsedCartItems.push(value);
                await AsyncStorage.setItem(key, JSON.stringify(parsedCartItems));
            } else {
                await AsyncStorage.setItem(key, JSON.stringify([value]));
            };
        } catch (error) {
            console.log('Error al agregar el plato al carrito:', error);
        };
    };
    const handleAddToCart = async () => {
        const cartItems = await AsyncStorage.getItem('cartItems');
        if (!cartItems) {
            if (quantity === '' || quantity === 0) {
                Alert.alert('Warning', 'No dishes added to the cart');
                return;
            } else if (quantity > 3) {
                Alert.alert('Warnig', 'Can´t add more than 3 dishes to the cart');
                return;
            };
            const item = {
                id: dish.dish_id,
                name: dish.dish_name,
                price: dish.price,
                image: dish.image,
                quantity: quantity
            };
            addToCart('cartItems', item);
            setShowCantModal(false);
            setQuantity(0);
            Alert.alert('Success', 'Dish added to cart successfully!');
        } else {
            const parsedCartItems = JSON.parse(cartItems);
            const totalQuantity = parsedCartItems.reduce((accumulator, item) => accumulator + item.quantity, 0);
            if (quantity === '' || quantity === 0) {
                Alert.alert('Warning', 'No dishes added to the cart');
                return;
            } else if (quantity > 3) {
                Alert.alert('Warning', 'Can´t add more than 3 dishes to the cart');
                return;
            } else if ((totalQuantity + quantity) > 3) {
                Alert.alert('Warning', 'Can only order a total of 3 dishes');
                return;
            };
            const item = {
                id: dish.dish_id,
                name: dish.dish_name,
                price: dish.price,
                image: dish.image,
                quantity: quantity
            };
            addToCart('cartItems', item);
            setShowCantModal(false);
            setQuantity(0);
            Alert.alert('Success', 'Dish added to cart successfully!');
        };
    };
    const handleRedirect = () => {
        navigateTo('IndexPlatos');
    };
    const handleImageClick = () => {
        setShowImageModal(true);
    };
    const handleCloseImageModal = () => {
        setShowImageModal(false);
    };
    const handleCantClick = () => {
        setShowCantModal(true);
    };
    const handleCloseCantModal = () => {
        setShowCantModal(false);
    };
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#333333" />
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <TouchableOpacity style={styles.botonIndex} onPress={handleRedirect}>
                    <Text style={styles.botonText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{dish.dish_name}</Text>
                    <Text style={styles.itemTitle}>{dish.price} $</Text>
                    <TouchableOpacity onPress={handleImageClick}>
                        <Image source={{ uri: dish.image }} style={styles.itemImage} />
                    </TouchableOpacity>
                    <Text style={styles.itemTitle}>{dish.description}</Text>
                    <TouchableOpacity
                        style={styles.botonSelect}
                        onPress={handleCantClick}
                    >
                        <Text style={styles.botonText}>Select</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <Modal visible={showImageModal} transparent={true}>
                <View style={styles.modalContainerImage}>
                    <Image source={{ uri: dish.image }} style={styles.modalImage} />
                    <TouchableOpacity style={styles.closeButtonSmall} onPress={handleCloseImageModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal visible={showCantModal} transparent={true}>
                <View style={styles.modalContainerCant}>
                    <Text style={styles.quantityText}>Quantity</Text>
                    <TextInput
                        style={styles.quantityInput}
                        value={quantity.toString()}
                        onChangeText={text => setQuantity(parseInt(text) || 0)}
                        keyboardType="numeric"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseCantModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        backgroundColor: 'rgba(153, 153, 153, 0.5)',
        padding: 20,
        marginTop: 10,
        marginHorizontal: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 300,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    itemImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    modalContainerImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainerCant: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#999999',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        marginLeft: '10%',
        marginTop: '70%',
    },
    botonSelect: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#7c5d3b',
        borderRadius: 5,
        width: '45%',
        height: 35,
        marginBottom: 10,
    },
    botonIndex: {
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
    modalImage: {
        width: '90%',
        height: '40%',
        resizeMode: 'contain',
        borderRadius: 10,
    },
    closeButton: {
        marginTop: 25,
        padding: 10,
        backgroundColor: '#333333',
        borderRadius: 10,
    },
    quantityInput: {
        width: 200,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        width: '30%',
        marginTop: 15,
    },
    closeButton: {
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        width: '30%',
        marginTop: 15,
    },
    closeButtonSmall: {
        marginTop: 25,
        marginLeft: 10,
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#333333',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    botonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center'
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ViewDish;

