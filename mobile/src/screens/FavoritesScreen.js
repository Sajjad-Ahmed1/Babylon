/**
 * FavoritesScreen.js — شاشة المفضلة
 * تعرض الخدمات التي حفظها المستخدم؛ القائمة تُقرأ من التخزين المحلي (@babylon/favorites)
 * فتبقى موجودة بعد إغلاق التطبيق وإعادة فتحه.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { categoryIcons, getServiceById } from '../data/services';
import { colors } from '../theme';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite } = useApp();
  const items = favorites.map(getServiceById).filter(Boolean);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.storageNote}>
        <Ionicons name="save-outline" size={18} color={colors.success} />
        <T style={{ fontSize: 13, color: colors.success, marginRight: 6 }}>
          محفوظة على جهازك ({items.length}) — تبقى بعد إغلاق التطبيق
        </T>
      </View>
      {items.length === 0 ? (
        <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Ionicons name="heart-outline" size={44} color={colors.muted} />
          <T muted style={{ textAlign: 'center', marginTop: 8 }}>
            لا توجد خدمات في المفضلة بعد. اضغط على ♡ بجانب أي خدمة لحفظها هنا
          </T>
        </Card>
      ) : (
        items.map((s) => (
          <Pressable key={s.id} onPress={() => navigation.navigate('Detail', { id: s.id })}>
            <Card style={styles.row}>
              <View style={[styles.icon, { backgroundColor: s.color }]}>
                <Ionicons name={categoryIcons[s.categoryId]} size={22} color={colors.secondary} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <T semibold>{s.name}</T>
                <T muted style={{ fontSize: 13 }}>{s.requiredDocs.length} أوراق مطلوبة · {s.fee}</T>
              </View>
              <Pressable hitSlop={8} onPress={() => toggleFavorite(s.id)}>
                <Ionicons name="heart" size={22} color={colors.danger} />
              </Pressable>
            </Card>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  storageNote: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10, padding: 12 },
  icon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
