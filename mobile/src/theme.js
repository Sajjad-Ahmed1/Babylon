/**
 * theme.js — ألوان وخطوط تطبيق بابل
 * ألوان رسمية تعطي إحساساً بالثقة والأمان
 */
export const colors = {
  primary: '#1B4F72',
  secondary: '#F39C12',
  success: '#27AE60',
  warning: '#E67E22',
  danger: '#C0392B',
  bg: '#0D1B2A',
  card: '#112240',
  cardAlt: '#16294A',
  border: '#1F3A5F',
  text: '#E8F0FE',
  muted: '#8899A6',
};

export const fonts = {
  regular: 'Cairo_400Regular',
  semibold: 'Cairo_600SemiBold',
  bold: 'Cairo_700Bold',
};

export const radius = 12;

/** نص عربي من اليمين لليسار */
export const rtlText = {
  textAlign: 'right',
  writingDirection: 'rtl',
  fontFamily: fonts.regular,
  color: colors.text,
};
