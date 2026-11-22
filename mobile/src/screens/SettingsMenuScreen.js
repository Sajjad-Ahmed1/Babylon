/**
 * SettingsMenuScreen.js — قائمة الإعدادات
 * تُفتح من أيقونة الترس في رأس الشاشة الرئيسية، وتعرض عناصر القائمة:
 * الإعدادات العامة، الإشعارات، مستجدات المنصة، الملف الشخصي، التخزين المحلي، حول التطبيق، تسجيل الخروج
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { Card, SettingRow, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

export default function SettingsMenuScreen({ navigation }) {
  const { logout, user } = useApp();

  const items = [
    { key: 'settings', icon: 'options-outline', title: 'الإعدادات العامة', subtitle: 'اللغة، حجم الخط، المحافظة', go: 'Settings' },
    { key: 'notifications', icon: 'notifications-outline', title: 'الإشعارات', subtitle: 'التذكيرات وإشعار تجريبي', go: 'Notifications' },
    { key: 'updates', icon: 'cloud-download-outline', title: 'مستجدات المنصة', subtitle: 'بيانات مباشرة من API', go: 'Updates' },
    { key: 'profile', icon: 'person-circle-outline', title: 'الملف الشخصي', subtitle: user?.email, go: 'Profile' },
    { key: 'storage', icon: 'server-outline', title: 'البيانات المحفوظة على الجهاز', subtitle: 'عرض التخزين المحلي', go: 'Storage' },
    { key: 'about', icon: 'information-circle-outline', title: 'حول بابل', subtitle: 'الإصدار 1.0.0', go: 'About' },
  ];

  return (
    <ScrollView testID="settings-menu" style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <T muted style={{ marginBottom: 8 }}>اختر ما تريد ضبطه</T>
      <Card style={{ paddingVertical: 0 }}>
        {items.map((it) => (
          <SettingRow key={it.key} testID={`menu-${it.key}`} icon={it.icon} title={it.title} subtitle={it.subtitle}
            onPress={() => navigation.navigate(it.go)} />
        ))}
        <SettingRow icon="log-out-outline" title="تسجيل الخروج" danger onPress={logout} last />
      </Card>
    </ScrollView>
  );
}
