import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { AuthInput, PageDots } from '../../components/auth/AuthComponents';
import { authService } from '../../lib/api';
import { useAppContext } from '../../context/AppContext';
export const LoginScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { dispatch } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(Dimensions.get('window').width);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados locais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
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
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
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
        dispatch({ type: 'LOGIN_SUCCESS', payload: undefined, token: response.token, user: response.user } as any);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Erro interno no login');
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
      });

      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => {
            setSuccessMsg(null);
            setEmail(createEmail);
            navigateToSlide(1); // Vai para a tela de login
        }, 1500);
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const updateLayout = () => {
      setSlideWidth(Dimensions.get('window').width);
    };
    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => subscription.remove();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== currentSlide && index >= 0 && index <= 2) {
      setCurrentSlide(index);
    }
  };

  const navigateToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * slideWidth, animated: true });
  };

  const renderLogo = () => (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
          <Text style={styles.logoTextLarge}>C3</Text>
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
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex1}
          >
            <View style={styles.carouselContainer}>
              <ScrollView 
                ref={scrollViewRef}
                horizontal
                pagingEnabled={Platform.OS !== 'web'}
                snapToInterval={Platform.OS === 'web' ? slideWidth : undefined}
                snapToAlignment="center"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.flexGrow}
              >
                
                {/* SLIDE 1: ONBOARDING PRINCIPAL */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View style={{ width: slideWidth - 64 }}>
                    {renderLogo()}
                    <View style={styles.titleContainer}>
                      <Text style={styles.headline}>O Cartório virtual que faltava</Text>
                    </View>
                    <Text style={styles.onboardingSubtitle}>
                      Acompanhe o andamento do seu processo e/ou solicite sua certidão de matrícula.
                    </Text>

                    <View style={styles.spacerHuge} />
                    
                    <TouchableOpacity 
                      style={styles.primaryBtnFull} 
                      onPress={() => navigateToSlide(2)}
                    >
                      <Text style={styles.primaryBtnText}>Criar conta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.linkBtnCenter} 
                      onPress={() => navigateToSlide(1)}
                    >
                      <Text style={styles.linkText}>Já tem conta? Logar</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                {/* SLIDE 2: LOGIN */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View style={{ width: slideWidth - 64 }}>
                    {renderLogo()}
                    
                    <View style={styles.titleContainerCenter}>
                      <Text style={styles.titleCenter}>Login</Text>
                    </View>

                    {currentSlide === 1 && errorMsg && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={20} color={colors.status.danger} />
                            <Text style={styles.errorBoxText}>{errorMsg}</Text>
                        </View>
                    )}

                    <View style={styles.formContainer}>
                      <AuthInput
                        label="Endereço de e-mail"
                        placeholder="digite o seu e-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                      />
                      <View style={styles.spacer} />
                      <AuthInput
                        label="Senha"
                        placeholder="digite sua senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />

                      <View style={styles.spacerLarge} />

                      <View style={styles.loginActionRow}>
                        <TouchableOpacity style={styles.linkBtnLeft}>
                          <Text style={styles.linkTextInline}>Esqueceu a senha?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={[styles.primaryBtnAuto, loading && styles.primaryBtnDisabled]} 
                          onPress={handleLogin}
                          disabled={loading}
                        >
                          <Text style={styles.primaryBtnText}>{loading ? 'Aguarde...' : 'Login'}</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.spacerHuge} />

                      <View style={styles.registerRow}>
                        <View style={styles.registerTextGroup}>
                          <Text style={styles.linkTextInline}>Primeiro acesso?</Text>
                          <Ionicons name="arrow-forward" size={16} color={colors.text.muted} />
                        </View>
                        <TouchableOpacity onPress={() => navigateToSlide(2)}>
                          <Text style={styles.linkTextAccent}>Criar conta</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                {/* SLIDE 3: CRIAR CONTA */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  <View style={{ width: slideWidth - 64 }}>
                    {renderLogo()}

                    <View style={styles.titleContainerCenter}>
                      <Text style={styles.titleCenter}>Criar Conta</Text>
                      <Text style={styles.subtitleCenter}>Preencha os campos abaixo</Text>
                    </View>

                    {currentSlide === 2 && errorMsg && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={20} color={colors.status.danger} />
                            <Text style={styles.errorBoxText}>{errorMsg}</Text>
                        </View>
                    )}

                    {currentSlide === 2 && successMsg && (
                        <View style={styles.successBox}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.accent.green} />
                            <Text style={styles.successText}>{successMsg}</Text>
                        </View>
                    )}

                    <View style={styles.formContainer}>
                      <AuthInput placeholder="Nome completo" value={nome} onChangeText={(t: string) => { setNome(t); setErrorMsg(null); }} />
                      <View style={styles.spacer} />
                      <AuthInput placeholder="E-mail" value={createEmail} onChangeText={(t: string) => { setCreateEmail(t); setErrorMsg(null); }} keyboardType="email-address" />
                      <View style={styles.spacer} />
                      <AuthInput placeholder="Senha" value={createPassword} onChangeText={(t: string) => { setCreatePassword(t); setErrorMsg(null); }} secureTextEntry />
                      <View style={styles.spacer} />
                      <AuthInput placeholder="Confirme a Senha" value={confirmPassword} onChangeText={(t: string) => { setConfirmPassword(t); setErrorMsg(null); }} secureTextEntry />

                      <View style={styles.spacerLarge} />

                      <TouchableOpacity 
                        style={[styles.primaryBtnFull, loading && styles.primaryBtnDisabled]} 
                        onPress={handleRegister}
                        disabled={loading}
                      >
                        <Text style={styles.primaryBtnText}>{loading ? 'Aguarde...' : 'Criar Conta'}</Text>
                      </TouchableOpacity>

                      <View style={styles.spacerLarge} />

                      <TouchableOpacity 
                        style={styles.linkBtnCenterRow} 
                        onPress={() => navigateToSlide(1)}
                      >
                        <Ionicons name="arrow-back" size={16} color="white" />
                        <Text style={styles.linkTextWhite}>Já tem uma conta? Logar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>

              </ScrollView>
            </View>
          </KeyboardAvoidingView>
          
          <PageDots total={3} activeIndex={currentSlide} />
          
          {/* Footer Rights */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>© 2026 Cartório 3º Ofício. Todos os direitos reservados.</Text>
            <View style={styles.footerLinksRow}>
              <Text style={styles.footerLink}>Termos de Uso</Text>
              <Text style={styles.footerDot}>•</Text>
              <Text style={styles.footerLink}>Política de Privacidade (LGPD)</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // fundo azul escuro com opacidade
  },
  container: {
    flex: 1,
  },
  carouselContainer: {
    flex: 1,
    overflow: Platform.OS === 'web' ? 'hidden' : 'visible',
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 100,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 48,
    width: '100%',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1E6FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  logoTextLarge: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginBottom: 16,
    width: '100%',
  },
  titleContainerCenter: {
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  headline: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 48,
  },
  titleCenter: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitleCenter: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 8,
  },
  onboardingSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  spacer: {
    height: 12,
  },
  spacerLarge: {
    height: 24,
  },
  spacerHuge: {
    height: 48,
  },
  primaryBtnFull: {
    backgroundColor: '#1E6FD9',
    width: '100%',
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnAuto: {
    backgroundColor: '#1E6FD9',
    paddingHorizontal: 40,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkBtnCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 10,
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
  linkText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  linkTextInline: {
    color: colors.text.muted,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  linkTextWhite: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  linkTextAccent: {
    color: colors.neon.blue,
    fontSize: 15,
    fontWeight: 'bold',
  },
  loginActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginBottom: 4,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  footerDot: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  errorBoxText: {
    color: colors.status.danger,
    fontSize: 14,
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 156, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 156, 0.3)',
  },
  successText: {
    color: colors.accent.green,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  primaryBtnDisabled: {
    backgroundColor: '#444',
  },
});
