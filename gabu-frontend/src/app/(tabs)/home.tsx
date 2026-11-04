import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import AppHeader from '../../components/AppHeader';
import { getUser } from '../../database/repositories/userRepository';
import type { User } from '../../types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  if (hour >= 18) return 'Boa noite';
  return 'Olá';
}

export default function Home() {
  const db = useSQLiteContext();
  const [user, setUser] = useState<User | null>(null);
  const [greeting, setGreeting] = useState(getGreeting);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadUser() {
        try {
          const loadedUser = await getUser(db);
          if (active) {
            setUser(loadedUser);
            setError(null);
          }
        } catch {
          if (active) setError('Não foi possível carregar seu progresso local.');
        }
      }

      void loadUser();
      return () => {
        active = false;
      };
    }, [db])
  );

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!user && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4E88DF" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Usuário local indisponível.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader streak={user.streak} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.streakCard}>
          <Image
            source={require('../../../assets/fogo - black back.jpeg')}
            style={styles.fireImage}
            resizeMode="contain"
          />
          <View style={styles.streakContent}>
            <Text style={styles.greeting}>
              {greeting},{' '}
              <Text style={styles.bold}>{user.name || 'estudante'}!</Text>
            </Text>
            <View style={styles.streakBox}>
              <Text style={styles.streakTitle}>
                {user.streak} {user.streak === 1 ? 'dia' : 'dias'} seguidos
              </Text>
              <Text style={styles.streakSubtitle}>
                Mantenha sua sequência de estudos!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Seu progresso</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.coins}</Text>
              <Text style={styles.statLabel}>Moedas</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.daily_goal}</Text>
              <Text style={styles.statLabel}>Meta diária</Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/jogos')}
          style={styles.playButton}
        >
          <Text style={styles.playText}>JOGAR</Text>
          <Text style={styles.playArrow}>▶</Text>
        </Pressable>
      </ScrollView>
    </View>
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
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
    gap: 20,
  },
  error: {
    color: '#FF8A80',
    textAlign: 'center',
  },
  streakCard: {
    minHeight: 260,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#263D5A',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
  },
  fireImage: {
    position: 'absolute',
    left: -80,
    bottom: 0,
    width: 250,
    height: 250,
  },
  streakContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  streakBox: {
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
  },
  streakTitle: {
    color: '#FF681C',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  streakSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  progressCard: {
    padding: 20,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#263D5A',
    borderRadius: 20,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#AAB6C5',
    fontSize: 14,
    marginTop: 4,
  },
  playButton: {
    minHeight: 110,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#65D957',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    elevation: 6,
  },
  playText: {
    color: '#7BFF72',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  playArrow: {
    color: '#FFFFFF',
    fontSize: 52,
  },
});
