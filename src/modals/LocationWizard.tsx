import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { Check, X, Map, MapPin, Search, AlertTriangle, Navigation } from 'lucide-react-native';
import { useCep } from '../hooks/useCep';
import { useAppContext } from '../context/AppContext';
import { CERTIDAO_PRICE } from '../lib/config';

const { width } = Dimensions.get('window');

export const LocationWizard = ({ visible, onClose, navigation }: { visible: boolean, onClose: () => void, navigation: any }) => {
  const { dispatch } = useAppContext();
  const { cep, setCep, resultado: endereco, loading, erro: error, isCircunscricao3RISP } = useCep();
  
  const [step, setStep] = useState(1);
  const [hasSql, setHasSql] = useState<boolean | null>(null);
  const [hasCep, setHasCep] = useState<boolean | null>(null);
  const [matriculaInput, setMatriculaInput] = useState('');
  const [numeroInput, setNumeroInput] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (endereco) {
      setLogradouro(endereco.logradouro);
      setBairro(endereco.bairro);
      setCidade(endereco.cidade);
      setUf(endereco.uf);
    }
  }, [endereco]);

  const totalSteps = 4;

  const reset = () => {
    setStep(1);
    setHasSql(null);
    setHasCep(null);
    setCep('');
    setMatriculaInput('');
    setNumeroInput('');
    setLogradouro('');
    setBairro('');
    setCidade('');
    setUf('');
    setTermsAccepted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddToCart = () => {
    if (!matriculaInput) return;

    const address = `${logradouro}${numeroInput ? `, ${numeroInput}` : ''} - ${bairro}, ${cidade}/${uf}`;

    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id: `cert_${Date.now()}`,
        matricula: matriculaInput,
        address,
        price: CERTIDAO_PRICE,
        tipo: 'certidao_digital',
      },
    });
    handleClose();
  };

  const StepIndicator = () => (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map(i => (
        <View 
            key={i} 
            style={[styles.dot, step === i ? styles.activeDot : (step > i ? styles.completedDot : styles.inactiveDot)]} 
        />
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Top Visual */}
        <View style={styles.topSection}>
          <View style={styles.placeholderCityImage}>
            <Text style={styles.cityText}>DUQUE DE CAXIAS</Text>
            <View style={styles.imageGrid}>
               <View style={styles.gridBox} />
               <View style={styles.gridBox} />
               <View style={styles.gridBox} />
               <View style={styles.gridBox} />
            </View>
          </View>
        </View>

        {/* Panel */}
        <View style={styles.bottomPanel}>
          <Text style={styles.subtitle}>1º e 3º Distritos de Duque de Caxias</Text>

          {/* Step 1: SQL/Contribuinte */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.question}>Você possui o número do Contribuinte Municipal (IPTU/SQL)?</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={[styles.choiceBtn, { backgroundColor: colors.status.success }]} 
                  onPress={() => { setHasSql(true); setStep(2); }}
                >
                  <Check size={20} color="white" />
                  <Text style={styles.choiceText}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.choiceBtn, { backgroundColor: colors.status.danger }]} 
                  onPress={() => { setHasSql(false); setStep(2); }}
                >
                  <X size={20} color="white" />
                  <Text style={styles.choiceText}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 2: CEP */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.question}>Você possui o CEP do imóvel?</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity 
                  style={[styles.choiceBtn, { backgroundColor: colors.status.success }]} 
                  onPress={() => { setHasCep(true); setStep(3); }}
                >
                  <Check size={20} color="white" />
                  <Text style={styles.choiceText}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.choiceBtn, { backgroundColor: colors.status.danger }]} 
                  onPress={() => { setHasCep(false); setStep(4); }}
                >
                  <X size={20} color="white" />
                  <Text style={styles.choiceText}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 3: Input de CEP com busca REAL ViaCEP */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.question}>Digite o CEP do imóvel</Text>
              
              {/* Input CEP */}
              <View style={styles.cepInputRow}>
                <View style={styles.cepInputWrapper}>
                  <MapPin size={18} color={colors.accent.blue} />
                  <TextInput
                    style={styles.cepInput}
                    placeholder="00000-000"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    maxLength={9}
                    value={cep}
                    onChangeText={setCep}
                    autoFocus
                  />
                  {loading && <ActivityIndicator size="small" color={colors.accent.blue} />}
                </View>
              </View>

              {/* Resultado do CEP */}
              {endereco && (
                <View style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Navigation size={16} color={colors.accent.green} />
                    <Text style={styles.resultLabel}>Endereço encontrado</Text>
                    {isCircunscricao3RISP() && (
                      <View style={styles.circunscricaoBadge}>
                        <Text style={styles.circunscricaoText}>3º RISP</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.autofillGrid}>
                    <TextInput
                      style={styles.autofilledInput}
                      value={logradouro}
                      onChangeText={setLogradouro}
                      placeholder="Logradouro"
                      placeholderTextColor="#666"
                    />
                    <TextInput
                      style={styles.autofilledInput}
                      value={bairro}
                      onChangeText={setBairro}
                      placeholder="Bairro"
                      placeholderTextColor="#666"
                    />
                    <View style={styles.cidadeUfRow}>
                      <TextInput
                        style={[styles.autofilledInput, { flex: 3 }]}
                        value={cidade}
                        onChangeText={setCidade}
                        placeholder="Cidade"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={[styles.autofilledInput, { flex: 1 }]}
                        value={uf}
                        onChangeText={setUf}
                        placeholder="UF"
                        placeholderTextColor="#666"
                      />
                    </View>
                  </View>
                  
                  {/* Número */}
                  <View style={styles.numeroRow}>
                    <TextInput
                      style={styles.numeroInput}
                      placeholder="Nº"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={numeroInput}
                      onChangeText={setNumeroInput}
                    />
                    <TextInput
                      style={[styles.numeroInput, { flex: 2 }]}
                      placeholder="Nº Matrícula"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={matriculaInput}
                      onChangeText={setMatriculaInput}
                    />
                  </View>

                  {!isCircunscricao3RISP() && (
                    <View style={styles.alertBox}>
                      <AlertTriangle size={14} color={colors.status.warning} />
                      <Text style={styles.alertText}>
                        Este endereço pode não pertencer à circunscrição deste Ofício. 
                        Consulte o cartório antes de finalizar o pedido.
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={[styles.confirmBtn, !matriculaInput && styles.confirmBtnDisabled]}
                    disabled={!matriculaInput}
                    onPress={handleAddToCart}
                  >
                    <Text style={styles.confirmBtnText}>
                      Adicionar ao Carrinho — R$ {CERTIDAO_PRICE.toFixed(2).replace('.', ',')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Erro */}
              {error && (
                <View style={styles.errorCard}>
                  <AlertTriangle size={18} color={colors.status.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Sem resultado ainda */}
              {!endereco && !error && !loading && cep.length < 8 && (
                <View style={styles.hintCard}>
                  <Search size={16} color={colors.text.muted} />
                  <Text style={styles.hintText}>
                    A busca é automática ao digitar os 8 dígitos do CEP
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Step 4: Mapa (fallback quando não tem CEP) */}
          {step === 4 && (
            <View style={styles.stepContent}>
              <Text style={styles.question}>Gostaria de tentar localizar a matrícula através do Google Maps?</Text>
              <View style={styles.warningBox}>
                <TouchableOpacity 
                  style={[styles.checkbox, termsAccepted && styles.checkboxActive]}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  {termsAccepted && <Check size={12} color="white" />}
                </TouchableOpacity>
                <Text style={styles.warningText}>
                  Estou ciente de que o imóvel pode não ser localizado no mapa por limitações de dados ou imprecisões do sistema.
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.mapBtn, !termsAccepted && styles.mapBtnDisabled]}
                disabled={!termsAccepted}
                onPress={() => {
                   handleClose();
                   const addressString = logradouro 
                     ? `${logradouro}, ${cidade} - ${uf}`
                    : 'Duque de Caxias, RJ'; // Default map query fallback
                   navigation.navigate('MapaMatricula', { address: addressString });
                }}
              >
                <Map size={20} color="white" />
                <Text style={styles.mapBtnText}>Visualizar Mapa</Text>
              </TouchableOpacity>
            </View>
          )}

          <StepIndicator />

          {/* Back / Cancel */}
          <View style={styles.navRow}>
            {step > 1 && (
              <TouchableOpacity onPress={() => setStep(s => s - 1)} style={styles.backNavBtn}>
                <Text style={styles.backNavText}>← Voltar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topSection: {
    height: '35%',
    backgroundColor: '#333',
  },
  placeholderCityImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 40,
    fontWeight: 'bold',
    position: 'absolute',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  gridBox: {
    width: (width - 40) / 2,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  bottomPanel: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  subtitle: {
    color: colors.accent.blue,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  stepContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  question: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.pill,
  },
  choiceText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // CEP Input
  cepInputRow: {
    width: '100%',
    marginBottom: spacing.md,
  },
  cepInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.accent.blue,
    gap: 10,
  },
  cepInput: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  // Resultado
  resultCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 156, 0.3)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  resultLabel: {
    color: colors.accent.green,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    flex: 1,
  },
  circunscricaoBadge: {
    backgroundColor: 'rgba(30, 111, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.accent.blue,
  },
  circunscricaoText: {
    color: colors.accent.blue,
    fontSize: 10,
    fontWeight: 'bold',
  },
  autofillGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  autofilledInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    color: 'white',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    opacity: 0.6,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  cidadeUfRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  numeroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  numeroInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    color: 'white',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  alertBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.status.warning,
  },
  alertText: {
    flex: 1,
    color: '#CCC',
    fontSize: 11,
    lineHeight: 16,
  },
  confirmBtn: {
    backgroundColor: colors.accent.blue,
    height: 48,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#444',
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Error
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    flex: 1,
  },
  // Hint
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  hintText: {
    color: '#888',
    fontSize: 12,
    flex: 1,
  },
  // Indicators
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.accent.blue,
  },
  completedDot: {
    width: 8,
    backgroundColor: colors.accent.green,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#444',
  },
  // Warning / Map
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.accent.blue,
    borderColor: colors.accent.blue,
  },
  warningText: {
    flex: 1,
    color: '#AAA',
    fontSize: 12,
    lineHeight: 18,
  },
  mapBtn: {
    backgroundColor: colors.accent.blue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: borderRadius.pill,
  },
  mapBtnDisabled: {
    backgroundColor: '#444',
  },
  mapBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Navigation
  navRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    alignItems: 'center',
  },
  backNavBtn: {
    padding: 8,
  },
  backNavText: {
    color: '#AAA',
    fontSize: 14,
  },
  cancelBtn: {
    padding: 8,
  },
  cancelText: {
    color: colors.accent.blue,
    fontSize: 16,
  },
});
