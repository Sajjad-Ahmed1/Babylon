/**
 * UI.js — مكونات واجهة مشتركة: نص عربي، حقل إدخال، زر، رسالة خطأ، بطاقة، صف إعداد
 */
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, rtlText } from '../theme';

export function T({ style, bold, semibold, muted, children, ...rest }) {
  return (
    <Text
      style={[
        rtlText,
        { fontSize: 16 },
        bold && { fontFamily: fonts.bold },
        semibold && { fontFamily: fonts.semibold },
        muted && { color: colors.muted },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Input({ label, icon, testID, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <T semibold style={{ marginBottom: 6, fontSize: 15 }}>{label}</T>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={20} color={colors.muted} />
        <TextInput
          testID={testID}
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoCapitalize="none"
          {...props}
        />
      </View>
    </View>
  );
}

export function Button({ title, onPress, loading, variant = 'primary', icon, testID, style }) {
  const bg = variant === 'primary' ? colors.secondary : variant === 'danger' ? colors.danger : colors.primary;
  const fg = variant === 'primary' ? '#0D1B2A' : colors.text;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          <T bold style={{ color: fg, fontSize: 17 }}>{title}</T>
          {icon ? <Ionicons name={icon} size={20} color={fg} /> : null}
        </>
      )}
    </Pressable>
  );
}

export function ErrorBox({ message, testID }) {
  if (!message) return null;
  return (
    <View testID={testID} style={styles.error} accessibilityRole="alert">
      <T style={{ color: '#FFD6D1', flex: 1, fontSize: 15 }}>{message}</T>
      <Ionicons name="alert-circle" size={22} color="#FF8A7A" />
    </View>
  );
}

export function Card({ style, children }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({ text, color = colors.success }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '33', borderColor: color }]}>
      <T semibold style={{ color, fontSize: 13 }}>{text}</T>
    </View>
  );
}

/** صف في قائمة الإعدادات: أيقونة + عنوان + وصف + مفتاح أو سهم */
export function SettingRow({ icon, title, subtitle, value, onValueChange, onPress, danger, testID, last }) {
  const content = (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={[styles.rowIcon, danger && { backgroundColor: colors.danger + '33' }]}>
        <Ionicons name={icon} size={22} color={danger ? '#FF8A7A' : colors.secondary} />
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <T semibold style={danger && { color: '#FF8A7A' }}>{title}</T>
        {subtitle ? <T muted style={{ fontSize: 13 }}>{subtitle}</T> : null}
      </View>
      {onValueChange ? (
        <Switch
          testID={testID}
          value={value}
          onValueChange={onValueChange}
          trackColor={{ true: colors.success, false: '#33475B' }}
          thumbColor="#fff"
        />
      ) : (
        <Ionicons name="chevron-back" size={20} color={colors.muted} />
      )}
    </View>
  );
  if (onPress) {
    return (
      <Pressable testID={testID} onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: 14,
    height: 54,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginRight: 10,
    height: '100%',
    outlineStyle: 'none',
  },
  button: {
    height: 54,
    borderRadius: radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    gap: 8,
  },
  error: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.danger + '33',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius,
    padding: 12,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  row: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.secondary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
