import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/theme';

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SectionCard = ({ title, children, style }: SectionCardProps) => (
  <View style={[styles.card, style]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {children}
  </View>
);

export const StatusBadge = ({ isOpen }: { isOpen: boolean }) => (
  <View style={styles.badgeContainer}>
    <View style={[styles.dot, { backgroundColor: isOpen ? colors.accent.green : colors.status.danger }]} />
    <Text style={[styles.badgeText, { color: isOpen ? colors.accent.green : colors.status.danger }]}>
      {isOpen ? 'Aberto' : 'Fechado'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.padding,
    marginBottom: spacing.md,
    // Subtle shadow for light mode premium look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
