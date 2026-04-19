import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Clock, RefreshCcw, Camera, Wallet, ClipboardList, Ticket, Layers } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import { useAppContext } from '../context/AppContext';
import { CERTIDAO_PRICE } from '../lib/config';
import { SectionCard, StatusBadge } from '../components/BaseComponents';
import { CameraModal } from '../modals/CameraModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - (spacing.padding * 2) - spacing.md) / 2;

export const HomeScreen = ({ navigation }: any) => {
  const { state } = useAppContext();
  const [showCamera, setShowCamera] = React.useState(false);

  const QuickActionCard = ({ icon: Icon, label, color, neonColor, onPress }: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: neonColor || color }]}>
        <Icon size={24} color={neonColor || color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.navigate('PerfilTab')} style={styles.avatar}>
              <UserSilhouette color={colors.text.muted} size={30} />
            </TouchableOpacity>
            <View>
              <Text style={styles.brandTitle}>Cartório do Terceiro Ofício</Text>
              <Text style={styles.userName}>{state.user.name}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell color={colors.text.primary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Status Cards Row */}
        <View style={styles.statusRow}>
          <SectionCard style={[styles.statusCard, { width: CARD_WIDTH } as any]}>
            <Text style={styles.cardTopText}>{state.office.openHours}</Text>
            <View style={styles.clockIconContainer}>
              <Clock color={colors.text.secondary} size={40} strokeWidth={1} />
            </View>
            <StatusBadge isOpen={state.office.isOpen} />
            <View style={styles.cardFooter}>
              <RefreshCcw size={10} color={colors.text.muted} />
              <Text style={styles.footerText}>{state.office.lastUpdated}</Text>
            </View>
            <Text style={styles.footerSubText}>{state.office.dayOfWeek}</Text>
          </SectionCard>

          <SectionCard style={[styles.statusCard, { width: CARD_WIDTH } as any]}>
            <View style={styles.atendimentoHeader}>
              <Camera size={16} color={colors.text.primary} />
              <Text style={styles.atendimentoTitle}>Atendimento</Text>
            </View>
            <Text style={styles.atendimentoSub}>Acompanhe a fila em tempo real</Text>
            <TouchableOpacity 
                style={styles.visualizarBtn}
                onPress={() => setShowCamera(true)}
            >
              <Camera size={16} color="white" />
              <Text style={styles.visualizarText}>Visualizar</Text>
            </TouchableOpacity>
          </SectionCard>
        </View>

        {/* Consultas e Solicitações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultas e Solicitações</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <QuickActionCard 
              icon={Wallet} 
              label="Carteira Digital" 
              color={colors.accent.green}
              neonColor={colors.neon.green}
              onPress={() => navigation.navigate('CarteiraDashboard')} 
            />
            <QuickActionCard 
              icon={ClipboardList} 
              label={`Solicitar Certidão\nR$ ${CERTIDAO_PRICE.toFixed(2).replace('.', ',')}`} 
              color={colors.accent.blue} 
              neonColor={colors.neon.blue}
              onPress={() => navigation.navigate('PedidoTab')}
            />
            <QuickActionCard 
              icon={Ticket} 
              label="Minhas Prenotações" 
              color={colors.accent.yellow} 
              neonColor={colors.neon.purple}
              onPress={() => navigation.navigate('PrenotacoesTab')}
            />
            <QuickActionCard 
              icon={Layers} 
              label="Meus Pedidos\n(Certidão)" 
              color={colors.accent.pink} 
              neonColor={colors.neon.pink}
              onPress={() => navigation.navigate('PedidoTab')}
            />
          </ScrollView>
        </View>

        <CameraModal visible={showCamera} onClose={() => setShowCamera(false)} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Placeholder for User Silhouette if not using an image
const UserSilhouette = ({ color, size }: any) => (
  <View style={{ width: size, height: size, borderRadius: size/2, backgroundColor: '#E1E1E1', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 20 }}>👤</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: spacing.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.accent.blue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  notificationBtn: {
    padding: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statusCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    height: 160,
  },
  cardTopText: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  clockIconContainer: {
    marginBottom: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  footerText: {
    fontSize: 10,
    color: colors.text.muted,
  },
  footerSubText: {
    fontSize: 10,
    color: colors.text.muted,
  },
  atendimentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  atendimentoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  atendimentoSub: {
    fontSize: 12,
    color: colors.accent.blue,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  visualizarBtn: {
    backgroundColor: colors.accent.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    gap: 6,
  },
  visualizarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  horizontalScroll: {
    paddingRight: spacing.padding,
    gap: spacing.md,
  },
  quickAction: {
    width: 100,
    height: 120,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1.5,
  },
  quickActionLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
});
