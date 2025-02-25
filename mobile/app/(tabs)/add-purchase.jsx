import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import PurchaseForm from "../../components/PurchaseForm";
import { useTheme } from '@react-navigation/native';

const AddPurchase = () => {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <PurchaseForm />
    </SafeAreaView>
  );
};


export default AddPurchase;