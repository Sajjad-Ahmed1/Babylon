# بابل — Babylon 🏛️

**البوابة الوطنية الموحدة للخدمات الحكومية العراقية**

> «المواطن العراقي لا يخاف من المعاملة — يخاف من المجهول»

بابل تطبيق هاتف (React Native / Expo) يخبر المواطن بالأوراق المطلوبة لكل معاملة، وحالة النظام في الدائرة، ومدة الإنجاز والرسوم — **قبل** أن يذهب للدائرة. يحفظ المستخدم خدماته المفضلة على جهازه، ويستقبل إشعارات تذكير بانتهاء وثائقه.

---

## 📖 قصص المستخدم (User Stories)

| # | قصة المستخدم | معايير القبول |
|---|---|---|
| 1 | **التسجيل:** بصفتي مواطناً جديداً، أريد إنشاء حساب باسم مستخدم وبريد إلكتروني وكلمة مرور، حتى أحفظ خدماتي وإعداداتي. | شاشة بثلاثة حقول + زر "تسجيل" + رابط "تسجيل الدخول"؛ رسالة خطأ عربية واضحة عند بيانات غير صحيحة أو بريد مسجّل مسبقاً. |
| 2 | **تسجيل الدخول:** بصفتي مستخدماً مسجّلاً، أريد الدخول ببريدي وكلمة المرور، حتى أصل لحسابي بأمان. | حقلان + زر "تسجيل الدخول" + رابط "إنشاء حساب"؛ رسالة "البريد الإلكتروني أو كلمة المرور غير صحيحة" عند الخطأ. |
| 3 | **الشاشة الرئيسية:** بصفتي مستخدماً، أريد رؤية كل الخدمات مصنّفة حسب أحداث الحياة مع شعار بابل في الرأس، حتى أجد خدمتي بسرعة. | رأس بالشعار، بحث، تصنيفات (الهوية، المركبات، التقاعد)، بطاقات خدمات بحالة النظام. |
| 4 | **شاشة التفاصيل:** بصفتي مواطناً، أريد الضغط على أيقونة التنقل في أي خدمة لأرى الأوراق المطلوبة والرسوم والمدة والجهة، حتى لا أرجع للدائرة أكثر من مرة. | أيقونة سهم في كل بطاقة تفتح شاشة التفاصيل بكل المعلومات. |
| 5 | **المفضلة / الملف الشخصي:** بصفتي مستخدماً، أريد حفظ الخدمات التي أحتاجها ورؤية بيانات حسابي، حتى أصل إليها بضغطة واحدة. | زر ♡ في كل خدمة؛ تبويب "المفضلة" وتبويب "حسابي" مع تسجيل الخروج. |
| 6 | **التخزين المحلي:** بصفتي مستخدماً، أريد أن تبقى المفضلة والإعدادات وجلسة الدخول محفوظة بعد إغلاق التطبيق، حتى لا أعيد إدخالها. | كل البيانات تُحفظ في AsyncStorage تحت مفاتيح `@babylon/*` وتُقرأ عند فتح التطبيق. |
| 7 | **تكامل API خارجي:** بصفتي مستخدماً، أريد رؤية آخر مستجدات المنصة مباشرة من الخادم، حتى أعرف بالتحديثات الجديدة. | شاشة "المستجدات" تجلب البيانات من GitHub REST API مع حالات تحميل/نجاح/خطأ وسحب للتحديث. |
| 8 | **قائمة الإعدادات وشاشة الإعدادات:** بصفتي مستخدماً، أريد أيقونة إعدادات في الرأس تفتح قائمة، ومنها شاشة إعدادات أضبط فيها حجم الخط والمحافظة والمزامنة، حتى أخصص التطبيق. | أيقونة ترس ← قائمة (الإعدادات العامة، الإشعارات، المستجدات، الملف الشخصي، التخزين المحلي، حول، تسجيل الخروج) ← شاشة إعدادات تُحفظ تلقائياً. |
| 9 | **الإشعارات:** بصفتي مواطناً، أريد تفعيل تذكيرات انتهاء وثائقي واختيار وقتها وتجربة إشعار، حتى لا تفوتني مواعيد التجديد. | شاشة إعداد إشعارات (تفعيل، أنواع، وقت التذكير اليومي) + زر "إرسال إشعار تجريبي" يُظهر تنبيهاً ناجحاً. |

---

## 🗂️ أين الكود؟ (Code map)

تطبيق الهاتف موجود في المجلد [`mobile/`](mobile):

| الميزة | الملف |
|---|---|
| التسجيل (Sign up) | [`mobile/src/screens/SignupScreen.js`](mobile/src/screens/SignupScreen.js) + منطق `signup` في [`AppContext.js`](mobile/src/context/AppContext.js) |
| تسجيل الدخول (Login) | [`mobile/src/screens/LoginScreen.js`](mobile/src/screens/LoginScreen.js) + منطق `login` في [`AppContext.js`](mobile/src/context/AppContext.js) |
| الشاشة الرئيسية (Home) | [`mobile/src/screens/HomeScreen.js`](mobile/src/screens/HomeScreen.js) + الرأس بالشعار [`AppHeader.js`](mobile/src/components/AppHeader.js) |
| شاشة التفاصيل (Detail) | [`mobile/src/screens/DetailScreen.js`](mobile/src/screens/DetailScreen.js) |
| المفضلة / الملف الشخصي | [`FavoritesScreen.js`](mobile/src/screens/FavoritesScreen.js) · [`ProfileScreen.js`](mobile/src/screens/ProfileScreen.js) |
| التخزين المحلي (Local storage) | [`mobile/src/storage/storage.js`](mobile/src/storage/storage.js) · عارض التخزين [`StorageScreen.js`](mobile/src/screens/StorageScreen.js) |
| تكامل API | [`mobile/src/api/api.js`](mobile/src/api/api.js) · الشاشة [`UpdatesScreen.js`](mobile/src/screens/UpdatesScreen.js) |
| قائمة الإعدادات (Settings menu) | [`mobile/src/screens/SettingsMenuScreen.js`](mobile/src/screens/SettingsMenuScreen.js) |
| شاشة الإعدادات (Settings) | [`mobile/src/screens/SettingsScreen.js`](mobile/src/screens/SettingsScreen.js) |
| الإشعارات (Notifications) | [`mobile/src/notifications/notifications.js`](mobile/src/notifications/notifications.js) · الشاشة [`NotificationsScreen.js`](mobile/src/screens/NotificationsScreen.js) |
| التنقل | [`mobile/src/navigation/AppNavigator.js`](mobile/src/navigation/AppNavigator.js) |

لقطات الأدلة في المجلد [`evidence/`](evidence) · تصاميم Figma: [Babylon – بابل Mobile App](https://www.figma.com/design/KLJqz93e1QSAvfI0jISygE)

---

## ▶️ التشغيل

```bash
cd mobile
npm install
npx expo start          # امسح رمز QR بتطبيق Expo Go على هاتفك
npx expo start --web    # أو شغّله في المتصفح
```

**التقنيات:** React Native 0.88 · Expo SDK 58 · React Navigation 7 · AsyncStorage · expo-notifications · GitHub REST API · خط Cairo · واجهة RTL داكنة.

> المجلد `src/` في جذر المستودع يحتوي نسخة الويب الأولى من بابل (React + Vite).

---

تصميم وتطوير: **سجاد أحمد**
