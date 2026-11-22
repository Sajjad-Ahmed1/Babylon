/**
 * AppNavigator.js — التنقل بين الشاشات
 * - غير مسجّل: تسجيل الدخول / التسجيل
 * - مسجّل: تبويبات (الرئيسية، المفضلة، المستجدات، حسابي) + شاشات التفاصيل والإعدادات والإشعارات
 */
import React from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../theme';
import { Card, T } from '../components/UI';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UpdatesScreen from '../screens/UpdatesScreen';
import SettingsMenuScreen from '../screens/SettingsMenuScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import StorageScreen from '../screens/StorageScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.card, primary: colors.secondary, text: colors.text, border: colors.border },
};

const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.text,
  headerTitleStyle: { fontFamily: fonts.bold, fontSize: 18 },
  headerTitleAlign: 'center',
  contentStyle: { backgroundColor: colors.bg },
};

function AboutScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
      <Image source={require('../../assets/logo.png')} style={{ width: 96, height: 96, borderRadius: 22, marginVertical: 16 }} />
      <Card style={{ alignSelf: 'stretch' }}>
        <T bold style={{ fontSize: 18 }}>بابل — البوابة الوطنية للخدمات</T>
        <T muted>«المواطن العراقي لا يخاف من المعاملة — يخاف من المجهول». بابل يخبرك بالأوراق المطلوبة وحالة النظام قبل أن تذهب للدائرة.</T>
        <T muted style={{ marginTop: 8 }}>الإصدار 1.0.0 · تصميم وتطوير: سجاد أحمد</T>
      </Card>
    </ScrollView>
  );
}

const TAB_ICONS = { Home: 'home', Favorites: 'heart', Updates: 'cloud-download', Profile: 'person' };

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        ...headerOptions,
        tabBarButtonTestID: `tab-${route.name}`,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, height: 72, paddingBottom: 10, paddingTop: 6 },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 18 },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons name={focused ? TAB_ICONS[route.name] : `${TAB_ICONS[route.name]}-outline`} size={size} color={color} />
        ),
      })}
    >
      {/* ترتيب RTL: الرئيسية أقصى اليمين */}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'حسابي' }} />
      <Tab.Screen name="Updates" component={UpdatesScreen} options={{ title: 'المستجدات' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'المفضلة' }} />
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'الرئيسية', headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { ready, user } = useApp();
  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.secondary} size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={headerOptions}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'تفاصيل الخدمة' }} />
            <Stack.Screen name="SettingsMenu" component={SettingsMenuScreen} options={{ title: 'قائمة الإعدادات' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'الإعدادات' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'الإشعارات' }} />
            <Stack.Screen name="Storage" component={StorageScreen} options={{ title: 'التخزين المحلي' }} />
            <Stack.Screen name="About" component={AboutScreen} options={{ title: 'حول بابل' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
