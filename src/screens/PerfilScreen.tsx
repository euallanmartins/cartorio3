import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { User, Lock, MapPin, ShieldCheck, Wallet, FileText, UserMinus, LogOut, ChevronRight } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useAppContext } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { CARTORIO_INFO } from '../lib/config';

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onPress?: () => void;
  isDanger?: boolean;
}

const MenuItem = ({ icon: Icon, label, onPress, isDanger }: MenuItemProps) => (
  <TouchableOpacity 
      style={[styles.menuItem, isDanger && styles.dangerItem]} 
      onPress={onPress}
  >
    <View style={styles.menuLeft}>
      <View style={[styles.iconContainer, isDanger && { backgroundColor: 'transparent' }]}>
          <Icon size={20} color={isDanger ? colors.status.danger : colors.text.secondary} />
      </View>
      <Text style={[styles.menuLabel, isDanger && { color: colors.status.danger }]}>{label}</Text>
    </View>
    {!isDanger && <ChevronRight size={20} color={colors.text.muted} />}
  </TouchableOpacity>
);

export const PerfilScreen = ({ navigation }: any) => {
  const { state, dispatch } = useAppContext();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => console.log("Account deleted") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header with Gradient */}
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
                <MenuItem icon={User} label="Editar Perfil" />
                <MenuItem icon={Lock} label="Mudar Senha" />
                <MenuItem icon={MapPin} label="Mudar Endereço" />
                <MenuItem icon={ShieldCheck} label="Política de Privacidade" />
                <MenuItem 
                    icon={Wallet} 
                    label="Carteira Digital" 
                    onPress={() => navigation.navigate('CarteiraDashboard')} 
                />
            </View>

            <Text style={styles.sectionTitle}>Meus Pedidos</Text>
            <View style={styles.menuCard}>
                <MenuItem 
                    icon={FileText} 
                    label="Certidões Solicitadas" 
                    onPress={() => navigation.navigate('PedidoTab')}
                />
            </View>

            <View style={styles.dangerSection}>
                <MenuItem 
                    icon={UserMinus} 
                    label="Excluir conta" 
                    isDanger 
                    onPress={handleDeleteAccount}
                />
            </View>

            {/* Official Info */}
            <View style={styles.contactCard}>
                <Text style={styles.contactTitle}>{CARTORIO_INFO.nomeAbreviado}</Text>
                <Text style={styles.contactInfo}>{CARTORIO_INFO.endereco}</Text>
                <Text style={styles.contactInfo}>Tel: {CARTORIO_INFO.telefone}</Text>
                <Text style={styles.contactInfo}>Site: {CARTORIO_INFO.site}</Text>
            </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>Cartório do Terceiro Ofício de São Paulo</Text>
            <Text style={styles.versionText}>v. 1.1.0 (328)</Text>
        </View>

      </ScrollView>
    </View>
  );
};

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
  },
  menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
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
  },
});
