import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Alert,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme/theme';
import { AuthInput, PageDots } from '../../components/auth/AuthComponents';
import { authService } from '../../lib/api';
import { useAppContext } from '../../context/AppContext';

export const LoginScreen = () => {
  const { dispatch } = useAppContext();
  const { height, width } = useWindowDimensions();
  const isCompact = height < 760;
  const contentWidth = Math.min(width - 48, 420);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const formatCPF = (value: string): string => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  const formatPhone = (value: string): string => {
    const nums = value.replace(/\D/g, '').slice(0, 11);
    if (!nums) return '';
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  const navigateToSlide = (index: number) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setCurrentSlide(index);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await authService.login({ email, password });
      if (response.token && response.user) {
        dispatch({ type: 'LOGIN_SUCCESS', token: response.token, user: response.user });
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Erro interno no login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!nome || !createEmail || !createPassword || !confirmPassword) {
      setErrorMsg('Preencha os campos obrigatórios.');
      return;
    }
    if (createPassword !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await authService.register({
        name: nome,
        email: createEmail,
        password: createPassword,
        cpf,
        phone,
      });

      if (result.success) {
        setSuccessMsg(result.message);
        setEmail(createEmail);
        setPassword('');
        setTimeout(() => navigateToSlide(1), 900);
      }
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const openForgotPassword = () => {
    setForgotEmail(email);
    setForgotSent(false);
    setForgotVisible(true);
  };

  const handleForgotPassword = () => {
    if (!forgotEmail.trim()) {
      return;
    }

    setForgotSent(true);
  };

  const renderLogo = () => (
    <View style={[styles.logoCircle, isCompact && styles.logoCircleCompact]}>
      <Text style={[styles.logoTextLarge, isCompact && styles.logoTextCompact]}>C3</Text>
    </View>
  );

  const renderMessage = () => (
    <>
      {errorMsg && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color={colors.status.danger} />
          <Text style={styles.errorBoxText}>{errorMsg}</Text>
        </View>
      )}
      {successMsg && (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.status.success} />
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      )}
    </>
  );

  const renderWelcome = () => (
    <View style={[styles.panel, { width: contentWidth }]}>
      {renderLogo()}
      <View style={styles.welcomeCopy}>
        <Text style={[styles.headline, isCompact && styles.headlineCompact]}>O Cartório virtual que faltava</Text>
        <Text style={[styles.onboardingSubtitle, isCompact && styles.subtitleCompact]}>
          Acompanhe protocolos e solicite certidões de matrícula pelo aplicativo.
        </Text>
      </View>
      <View style={styles.actionsBlock}>
        <TouchableOpacity style={styles.primaryBtnFull} onPress={() => navigateToSlide(2)}>
          <Text style={styles.primaryBtnText}>Criar conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigateToSlide(1)}>
          <Text style={styles.secondaryBtnText}>Já tem conta? Logar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLogin = () => (
    <View style={[styles.panel, { width: contentWidth }]}>
      {renderLogo()}
      <Text style={styles.titleCenter}>Login</Text>
      {renderMessage()}
      <View style={styles.formContainer}>
        <AuthInput label="Endereço de e-mail" placeholder="digite o seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <AuthInput label="Senha" placeholder="digite sua senha" value={password} onChangeText={setPassword} secureTextEntry />
        <View style={styles.loginActionRow}>
          <TouchableOpacity
            style={styles.linkBtnLeft}
            onPress={openForgotPassword}
          >
            <Text style={styles.linkTextInline}>Esqueceu a senha?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtnAuto, loading && styles.primaryBtnDisabled]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.primaryBtnText}>{loading ? 'Aguarde...' : 'Login'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.registerRow}>
          <Text style={styles.helperInline}>Primeiro acesso?</Text>
          <TouchableOpacity onPress={() => navigateToSlide(2)}>
            <Text style={styles.linkTextAccent}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderRegister = () => (
    <View style={[styles.panel, { width: contentWidth }]}>
      {renderLogo()}
      <View style={styles.titleGroup}>
        <Text style={styles.titleCenter}>Criar Conta</Text>
        <Text style={styles.subtitleCenter}>Preencha os dados de acesso</Text>
      </View>
      {renderMessage()}
      <View style={styles.formContainer}>
        <AuthInput placeholder="Nome completo" value={nome} onChangeText={(t) => { setNome(t); setErrorMsg(null); }} />
        <AuthInput placeholder="CPF" value={cpf} onChangeText={(t) => { setCpf(formatCPF(t)); setErrorMsg(null); }} keyboardType="numeric" />
        <AuthInput placeholder="Telefone" value={phone} onChangeText={(t) => { setPhone(formatPhone(t)); setErrorMsg(null); }} keyboardType="phone-pad" />
        <AuthInput placeholder="E-mail" value={createEmail} onChangeText={(t) => { setCreateEmail(t); setErrorMsg(null); }} keyboardType="email-address" />
        <AuthInput placeholder="Senha" value={createPassword} onChangeText={(t) => { setCreatePassword(t); setErrorMsg(null); }} secureTextEntry />
        <AuthInput placeholder="Confirmar senha" value={confirmPassword} onChangeText={(t) => { setConfirmPassword(t); setErrorMsg(null); }} secureTextEntry />
        <TouchableOpacity style={[styles.primaryBtnFull, loading && styles.primaryBtnDisabled]} onPress={handleRegister} disabled={loading}>
          <Text style={styles.primaryBtnText}>{loading ? 'Aguarde...' : 'Criar Conta'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtnCenterRow} onPress={() => navigateToSlide(1)}>
          <Ionicons name="arrow-back" size={16} color={colors.text.inverse} />
          <Text style={styles.linkTextWhite}>Já tem uma conta? Logar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex1}>
            <View style={styles.staticContent}>
              {currentSlide === 0 && renderWelcome()}
              {currentSlide === 1 && renderLogin()}
              {currentSlide === 2 && renderRegister()}
            </View>
          </KeyboardAvoidingView>

          <View style={styles.bottomArea}>
            <PageDots total={3} activeIndex={currentSlide} />
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>© 2026 Cartório 3º Ofício. Todos os direitos reservados.</Text>
              <View style={styles.footerLinksRow}>
                <TouchableOpacity onPress={() => Alert.alert('Termos de Uso', 'Conteúdo estático pronto para receber o texto jurídico final.')}>
                  <Text style={styles.footerLink}>Termos de Uso</Text>
                </TouchableOpacity>
                <Text style={styles.footerDot}>•</Text>
                <TouchableOpacity onPress={() => Alert.alert('Política de Privacidade', 'Conteúdo estático pronto para receber a política final.')}>
                  <Text style={styles.footerLink}>Política de Privacidade (LGPD)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>

        <Modal visible={forgotVisible} transparent animationType="fade" onRequestClose={() => setForgotVisible(false)}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalKeyboard}>
              <View style={styles.forgotCard}>
                <View style={styles.forgotHeader}>
                  <View>
                    <Text style={styles.forgotTitle}>Recuperar senha</Text>
                    <Text style={styles.forgotSubtitle}>Informe seu e-mail de acesso</Text>
                  </View>
                  <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setForgotVisible(false)}>
                    <Ionicons name="close" size={22} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                {forgotSent ? (
                  <View style={styles.forgotSuccess}>
                    <Ionicons name="checkmark-circle" size={34} color={colors.status.success} />
                    <Text style={styles.forgotSuccessTitle}>Solicitação registrada</Text>
                    <Text style={styles.forgotSuccessText}>
                      O front-end já conclui o fluxo. O envio real do link será conectado ao backend.
                    </Text>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={styles.forgotInput}
                      value={forgotEmail}
                      onChangeText={setForgotEmail}
                      placeholder="seu e-mail"
                      placeholderTextColor={colors.text.muted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <Text style={styles.forgotHint}>Nenhum e-mail será enviado nesta versão local.</Text>
                  </>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setForgotVisible(false)}>
                    <Text style={styles.modalSecondaryText}>{forgotSent ? 'Fechar' : 'Cancelar'}</Text>
                  </TouchableOpacity>
                  {!forgotSent && (
                    <TouchableOpacity
                      style={[styles.modalPrimaryBtn, !forgotEmail.trim() && styles.primaryBtnDisabled]}
                      onPress={handleForgotPassword}
                      disabled={!forgotEmail.trim()}
                    >
                      <Text style={styles.modalPrimaryText}>Continuar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 12, 24, 0.62)',
  },
  container: {
    flex: 1,
  },
  staticContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  panel: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: colors.accent.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: colors.accent.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  logoCircleCompact: {
    width: 58,
    height: 58,
    borderRadius: 14,
    marginBottom: 16,
  },
  logoTextLarge: {
    color: colors.text.inverse,
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoTextCompact: {
    fontSize: 20,
  },
  welcomeCopy: {
    width: '100%',
    marginBottom: 40,
  },
  headline: {
    color: colors.text.inverse,
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 46,
  },
  headlineCompact: {
    fontSize: 32,
    lineHeight: 38,
  },
  titleGroup: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titleCenter: {
    color: colors.text.inverse,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitleCenter: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 14,
  },
  onboardingSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 14,
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  actionsBlock: {
    width: '100%',
    gap: 12,
  },
  primaryBtnFull: {
    backgroundColor: colors.accent.blue,
    width: '100%',
    height: 54,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnAuto: {
    backgroundColor: colors.accent.blue,
    paddingHorizontal: 34,
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  secondaryBtnText: {
    color: colors.text.inverse,
    fontSize: 15,
    fontWeight: '700',
  },
  linkBtnLeft: {
    justifyContent: 'center',
  },
  linkBtnCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  linkTextInline: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  helperInline: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 14,
  },
  linkTextWhite: {
    color: colors.text.inverse,
    fontSize: 15,
    fontWeight: '700',
  },
  linkTextAccent: {
    color: colors.accent.blueLight,
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
  },
  bottomArea: {
    paddingBottom: 4,
  },
  footerContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  footerDot: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  errorBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.16)',
    padding: 10,
    borderRadius: borderRadius.sm,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.45)',
  },
  errorBoxText: {
    color: colors.text.inverse,
    fontSize: 13,
    flex: 1,
  },
  successBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(39, 174, 96, 0.18)',
    padding: 10,
    borderRadius: borderRadius.sm,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(39, 174, 96, 0.45)',
  },
  successText: {
    color: colors.text.inverse,
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  primaryBtnDisabled: {
    opacity: 0.65,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalKeyboard: {
    width: '100%',
    alignItems: 'center',
  },
  forgotCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  forgotHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 18,
  },
  forgotTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  forgotSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 4,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotInput: {
    height: 50,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    paddingHorizontal: 14,
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  forgotHint: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 10,
    lineHeight: 17,
  },
  forgotSuccess: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  forgotSuccessTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  forgotSuccessText: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 6,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalSecondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  modalSecondaryText: {
    color: colors.text.secondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalPrimaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.blue,
  },
  modalPrimaryText: {
    color: colors.text.inverse,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
