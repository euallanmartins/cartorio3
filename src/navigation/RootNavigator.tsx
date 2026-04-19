import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { CarteiraDashboard } from '../screens/CarteiraDashboard';
import { AdicionarSaldoScreen } from '../screens/AdicionarSaldoScreen';
import { MapaMatricula } from '../screens/MapaMatricula';
import { MeusPedidosScreen } from '../screens/MeusPedidosScreen';
import { AuthNavigator } from './AuthNavigator';
import { useAppContext } from '../context/AppContext';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { state } = useAppContext();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!state.isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {/* Main App with Tabs */}
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          
          {/* Carteira Flow */}
          <Stack.Screen name="CarteiraDashboard" component={CarteiraDashboard} />
          <Stack.Screen name="AdicionarSaldo" component={AdicionarSaldoScreen} />
          
          {/* Map */}
          <Stack.Screen name="MapaMatricula" component={MapaMatricula} />
          
          {/* Requests Flow */}
          <Stack.Screen name="MeusPedidos" component={MeusPedidosScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
