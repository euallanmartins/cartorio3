import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import { PageDots } from '../../components/auth/AuthComponents';

export const WelcomeScreen = ({ navigation }: any) => {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' }} // Usando Unsplash como fallback de alta qualidade se o asset local demorar
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>C3</Text>
            </View>
            <Text style={styles.headerTitle}>Cartório do Terceiro Ofício</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.title}>O Cartório virtual{"\n"}que faltava</Text>
            
            <View style={styles.spacerSmall} />
            
            <Text style={styles.subtitle}>
              Acompanhe o andamento do seu processo{"\n"}e/ou solicite sua certidão de matrícula.
            </Text>

            <View style={styles.spacerLarge} />

            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.ctaButtonText}>Criar conta</Text>
            </TouchableOpacity>

            <View style={styles.spacerSmall} />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Já tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Logar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <PageDots total={3} activeIndex={0} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 12,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E6FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 100,
  },
  title: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    lineHeight: 46,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    lineHeight: 22,
  },
  spacerSmall: {
    height: 16,
  },
  spacerLarge: {
    height: 32,
  },
  ctaButton: {
    backgroundColor: '#1E6FFF',
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
