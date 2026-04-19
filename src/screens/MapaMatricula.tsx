import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { colors, spacing } from '../theme/theme';
import { Platform } from 'react-native';
import { geocodeEndereco } from '../lib/publicApis';

// Mock components for Web to avoid codegenNativeCommands error
let MapView: any = View;
let Marker: any = View;
let Circle: any = View;
let PROVIDER_GOOGLE: any = 'google';

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Circle = Maps.Circle;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn('Maps not available');
  }
}

const { width, height } = Dimensions.get('window');

export const MapaMatricula = ({ route, navigation }: any) => {
  const { address } = route?.params || {};
  
  const [region, setRegion] = useState<any>(null);
  const [loading, setLoading] = useState(!!address);
  const [errorLocalizacao, setErrorLocalizacao] = useState(false);

  useEffect(() => {
    if (!address) {
      setRegion({
        latitude: -23.5505,
        longitude: -46.6333,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      return;
    }

    const fetchGeo = async () => {
      setLoading(true);
      const coords = await geocodeEndereco(address);
      if (coords) {
        setRegion({
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } else {
        setErrorLocalizacao(true);
        setRegion({
          latitude: -23.5505,
          longitude: -46.6333,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
      setLoading(false);
    };

    fetchGeo();
  }, [address]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.skeletonContainer}>
             <ActivityIndicator size="large" color={colors.accent.blue} />
             <Text style={styles.skeletonText}>Buscando coordenadas de: {address}</Text>
          </View>
        ) : Platform.OS === 'web' ? (
          <View style={styles.webPlaceholder}>
            <MapPin size={48} color={colors.accent.blue} />
            <Text style={styles.webPlaceholderText}>O Mapa real está disponível apenas em dispositivos reais.</Text>
            <Text style={styles.webPlaceholderSub}>
               {errorLocalizacao ? 'Erro ao buscar localização.' : `Coordenadas: ${region?.latitude.toFixed(4)}, ${region?.longitude.toFixed(4)}`}
            </Text>
          </View>
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            region={region}
          >
            {region && (
              <Marker
                coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                title="Matrícula Selecionada"
                description={errorLocalizacao ? 'Localização Padrão' : address || "3º Registro de Imóveis"}
              >
                <View style={styles.customMarker}>
                   <View style={styles.markerCircle}>
                      <MapPin size={18} color="white" />
                   </View>
                   <View style={styles.markerArrow} />
                </View>
              </Marker>
            )}

            {region && (
              <Circle
                center={{ latitude: region.latitude, longitude: region.longitude }}
                radius={100}
                fillColor="rgba(30, 111, 255, 0.1)"
                strokeColor="rgba(30, 111, 255, 0.3)"
              />
            )}
          </MapView>
        )}
        
        {errorLocalizacao && !loading && (
           <View style={styles.floatingError}>
              <Text style={styles.floatingErrorText}>Coordenadas não encontradas. Exibindo centro.</Text>
           </View>
        )}
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
  mapContainer: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
      backgroundColor: colors.accent.blue,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'white',
      elevation: 4,
  },
  markerArrow: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: colors.accent.blue,
      marginTop: -2,
  },
  webPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F5',
    padding: 40,
  },
  webPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  webPlaceholderSub: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  skeletonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F2F5',
  },
  skeletonText: {
    marginTop: 16,
    color: colors.text.muted,
  },
  floatingError: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 50, 50, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  floatingErrorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
