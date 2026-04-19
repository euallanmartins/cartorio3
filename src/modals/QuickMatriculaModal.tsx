import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { Clipboard, X, Plus } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';
import { CERTIDAO_PRICE } from '../lib/config';

interface QuickMatriculaModalProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickMatriculaModal = ({ visible, onClose }: QuickMatriculaModalProps) => {
  const { dispatch } = useAppContext();
  const [matricula, setMatricula] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!matricula.trim()) {
      setError('Matrícula obrigatória');
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      item: {
        id: `cert_${Date.now()}`,
        matricula: matricula.trim(),
        address: 'Endereço vinculado à matrícula', // Será resolvido pelo backend
        price: CERTIDAO_PRICE,
        tipo: 'certidao_digital',
      },
    });

    handleClose();
  };

  const handleClose = () => {
    setMatricula('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Adicionar Matrícula</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                  <X size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                  <Clipboard size={20} color={colors.text.secondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="digite o número da matrícula"
                    placeholderTextColor="#888"
                    value={matricula}
                    onChangeText={(text) => {
                      setMatricula(text);
                      if (error) setError(null);
                    }}
                    keyboardType="numeric"
                    autoFocus
                  />
                </View>
                {error && (
                  <View style={styles.errorRow}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Text style={styles.charCount}>{matricula.length}/8</Text>
                  </View>
                )}
              </View>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                  <X size={20} color={colors.accent.blue} />
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                  <Plus size={20} color="white" />
                  <Text style={styles.addBtnText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  modalContainer: {
    backgroundColor: '#121417',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent.blue,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 12,
    height: 60,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: colors.status.danger,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginHorizontal: 4,
  },
  errorText: {
    color: colors.status.danger,
    fontSize: 12,
  },
  charCount: {
    color: '#666',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 111, 255, 0.1)',
    gap: 8,
  },
  cancelBtnText: {
    color: colors.accent.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.blue,
    gap: 8,
  },
  addBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
