import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, FlatList, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingCart, Plus, MapPin, Hash, X } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useAppContext } from '../context/AppContext';
import { LocationWizard } from '../modals/LocationWizard';
import { QuickMatriculaModal } from '../modals/QuickMatriculaModal';
import { CERTIDAO_PRICE } from '../lib/config';
import { certidaoService } from '../lib/api';

export const PedidoCertidaoScreen = ({ navigation }: any) => {
  const { state, dispatch } = useAppContext();
  const [isFABExpanded, setIsFABExpanded] = useState(false);
  const [wizardVisible, setWizardVisible] = useState(false);
  const [quickMatriculaVisible, setQuickMatriculaVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();
  const animation = useState(new Animated.Value(0))[0];

  const toggleFAB = () => {
    const toValue = isFABExpanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setIsFABExpanded(!isFABExpanded);
  };

  const fabIconStyle = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const subBtnStyle = (index: number) => ({
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70 * (index + 1)],
        }),
      },
    ],
    opacity: animation,
  });

  const handleCheckout = async () => {
    if (state.cart.items.length === 0 || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      await Promise.all(
        state.cart.items.map(({ matricula, address, tipo }) =>
          certidaoService.solicitar({ matricula, address, tipo })
        )
      );

      dispatch({ type: 'CLEAR_CART' });
      Alert.alert('Pedido enviado', 'Sua solicitação de certidão foi registrada com sucesso.');
      navigation.navigate('MeusPedidos');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível finalizar o pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top, spacing.md) }]}>
        <Text style={styles.headerTitle}>Pedido de Certidão</Text>
        <View style={styles.progressBar} />
      </View>

      <View style={styles.content}>
        {state.cart.items.length === 0 ? (
          <ScrollView contentContainerStyle={styles.emptyScrollContent}>
            <View style={styles.emptyState}>
              <View style={styles.cartIconCircle}>
                <ShoppingCart size={48} color={colors.accent.blue} />
              </View>
              <Text style={styles.emptyTitle}>Não há nada aqui ainda</Text>
              <Text style={styles.emptySubtitle}>você ainda não possui nenhuma matrícula no carrinho.</Text>
              <Text style={styles.emptyInstruction}>Adicione clicando no botão (+) abaixo</Text>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={state.cart.items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemIcon}>
                  <MapPin size={22} color={colors.accent.blue} />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemMatricula}>Matrícula: {item.matricula}</Text>
                  <Text style={styles.itemAddress} numberOfLines={2}>{item.address}</Text>
                  <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => dispatch({ type: 'REMOVE_FROM_CART', id: item.id })}
                  style={styles.removeBtn}
                >
                  <X size={20} color={colors.status.danger} />
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total do Pedido</Text>
                  <Text style={styles.totalValue}>
                    R$ {state.cart.items.reduce((acc, curr) => acc + curr.price, 0).toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.checkoutBtn, submitting && styles.checkoutBtnDisabled]}
                  onPress={handleCheckout}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.checkoutBtnText}>Finalizar Pedido</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* FAB Group */}
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.subBtnContainer, subBtnStyle(0)]}>
            <Text style={styles.subBtnLabel}>Local</Text>
            <TouchableOpacity 
                style={[styles.subBtn, { backgroundColor: colors.accent.purple }]}
                onPress={() => {
                    toggleFAB();
                    setWizardVisible(true);
                }}
            >
                <MapPin size={20} color="white" />
            </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.subBtnContainer, subBtnStyle(1)]}>
            <Text style={styles.subBtnLabel}>Matrícula</Text>
            <TouchableOpacity 
                style={[styles.subBtn, { backgroundColor: colors.accent.blue }]}
                onPress={() => {
                    toggleFAB();
                    setQuickMatriculaVisible(true);
                }}
            >
                <Hash size={20} color="white" />
            </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
            style={[styles.mainFab, isFABExpanded && styles.mainFabClose]} 
            onPress={toggleFAB}
            activeOpacity={0.8}
        >
            <Animated.View style={fabIconStyle}>
                <Plus size={24} color="white" />
            </Animated.View>
        </TouchableOpacity>
      </View>

      <LocationWizard 
        visible={wizardVisible} 
        onClose={() => setWizardVisible(false)} 
        navigation={navigation}
      />

      <QuickMatriculaModal 
        visible={quickMatriculaVisible}
        onClose={() => setQuickMatriculaVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingBottom: spacing.md,
    backgroundColor: colors.background.card,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 2,
    width: '100%',
    backgroundColor: colors.accent.blue,
    position: 'absolute',
    bottom: 0,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 111, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemDetails: {
    flex: 1,
  },
  itemMatricula: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  itemAddress: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent.blue,
    marginTop: 4,
  },
  removeBtn: {
    padding: 8,
  },
  totalSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  checkoutBtn: {
    backgroundColor: colors.accent.blue,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBtnDisabled: {
    opacity: 0.7,
  },
  checkoutBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  cartIconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: colors.accent.blue,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyInstruction: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'flex-end',
  },
  mainFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.pink,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  mainFabClose: {
      backgroundColor: colors.text.secondary,
  },
  subBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    position: 'absolute',
  },
  subBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  subBtnLabel: {
    backgroundColor: colors.background.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
