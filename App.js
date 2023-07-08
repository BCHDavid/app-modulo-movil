import React, { useState } from 'react';
import { View } from 'react-native';
import Login from './screens/Login';
import IndexPlatos from './screens/IndexPlatos';
import Register from './screens/Register';
import EditInfo from './screens/EditInfo';
import CartScreen from './screens/CartItems';
import ViewDish from './screens/ViewDish';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <Login navigateTo={navigateTo} />;
      case 'Register':
        return <Register navigateTo={navigateTo} />;
      case 'IndexPlatos':
        return <IndexPlatos navigateTo={navigateTo} />;
      case 'Edit Information':
        return <EditInfo navigateTo={navigateTo} />;
      case 'Cart Items':
        return <CartScreen navigateTo={navigateTo} />;
      case 'View Dish':
        return <ViewDish navigateTo={navigateTo}/>;
      default:
        return null;
    }
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
    </NavigationContainer>
  );
}
