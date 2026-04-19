import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, colors } from '../../theme/theme';
import { AuthInput, PageDots } from '../../components/auth/AuthComponents';
import { authService } from '../../lib/api';

export const RegisterScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<any>({});

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

  const handleRegister = async () => {
    let newErrors: any = {};
    if (!nome) newErrors.nome = 'Nome obrigatório';
    if (!email) newErrors.email = 'E-mail obrigatório';
    if (!cpf || cpf.replace(/\D/g, '').length < 11) newErrors.cpf = 'CPF inválido';
    if (!phone || phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Telefone inválido';
    if (!password) newErrors.password = 'Senha obrigatória';
    if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await authService.register({
        name: nome,
        email,
        cpf: cpf.replace(/\D/g, ''),
        phone: phone.replace(/\D/g, ''),
        password,
      });

      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => navigation.navigate('Login'), 1500);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro ao criar conta.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormEmpty = !nome || !email || !cpf || !phone || !password || !confirmPassword;

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
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              
              {/* Logo Small */}
              <View style={styles.logoHeader}>
                <View style={styles.logoCircleSmall}>
                    <Text style={styles.logoTextSmall}>C3</Text>
                </View>
              </View>

              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Preencha os campos abaixo</Text>
              </View>

              {/* Success Message */}
              {successMsg && (
                <View style={styles.successBox}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.accent.green} />
                  <Text style={styles.successText}>{successMsg}</Text>
                </View>
              )}

              {/* General Error */}
              {errors.general && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={20} color={colors.status.danger} />
                  <Text style={styles.errorBoxText}>{errors.general}</Text>
                </View>
              )}

              {/* Form */}
              <View style={styles.form}>
                <AuthInput
                  placeholder="Nome completo"
                  value={nome}
                  onChangeText={(t: string) => {
                      setNome(t);
                      if(errors.nome) setErrors({...errors, nome: null});
                  }}
                  error={errors.nome}
                />

                <AuthInput
                  placeholder="E-mail"
                  value={email}
                  onChangeText={(t: string) => {
                      setEmail(t);
                      if(errors.email) setErrors({...errors, email: null});
                  }}
                  keyboardType="email-address"
                  error={errors.email}
                />

                <AuthInput
                  placeholder="CPF"
                  value={formatCPF(cpf)}
                  onChangeText={(t: string) => {
                      setCpf(t.replace(/\D/g, ''));
                      if(errors.cpf) setErrors({...errors, cpf: null});
                  }}
                  keyboardType="numeric"
                  error={errors.cpf}
                />

                <AuthInput
                  placeholder="Celular"
                  value={formatPhone(phone)}
                  onChangeText={(t: string) => {
                      setPhone(t.replace(/\D/g, ''));
                      if(errors.phone) setErrors({...errors, phone: null});
                  }}
                  keyboardType="phone-pad"
                  error={errors.phone}
                />

                <AuthInput
                  placeholder="Senha"
                  value={password}
                  onChangeText={(t: string) => {
                      setPassword(t);
                      if(errors.password) setErrors({...errors, password: null});
                  }}
                  secureTextEntry
                  error={errors.password}
                />

                <AuthInput
                  placeholder="Confirme a Senha"
                  value={confirmPassword}
                  onChangeText={(t: string) => {
                      setConfirmPassword(t);
                      if(errors.confirmPassword) setErrors({...errors, confirmPassword: null});
                  }}
                  secureTextEntry
                  error={errors.confirmPassword}
                />

                <View style={styles.spacerLarge} />

                <View style={styles.btnRight}>
                    <TouchableOpacity 
                        style={[styles.registerBtn, (isFormEmpty || loading) && styles.registerBtnDisabled]} 
                        onPress={handleRegister}
                        disabled={isFormEmpty || loading}
                    >
                        {loading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={styles.registerBtnText}>Criar Conta</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.spacerHuge} />

                <View style={styles.footerRow}>
                    <Ionicons name="arrow-back" size={20} color="white" />
                    <Text style={styles.footerText}>Já tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Logar</Text>
                    </TouchableOpacity>
                </View>
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
          
          <PageDots total={3} activeIndex={2} />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  logoHeader: {
    marginTop: 48,
    marginBottom: 24,
  },
  logoCircleSmall: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1E6FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextSmall: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#1E6FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
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
  form: {
    width: '100%',
  },
  spacerLarge: {
    height: 24,
  },
  spacerHuge: {
    height: 24,
  },
  btnRight: {
    alignItems: 'flex-end',
  },
  registerBtn: {
    backgroundColor: '#1E6FFF',
    paddingHorizontal: 36,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnDisabled: {
    backgroundColor: '#444',
  },
  registerBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: 'white',
    fontSize: 15,
  },
  loginLink: {
    color: '#1E6FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
