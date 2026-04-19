import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowLeft, MapPin, Info } from 'lucide-react-native';
import { colors, spacing } from '../theme/theme';

const { width, height } = Dimensions.get('window');

// fix: aceitar route.params.address para compatibilidade com LocationWizard na web
export const MapaMatricula = ({ route, navigation }: any) => {
  const { address } = route?.params || {};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa (Web Preview)</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.webPlaceholder}>
        <View style={styles.iconCircle}>
            <MapPin size={64} color={colors.accent.blue} />
        </View>
        
        <Text style={styles.webPlaceholderText}>Visualização Geográfica</Text>
        <Text style={styles.webPlaceholderSub}>
            O componente de Mapas nativo (Google Maps) está disponível apenas em dispositivos móveis (Android/iOS).
        </Text>

        {/* fix: exibir endereço buscado se disponível */}
        {address && (
          <View style={styles.addressBox}>
            <MapPin size={16} color={colors.accent.blue} />
            <Text style={styles.addressText}>{address}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
            <Info size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>
                No navegador, você pode testar todos os fluxos de navegação, carteira digital, e o wizard de localização.
            </Text>
        </View>

        <TouchableOpacity 
            style={styles.backHomeBtn}
            onPress={() => navigation.navigate('Main')}
        >
            <Text style={styles.backHomeText}>Voltar para o Início</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  webPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
    padding: 40,
  },
  iconCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
  },
  webPlaceholderText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  webPlaceholderSub: {
    fontSize: 16,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(30, 111, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(30, 111, 255, 0.2)',
    maxWidth: 400,
    width: '100%',
  },
  addressText: {
    color: colors.accent.blue,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  infoBox: {
      backgroundColor: colors.background.card,
      padding: 20,
      borderRadius: 16,
      flexDirection: 'row',
      gap: 15,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      width: '100%',
      maxWidth: 400,
      marginBottom: 30,
  },
  infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
  },
  backHomeBtn: {
      backgroundColor: colors.accent.blue,
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 30,
  },
  backHomeText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  }
});
