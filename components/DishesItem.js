import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DishesItem = ({ dish, navigateTo }) => {
    const { dish_id, dish_name, price, description, dish_state } = dish
    const addToMemory = async () => {
        try {
            await AsyncStorage.removeItem('dishSelect');
            await AsyncStorage.setItem('dishSelect', JSON.stringify({
                dish_id,
                dish_name,
                price,
                description,
                dish_state
            }));
        } catch (error) {
            console.log('Error al agregar el plato:', error);
        };
    };
    return (
        <View style={styles.Container}>
            <View style={styles.itemContainer}>
                <TouchableOpacity onPress={() => {
                    addToMemory();
                    setTimeout(() => {
                        navigateTo('View Dish')
                    }, 500);
                }}>
                    <Text style={styles.itemTitle}>{dish.dish_name}</Text>
                    <Image source={{ uri: dish.image }} style={styles.itemImage} />
                    <Text style={styles.itemTitle}>{dish.price} $</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    Container: {
        marginTop: 50,
        marginBottom: 5,
    },
    itemContainer: {
        backgroundColor: '#B8862B',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    itemImage: {
        width: 120,
        height: 120,
        borderRadius: 5,
        marginLeft: 100,
        alignSelf: 'flex-start',
        marginBottom: 3,
    },
});

export default DishesItem;