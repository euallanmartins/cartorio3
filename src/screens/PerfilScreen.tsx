import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import {
  User,
  Lock,
  MapPin,
  ShieldCheck,
  Wallet,
  FileText,
  UserMinus,
  LogOut,
  ChevronRight,
  X,
  Save,
} from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useAppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { CARTORIO_INFO } from '../lib/config';

type ModalKey = 'profile' | 'password' | 'address' | 'privacy' | null;

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onPress?: () => void;
  isDanger?: boolean;
  rightContent?: React.ReactNode;
}

const MenuItem = ({ icon: Icon, label, description, onPress, isDanger, rightContent }: MenuItemProps) => (
  <TouchableOpacity
    style={[styles.menuItem, isDanger && styles.dangerItem]}
    onPress={onPress}
    disabled={!onPress && !rightContent}
    activeOpacity={0.75}
  >
    <View style={styles.menuLeft}>
      <View style={[styles.iconContainer, isDanger && { backgroundColor: 'transparent' }]}>
        <Icon size={20} color={isDanger ? colors.status.danger : colors.text.secondary} />
      </View>
      <View style={styles.menuTextGroup}>
        <Text style={[styles.menuLabel, isDanger && { color: colors.status.danger }]}>{label}</Text>
        {description && <Text style={styles.menuDescription}>{description}</Text>}
      </View>
    </View>
    {rightContent || (!isDanger && <ChevronRight size={20} color={colors.text.muted} />)}
  </TouchableOpacity>
);

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.text.muted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
  </View>
);

export const PerfilScreen = ({ navigation }: any) => {
  const { state, dispatch } = useAppContext();
  const [activeModal, setActiveModal] = useState<ModalKey>(null);

  const [profileForm, setProfileForm] = useState({
    name: state.user.name,
    email: state.user.email,
    phone: state.user.phone || '',
    cpf: state.user.cpf || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [addressForm, setAddressForm] = useState({
    cep: '',
    street: '',
    number: '',
    district: '',
    city: '',
    uf: '',
  });

  const savedAddress = [
    addressForm.street,
    addressForm.number,
    addressForm.district,
    addressForm.city && addressForm.uf ? `${addressForm.city} - ${addressForm.uf}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const closeModal = () => setActiveModal(null);

  const handleSaveProfile = () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      Alert.alert('Dados incompletos', 'Nome e e-mail são obrigatórios.');
      return;
    }

    dispatch({
      type: 'SET_USER',
      user: {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        cpf: profileForm.cpf.trim(),
      },
    });
    closeModal();
    Alert.alert('Perfil atualizado', 'Alteração salva localmente no front-end.');
  };

  const handleSavePassword = () => {
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos de senha.');
      return;
    }
    if (passwordForm.next.length < 6) {
      Alert.alert('Senha fraca', 'Use pelo menos 6 caracteres.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      Alert.alert('Confirmação inválida', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    setPasswordForm({ current: '', next: '', confirm: '' });
    closeModal();
    Alert.alert('Senha validada', 'Fluxo pronto no front-end. A troca real depende do backend.');
  };

  const handleSaveAddress = () => {
    if (!addressForm.cep.trim() || !addressForm.street.trim() || !addressForm.city.trim() || !addressForm.uf.trim()) {
      Alert.alert('Endereço incompleto', 'Preencha CEP, logradouro, cidade e UF.');
      return;
    }

    closeModal();
    Alert.alert('Endereço salvo', 'Endereço mantido localmente para demonstração do front-end.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir conta',
      'Este front-end já exibe a confirmação. A exclusão permanente deve ser executada pelo backend.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Entendi',
          style: 'destructive',
          onPress: () => Alert.alert('Aguardando backend', 'Nenhum dado real foi excluído.'),
        },
      ]
    );
  };

  const renderModalContent = () => {
    if (activeModal === 'profile') {
      return (
        <>
          <ModalHeader title="Editar Perfil" onClose={closeModal} />
          <Field label="Nome completo" value={profileForm.name} onChangeText={(name) => setProfileForm({ ...profileForm, name })} />
          <Field
            label="E-mail"
            value={profileForm.email}
            onChangeText={(email) => setProfileForm({ ...profileForm, email })}
            keyboardType="email-address"
          />
          <Field
            label="CPF"
            value={profileForm.cpf}
            onChangeText={(cpf) => setProfileForm({ ...profileForm, cpf })}
            keyboardType="numeric"
            placeholder="000.000.000-00"
          />
          <Field
            label="Telefone"
            value={profileForm.phone}
            onChangeText={(phone) => setProfileForm({ ...profileForm, phone })}
            keyboardType="phone-pad"
            placeholder="(00) 00000-0000"
          />
          <PrimaryButton label="Salvar alterações" onPress={handleSaveProfile} />
        </>
      );
    }

    if (activeModal === 'password') {
      return (
        <>
          <ModalHeader title="Mudar Senha" onClose={closeModal} />
          <Field label="Senha atual" value={passwordForm.current} onChangeText={(current) => setPasswordForm({ ...passwordForm, current })} secureTextEntry />
          <Field label="Nova senha" value={passwordForm.next} onChangeText={(next) => setPasswordForm({ ...passwordForm, next })} secureTextEntry />
          <Field
            label="Confirmar nova senha"
            value={passwordForm.confirm}
            onChangeText={(confirm) => setPasswordForm({ ...passwordForm, confirm })}
            secureTextEntry
          />
          <Text style={styles.helperText}>A senha é validada apenas no front-end neste protótipo.</Text>
          <PrimaryButton label="Validar alteração" onPress={handleSavePassword} />
        </>
      );
    }

    if (activeModal === 'address') {
      return (
        <>
          <ModalHeader title="Mudar Endereço" onClose={closeModal} />
          <Field label="CEP" value={addressForm.cep} onChangeText={(cep) => setAddressForm({ ...addressForm, cep })} keyboardType="numeric" placeholder="00000-000" />
          <Field label="Logradouro" value={addressForm.street} onChangeText={(street) => setAddressForm({ ...addressForm, street })} />
          <View style={styles.inlineFields}>
            <View style={styles.inlineSmall}>
              <Field label="Número" value={addressForm.number} onChangeText={(number) => setAddressForm({ ...addressForm, number })} keyboardType="numeric" />
            </View>
            <View style={styles.inlineLarge}>
              <Field label="Bairro" value={addressForm.district} onChangeText={(district) => setAddressForm({ ...addressForm, district })} />
            </View>
          </View>
          <View style={styles.inlineFields}>
            <View style={styles.inlineLarge}>
              <Field label="Cidade" value={addressForm.city} onChangeText={(city) => setAddressForm({ ...addressForm, city })} />
            </View>
            <View style={styles.inlineSmall}>
              <Field label="UF" value={addressForm.uf} onChangeText={(uf) => setAddressForm({ ...addressForm, uf: uf.toUpperCase().slice(0, 2) })} />
            </View>
          </View>
          <PrimaryButton label="Salvar endereço" onPress={handleSaveAddress} />
        </>
      );
    }

    if (activeModal === 'privacy') {
      return (
        <>
          <ModalHeader title="Política de Privacidade" onClose={closeModal} />
          <Text style={styles.privacyTitle}>Resumo LGPD</Text>
          <Text style={styles.privacyText}>
            Seus dados são usados para autenticação, acompanhamento de solicitações, comunicação do cartório e emissão de certidões.
          </Text>
          <Text style={styles.privacyText}>
            Dados sensíveis, pagamentos e documentos oficiais devem ser tratados pelo backend com autenticação, auditoria e canais seguros.
          </Text>
          <Text style={styles.privacyText}>
            Este front-end mantém apenas o fluxo visual e estados locais de demonstração até a integração dos endpoints reais.
          </Text>
          <PrimaryButton label="Entendido" onPress={closeModal} />
        </>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={colors.gradient.profile as [string, string, ...string[]]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <SafeAreaView>
            <View style={styles.headerContent}>
              <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch({ type: 'LOGOUT' })}>
                <LogOut size={20} color="white" />
              </TouchableOpacity>

              <View style={styles.avatarCircle}>
                <User size={40} color="white" />
              </View>

              <Text style={styles.userName}>{state.user.name}</Text>
              <Text style={styles.userEmail}>{state.user.email}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={User} label="Editar Perfil" description="Nome, e-mail, CPF e telefone" onPress={() => setActiveModal('profile')} />
            <MenuItem icon={Lock} label="Mudar Senha" description="Validação local do fluxo" onPress={() => setActiveModal('password')} />
            <MenuItem
              icon={MapPin}
              label="Mudar Endereço"
              description={savedAddress || 'Endereço de contato'}
              onPress={() => setActiveModal('address')}
            />
            <MenuItem icon={ShieldCheck} label="Política de Privacidade" description="Resumo LGPD do aplicativo" onPress={() => setActiveModal('privacy')} />
            <MenuItem
              icon={ShieldCheck}
              label="Biometria"
              description={state.biometricsEnabled ? 'Ativada neste dispositivo' : 'Desativada'}
              rightContent={
                <Switch
                  value={state.biometricsEnabled}
                  onValueChange={(enabled) => dispatch({ type: 'SET_BIOMETRICS', enabled })}
                  trackColor={{ false: colors.border.subtle, true: colors.accent.blue }}
                  thumbColor="white"
                />
              }
            />
            <MenuItem icon={Wallet} label="Carteira Digital" description="Saldo e transações" onPress={() => navigation.navigate('CarteiraDashboard')} />
          </View>

          <Text style={styles.sectionTitle}>Meus Pedidos</Text>
          <View style={styles.menuCard}>
            <MenuItem icon={FileText} label="Certidões Solicitadas" description="Pedidos prontos e em processamento" onPress={() => navigation.navigate('MeusPedidos')} />
          </View>

          <View style={styles.dangerSection}>
            <MenuItem icon={UserMinus} label="Excluir conta" description="Requer backend para exclusão real" isDanger onPress={handleDeleteAccount} />
          </View>

          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>{CARTORIO_INFO.nomeAbreviado}</Text>
            <Text style={styles.contactInfo}>{CARTORIO_INFO.endereco}</Text>
            <Text style={styles.contactInfo}>Tel: {CARTORIO_INFO.telefone}</Text>
            <Text style={styles.contactInfo}>Site: {CARTORIO_INFO.site}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{CARTORIO_INFO.nome}</Text>
          <Text style={styles.versionText}>v. 1.1.0 (328)</Text>
        </View>
      </ScrollView>

      <Modal visible={!!activeModal} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              {renderModalContent()}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const ModalHeader = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <View style={styles.modalHeader}>
    <Text style={styles.modalTitle}>{title}</Text>
    <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
      <X size={22} color={colors.text.secondary} />
    </TouchableOpacity>
  </View>
);

const PrimaryButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
    <Save size={18} color="white" />
    <Text style={styles.primaryButtonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    height: 220,
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logoutBtn: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  menuSection: {
    padding: spacing.padding,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    gap: spacing.sm,
  },
  menuLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  menuDescription: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  dangerSection: {
    marginTop: spacing.xl,
  },
  dangerItem: {
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    paddingLeft: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.padding,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 4,
  },
  contactCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalCard: {
    maxHeight: '88%',
    backgroundColor: colors.background.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  modalScroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    height: 52,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  inlineFields: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inlineSmall: {
    flex: 0.8,
  },
  inlineLarge: {
    flex: 1.4,
  },
  helperText: {
    fontSize: 12,
    color: colors.text.muted,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  privacyText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  primaryButton: {
    height: 54,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.md,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
