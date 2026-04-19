import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Modal, Platform, ActivityIndicator } from 'react-native';
import { ArrowLeft, Wallet, Plus, ChevronDown, ChevronUp, Search, Eye, EyeOff, Receipt, X, Printer, Share2 } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useAppContext } from '../context/AppContext';
import { useIndicadores } from '../hooks/useIndicadores';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export const CarteiraDashboard = ({ navigation }: any) => {
  const { state } = useAppContext();
  const { indicadores, loading } = useIndicadores();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('Todas');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const transactions = state.wallet.transactions;

  const FilterTab = ({ label, icon: Icon }: any) => {
    const isActive = activeTab === label;
    return (
      <TouchableOpacity 
        style={[styles.filterTab, isActive && styles.activeFilterTab]}
        onPress={() => setActiveTab(label)}
      >
        {Icon && <Icon size={16} color={isActive ? 'white' : colors.text.secondary} />}
        <Text style={[styles.filterTabText, isActive && styles.activeFilterTabText]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          accessibilityLabel="Voltar para tela anterior"
          accessibilityRole="button"
        >
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Balance Card */}
        <LinearGradient
          colors={colors.gradient.wallet as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Wallet color="white" size={24} opacity={0.8} />
            <TouchableOpacity 
              style={styles.addBalanceBtn}
              onPress={() => navigation.navigate('AdicionarSaldo')}
              accessibilityLabel="Adicionar Saldo"
              accessibilityHint="Abre a tela para recarregar sua carteira via PIX"
              accessibilityRole="button"
            >
              <Plus color={colors.accent.blue} size={16} />
              <Text style={styles.addBalanceText}>Adicionar Saldo</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceLabel}>Saldo</Text>
          <View 
            style={styles.balanceRow}
            accessibilityLabel={`Saldo atual: ${balanceVisible ? `R$ ${state.wallet.balance.toFixed(2)}` : 'Oculto'}`}
          >
            <Text style={styles.balanceValue}>
              {balanceVisible ? `R$ ${state.wallet.balance.toFixed(2).replace('.', ',')}` : 'R$ •••••'}
            </Text>
            <TouchableOpacity 
              onPress={() => setBalanceVisible(!balanceVisible)}
              accessibilityLabel={balanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
              accessibilityRole="button"
            >
              {balanceVisible ? <Eye color="white" size={20} opacity={0.7} /> : <EyeOff color="white" size={20} opacity={0.7} />}
            </TouchableOpacity>
          </View>

          <View style={styles.balanceFooter}>
            <Text style={styles.walletTitle}>Carteira Digital</Text>
            <Text style={styles.walletTime}>16/4 13:40</Text>
          </View>
        </LinearGradient>

        {/* Indicadores BCB */}
        <View style={styles.indicadoresCard}>
          <View style={styles.indHeader}>
            <Text style={styles.indTitle}>📈 Indicadores (Fonte: BCB)</Text>
            {loading ? (
              <ActivityIndicator size="small" color={colors.accent.blue} />
            ) : (
              <View style={styles.pulseDot} />
            )}
          </View>
          <View style={styles.indRow}>
            <View style={styles.indItem}>
              <Text style={styles.indLabel}>Selic</Text>
              <Text style={styles.indValue}>
                {loading ? '--' : `${indicadores?.selic.toFixed(2).replace('.', ',')}%`}
              </Text>
            </View>
            <View style={styles.indDivider} />
            <View style={styles.indItem}>
              <Text style={styles.indLabel}>CDI</Text>
              <Text style={styles.indValue}>
                {loading ? '--' : `${indicadores?.cdi.toFixed(2).replace('.', ',')}%`}
              </Text>
            </View>
            <View style={styles.indDivider} />
            <View style={styles.indItem}>
              <Text style={styles.indLabel}>Atualizado</Text>
              <Text style={[styles.indValue, { fontSize: 13, color: colors.text.muted }]}>
                {loading ? '--' : indicadores?.data}
              </Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <FilterTab label="Todas" />
          <FilterTab label="Créditos" icon={ChevronDown} />
          <FilterTab label="Débitos" icon={ChevronUp} />
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Histórico transações</Text>
          
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
               <View style={styles.illustrationPlaceholder}>
                  <Search size={64} color={colors.border.subtle} strokeWidth={1} />
                  <View style={styles.magnifierCircle} />
               </View>
               <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
            </View>
          ) : (
            transactions.map(item => (
                <View key={item.id} style={styles.transactionCard}>
                    <View style={styles.transLeft}>
                        <View style={[styles.iconBox, { backgroundColor: item.type === 'credit' ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 255, 255, 0.05)' }]}>
                            {item.type === 'credit' ? <ChevronDown size={20} color={colors.accent.green} /> : <ChevronUp size={20} color={colors.text.secondary} />}
                        </View>
                        <View>
                            <Text style={styles.transDesc}>{item.description}</Text>
                            <Text style={styles.transDate}>{item.date}</Text>
                        </View>
                    </View>
                    <View style={styles.transRight}>
                        <Text style={[styles.transAmount, { color: item.type === 'credit' ? colors.accent.green : colors.text.primary }]}>
                            {item.type === 'credit' ? '+' : '-'} R$ {item.amount.toFixed(2).replace('.', ',')}
                        </Text>
                        {item.type === 'debit' && (
                            <TouchableOpacity onPress={() => setSelectedTransaction(item)} style={styles.receiptBtn}>
                                <Receipt size={14} color={colors.accent.blue} />
                                <Text style={styles.receiptBtnText}>Recibo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))
          )}
        </View>

      </ScrollView>

      {/* Recibo Modal */}
      <Modal
        visible={!!selectedTransaction}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
            <View 
                style={styles.receiptModal}
                accessibilityViewIsModal={true}
                accessibilityLabel="Detalhes do Recibo de Emolumentos"
            >
                <View style={styles.receiptHeader}>
                    <Text style={styles.receiptTitle}>Recibo de Emolumentos</Text>
                    <TouchableOpacity onPress={() => setSelectedTransaction(null)}>
                        <X size={24} color={colors.text.muted} />
                    </TouchableOpacity>
                </View>

                <View style={styles.receiptBody}>
                    <Text style={styles.receiptMeta}>ID: {selectedTransaction?.id}77B21</Text>
                    <View style={styles.recipDivider} />
                    
                    <View style={styles.emolumentRow}>
                        <Text style={styles.emolLabel}>Estado</Text>
                        <Text style={styles.emolValue}>R$ 15,40</Text>
                    </View>
                    <View style={styles.emolumentRow}>
                        <Text style={styles.emolLabel}>IPESP</Text>
                        <Text style={styles.emolValue}>R$ 4,10</Text>
                    </View>
                    <View style={styles.emolumentRow}>
                        <Text style={styles.emolLabel}>Registro Civil</Text>
                        <Text style={styles.emolValue}>R$ 1,11</Text>
                    </View>
                    <View style={styles.emolumentRow}>
                        <Text style={styles.emolLabel}>Tribunal de Justiça</Text>
                        <Text style={styles.emolValue}>R$ 1,44</Text>
                    </View>
                    <View style={styles.emolumentRow}>
                        <Text style={styles.emolLabel}>Ministério Público</Text>
                        <Text style={styles.emolValue}>R$ 1,01</Text>
                    </View>
                    <View style={styles.emolumentRow}>
                        <Text style={styles.emolLabel}>Oficial (Taxa)</Text>
                        <Text style={styles.emolValue}>R$ 53,48</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TOTAL PAGO</Text>
                        <Text style={styles.totalValue}>R$ {selectedTransaction?.amount.toFixed(2).replace('.', ',')}</Text>
                    </View>

                    <View style={styles.statusBox}>
                        <Text style={styles.statusBoxText}>Pago via Saldo Carteira em {selectedTransaction?.date}</Text>
                    </View>
                </View>

                <View style={styles.receiptActions}>
                    <TouchableOpacity style={styles.rActionBtn}>
                        <Printer size={20} color="white" />
                        <Text style={styles.rActionText}>Imprimir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.rActionBtn, { backgroundColor: colors.background.primary }]}>
                        <Share2 size={20} color={colors.text.primary} />
                        <Text style={[styles.rActionText, { color: colors.text.primary }]}>PDF</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.padding,
    paddingVertical: spacing.md,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  scrollContent: {
    padding: spacing.padding,
  },
  balanceCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addBalanceBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    gap: 4,
  },
  addBalanceText: {
    color: colors.accent.blue,
    fontSize: 12,
    fontWeight: 'bold',
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  balanceValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  walletTime: {
    color: colors.accent.blueLight,
    fontSize: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  activeFilterTab: {
    backgroundColor: colors.accent.blue,
    borderColor: colors.accent.blue,
  },
  filterTabText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  activeFilterTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  indicadoresCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  indHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  indTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
  },
  indRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indItem: {
    flex: 1,
    alignItems: 'center',
  },
  indDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.subtle,
  },
  indLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 4,
  },
  indValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historySection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  illustrationPlaceholder: {
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magnifierCircle: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.accent.blue,
      opacity: 0.3,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  transactionCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.card,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border.subtle,
  },
  transLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
  },
  transDesc: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text.primary,
      maxWidth: 160,
  },
  transDate: {
      fontSize: 12,
      color: colors.text.muted,
      marginTop: 2,
  },
  transRight: {
      alignItems: 'flex-end',
  },
  transAmount: {
      fontSize: 15,
      fontWeight: 'bold',
  },
  receiptBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
      backgroundColor: 'rgba(30, 111, 255, 0.1)',
  },
  receiptBtnText: {
      fontSize: 10,
      color: colors.accent.blue,
      fontWeight: 'bold',
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      padding: spacing.xl,
  },
  receiptModal: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      borderWidth: 1.5,
      borderColor: colors.accent.blue,
      shadowColor: colors.accent.blue,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 5,
  },
  receiptHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
  },
  receiptTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text.primary,
  },
  receiptBody: {
      marginBottom: spacing.xl,
  },
  receiptMeta: {
      fontSize: 12,
      color: colors.text.muted,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  recipDivider: {
      height: 1,
      backgroundColor: colors.border.subtle,
      marginVertical: spacing.md,
      borderStyle: 'dashed',
  },
  emolumentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
  },
  emolLabel: {
      fontSize: 14,
      color: colors.text.secondary,
  },
  emolValue: {
      fontSize: 14,
      color: colors.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.subtle,
  },
  totalLabel: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.accent.blue,
  },
  totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text.primary,
  },
  statusBox: {
      marginTop: spacing.xl,
      padding: spacing.md,
      backgroundColor: 'rgba(0, 255, 156, 0.05)',
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: 'rgba(0, 255, 156, 0.2)',
  },
  statusBoxText: {
      fontSize: 12,
      color: colors.accent.green,
      textAlign: 'center',
      fontWeight: 'bold',
  },
  receiptActions: {
      flexDirection: 'row',
      gap: 12,
  },
  rActionBtn: {
      flex: 1,
      backgroundColor: colors.accent.blue,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderRadius: borderRadius.pill,
      gap: 8,
  },
  rActionText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
  },
});
