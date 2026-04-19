import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import * as Sentry from '@sentry/react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    Sentry.captureException(error);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <LinearGradient
                colors={['rgba(255, 0, 0, 0.2)', 'transparent'] as [string, string, ...string[]]}
                style={styles.glow}
            />
            
            <AlertCircle size={64} color="#FF4D4D" style={styles.icon} />
            
            <Text style={styles.title}>Ops! Algo não deu certo.</Text>
            <Text style={styles.message}>
              Ocorreu um erro inesperado. Já notificamos nossa equipe para corrigir o problema.
            </Text>

            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <RefreshCw size={20} color="white" />
              <Text style={styles.buttonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  glow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 300,
  },
  icon: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.blue,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: borderRadius.pill,
    gap: 10,
    shadowColor: colors.accent.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
