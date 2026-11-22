/**
 * HomeScreen.js — الشاشة الرئيسية
 * رأس بالشعار + ترحيب + بحث + تصنيفات حسب أحداث الحياة + قائمة الخدمات
 * كل بطاقة خدمة لها أيقونة تنقّل (سهم) تفتح شاشة التفاصيل، وأيقونة قلب للمفضلة.
 */
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { Card, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { allServices, categoryIcons, lifeEvents } from '../data/services';
import { colors, fonts, radius } from '../theme';

export default function HomeScreen({ navigation }) {
  const { user, favorites, toggleFavorite } = useApp();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const services = useMemo(
    () =>
      allServices.filter(
        (s) => (category === 'all' || s.categoryId === category) && (!query || s.name.includes(query.trim()))
      ),
    [category, query]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppHeader
        onMenuPress={() => navigation.navigate('SettingsMenu')}
        onBellPress={() => navigation.navigate('Notifications')}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <T bold style={{ fontSize: 20 }}>أهلاً {user?.username} 👋</T>
        <T muted style={{ marginBottom: 14 }}>اعرف أوراقك المطلوبة قبل ما تروح للدائرة</T>

        <View style={styles.search}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            placeholder="ابحث عن خدمة..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 14 }}
          contentContainerStyle={{ flexDirection: 'row-reverse', gap: 8 }}>
          {[{ id: 'all', title: 'الكل' }, ...lifeEvents].map((c) => {
            const active = c.id === category;
            return (
              <Pressable key={c.id} onPress={() => setCategory(c.id)}
                style={[styles.chip, active && { backgroundColor: colors.secondary, borderColor: colors.secondary }]}>
                {c.id !== 'all' && (
                  <Ionicons name={categoryIcons[c.id]} size={16} color={active ? colors.bg : colors.text} />
                )}
                <T semibold style={{ fontSize: 14, color: active ? colors.bg : colors.text }}>{c.title}</T>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.statsRow}>
          <Card style={styles.stat}>
            <T bold style={{ fontSize: 22, color: colors.secondary, textAlign: 'center' }}>{allServices.length}</T>
            <T muted style={{ fontSize: 13, textAlign: 'center' }}>خدمات متاحة</T>
          </Card>
          <Card style={styles.stat}>
            <T bold style={{ fontSize: 22, color: colors.success, textAlign: 'center' }}>{favorites.length}</T>
            <T muted style={{ fontSize: 13, textAlign: 'center' }}>في المفضلة</T>
          </Card>
          <Card style={styles.stat}>
            <T bold style={{ fontSize: 22, color: colors.text, textAlign: 'center' }}>🟢</T>
            <T muted style={{ fontSize: 13, textAlign: 'center' }}>الأنظمة تعمل</T>
          </Card>
        </View>

        <T bold style={{ fontSize: 18, marginVertical: 10 }}>الخدمات</T>
        {services.length === 0 && (
          <Card><T muted style={{ textAlign: 'center' }}>لا توجد خدمة بهذا الاسم، جرّب كلمة أخرى</T></Card>
        )}
        {services.map((s) => {
          const fav = favorites.includes(s.id);
          return (
            <Pressable key={s.id} testID={`service-${s.id}`} onPress={() => navigation.navigate('Detail', { id: s.id })}>
              <Card style={styles.serviceCard}>
                <View style={[styles.serviceIcon, { backgroundColor: s.color }]}>
                  <Ionicons name={categoryIcons[s.categoryId]} size={24} color={colors.secondary} />
                </View>
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <T semibold>{s.name}</T>
                  <T muted style={{ fontSize: 13 }}>{s.office} · {s.estimatedTime}</T>
                  <T style={{ fontSize: 13, color: colors.success }}>● النظام {s.systemStatus}</T>
                </View>
                <Pressable testID={`fav-${s.id}`} hitSlop={8} onPress={() => toggleFavorite(s.id)} style={{ padding: 4 }}>
                  <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? colors.danger : colors.muted} />
                </Pressable>
                <View testID={`detail-nav-${s.id}`} style={styles.navIcon} accessibilityLabel="عرض التفاصيل">
                  <Ionicons name="chevron-back" size={20} color={colors.bg} />
                </View>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: 'right',
    outlineStyle: 'none',
  },
  chip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  statsRow: { flexDirection: 'row-reverse', gap: 10 },
  stat: { flex: 1, padding: 10 },
  serviceCard: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10, padding: 12 },
  serviceIcon: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  navIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
});
