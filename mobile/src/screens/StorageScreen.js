/**
 * StorageScreen.js — عارض التخزين المحلي
 * يقرأ كل المفاتيح التي يحفظها التطبيق في AsyncStorage ويعرض قيمها كما هي (JSON)
 */
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Card, T } from '../components/UI';
import { dumpAll } from '../storage/storage';
import { colors } from '../theme';

function pretty(value) {
  try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return String(value); }
}

export default function StorageScreen() {
  const [entries, setEntries] = useState([]);
  const load = useCallback(() => { dumpAll().then(setEntries); }, []);
  useFocusEffect(load);

  return (
    <ScrollView testID="storage-screen" style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <T muted style={{ marginBottom: 10 }}>
        AsyncStorage · {entries.length} مفاتيح محفوظة على هذا الجهاز
      </T>
      {entries.map((e) => (
        <Card key={e.key} style={{ marginBottom: 10 }}>
          <T bold style={styles.key}>{e.key}</T>
          <View style={styles.code}>
            <T style={styles.mono}>{pretty(e.value)}</T>
          </View>
        </Card>
      ))}
      <Button title="تحديث" icon="refresh" variant="secondary" onPress={load} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  key: { color: colors.secondary, textAlign: 'left', writingDirection: 'ltr', fontSize: 15 },
  code: { backgroundColor: '#0A1422', borderRadius: 8, padding: 10, marginTop: 6 },
  mono: {
    fontFamily: 'monospace', fontSize: 12, textAlign: 'left', writingDirection: 'ltr', color: '#A8E6A1', lineHeight: 18,
  },
});
