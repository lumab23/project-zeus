import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { useExpenses } from "../../context/ExpensesContext";
import SelectDropdown from 'react-native-select-dropdown';
import { useTheme } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from "react-native";

const History = () => {
  const { colors } = useTheme();
  const theme = useColorScheme();

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
      fontFamily: Platform.select({
        ios: "Poppins-Bold",
        android: "Poppins-Bold",
        default: "sans-serif-bold",
      }),
    },
    purchaseItem: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    purchaseContent: {
      flex: 1,
    },
    productName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
      fontFamily: "Poppins-Bold"
    },
    quantity: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
      fontFamily: "Poppins-Light"
    },
    price: {
      fontSize: 15,
      color: "#2E7D32",
      fontWeight: "600",
      marginBottom: 2,
      fontFamily: "Poppins-SemiBold"
    },
    date: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
      fontFamily: "Poppins-Light"
    },
    type: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 2,
      fontFamily: "Poppins-Light"
    },
    store: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      fontFamily: "Poppins-Light"
    },
    actionButtons: {
      flexDirection: "column",
      justifyContent: "space-between",
      height: 60,
    },
    editButton: {
      padding: 8,
    },
    deleteButton: {
      padding: 8,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
    },
    emptyCentered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyMessage: {
      textAlign: "center",
      marginTop: 12,
      color: "#666",
      fontSize: 16,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    loaderText: {
      marginTop: 10,
      color: "#666",
      fontSize: 16,
    },
    descriptionToggle: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
    },
    descriptionToggleText: {
      color: "#3f51b5",
      marginRight: 4,
      fontWeight: "500",
    },
    descriptionContainer: {
      backgroundColor: theme === 'light' ? '#f0f4f7' : '2a2a2a',
      padding: 12,
      borderRadius: 6,
      marginTop: 4,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: "#3f51b5",
    },
    descriptionText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: colors.background,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      maxHeight: "90%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: colors.text,
    },
    formField: {
      marginBottom: 15,
    },
    formLabel: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 5,
      color: colors.text,
    },
    formInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      padding: 10,
      fontSize: 16,
      backgroundColor: colors.card,
      color: colors.text
    },
    formTextArea: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: "#FF3131",
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: "600",
    },
    submitButton: {
      backgroundColor: "#77BFA3",
    },
    submitButtonText: {
      color: colors.text,
      fontWeight: "600",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    filterSection: {
      marginBottom: 20,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 10,
      color: "#555",
    },
    typeContainer: {
      flexDirection: "row",
      marginBottom: 10,
    },
    typeChip: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedTypeChip: {
      backgroundColor: "#98C9A3",
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeChipText: {
      color: colors.text
    },
    selectedTypeChipText: {
      color: "#fff",
    },
    filterActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    filterButton: {
      flex: 1,
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
      marginHorizontal: 5,
    },
    clearButton: {
      backgroundColor: "#FF3131",
    },
    clearButtonText: {
      color: colors.text,
      fontWeight: "600",
    },
    applyButton: {
      backgroundColor: "#77BFA3",
    },
    applyButtonText: {
      color: colors.text,
      fontWeight: "600",
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
    dropdownButtonTxtStyle: {
      fontSize: 14,
      color: colors.text,
      textAlign: 'left',
      fontFamily: "Poppins-Regular",
    },
    placeholderText: {
      color: '#999',
    },
    dropdownMenuStyle: {
      backgroundColor: '#FFF',
      borderRadius: 5,
      borderWidth: 0.5,
      borderColor: '#ccc',
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
    monthContainer: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    monthChip: {
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedMonthChip: {
      backgroundColor: "#98C9A3",
      borderWidth: 1,
      borderColor: colors.border,
    },
    monthChipText: {
      color: colors.text,
      fontSize: 14,
      fontFamily: "Poppins-Regular",
    },
    selectedMonthChipText: {
      color: "#fff",
    },
    datePickerButton: {
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 5,
    },
    datePickerText: {
      color: colors.text,
      fontSize: 14,
      fontFamily: "Poppins-Regular",
    },
    errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 10,
      fontFamily: "Poppins-Regular"
    }
  });

  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { updateExpenses } = useExpenses();
  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");

  const handlePriceChange = (value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      handleInputChange("price", value);
      setPriceError("");
    } else {
      setPriceError("Forneça um valor numérico válido!");
    }
  };

  const handleQuantityChange = (value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      handleInputChange("quantity", value);
      setQuantityError("");
    } else if (/[a-zA-Z]/.test(value)) {
      setQuantityError("Forneça um valor numérico!");
    } else {
      setQuantityError("Forneça um valor inteiro!");
    }
  }

  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    price: "",
    type: "",
    store: "",
    description: "",
  });

  const [tempFilters, setTempFilters] = useState({
    type: "",
    month: null,
    date: null
  });

  const [filters, setFilters] = useState({
    type: "",
    month: null,
    date: null
  });

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const baseURL =
    Platform.OS === "web" ? "http://localhost:3001" : "http://10.50.186.163:3001";

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/purchases/grouped-by-type`);
      const types = response.data.map((item) => item._id);
      setAvailableTypes(types);
    } catch (err) {
      console.error("Erro ao buscar tipos:", err);
    }
  };

  const refreshExpenses = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/purchases/grouped-by-type`);
      const sortedExpenses = response.data.sort((a, b) => b.totalSpent - a.totalSpent);
      updateExpenses(sortedExpenses);
    } catch (err) {
      console.error("Erro ao atualizar gastos:", err);
    }
  };

  const fetchPurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = `${baseURL}/api/purchases/all`;

      if (filters.type) {
        url = `${baseURL}/api/purchases/by-type/${filters.type}`;
      }

      const response = await axios.get(url);
      let purchasesData = response.data;

      if (response.data.success) {
        purchasesData = response.data.data;
      }

      purchasesData = purchasesData.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        
        if (filters.date) {
          const filterDate = new Date(filters.date);
          return (
            purchaseDate.getDate() === filterDate.getDate() &&
            purchaseDate.getMonth() === filterDate.getMonth() &&
            purchaseDate.getFullYear() === filterDate.getFullYear()
          );
        }
        
        if (filters.month !== null) {
          return purchaseDate.getMonth() === filters.month;
        }
        
        return true;
      });

      setPurchases(purchasesData);
    } catch (err) {
      console.error("Erro ao buscar compras:", err.message);
      Alert.alert("Erro", "Não foi possível carregar as compras. Tente novamente.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [filters, baseURL]); 

  const handleDeletePurchase = (purchaseId) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => confirmDeletePurchase(purchaseId) },
      ]
    );
  };

  const confirmDeletePurchase = async (purchaseId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${baseURL}/api/purchases/${purchaseId}`);

      if (response.data.success || response.status === 200) {
        setPurchases((currentPurchases) =>
          currentPurchases.filter((purchase) => purchase._id !== purchaseId)
        );

        await refreshExpenses();

        Alert.alert("Sucesso", "Compra excluída com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao excluir compra:", err.message);
      Alert.alert("Erro", "Não foi possível excluir a compra. Tente novamente.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      product: purchase.product,
      quantity: purchase.quantity.toString(),
      price: purchase.price.toString(),
      type: purchase.type || "",
      store: purchase.store || "",
      description: purchase.description || "",
    });
    setModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTempFilterChange = (field, value) => {
    setTempFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: "",
      month: null,
      date: null
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setTempFilters(prev => ({
        ...prev,
        date: selectedDate,
        month: null
      }));
    }
  };


  const validateForm = () => {
    if (!formData.product.trim()) {
      Alert.alert("Erro", "O nome do produto é obrigatório");
      return false;
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert("Erro", "A quantidade deve ser um número inteiro positivo");
      return false;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Erro", "O preço deve ser um número positivo");
      return false;
    }

    if (!formData.type.trim()) {
      Alert.alert("Erro", "O tipo é obrigatório");
      return false;
    }

    return true;
  };

  const submitEditForm = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const updatedPurchase = {
        product: formData.product.trim(),
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        type: formData.type.trim(),
        store: formData.store.trim(),
        description: formData.description.trim(),
      };

      const response = await axios.put(
        `${baseURL}/api/purchases/${editingPurchase._id}`,
        updatedPurchase
      );

      if (response.data.success || response.status === 200) {
        setPurchases((currentPurchases) =>
          currentPurchases.map((purchase) =>
            purchase._id === editingPurchase._id ? response.data.data || response.data : purchase
          )
        );

        await refreshExpenses();

        setModalVisible(false);
        Alert.alert("Sucesso", "Compra atualizada com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao atualizar compra:", err.message);
      Alert.alert(
        "Erro",
        `Não foi possível atualizar a compra: ${err.response?.data?.error?.message || err.message}`,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPurchases();
  };

  useEffect(() => {
    fetchPurchases();
    fetchTypes();
  }, [fetchPurchases]);

  const toggleExpandItem = (itemId) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const getEmptyMessage = () => {
    if (filters.type && purchases.length === 0) {
      return `Nenhuma compra do tipo "${filters.type}"`;
    }
    if (filters.month !== null && purchases.length === 0) {
      return `Nenhuma compra no mês de ${months[filters.month]}`;
    }
    if (filters.date && purchases.length === 0) {
      return `Nenhuma compra na data ${filters.date.toLocaleDateString('pt-BR')}`;
    }
    return "Nenhuma compra encontrada.";
  };

  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => {
        setTempFilters(filters);
        setFilterModalVisible(false);
        setShowDatePicker(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtrar Compras</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tipo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeChip, !tempFilters.type && styles.selectedTypeChip]}
                onPress={() => handleTempFilterChange("type", "")}
              >
                <Text style={[styles.typeChipText, !tempFilters.type && styles.selectedTypeChipText]}>
                  Todos
                </Text>
              </TouchableOpacity>
              {availableTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, tempFilters.type === type && styles.selectedTypeChip]}
                  onPress={() => handleTempFilterChange("type", type)}
                >
                  <Text style={[styles.typeChipText, tempFilters.type === type && styles.selectedTypeChipText]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Mês</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthContainer}>
              <TouchableOpacity
                style={[styles.monthChip, tempFilters.month === null && styles.selectedMonthChip]}
                onPress={() => {
                  setTempFilters(prev => ({
                    ...prev,
                    month: null,
                    date: null
                  }));
                }}
              >
                <Text style={[styles.monthChipText, tempFilters.month === null && styles.selectedMonthChipText]}>
                  Todos
                </Text>
              </TouchableOpacity>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[styles.monthChip, tempFilters.month === index && styles.selectedMonthChip]}
                  onPress={() => {
                    setTempFilters(prev => ({
                      ...prev,
                      month: index,
                      date: null
                    }));
                  }}
                >
                  <Text style={[styles.monthChipText, tempFilters.month === index && styles.selectedMonthChipText]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Data Específica</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {tempFilters.date 
                  ? tempFilters.date.toLocaleDateString('pt-BR')
                  : "Selecionar data"}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={tempFilters.date || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              onCancel={() => setShowDatePicker(false)}
              style={{ width: Platform.OS === 'ios' ? '100%' : undefined }}
            />
          )}

          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={[styles.filterButton, styles.clearButton]} 
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, styles.applyButton]}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderItem = ({ item }) => {
    const hasDescription = item.description && item.description.trim().length > 0;
    const isExpanded = expandedItemId === item._id;

    return (
      <View style={styles.purchaseItem}>
        <View style={styles.purchaseContent}>
          <Text style={styles.productName}>{item.product}</Text>
          <Text style={styles.price}>Preço: R$ {item.price?.toFixed(2) || "0.00"}</Text>
          <Text style={styles.quantity}>Quantidade: {item.quantity}</Text>
          {item.type && <Text style={styles.type}>Tipo: {item.type}</Text>}
          {item.store && <Text style={styles.store}>Loja: {item.store}</Text>}
          <Text style={styles.date}>
            Data: {item.date ? new Date(item.date).toLocaleDateString("pt-BR") : "Data não disponível"}
          </Text>

          {hasDescription && (
            <View>
              <TouchableOpacity style={styles.descriptionToggle} onPress={() => toggleExpandItem(item._id)}>
                <Text style={styles.descriptionToggleText}>
                  {isExpanded ? "Ocultar descrição" : "Ver descrição"}
                </Text>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color="#3f51b5" />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEditPurchase(item)}>
            <Feather name="edit-2" size={22} color="#3f51b5" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePurchase(item._id)}>
            <Feather name="trash-2" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Histórico de Compras</Text>
      <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
        <Feather name="filter" size={24} color="#3f51b5" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={styles.loaderText}>Carregando compras...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        <FlatList
          data={purchases}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="shopping-bag" size={60} color="#ccc" />
              <Text style={styles.emptyMessage}>{getEmptyMessage()}</Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={purchases.length === 0 ? styles.emptyCentered : null}
        />
      </View>
      
      <FilterModal />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Compra</Text>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Produto*</Text>
              <TextInput
                style={styles.formInput}
                value={formData.product}
                onChangeText={(text) => handleInputChange("product", text)}
                placeholder="Nome do produto"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Quantidade*</Text>
              <TextInput
                style={styles.formInput}
                value={formData.quantity}
                onChangeText={handleQuantityChange}
                placeholder="Quantidade"
                keyboardType="numeric"
              />
              {quantityError ? <Text style={styles.errorText}>{quantityError}</Text> : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Preço (R$)*</Text>
              <TextInput
                style={styles.formInput}
                value={formData.price}
                onChangeText={handlePriceChange}
                placeholder="Preço"
                keyboardType="decimal-pad"
              />
              {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Tipo*</Text>
              <SelectDropdown
                data={availableTypes} 
                defaultValue={formData.type} 
                onSelect={(selectedItem) => handleInputChange("type", selectedItem)} 
                buttonStyle={styles.dropdownButtonStyle}
                buttonTextStyle={styles.dropdownButtonTxtStyle}
                defaultButtonText="Selecione um tipo"
                renderDropdownIcon={() => (
                  <Feather name="chevron-down" size={18} color="#666" />
                )}
                dropdownIconPosition="right"
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={[
                        styles.dropdownButtonTxtStyle,
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

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Loja</Text>
              <TextInput
                style={styles.formInput}
                value={formData.store}
                onChangeText={(text) => handleInputChange("store", text)}
                placeholder="Nome da loja (opcional)"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Descrição</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                placeholder="Descrição (opcional)"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitEditForm}
              >
                <Text style={styles.submitButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default History;