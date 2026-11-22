/**
 * AppContext.js — الحالة العامة للتطبيق: المستخدم، تسجيل الدخول/التسجيل، المفضلة، الإعدادات
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as storage from '../storage/storage';

const AppContext = createContext(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavoritesState] = useState([]);
  const [settings, setSettingsState] = useState(storage.DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      setUser(await storage.getSession());
      setFavoritesState(await storage.getFavorites());
      setSettingsState(await storage.getSettings());
      setReady(true);
    })();
  }, []);

  /**
   * التسجيل (Sign up): يتحقق من الحقول ثم يحفظ الحساب في التخزين المحلي
   * يرمي خطأ برسالة عربية مبسطة عند وجود مشكلة
   */
  const signup = useCallback(async ({ username, email, password }) => {
    const u = username.trim();
    const e = email.trim().toLowerCase();
    if (!u || !e || !password) throw new Error('يرجى ملء جميع الحقول: اسم المستخدم، البريد الإلكتروني، كلمة المرور');
    if (u.length < 3) throw new Error('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
    if (!EMAIL_RE.test(e)) throw new Error('صيغة البريد الإلكتروني غير صحيحة');
    if (password.length < 6) throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    const users = await storage.getUsers();
    if (users.some((x) => x.email === e)) throw new Error('هذا البريد الإلكتروني مسجّل مسبقاً، جرّب تسجيل الدخول');
    const newUser = {
      id: Date.now().toString(),
      username: u,
      email: e,
      passwordHash: storage.hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    await storage.saveUser(newUser);
    const session = { id: newUser.id, username: u, email: e };
    await storage.setSession(session);
    setUser(session);
    return session;
  }, []);

  /** تسجيل الدخول (Login): يطابق البريد وكلمة المرور مع الحسابات المحفوظة */
  const login = useCallback(async ({ email, password }) => {
    const e = email.trim().toLowerCase();
    if (!e || !password) throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
    if (!EMAIL_RE.test(e)) throw new Error('صيغة البريد الإلكتروني غير صحيحة');
    const users = await storage.getUsers();
    const found = users.find((x) => x.email === e);
    if (!found || found.passwordHash !== storage.hashPassword(password)) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
    const session = { id: found.id, username: found.username, email: found.email };
    await storage.setSession(session);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(async () => {
    await storage.clearSession();
    setUser(null);
  }, []);

  const toggleFavorite = useCallback(async (serviceId) => {
    setFavoritesState((prev) => {
      const next = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];
      storage.setFavorites(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback(async (patch) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      storage.saveSettings(next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ ready, user, signup, login, logout, favorites, toggleFavorite, settings, updateSettings }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
