/**
 * NotificationBanner.js — شريط تنبيه يظهر أعلى الشاشة عند وصول إشعار
 */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { subscribeToInAppNotifications } from '../notifications/notifications';
import { T } from './UI';
import { colors } from '../theme';

export default function NotificationBanner() {
  const [note, setNote] = useState(null);
  const y = useRef(new Animated.Value(-160)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let timer;
    const unsub = subscribeToInAppNotifications((n) => {
      setNote(n);
      Animated.spring(y, { toValue: 0, useNativeDriver: false }).start();
      clearTimeout(timer);
      timer = setTimeout(() => {
        Animated.timing(y, { toValue: -160, duration: 300, useNativeDriver: false }).start();
      }, 8000);
    });
    return () => { unsub(); clearTimeout(timer); };
  }, [y]);

  if (!note) return null;
  return (
    <Animated.View
      testID="notification-banner"
      style={[styles.wrap, { top: insets.top + 8, transform: [{ translateY: y }] }]}
    >
      <View style={styles.row}>
        <Image source={require('../../assets/logo.png')} style={styles.icon} />
        <View style={{ flex: 1, marginRight: 10 }}>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
            <T muted style={{ fontSize: 12 }}>بابل · الآن</T>
          </View>
          <T bold style={{ fontSize: 15 }}>{note.title}</T>
          <T style={{ fontSize: 14, color: '#C9D6E8' }}>{note.body}</T>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: 'rgba(22,41,74,0.98)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  row: { flexDirection: 'row-reverse', alignItems: 'flex-start' },
  icon: { width: 38, height: 38, borderRadius: 9 },
});
