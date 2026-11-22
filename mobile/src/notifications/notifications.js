/**
 * notifications.js — تنفيذ الإشعارات (Notifications)
 *
 * - على Android / iOS: يستخدم expo-notifications لطلب الإذن، إنشاء قناة إشعارات،
 *   إرسال إشعار تجريبي، وجدولة تذكير يومي.
 * - على الويب: يستخدم Web Notification API إن كان متاحاً.
 * - في كل المنصات: يظهر شريط تنبيه داخل التطبيق (In-App Banner) عند وصول الإشعار
 *   ويُحفظ الإشعار في سجل الإشعارات في التخزين المحلي.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { addNotificationLog } from '../storage/storage';

const isNative = Platform.OS !== 'web';
const CHANNEL_ID = 'babylon-default';
const DAILY_ID = 'babylon-daily-reminder';

// ---------- مستمعو شريط التنبيه داخل التطبيق ----------
const listeners = new Set();
export function subscribeToInAppNotifications(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emitInApp(notification) {
  listeners.forEach((fn) => fn(notification));
}

/** إعداد طريقة عرض الإشعار عندما يكون التطبيق مفتوحاً */
export function configureNotificationHandler() {
  if (!isNative) return () => {};
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  const sub = Notifications.addNotificationReceivedListener((n) => {
    emitInApp({ title: n.request.content.title, body: n.request.content.body });
  });
  return () => sub.remove();
}

/** طلب إذن الإشعارات من المستخدم وإنشاء قناة Android */
export async function requestPermission() {
  if (!isNative) {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await window.Notification.requestPermission();
      return result === 'granted' ? 'granted' : 'in-app';
    }
    return 'in-app';
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'إشعارات بابل',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F39C12',
    });
  }
  if (!Device.isDevice) return 'in-app';
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  return status;
}

/** إرسال إشعار تجريبي بعد ثانيتين */
export async function sendTestNotification() {
  const content = {
    title: 'بابل — إشعار تجريبي ✅',
    body: 'تم تفعيل الإشعارات بنجاح. ستصلك تذكيرات انتهاء وثائقك وتحديثات معاملاتك.',
  };
  if (isNative) {
    await Notifications.scheduleNotificationAsync({
      content: { ...content, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        channelId: CHANNEL_ID,
      },
    });
  } else {
    setTimeout(() => {
      if (typeof window !== 'undefined' && 'Notification' in window &&
          window.Notification.permission === 'granted') {
        try { new window.Notification(content.title, { body: content.body }); } catch {}
      }
      emitInApp(content);
    }, 2000);
  }
  await addNotificationLog({ ...content, sentAt: new Date().toISOString() });
  return content;
}

/** جدولة / إلغاء التذكير اليومي حسب إعدادات المستخدم */
export async function applyDailyReminder(settings) {
  if (!isNative) return;
  await Notifications.cancelScheduledNotificationAsync(DAILY_ID).catch(() => {});
  if (!settings.enabled || !settings.documentReminders) return;
  const [hour, minute] = settings.reminderTime.split(':').map(Number);
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_ID,
    content: {
      title: 'تذكير بابل',
      body: 'راجع وثائقك: هويتك أو رخصة القيادة قد تقترب من الانتهاء.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
}
