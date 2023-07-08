import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, ScrollView, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveOrder, saveOrderxDishes } from '../api';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = require('../images/Orders.jpg');

const CartScreen = ({ navigateTo }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    getCartItems();
  }, []);
  const getCartItems = async () => {
    try {
      const cartItems = await AsyncStorage.getItem('cartItems');
      if (cartItems) {
        const parsedCartItems = JSON.parse(cartItems);
        setCartItems(parsedCartItems);
        const totalPrice = parsedCartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
        setTotal(totalPrice);
      } else {
        setCartItems([]);
      };
    } catch (error) {
      console.log('Error al obtener los platos del carrito:', error);
    };
  };
  const handleSubmit = async () => {
    const currentDate = new Date();
    const clientString = await AsyncStorage.getItem('Client');
    const client = JSON.parse(clientString);
    const cartItems = await AsyncStorage.getItem('cartItems');

    if (!cartItems) {
      Alert.alert('Error', 'The cart is empty');
      return;
    }

    const formattedTime = currentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const response = await saveOrder({
      order_time: formattedTime,
      order_date: formattedDate,
      order_state: 0,
      client_id: client.id,
    });
    if (cartItems) {
      const parsedCartItems = JSON.parse(cartItems);
      for (let index = 0; index < parsedCartItems.length; index++) {
        for (let k = 0; k < parsedCartItems[index].quantity; k++) {
          await saveOrderxDishes({
            order_id: response.order.order_id,
            dish_id: parsedCartItems[index].id,
          });
        };
      };
    };
    await AsyncStorage.removeItem('cartItems');
    setTotal(0);
    setCartItems([]);
    setTimeout(() => {
      navigateTo('IndexPlatos');
    }, 1000);
  };
  const removeCartItem = async (index) => {
    try {
      const itemToRemove = cartItems[index];
      let updatedCartItems = [];
      if (itemToRemove.quantity > 1) {
        updatedCartItems = [...cartItems];
        updatedCartItems[index] = {
          ...itemToRemove,
          quantity: itemToRemove.quantity - 1,
        };
      } else {
        updatedCartItems = cartItems.filter((item, i) => i !== index);
      };
      setCartItems(updatedCartItems);
      const totalPrice = updatedCartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      setTotal(totalPrice);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.log('Error al eliminar el plato del carrito:', error);
    };
  };
  const handleRedirect = () => {
    navigateTo('IndexPlatos');
  };
  const handleEmptyCart = async () => {
    setTotal(0);
    await AsyncStorage.removeItem('cartItems');
    setCartItems([]);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <TouchableOpacity style={styles.botonEmpty} onPress={handleEmptyCart}>
          <Text style={styles.botonText}>Empty Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIndex} onPress={handleRedirect}>
          <Text style={styles.botonText}>Back</Text>
        </TouchableOpacity>
        <ScrollView style={{ marginTop: 50 }}>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <View key={index} style={styles.cartItemContainer}>
                <Text style={styles.itemTitle}>{item.price} $</Text>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeCartItem(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#333333" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.itemContainer}>
              <Text style={styles.emptyCartText}>The cart is empty</Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          style={[styles.botonSend, { zIndex: 1 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.botonText}>Send Order</Text>
        </TouchableOpacity>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: {total} $</Text>
        </View>
      </ImageBackground>
    </View >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    marginTop: 180,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'column',
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
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 19,
    color: '#000000',
    marginTop: 1,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemContainer: {
    backgroundColor: 'rgba(153, 153, 153, 0.5)',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 20
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 20
  },
  removeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 15,
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  botonSend: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#333333',
    borderRadius: 5,
    width: '50%',
    height: 35,
    marginBottom: 60,
    marginTop: 20,
    alignSelf: 'center',
  },
  botonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  botonIndex: {
    position: 'absolute',
    top: 20,
    right: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#333333',
    borderRadius: 5,
    width: '25%',
    height: 35,
    marginBottom: 10,
  },
  botonEmpty: {
    position: 'absolute',
    top: 20,
    left: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#333333',
    borderRadius: 5,
    width: '30%',
    height: 35,
    marginBottom: 10,
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555555',
  },
  itemQuantity: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
    marginRight: 10,
  },
});

export default CartScreen;
