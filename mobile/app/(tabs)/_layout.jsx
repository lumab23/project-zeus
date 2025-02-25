import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';

const TabIcon = ({ icon, name, focused }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", gap: 2, paddingTop: 15}}>
      <FontAwesome name={icon} size={20} color={focused ? "#77BFA3" : "#CDCDE0"} />
      {name && <Text style={{ fontSize: 8, fontWeight: "600", color: focused ? "#77BFA3" : "#CDCDE0" }}>{name}</Text>}
    </View>
  );
};


const TabsLayout = () => {

  const { colors } = useTheme();

  return (
      <Tabs
        screenOptions={{
            tabBarActiveTintColor: colors.primary, 
            tabBarInactiveTintColor: colors.text, 
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: colors.text
                }
              }),
              ...styles.tabBar
            },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="home"
                name={"Home"}
                focused={focused}   
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add-purchase"
          options={{
            title: "Add",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="plus" 
                name={"Add"}
                focused={focused} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="history" 
                name={"History"}
                focused={focused} 
              />
            ),
          }}
        />
      </Tabs>
  );
};

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: 1, 
        height: 100, 
        ...Platform.select({
          ios: {
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          android: {
            elevation: 5, 
          },
        }),
    },

});

export default TabsLayout;