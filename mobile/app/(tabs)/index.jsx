import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  Platform,
  RefreshControl 
} from "react-native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useExpenses } from "../../context/ExpensesContext";
import { useTheme } from '@react-navigation/native';

const Home = () => {
  const { expenses, totalExpenses, updateExpenses } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
      fontFamily: "Poppins-Bold"
    },
    expenseItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      marginBottom: 10,
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      shadowColor: "#000",
      borderColor: colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    expenseName: {
      fontSize: 16,
      color: colors.text,
      fontFamily: "Poppins-Regular"
    },
    expenseAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#77BFA3",
      fontFamily: "Poppins-Bold"
    },
    totalContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      marginTop: 20,
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    totalText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      fontFamily: "Poppins-Bold"
    },
    totalAmount: {
      fontSize: 18,
      color: "#77BFA3",
      fontFamily: "Poppins-Bold"
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
    },
    emptyMessage: {
      textAlign: "center",
      marginTop: 12,
      color: colors.text,
      fontSize: 16,
    },
    emptyCentered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
                                                                          
  const baseURL = Platform.OS === "web" ? "http://localhost:3001" : "http://10.50.186.163:3001"

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/purchases/grouped-by-type`);
      
      if (response.data && Array.isArray(response.data)) {
        const sortExpenses = response.data.sort((a, b) => b.totalSpent - a.totalSpent);
        updateExpenses(sortExpenses);
      } else {
        updateExpenses([]);
      }
    } catch (err) {
      console.error("Erro ao buscar gastos:", err);
      updateExpenses([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.expenseName}>{String(item._id)}</Text>
      <Text style={styles.totalAmount}>{`R$ ${item.totalSpent.toFixed(2)}`}</Text>
    </View>
  );

  if (!expenses || expenses.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Gastos</Text>
          <FlatList
            data={[]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="dollar-sign" size={60} color="#ccc" />
                <Text style={styles.emptyMessage}>Nenhum gasto registrado.</Text>
              </View>
            }
            contentContainerStyle={styles.emptyCentered}
                refreshing={refreshing}
                onRefresh={onRefresh}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Gastos</Text>
        <FlatList
          data={expenses}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>R$ {totalExpenses.toFixed(2)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};


export default Home;