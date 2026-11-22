/**
 * SignupScreen.js — شاشة التسجيل (إنشاء حساب)
 * ثلاثة حقول: اسم المستخدم، البريد الإلكتروني، كلمة المرور + زر التسجيل + رابط تسجيل الدخول
 * عند النجاح يُحفظ الحساب في التخزين المحلي (AsyncStorage) ويدخل المستخدم مباشرة.
 */
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, ErrorBox, Input, T } from '../components/UI';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

export default function SignupScreen({ navigation }) {
  const { signup } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await signup({ username, email, password });
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
          <T bold style={styles.title}>إنشاء حساب جديد</T>
          <T muted style={{ textAlign: 'center' }}>سجّل في بابل لتتابع معاملاتك ووثائقك من مكان واحد</T>
        </View>

        <ErrorBox testID="signup-error" message={error} />

        <Input testID="signup-username" label="اسم المستخدم" icon="person-outline" placeholder="مثال: ahmed_rubaie" value={username} onChangeText={setUsername} />
        <Input testID="signup-email" label="البريد الإلكتروني" icon="mail-outline" placeholder="name@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input testID="signup-password" label="كلمة المرور" icon="lock-closed-outline" placeholder="6 أحرف على الأقل" secureTextEntry value={password} onChangeText={setPassword} />

        <Button testID="signup-button" title="تسجيل" icon="person-add-outline" onPress={onSignup} loading={loading} style={{ marginTop: 8 }} />

        <View style={styles.linkRow}>
          <T muted>لديك حساب بالفعل؟</T>
          <Pressable testID="go-login" onPress={() => navigation.navigate('Login')}>
            <T bold style={{ color: colors.secondary, marginRight: 6 }}>تسجيل الدخول</T>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, flexGrow: 1 },
  brand: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 84, height: 84, borderRadius: 20, marginBottom: 14 },
  title: { fontSize: 26, textAlign: 'center', lineHeight: 40 },
  linkRow: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 22 },
});
