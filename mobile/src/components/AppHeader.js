/**
 * AppHeader.js — رأس التطبيق: الشعار + اسم "بابل" + أيقونة قائمة الإعدادات + أيقونة الإشعارات
 */
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from './UI';
import { colors } from '../theme';

export default function AppHeader({ onMenuPress, onBellPress }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.brand}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} accessibilityLabel="شعار بابل" />
        <View style={{ marginRight: 10 }}>
          <T bold style={{ fontSize: 22, lineHeight: 30 }}>بابل</T>
          <T muted style={{ fontSize: 12, lineHeight: 16 }}>البوابة الوطنية للخدمات</T>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable testID="header-bell" onPress={onBellPress} style={styles.iconBtn} accessibilityLabel="الإشعارات">
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={styles.dot} />
        </Pressable>
        <Pressable testID="settings-menu-icon" onPress={onMenuPress} style={styles.iconBtn} accessibilityLabel="قائمة الإعدادات">
          <Ionicons name="settings-outline" size={24} color={colors.secondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  brand: { flexDirection: 'row-reverse', alignItems: 'center' },
  logo: { width: 46, height: 46, borderRadius: 12 },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(13,27,42,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
});
