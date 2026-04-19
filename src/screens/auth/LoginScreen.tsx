import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme/theme';
import { AuthInput, PageDots } from '../../components/auth/AuthComponents';
import { useAppContext } from '../../context/AppContext';
import { authService } from '../../lib/api';

export const LoginScreen = ({ navigation }: any) => {
  const { dispatch } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
            <View style={styles.content}>
              {renderLogo()}
              
              <View style={styles.titleContainerCenter}>
                <Text style={styles.titleCenter}>Login</Text>
              </View>

              {errorMsg && (
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
                  onChangeText={(t: string) => {
                      setEmail(t);
                      if (errorMsg) setErrorMsg(null);
                  }}
                  keyboardType="email-address"
                />
                <View style={styles.spacer} />
                <AuthInput
                  label="Senha"
                  placeholder="digite sua senha"
                  value={password}
                  onChangeText={(t: string) => {
                      setPassword(t);
                      if (errorMsg) setErrorMsg(null);
                  }}
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
                    {loading ? (
                       <ActivityIndicator size="small" color="white" />
                    ) : (
                       <Text style={styles.primaryBtnText}>Login</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.spacerHuge} />

                <View style={styles.registerRow}>
                  <View style={styles.registerTextGroup}>
                    <Text style={styles.linkTextInline}>Primeiro acesso?</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.text.muted} />
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkTextAccent}>Criar conta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          
          <PageDots total={3} activeIndex={1} />
          
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
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
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
  titleContainerCenter: {
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  titleCenter: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
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
  primaryBtnAuto: {
    backgroundColor: '#1E6FD9',
    paddingHorizontal: 40,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primaryBtnDisabled: {
    backgroundColor: '#444',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkBtnLeft: {
    justifyContent: 'center',
  },
  linkTextInline: {
    color: colors.text.muted,
    fontSize: 14,
    textDecorationLine: 'underline',
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
