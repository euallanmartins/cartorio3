import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Wallet, Eye, Smartphone, Info } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useAppContext } from '../context/AppContext';

export const AdicionarSaldoScreen = ({ navigation }: any) => {
  const { state, dispatch } = useAppContext();
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    const amount = parseFloat(value.replace(',', '.')) || 0;
    if (amount > 0) {
      dispatch({ type: 'ADD_CREDIT', amount });
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ArrowLeft color={colors.text.primary} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Carteira Digital</Text>
            <View style={{ width: 40 }} />
        </View>

        {/* Current Balance Bar */}
        <View style={styles.balanceBarContainer}>
            <View style={styles.balanceBar}>
                <View style={styles.balanceBarLeft}>
                    <Wallet size={16} color={colors.accent.blue} />
                    <Text style={styles.balanceBarLabel}>Saldo Carteira</Text>
                </View>
                <View style={styles.balanceBarRight}>
                    <Text style={styles.balanceBarValue}>R$ {state.wallet.balance.toFixed(2).replace('.', ',')}</Text>
                    <Eye size={16} color={colors.text.muted} />
                </View>
            </View>
        </View>

        <View style={styles.content}>
            {/* Illustration placeholder */}
            <View style={styles.illustration}>
                <Smartphone size={80} color={colors.accent.blue} strokeWidth={1} />
            </View>

            {/* Value Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>R$ </Text>
                <TextInput
                    style={styles.input}
                    placeholder="0,00"
                    placeholderTextColor={colors.text.muted}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={setValue}
                    autoFocus
                />
            </View>
            <Text style={styles.hintText}>Digite o valor desejado e clique em confirmar</Text>

            {/* PIX Info */}
            <View style={styles.pixRow}>
                <View style={styles.pixIcon}>
                   <Text style={{ fontSize: 10, fontWeight: 'bold' }}>PIX</Text>
                </View>
                <Text style={styles.pixText}>Valor mínimo de recarga (PIX): <Text style={{ fontWeight: 'bold' }}>R$ 1,00</Text></Text>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
                <Info size={16} color={colors.text.secondary} />
                <Text style={styles.infoText}>
                    Créditos válidos imediatamente após a confirmação do pagamento, não é necessário enviar comprovante, o valor será disponibilizado automaticamente.
                </Text>
            </View>

            <View style={{ flex: 1 }} />

            {/* CTA Button */}
            <TouchableOpacity 
                style={[styles.addBtn, (!value || parseFloat(value) === 0) && styles.disabledBtn]}
                onPress={handleConfirm}
                disabled={!value || parseFloat(value) === 0}
            >
                <Text style={styles.addBtnText}>+ Adicionar saldo</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.padding,
    paddingVertical: spacing.md,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  balanceBarContainer: {
    paddingHorizontal: spacing.padding,
    marginBottom: spacing.xl,
  },
  balanceBar: {
    backgroundColor: colors.background.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  balanceBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceBarLabel: {
    fontSize: 12,
    color: colors.accent.blue,
    fontWeight: '500',
  },
  balanceBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceBarValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  illustration: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    paddingBottom: 8,
    width: '80%',
    justifyContent: 'center',
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  input: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    minWidth: 100,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 12,
    color: colors.accent.blue,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  pixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.lg,
  },
  pixIcon: {
    backgroundColor: '#FF8C00',
    width: 24,
    height: 16,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixText: {
    fontSize: 12,
    color: '#FF8C00',
  },
  infoBox: {
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  addBtn: {
    backgroundColor: colors.accent.blue,
    width: '100%',
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  disabledBtn: {
    backgroundColor: colors.border.subtle,
  },
  addBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
