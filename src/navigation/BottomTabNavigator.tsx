import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Ticket, ShoppingCart, User } from 'lucide-react-native';
import { colors } from '../theme/theme';

// Real screens
import { HomeScreen } from '../screens/HomeScreen';
import { PedidoCertidaoScreen } from '../screens/PedidoCertidaoScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { PrenotacoesScreen } from '../screens/PrenotacoesScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopColor: colors.border.subtle,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.accent.blue,
        tabBarInactiveTintColor: colors.text.muted,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PrenotacoesTab"
        component={PrenotacoesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PedidoTab"
        component={PedidoCertidaoScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
