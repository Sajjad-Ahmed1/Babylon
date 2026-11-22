/**
 * SettingsScreen.js — شاشة الإعدادات العامة
 * كل تغيير يُحفظ فوراً في التخزين المحلي (@babylon/settings)
 */
import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Card, SettingRow, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import { KEYS, removeItem } from '../storage/storage';

const GOVERNORATES = ['بغداد', 'البصرة', 'ميسان', 'نينوى', 'النجف', 'أربيل'];

export default function SettingsScreen() {
  const { settings, updateSettings, toggleFavorite, favorites } = useApp();

  const clearFavorites = async () => {
    const run = async () => {
      for (const id of favorites) await toggleFavorite(id);
      await removeItem(KEYS.favorites);
    };
    if (Platform.OS === 'web') return run();
    Alert.alert('مسح المفضلة', 'هل تريد حذف كل الخدمات المفضلة؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'مسح', style: 'destructive', onPress: run },
    ]);
  };

  return (
    <ScrollView testID="settings-screen" style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <T bold style={styles.section}>العرض</T>
      <Card style={{ paddingVertical: 0 }}>
        <SettingRow icon="language-outline" title="اللغة" subtitle="العربية (الكردية قريباً)" />
        <SettingRow icon="text-outline" title="خط كبير" subtitle="تكبير النصوص لسهولة القراءة"
          value={settings.largeText} onValueChange={(v) => updateSettings({ largeText: v })} testID="toggle-large-text" last />
      </Card>

      <T bold style={styles.section}>الحساب والأمان</T>
      <Card style={{ paddingVertical: 0 }}>
        <SettingRow icon="finger-print-outline" title="الدخول بالبصمة" subtitle="استخدام بصمة الجهاز"
          value={settings.biometric} onValueChange={(v) => updateSettings({ biometric: v })} />
        <SettingRow icon="sync-outline" title="المزامنة التلقائية" subtitle="تحديث حالة المعاملات تلقائياً"
          value={settings.autoSync} onValueChange={(v) => updateSettings({ autoSync: v })} last />
      </Card>

      <T bold style={styles.section}>محافظتك</T>
      <Card>
        <View style={styles.chips}>
          {GOVERNORATES.map((g) => {
            const active = settings.governorate === g;
            return (
              <Pressable key={g} onPress={() => updateSettings({ governorate: g })}
                style={[styles.chip, active && { backgroundColor: colors.secondary, borderColor: colors.secondary }]}>
                <T semibold style={{ fontSize: 14, color: active ? colors.bg : colors.text }}>{g}</T>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <T bold style={styles.section}>البيانات</T>
      <Card style={{ paddingVertical: 0 }}>
        <SettingRow icon="trash-outline" title="مسح المفضلة" subtitle="حذف الخدمات المحفوظة من الجهاز" danger onPress={clearFavorites} last />
      </Card>
      <T muted style={{ fontSize: 13, marginTop: 12 }}>✓ يتم حفظ الإعدادات تلقائياً على جهازك</T>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 16, marginTop: 16, marginBottom: 8, color: colors.secondary },
  chips: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
});
