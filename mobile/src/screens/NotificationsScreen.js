/**
 * NotificationsScreen.js — شاشة إعداد الإشعارات
 * - تفعيل/إيقاف الإشعارات وأنواعها
 * - اختيار وقت التذكير اليومي
 * - زر "إرسال إشعار تجريبي"
 * - سجل الإشعارات المرسلة (محفوظ في التخزين المحلي)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, SettingRow, T } from '../components/UI';
import {
  getNotificationLog, getNotificationSettings, saveNotificationSettings, DEFAULT_NOTIFICATION_SETTINGS,
} from '../storage/storage';
import { applyDailyReminder, requestPermission, sendTestNotification } from '../notifications/notifications';
import { formatDate } from '../api/api';
import { colors } from '../theme';

const TIMES = ['09:00', '12:00', '18:00', '21:00'];

export default function NotificationsScreen() {
  const [cfg, setCfg] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [permission, setPermission] = useState('…');
  const [log, setLog] = useState([]);
  const [sending, setSending] = useState(false);

  const refreshLog = useCallback(async () => setLog(await getNotificationLog()), []);

  useEffect(() => {
    (async () => {
      setCfg(await getNotificationSettings());
      setPermission(await requestPermission());
      refreshLog();
    })();
  }, [refreshLog]);

  const update = async (patch) => {
    const next = { ...cfg, ...patch };
    setCfg(next);
    await saveNotificationSettings(next);
    await applyDailyReminder(next);
  };

  const onTest = async () => {
    setSending(true);
    await sendTestNotification();
    await refreshLog();
    setSending(false);
  };

  const permLabel = permission === 'granted' ? 'مسموح ✓' : permission === 'in-app' ? 'داخل التطبيق ✓' : permission;

  return (
    <ScrollView testID="notifications-screen" style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Card style={styles.perm}>
        <Ionicons name="shield-checkmark-outline" size={22} color={colors.success} />
        <T style={{ marginRight: 8, flex: 1 }}>إذن الإشعارات: <T bold style={{ color: colors.success }}>{permLabel}</T></T>
      </Card>

      <T bold style={styles.section}>إعداد الإشعارات</T>
      <Card style={{ paddingVertical: 0 }}>
        <SettingRow icon="notifications-outline" title="تفعيل الإشعارات" subtitle="المفتاح الرئيسي لكل التنبيهات"
          value={cfg.enabled} onValueChange={(v) => update({ enabled: v })} testID="toggle-notifications" />
        <SettingRow icon="id-card-outline" title="تذكير انتهاء الوثائق" subtitle="الهوية، الرخصة، بطاقة المركبة"
          value={cfg.enabled && cfg.documentReminders} onValueChange={(v) => update({ documentReminders: v })} />
        <SettingRow icon="git-network-outline" title="تحديثات المعاملات" subtitle="عند انتقال معاملتك لخطوة جديدة"
          value={cfg.enabled && cfg.transactionUpdates} onValueChange={(v) => update({ transactionUpdates: v })} />
        <SettingRow icon="megaphone-outline" title="الإعلانات الرسمية" subtitle="عطل الدوائر وتغيير أوقات الدوام"
          value={cfg.enabled && cfg.announcements} onValueChange={(v) => update({ announcements: v })} last />
      </Card>

      <T bold style={styles.section}>وقت التذكير اليومي</T>
      <Card>
        <View style={styles.times}>
          {TIMES.map((t) => {
            const active = cfg.reminderTime === t;
            return (
              <Pressable key={t} onPress={() => update({ reminderTime: t })}
                style={[styles.time, active && { backgroundColor: colors.secondary, borderColor: colors.secondary }]}>
                <T bold style={{ textAlign: 'center', color: active ? colors.bg : colors.text }}>{t}</T>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Button testID="test-notification" title="إرسال إشعار تجريبي" icon="paper-plane-outline" loading={sending}
        onPress={onTest} style={{ marginTop: 18 }} />

      <T bold style={styles.section}>سجل الإشعارات</T>
      {log.length === 0 ? (
        <Card><T muted style={{ textAlign: 'center' }}>لا توجد إشعارات بعد ✓ كل شيء على ما يرام</T></Card>
      ) : (
        log.map((n, i) => (
          <Card key={n.sentAt + i} style={{ marginBottom: 8 }}>
            <T semibold>{n.title}</T>
            <T muted style={{ fontSize: 13 }}>{formatDate(n.sentAt)}</T>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  perm: { flexDirection: 'row-reverse', alignItems: 'center' },
  section: { fontSize: 16, marginTop: 16, marginBottom: 8, color: colors.secondary },
  times: { flexDirection: 'row-reverse', gap: 8 },
  time: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
});
