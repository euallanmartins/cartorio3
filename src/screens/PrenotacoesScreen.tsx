import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Ticket, Info, History, AlertCircle, FileText, X, CreditCard, Clock } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { BlurView } from 'expo-blur';
import { prenotacaoService } from '../lib/api';
import type { Prenotacao, PrenotacaoHistoricoItem } from '../types';

export const PrenotacoesScreen = () => {
  const [protocol, setProtocol] = useState('');
  const [dv, setDv] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<Prenotacao | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<Array<{ protocolo: string; dv: string; data: string }>>([]);
  const insets = useSafeAreaInsets();

  const handleSearch = async () => {
    if (!protocol || !dv) {
      setSearchResult(null);
      setErrorMsg('Informe o número do protocolo e o dígito verificador.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSearchResult(null);

    try {
      const result = await prenotacaoService.consultar({ protocolo: protocol, dv });
      setSearchResult(result);

      // Salvar na lista de consultas recentes
      setRecentSearches(prev => {
        const exists = prev.some(s => s.protocolo === protocol && s.dv === dv);
        if (exists) return prev;
        return [
          { protocolo: protocol, dv, data: new Date().toLocaleDateString('pt-BR') },
          ...prev.slice(0, 9),
        ];
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('Não foi possível consultar o protocolo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Registrado': return colors.accent.green;
      case 'Com Exigência': return colors.status.warning;
      case 'Cancelado': return colors.status.danger;
      case 'Aguardando Pagamento': return colors.accent.purple;
      default: return colors.accent.blue;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Acompanhamento</Text>
            <Text style={styles.headerSubtitle}>Consulte o status do seu protocolo</Text>
          </View>

          {/* Search Card */}
          <View style={styles.searchCard}>
            <Text style={styles.inputLabel}>Dados do Protocolo</Text>
            <View style={styles.inputRow}>
              <View style={styles.protocolInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nº Protocolo"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="numeric"
                  value={protocol}
                  onChangeText={setProtocol}
                  accessibilityLabel="Número do Protocolo"
                  accessibilityHint="Digite apenas os números do seu protocolo de registro"
                />
              </View>
              <View style={styles.dvInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="DV"
                  placeholderTextColor={colors.text.muted}
                  keyboardType="numeric"
                  maxLength={1}
                  value={dv}
                  onChangeText={setDv}
                  accessibilityLabel="Dígito Verificador"
                  accessibilityHint="Digite o dígito após o traço do protocolo"
                />
              </View>
            </View>

            <TouchableOpacity 
                style={styles.searchBtn} 
                onPress={handleSearch}
                disabled={loading}
                accessibilityLabel={loading ? "Consultando status..." : "Consultar status do protocolo"}
                accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Search color="white" size={20} />
              )}
              <Text style={styles.searchBtnText}>{loading ? 'Consultando...' : 'Consultar Status'}</Text>
            </TouchableOpacity>
          </View>

          {/* Error */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={colors.status.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Search Result */}
          {searchResult && (
            <View style={[styles.resultCard, { borderColor: getStatusColor(searchResult.status) }]}>
              <View style={styles.resultHeader}>
                <View style={styles.statusGroup}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(searchResult.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(searchResult.status) }]}>{searchResult.status}</Text>
                </View>
                <Text style={styles.resultDate}>{searchResult.data}</Text>
              </View>
              <Text style={styles.resultProtocol}>Protocolo: {searchResult.protocolo}-{searchResult.dv}</Text>
              
              {/* Histórico do Título */}
              {searchResult.historico && searchResult.historico.length > 0 && (
                <View style={styles.historico}>
                  <View style={styles.historicoHeader}>
                    <Clock size={14} color={colors.text.secondary} />
                    <Text style={styles.historicoTitle}>Histórico</Text>
                  </View>
                  {searchResult.historico.map((item: PrenotacaoHistoricoItem, idx: number) => (
                    <View key={idx} style={styles.historicoItem}>
                      <View style={[styles.historicoLine, idx === searchResult.historico!.length - 1 && { borderLeftColor: 'transparent' }]} />
                      <View style={[styles.historicoDot, { backgroundColor: getStatusColor(item.status) }]} />
                      <View style={styles.historicoContent}>
                        <Text style={styles.historicoDesc}>{item.descricao}</Text>
                        <Text style={styles.historicoDate}>{item.data}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Ações */}
              <View style={styles.actionRow}>
                {searchResult.status === 'Com Exigência' && (
                  <TouchableOpacity 
                    style={styles.notaSBtn}
                    onPress={() => setShowNote(true)}
                    accessibilityRole="button"
                  >
                    <FileText size={18} color={colors.neon.purple} />
                    <Text style={styles.notaSBtnText}>Ver Nota Devolutiva</Text>
                  </TouchableOpacity>
                )}

                {searchResult.complementoValor && searchResult.complementoValor > 0 && (
                  <TouchableOpacity style={styles.complementoBtn}>
                    <CreditCard size={18} color={colors.accent.blue} />
                    <Text style={styles.complementoBtnText}>
                      Pagar Complemento — R$ {searchResult.complementoValor.toFixed(2).replace('.', ',')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoIcon}>
              <Info size={16} color={colors.accent.blue} />
            </View>
            <Text style={styles.infoText}>
              Os dados de acompanhamento são atualizados em tempo real conforme o processamento interno da serventia.
            </Text>
          </View>

          {/* Recent Searches / History */}
          <View style={styles.historySection}>
            <View style={styles.sectionHeader}>
              <History size={18} color={colors.text.secondary} />
              <Text style={styles.sectionTitle}>Consultas Recentes</Text>
            </View>
            
            {recentSearches.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ticket size={48} color={colors.border.subtle} strokeWidth={1} />
                <Text style={styles.emptyText}>Nenhuma consulta recente encontrada.</Text>
              </View>
            ) : (
              recentSearches.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.recentItem}
                  onPress={() => {
                    setProtocol(item.protocolo);
                    setDv(item.dv);
                  }}
                >
                  <View style={styles.recentLeft}>
                    <Ticket size={16} color={colors.accent.blue} />
                    <Text style={styles.recentProto}>{item.protocolo}-{item.dv}</Text>
                  </View>
                  <Text style={styles.recentDate}>{item.data}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Nota Devolutiva Modal */}
      <Modal
        visible={showNote}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNote(false)}
      >
        <BlurView intensity={30} style={styles.modalOverlay}>
            <View 
                style={styles.noteContent}
                accessibilityViewIsModal={true}
                accessibilityLabel="Nota Devolutiva Detalhada"
            >
                <View style={styles.noteHeader}>
                    <View style={styles.noteTitleGroup}>
                        <FileText color={colors.neon.purple} size={24} />
                        <Text style={styles.noteTitle}>Nota Devolutiva</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowNote(false)} style={styles.closeBtn}>
                        <X color={colors.text.muted} size={24} />
                    </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.noteBody}>
                    <Text style={styles.noteSub}>Protocolo: {searchResult?.protocolo}-{searchResult?.dv}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.noteParagraph}>
                        {searchResult?.exigencia}
                    </Text>
                    <View style={styles.warningBox}>
                        <Info size={16} color={colors.text.secondary} />
                        <Text style={styles.warningBoxText}>
                            O prazo para cumprimento desta exigência é de {searchResult?.prazoExigencia || 30} dias corridos a contar da data da prenotação.
                        </Text>
                    </View>
                </ScrollView>
                
                <TouchableOpacity style={styles.printBtn} onPress={() => setShowNote(false)}>
                    <Text style={styles.printBtnText}>Entendido</Text>
                </TouchableOpacity>
            </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: spacing.padding,
  },
  header: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  searchCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.muted,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  protocolInputContainer: {
    flex: 3,
    height: 50,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  dvInputContainer: {
    flex: 1,
    height: 50,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  input: {
    fontSize: 16,
    color: colors.text.primary,
    width: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  searchBtn: {
    backgroundColor: colors.accent.blue,
    flexDirection: 'row',
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.08)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.2)',
  },
  errorText: {
    flex: 1,
    color: colors.status.danger,
    fontSize: 13,
  },
  // Info
  infoSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 111, 255, 0.05)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: 10,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  // Result
  resultCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    borderWidth: 1.5,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultDate: {
    fontSize: 12,
    color: colors.text.muted,
  },
  resultProtocol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  // Histórico
  historico: {
    marginBottom: spacing.md,
  },
  historicoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  historicoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
  },
  historicoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 6,
  },
  historicoLine: {
    position: 'absolute',
    left: 4,
    top: 12,
    bottom: 0,
    borderLeftWidth: 2,
    borderLeftColor: colors.border.subtle,
  },
  historicoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 4,
  },
  historicoContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  historicoDesc: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '500',
  },
  historicoDate: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  // Actions
  actionRow: {
    gap: spacing.sm,
  },
  notaSBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(191, 0, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.neon.purple,
    gap: 8,
  },
  notaSBtnText: {
    color: colors.neon.purple,
    fontWeight: 'bold',
    fontSize: 14,
  },
  complementoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(30, 111, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.accent.blue,
    gap: 8,
  },
  complementoBtnText: {
    color: colors.accent.blue,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // History
  historySection: {
    marginTop: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
  recentItem: {
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
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentProto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  recentDate: {
    fontSize: 12,
    color: colors.text.muted,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  noteContent: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxHeight: '80%',
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.neon.purple,
    shadowColor: colors.neon.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  noteTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeBtn: {
    padding: 4,
  },
  noteBody: {
    marginBottom: spacing.xl,
  },
  noteSub: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.md,
  },
  noteParagraph: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 24,
    textAlign: 'justify',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.blue,
  },
  warningBoxText: {
    flex: 1,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  printBtn: {
    backgroundColor: colors.neon.purple,
    height: 52,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neon.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  printBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
