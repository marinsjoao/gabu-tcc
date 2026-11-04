import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { countAnswers } from '../../database/repositories/answersRepository';
import { getUser } from '../../database/repositories/userRepository';
import type { User } from '../../types';

type StatsData = {
  user: User;
  answers: number;
};

export default function Stats() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadStats() {
        try {
          const [user, answers] = await Promise.all([
            getUser(db),
            countAnswers(db),
          ]);
          if (active) {
            setStats({ user, answers });
            setError(null);
          }
        } catch {
          if (active) setError('Não foi possível carregar suas estatísticas locais.');
        }
      }

      void loadStats();
      return () => {
        active = false;
      };
    }, [db])
  );

  if (!stats && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4E88DF" />
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Estatísticas indisponíveis.'}</Text>
      </View>
    );
  }

  const metrics = [
    { label: 'XP', value: stats.user.xp },
    { label: 'Moedas', value: stats.user.coins },
    { label: 'Sequência atual', value: stats.user.streak },
    { label: 'Melhor sequência', value: stats.user.best_streak },
    { label: 'Respostas registradas', value: stats.answers },
    { label: 'Meta diária', value: stats.user.daily_goal },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Suas estatísticas</Text>
      <View style={styles.grid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.card}>
            <Text style={styles.value}>{metric.value}</Text>
            <Text style={styles.label}>{metric.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 36,
    backgroundColor: '#000000',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#263D5A',
    backgroundColor: '#111111',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  label: {
    color: '#AAB6C5',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  error: {
    color: '#FF8A80',
    textAlign: 'center',
  },
});
