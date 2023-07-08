import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getDishes } from '../api';
import DishesItem from './DishesItem';

const DishesList = ({ filterKeyword: searchKeyword, navigateTo }) => {
    const [dishes, setDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const loadDishes = async () => {
        const data = await getDishes();
        const formattedData = data.reduce((acc, item) => {
            if (item.dish_state === "enable") {
                acc.push({
                    dish_id: item.dish_id,
                    description: item.description,
                    dish_name: item.dish_name,
                    dish_state: item.dish_state,
                    image: item.image,
                    price: item.price,
                });
            };
            return acc;
        }, []);
        setDishes(formattedData);
        setIsLoading(false);
    };
    const [searchedDishes, setSearchedDishes] = useState([]);
    useEffect(() => {
        loadDishes();
    }, [isFocused]);
    useEffect(() => {
        const filteredDishes = dishes.filter((dish) =>
            dish.dish_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            dish.price.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setSearchedDishes(filteredDishes);
    }, [dishes, searchKeyword]);
    const renderItem = ({ item }) => {
        return <DishesItem dish={item} navigateTo={navigateTo} />
    };
    const refresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadDishes();
        setRefreshing(false);
    }, []);
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    };
    if (searchedDishes.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.itemContainer}>No hay platos en este momento.</Text>
            </View>
        );
    };
    return (
        <FlatList
            style={{ width: '80%', marginTop: 235 }}
            data={searchedDishes}
            renderItem={renderItem}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }
        />
    );
};
export default DishesList;
const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 20,
        marginTop: 10,
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
        textAlign: 'center',
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
});
