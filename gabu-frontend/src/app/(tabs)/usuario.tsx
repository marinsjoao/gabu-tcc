import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getUser } from '../../database/repositories/userRepository';
import type { User } from '../../types';

export default function Usuario() {
  const db = useSQLiteContext();
  const [user, setUser] = useState<User | null>(null);
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
          if (active) setError('Não foi possível carregar seus dados locais.');
        }
      }

      void loadUser();
      return () => {
        active = false;
      };
    }, [db])
  );

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
      <Text style={styles.title}>Meu perfil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user.name || 'Não informado'}</Text>
        <Text style={styles.label}>Meta diária de questões</Text>
        <Text style={styles.value}>{user.daily_goal}</Text>
      </View>
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
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#263D5A',
    backgroundColor: '#111111',
  },
  label: {
    color: '#AAB6C5',
    fontSize: 14,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 20,
  },
  error: {
    color: '#FF8A80',
    textAlign: 'center',
  },
});
