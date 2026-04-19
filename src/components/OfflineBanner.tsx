import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { BlurView } from 'expo-blur';

export const OfflineBanner = () => {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <BlurView intensity={30} tint="dark" style={styles.blur}>
                <View style={styles.content}>
                    <WifiOff size={16} color={colors.accent.blueLight} />
                    <Text style={styles.text}>Modo Offline — Exibindo dados em cache</Text>
                </View>
            </BlurView>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  container: {
    marginHorizontal: spacing.padding,
    marginTop: Platform.OS === 'android' ? 40 : 10,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 243, 255, 0.3)',
  },
  blur: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(30, 111, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
