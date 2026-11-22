/**
 * LoginScreen.js — شاشة تسجيل الدخول
 * حقلان: البريد الإلكتروني وكلمة المرور + زر تسجيل الدخول + رابط إنشاء حساب
 * يتحقق من البيانات مقابل الحسابات المحفوظة في التخزين المحلي.
 */
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, ErrorBox, Input, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <T bold style={styles.title}>مرحباً بعودتك</T>
          <T muted style={{ textAlign: 'center' }}>سجّل الدخول للوصول إلى خدماتك الحكومية</T>
        </View>

        <ErrorBox testID="login-error" message={error} />

        <Input testID="login-email" label="البريد الإلكتروني" icon="mail-outline" placeholder="name@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input testID="login-password" label="كلمة المرور" icon="lock-closed-outline" placeholder="••••••" secureTextEntry value={password} onChangeText={setPassword} />

        <Button testID="login-button" title="تسجيل الدخول" icon="log-in-outline" onPress={onLogin} loading={loading} style={{ marginTop: 8 }} />

        <View style={styles.linkRow}>
          <T muted>ليس لديك حساب؟</T>
          <Pressable testID="go-signup" onPress={() => navigation.navigate('Signup')}>
            <T bold style={{ color: colors.secondary, marginRight: 6 }}>إنشاء حساب</T>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 70, flexGrow: 1 },
  brand: { alignItems: 'center', marginBottom: 28 },
  logo: { width: 84, height: 84, borderRadius: 20, marginBottom: 14 },
  title: { fontSize: 26, textAlign: 'center', lineHeight: 40 },
  linkRow: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 22 },
});
