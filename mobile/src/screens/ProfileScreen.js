/**
 * ProfileScreen.js — الملف الشخصي: بيانات المستخدم + اختصارات + تسجيل الخروج
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, SettingRow, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, favorites, settings, logout } = useApp();
  const initial = user?.username?.[0]?.toUpperCase() ?? '?';
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
        <View style={styles.avatar}><T bold style={{ fontSize: 30, color: colors.bg }}>{initial}</T></View>
        <T bold style={{ fontSize: 20, marginTop: 10, textAlign: 'center' }}>{user?.username}</T>
        <T muted style={{ textAlign: 'center' }}>{user?.email}</T>
        <T muted style={{ textAlign: 'center', fontSize: 13 }}>المحافظة: {settings.governorate}</T>
      </Card>
      <Card style={{ marginTop: 14, paddingVertical: 0 }}>
        <SettingRow icon="heart-outline" title="المفضلة" subtitle={`${favorites.length} خدمات محفوظة`} onPress={() => navigation.navigate('Favorites')} />
        <SettingRow icon="notifications-outline" title="الإشعارات" onPress={() => navigation.navigate('Notifications')} />
        <SettingRow icon="settings-outline" title="الإعدادات" onPress={() => navigation.navigate('SettingsMenu')} last />
      </Card>
      <Button title="تسجيل الخروج" icon="log-out-outline" variant="danger" onPress={logout} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: colors.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
});
