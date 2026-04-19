import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions, Animated } from 'react-native';
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
          placeholderTextColor="#888"
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
            {isPasswordVisible ? <EyeOff color="white" size={20} /> : <Eye color="white" size={20} />}
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
    marginBottom: spacing.md,
  },
  label: {
    color: '#4A90F5',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: borderRadius.md,
    height: 56,
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: '#1E6FFF',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 32,
    backgroundColor: '#1E6FFF',
  },
  dotInactive: {
    width: 10,
    backgroundColor: '#888888',
  },
});
