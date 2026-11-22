/**
 * UpdatesScreen.js — شاشة "مستجدات المنصة"
 * تعرض بيانات حقيقية تُجلب من واجهة برمجة تطبيقات خارجية (GitHub REST API)
 * مع حالات: التحميل / النجاح / الخطأ + السحب للتحديث.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, T } from '../components/UI';
import { fetchPlatformUpdates, formatDate } from '../api/api';
import { colors } from '../theme';

export default function UpdatesScreen() {
  const [state, setState] = useState({ status: 'loading', data: [], error: null });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchPlatformUpdates();
      setState({ status: 'success', data, error: null });
    } catch (e) {
      setState({ status: 'error', data: [], error: e.message });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (state.status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <T muted style={{ marginTop: 10 }}>جارٍ جلب المستجدات من الخادم...</T>
      </View>
    );
  }
  if (state.status === 'error') {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
        <T style={{ textAlign: 'center', marginVertical: 10 }}>تعذّر تحميل البيانات، تأكد من الاتصال بالإنترنت وحاول مرة أخرى</T>
        <Button title="إعادة المحاولة" icon="refresh" onPress={() => { setState({ status: 'loading', data: [] }); load(); }} />
      </View>
    );
  }

  return (
    <FlatList
      testID="api-list"
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16 }}
      data={state.data}
      keyExtractor={(i) => i.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.secondary} />}
      ListHeaderComponent={
        <View style={styles.source}>
          <Ionicons name="cloud-done-outline" size={18} color={colors.success} />
          <T style={{ fontSize: 13, color: colors.success, marginRight: 6, flex: 1 }}>
            بيانات مباشرة من GitHub REST API · {state.data.length} تحديث
          </T>
        </View>
      }
      renderItem={({ item }) => (
        <Card style={styles.item}>
          <View style={styles.dot}><Ionicons name="git-commit-outline" size={20} color={colors.bg} /></View>
          <View style={{ flex: 1, marginRight: 12 }}>
            <T semibold style={{ textAlign: 'left', writingDirection: 'ltr' }}>{item.title}</T>
            <T muted style={{ fontSize: 13 }}>👤 {item.author} · #{item.shortId}</T>
            <T muted style={{ fontSize: 13 }}>🕒 {formatDate(item.date)}</T>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  source: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  item: { flexDirection: 'row-reverse', alignItems: 'flex-start', marginBottom: 10, padding: 12 },
  dot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
});
