/**
 * DetailScreen.js — شاشة التفاصيل
 * تعرض معلومات الخدمة المختارة: حالة النظام، الأوراق المطلوبة، الوقت المتوقع، الرسوم، الجهة، ملاحظات
 * مع زر إضافة/إزالة من المفضلة (يُحفظ في التخزين المحلي).
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { categoryIcons, getServiceById } from '../data/services';
import { colors } from '../theme';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={colors.secondary} />
      <T muted style={{ marginRight: 8, fontSize: 15 }}>{label}</T>
      <T semibold style={{ flex: 1, textAlign: 'left', fontSize: 15 }}>{value}</T>
    </View>
  );
}

export default function DetailScreen({ route }) {
  const { favorites, toggleFavorite } = useApp();
  const service = getServiceById(route.params?.id);

  if (!service) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 24 }}>
        <T style={{ textAlign: 'center' }}>تعذّر العثور على الخدمة، ارجع وحاول مرة أخرى</T>
      </View>
    );
  }
  const fav = favorites.includes(service.id);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={[styles.hero, { backgroundColor: service.color }]}>
        <View style={styles.heroIcon}>
          <Ionicons name={categoryIcons[service.categoryId]} size={34} color={colors.secondary} />
        </View>
        <T muted style={{ color: '#C9D6E8', marginTop: 10 }}>{service.categoryTitle}</T>
        <T bold style={{ fontSize: 22, lineHeight: 34 }}>{service.name}</T>
        <Badge text={`🟢 النظام ${service.systemStatus}`} />
      </View>

      <Card style={{ marginTop: 14 }}>
        <InfoRow icon="business-outline" label="الجهة:" value={service.office} />
        <InfoRow icon="time-outline" label="مدة الإنجاز:" value={service.estimatedTime} />
        <InfoRow icon="cash-outline" label="الرسوم:" value={service.fee} />
        <InfoRow icon="calendar-outline" label="الحجز:" value={service.canBookOnline ? 'متاح إلكترونياً' : 'حضوري فقط'} />
        {service.avgWaitMinutes ? (
          <InfoRow icon="people-outline" label="متوسط الانتظار:" value={`${service.avgWaitMinutes} دقيقة`} />
        ) : null}
      </Card>

      <T bold style={{ fontSize: 18, marginTop: 18, marginBottom: 8 }}>الأوراق المطلوبة ({service.requiredDocs.length})</T>
      <Card>
        {service.requiredDocs.map((d, i) => (
          <View key={d} style={[styles.docRow, i < service.requiredDocs.length - 1 && styles.border]}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <T style={{ flex: 1, marginRight: 10 }}>{d}</T>
          </View>
        ))}
      </Card>

      {service.notes || service.walkInReason ? (
        <Card style={{ marginTop: 14, borderColor: colors.warning }}>
          <T semibold style={{ color: colors.warning }}>💡 ملاحظة مهمة</T>
          <T>{service.notes || service.walkInReason}</T>
        </Card>
      ) : null}

      <Button
        testID="detail-fav-button"
        title={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        icon={fav ? 'heart-dislike-outline' : 'heart-outline'}
        variant={fav ? 'secondary' : 'primary'}
        onPress={() => toggleFavorite(service.id)}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 16, padding: 18, alignItems: 'flex-end' },
  heroIcon: {
    width: 62, height: 62, borderRadius: 16, backgroundColor: 'rgba(13,27,42,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoRow: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 8 },
  docRow: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 10 },
  border: { borderBottomWidth: 1, borderBottomColor: colors.border },
});
