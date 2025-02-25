import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, Platform } from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import axios from "axios";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

const PurchaseForm = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
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
    input: {
      borderWidth: 0.5,
      color: colors.text,
      borderColor: colors.border,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 10,
      fontFamily: "Poppins-Regular"
    },
    fieldContainer: {
      marginBottom: 10,
    },
    dropdownButtonStyle: {
      width: '100%',
      height: 45,
      backgroundColor: colors.background,
      borderRadius: 5,
      borderWidth: 0.5,
      borderColor: '#ccc',
      marginBottom: 15,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    dropdownButtonTextStyle: {
      fontSize: 14,
      color: colors.text,
      textAlign: 'left',
      fontFamily: "Poppins-Regular",
    },
    placeholderText: {
      color: colors.text,
    },
    dropdownMenuStyle: {
      backgroundColor: '#FFF',
      borderRadius: 5,
      borderWidth: 0.5,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    dropdownRowStyle: {
      backgroundColor: '#FFF',
      borderBottomWidth: 0.5,
      borderBottomColor: '#eee',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    dropdownRowTxtStyle: {
      fontSize: 14,
      color: '#333',
      fontFamily: "Poppins-Regular",
    },
    submitButton: {
      backgroundColor: "#77BFA3",
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    submitButtonText: {
      color: "white",
      fontWeight: "bold",
      fontFamily: "Poppins-Regular"
    },
    inputName: {
      color: colors.text,
      fontWeight: "bold",
      fontFamily: "Poppins-Regular"
    },
    charCount: {
      fontSize: 12,
      color: "#666",
      textAlign: "right",
      marginBottom: 10,
      fontFamily: "Poppins-Regular"
    }
  });

  // uni: 10.50.186.163
  // base url baseado na plataforma 
  const baseURL = Platform.OS === "web" ? "http://localhost:3001" : "http://10.50.186.163:3001"

  const router = useRouter(); // rota
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("Alimentação");
  const [store, setStore] = useState("");
  const [description, setDescription] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");


  const types = [
    "Alimentação",
    "Saúde",
    "Acessórios",
    "Higiene",
    "Brinquedos",
    "Outros",
  ];

  const handlePriceChange = (valor) => {
    if (valor === "" || /^\d*\.?\d*$/.test(valor)) {
      setPrice(valor);
      setPriceError("");
    } else {
      setPriceError("Forneça um valor númerico válido!");
    }
  }

  const handleQuantityChange = (valor) => {
    if (valor === "" || /^[0-9]+$/.test(valor)) {
      setQuantity(valor);
      setQuantityError("");
    } else if (/[a-zA-Z]/.test(valor)) {
      setQuantityError("Forneça um valor númerico!");
    } else {
      setQuantityError("Forneça um valor inteiro!");
    }
  }

  const handleDescriptionChange = (valor) => {
    if (valor.length <= 200) {
      setDescription(valor);
    }
  }

  const handleSubmit = async () => {
    if (!product || !price || !quantity) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    const purchaseData = {
      product,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      type,
      store,
      description,
    };

    try {
      const response = await axios.post(`${baseURL}/api/purchases`, purchaseData);
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Sucesso", "Compra registrada com sucesso!", [
          { text: "OK", onPress: () => {
            
            setProduct("");
            setPrice("");
            setQuantity("");
            setType("Alimentação"); 
            setStore("");
            setDescription("");
            router.canGoBack(true) },

          }
            
            
            
        ]);
      } else {
        Alert.alert("Erro", "Erro ao registrar a compra.");
      }
    } catch (err) {
      Alert.alert("Erro", "Erro ao registrar a compra. Tente novamente.");
      console.error("Erro ao enviar dados:", err);
    }

    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Compra</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.inputName}>Produto</Text>
        <TextInput
          style={styles.input}
          value={product}
          onChangeText={setProduct}
          placeholder="Nome do produto"
        />
      </View>


      <View style={styles.fieldContainer}>
        <Text style={styles.inputName}>Preço</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
          placeholder="0.00"
        />
        {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.inputName}>Quantidade</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={handleQuantityChange}
          keyboardType="numeric"
          placeholder="1"
        />
        {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.inputName}>Loja</Text>
        <TextInput
          style={styles.input}
          value={store}
          onChangeText={setStore}
          placeholder="Nome da loja"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.inputName}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={handleDescriptionChange}
          multiline
          numberOfLines={3}
          maxLength={200}
          placeholder="Detalhes adicionais (opcional)"
        />
        <Text style={styles.charCount}>{description.length}/200</Text>
      </View>

      <View style={styles.fieldContainer}>
          <Text style={styles.inputName}>Tipo</Text>
          <SelectDropdown
            data={types}
            defaultValue="Alimentação"
            onSelect={(selectedItem) => setType(selectedItem)}
            buttonStyle={styles.dropdownButtonStyle}
            buttonTextStyle={styles.dropdownButtonTextStyle}
            defaultButtonText="Selecione um tipo"
            renderDropdownIcon={() => (
              <Feather name="chevron-down" size={18} color="#666" />
            )}
            dropdownIconPosition="right"
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={[
                    styles.dropdownButtonTextStyle,
                    !selectedItem && styles.placeholderText
                  ]}>
                    {selectedItem || "Selecione um tipo"}
                  </Text>
                  <Feather 
                    name={isOpened ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color="#666" 
                  />
                </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={[
                styles.dropdownRowStyle,
                isSelected && { backgroundColor: "#E8F0E8" }
              ]}>
                <Text style={[
                  styles.dropdownRowTxtStyle,
                  isSelected && { color: "#77BFA3" }
                ]}>
                  {item}
                </Text>
              </View>
            );
          }}
          dropdownStyle={styles.dropdownMenuStyle}
          showsVerticalScrollIndicator={false}
        />
      </View>



      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );
};


export default PurchaseForm;