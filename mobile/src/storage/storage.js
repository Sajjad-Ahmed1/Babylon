/**
 * storage.js — التخزين المحلي (Local Storage) باستخدام AsyncStorage
 *
 * كل بيانات التطبيق تُحفظ على جهاز المستخدم:
 *  - @babylon/users          : الحسابات المسجّلة (كلمة المرور تُحفظ مُشفّرة بدالة hash)
 *  - @babylon/session        : المستخدم الحالي المسجّل دخوله
 *  - @babylon/favorites      : الخدمات المفضلة
 *  - @babylon/settings       : إعدادات التطبيق
 *  - @babylon/notifications  : إعدادات الإشعارات
 *  - @babylon/notification_log : سجل الإشعارات المُرسلة
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  users: '@babylon/users',
  session: '@babylon/session',
  favorites: '@babylon/favorites',
  settings: '@babylon/settings',
  notifications: '@babylon/notifications',
  notificationLog: '@babylon/notification_log',
};

export const DEFAULT_SETTINGS = {
  language: 'ar',
  largeText: false,
  autoSync: true,
  biometric: false,
  governorate: 'بغداد',
};

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  documentReminders: true,
  transactionUpdates: true,
  announcements: false,
  reminderTime: '09:00',
};

/** قراءة قيمة JSON من التخزين المحلي */
export async function getItem(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (e) {
    console.warn('storage read failed', key, e);
    return fallback;
  }
}

/** حفظ قيمة JSON في التخزين المحلي */
export async function setItem(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key) {
  await AsyncStorage.removeItem(key);
}

/** دالة hash بسيطة حتى لا تُحفظ كلمة المرور كنص صريح (للعرض التعليمي فقط) */
export function hashPassword(password) {
  let h = 5381;
  for (let i = 0; i < password.length; i++) {
    h = ((h << 5) + h + password.charCodeAt(i)) >>> 0;
  }
  return 'h$' + h.toString(16);
}

// ---------- المستخدمون ----------
export async function getUsers() {
  return getItem(KEYS.users, []);
}

export async function saveUser(user) {
  const users = await getUsers();
  users.push(user);
  await setItem(KEYS.users, users);
}

export async function getSession() {
  return getItem(KEYS.session, null);
}

export async function setSession(user) {
  await setItem(KEYS.session, user);
}

export async function clearSession() {
  await removeItem(KEYS.session);
}

// ---------- المفضلة ----------
export async function getFavorites() {
  return getItem(KEYS.favorites, []);
}

export async function setFavorites(ids) {
  await setItem(KEYS.favorites, ids);
}

// ---------- الإعدادات ----------
export async function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(await getItem(KEYS.settings, {})) };
}

export async function saveSettings(settings) {
  await setItem(KEYS.settings, settings);
}

export async function getNotificationSettings() {
  return { ...DEFAULT_NOTIFICATION_SETTINGS, ...(await getItem(KEYS.notifications, {})) };
}

export async function saveNotificationSettings(settings) {
  await setItem(KEYS.notifications, settings);
}

export async function getNotificationLog() {
  return getItem(KEYS.notificationLog, []);
}

export async function addNotificationLog(entry) {
  const log = await getNotificationLog();
  log.unshift(entry);
  await setItem(KEYS.notificationLog, log.slice(0, 20));
}

/** قراءة كل مفاتيح التطبيق من التخزين المحلي (لشاشة عارض التخزين) */
export async function dumpAll() {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith('@babylon/'));
  const pairs = await AsyncStorage.multiGet(keys);
  return pairs.map(([key, value]) => ({ key, value }));
}
