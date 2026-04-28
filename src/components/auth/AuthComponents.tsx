import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions, Animated, Platform } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, borderRadius, spacing } from '../../theme/theme';

interface AuthInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  label?: string;
}

export const AuthInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType, 
  error, 
  label 
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View 
        style={[
          styles.inputWrapper, 
          isFocused && styles.inputFocused,
          error && styles.inputError
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.62)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            accessibilityRole="button"
          >
            {isPasswordVisible ? <EyeOff color={colors.text.inverse} size={20} /> : <Eye color={colors.text.inverse} size={20} />}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

interface PageDotsProps {
  total: number;
  activeIndex: number;
}

export const PageDots = ({ total, activeIndex }: PageDotsProps) => {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <View 
            key={i} 
            style={[
              styles.dot, 
              isActive ? styles.dotActive : styles.dotInactive
            ]} 
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.accent.blueLight,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.32)',
    borderRadius: borderRadius.md,
    height: 48,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: colors.accent.blueLight,
  },
  inputError: {
    borderColor: colors.status.danger,
  },
  input: {
    flex: 1,
    color: colors.text.inverse,
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  errorText: {
    color: colors.status.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 10,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 32,
    backgroundColor: colors.accent.blue,
  },
  dotInactive: {
    width: 10,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});
