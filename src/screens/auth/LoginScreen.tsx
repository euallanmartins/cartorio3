import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { AuthInput, PageDots } from '../../components/auth/AuthComponents';

export const LoginScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideWidth, setSlideWidth] = useState(Dimensions.get('window').width);

  // Estados locais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
                pagingEnabled
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
                          style={styles.primaryBtnAuto} 
                          onPress={() => console.log('Mock Login')}
                        >
                          <Text style={styles.primaryBtnText}>Login</Text>
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

                    <View style={styles.formContainer}>
                      <AuthInput placeholder="Nome" value={nome} onChangeText={setNome} />
                      <View style={styles.spacer} />
                      <AuthInput placeholder="Sobrenome" value={sobrenome} onChangeText={setSobrenome} />
                      <View style={styles.spacer} />
                      <AuthInput placeholder="E-mail" value={createEmail} onChangeText={setCreateEmail} keyboardType="email-address" />
                      <View style={styles.spacer} />
                      <AuthInput placeholder="Senha" value={createPassword} onChangeText={setCreatePassword} secureTextEntry />
                      <View style={styles.spacer} />
                      <AuthInput placeholder="Confirme a Senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

                      <View style={styles.spacerLarge} />

                      <TouchableOpacity 
                        style={styles.primaryBtnFull} 
                        onPress={() => console.log('Mock Register')}
                      >
                        <Text style={styles.primaryBtnText}>Criar Conta</Text>
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
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
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
});
