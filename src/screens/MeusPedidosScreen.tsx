import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FileText, Download, Share2, ChevronLeft } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../theme/theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { certidaoService } from '../lib/api';
import { Pedido } from '../types';

export const MeusPedidosScreen = ({ navigation }: any) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const data = await certidaoService.listar();
      setPedidos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seus pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAndShare = async (pedido: Pedido) => {
    if (!pedido.downloadUrl) {
      Alert.alert('Aviso', 'A certidão ainda não está disponível para download.');
      return;
    }

    try {
      setDownloading(pedido.id);
      
      const fileUri = ((FileSystem as any).cacheDirectory || '') + `Certidao_${pedido.matricula}.pdf`;
      const downloadRes = await FileSystem.downloadAsync(pedido.downloadUrl, fileUri);

      if (downloadRes.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadRes.uri);
        } else {
          Alert.alert('Sucesso', 'Arquivo baixado na pasta temporária.');
        }
      } else {
        throw new Error('Falha no download');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível baixar a certidão.');
    } finally {
      setDownloading(null);
    }
  };

  const renderItem = ({ item }: { item: Pedido }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <FileText size={20} color={colors.accent.blue} />
          <View>
            <Text style={styles.matriculaText}>Matrícula {item.matricula}</Text>
            <Text style={styles.dateText}>Solicitado em {item.data}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, item.status === 'Pronto' ? styles.statusPronto : styles.statusProcess]}>
          <Text style={[styles.statusText, item.status === 'Pronto' ? styles.statusProntoText : styles.statusProcessText]}>
            {item.status}
          </Text>
        </View>
      </View>

      {item.status === 'Pronto' && (
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => handleDownloadAndShare(item)}
            disabled={!!downloading}
          >
            <Download size={18} color={colors.text.primary} />
            <Text style={styles.actionBtnText}>
              {downloading === item.id ? 'Baixando...' : 'Download PDF'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionBtn, styles.shareBtn]}
            onPress={() => handleDownloadAndShare(item)}
          >
            <Share2 size={18} color="white" />
            <Text style={styles.shareBtnText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.text.primary} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Certidões</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.blue} />
          <Text style={styles.loadingText}>Carregando pedidos...</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FileText size={48} color={colors.border.subtle} strokeWidth={1} />
              <Text style={styles.emptyText}>Nenhum pedido realizado.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.padding,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  listContent: {
    padding: spacing.padding,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  cardInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  matriculaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  dateText: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusPronto: {
    backgroundColor: 'rgba(0, 255, 156, 0.1)',
  },
  statusProcess: {
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusProntoText: {
    color: colors.accent.green,
  },
  statusProcessText: {
    color: colors.status.warning,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  actionBtnText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  shareBtn: {
    backgroundColor: colors.accent.blue,
    borderColor: colors.accent.blue,
  },
  shareBtnText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.text.muted,
  },
});
