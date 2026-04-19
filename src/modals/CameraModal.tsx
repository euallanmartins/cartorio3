import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { X, Camera, Users, Timer } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useAppContext } from '../context/AppContext';

const { height } = Dimensions.get('window');

export const CameraModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const { state } = useAppContext();
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Camera size={20} color={colors.text.primary} />
              <Text style={styles.titleText}>Câmera Recepção</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Situação: </Text>
            <Text style={[styles.statusValue, { color: colors.accent.green }]}>Aberto</Text>
          </View>

          {/* Camera Feed Area */}
          <View style={styles.feedContainer}>
            <View style={styles.feedInner}>
               {/* Static grayscale placeholder info */}
               <View style={styles.placeholderImg}>
                  <Text style={styles.placeholderText}>[ IMAGEM RECEPÇÃO ]</Text>
                  <Text style={styles.placeholderSub}>Mesa, Cadeiras, Planta</Text>
               </View>

               {/* Overlay items */}
               <View style={styles.feedOverlay}>
                  <Text style={styles.timestamp}>CARTÓRIO TERCEIRO OFÍCIO 16/04/2026 13:39:49</Text>
                  <View style={styles.liveIndicatorContainer}>
                    <View style={[styles.liveDot, { opacity: pulse ? 1 : 0.3 }]} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
               </View>

               {/* Stats Overlay Layer */}
               <View style={styles.statsOverlay}>
                  <View style={styles.statsGlass}>
                     <View style={styles.overlayStatItem}>
                        <Text style={styles.overlayStatLabel}>REGISTRO</Text>
                        <Text style={[styles.overlayStatValue, { color: colors.neon.blue }]}>12</Text>
                     </View>
                     <View style={styles.overDivider} />
                     <View style={styles.overlayStatItem}>
                        <Text style={styles.overlayStatLabel}>CERTIDÃO</Text>
                        <Text style={[styles.overlayStatValue, { color: colors.neon.pink }]}>04</Text>
                     </View>
                     <View style={styles.overDivider} />
                     <View style={styles.overlayStatItem}>
                        <Text style={styles.overlayStatLabel}>ESPERA</Text>
                        <Text style={[styles.overlayStatValue, { color: colors.neon.green }]}>15m</Text>
                     </View>
                  </View>
               </View>
            </View>
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Text style={styles.footerLabel}>Pessoas aguardando e tempo médio de espera</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Users size={20} color={colors.text.primary} />
                <Text style={styles.statValue}>00</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Timer size={20} color={colors.accent.blue} />
                <Text style={[styles.statValue, { color: colors.accent.blue }]}>12s</Text>
              </View>
            </View>
            <Text style={styles.footerTime}>16/4 13:39</Text>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.padding,
    height: height * 0.65,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border.subtle,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeBtn: {
    padding: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.text.muted,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  feedContainer: {
    backgroundColor: '#333',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    height: 220,
    marginBottom: spacing.xl,
  },
  feedInner: {
    flex: 1,
    backgroundColor: '#222', // Dark background for camera feed
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImg: {
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholderSub: {
    color: '#444',
    fontSize: 12,
  },
  feedOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timestamp: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.status.danger,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.subtle,
  },
  footerTime: {
    fontSize: 12,
    color: colors.text.muted,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  statsGlass: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: borderRadius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  overlayStatItem: {
    alignItems: 'center',
  },
  overlayStatLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.text.muted,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  overlayStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
