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
import AppHeader from '../../components/AppHeader';
import EmBreve from '../../components/EmBreve';
import EstatisticaPessoal from '../../components/EstatisticaPessoal';

type StatsData = {
  user: User;
  answers: number;
};

export default function Stats() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

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

  if (!user || error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? 'Usuário local indisponível.'}</Text>
      </View>
    );
  }

  if (!stats && !error) {
    return (
      <View style={styles.center}>
        <AppHeader star={user.coins} streak={user.streak} />
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
    <View style={styles.containerAll}>
      <AppHeader star={user.coins} streak={user.streak} />
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Estatísticas</Text>
          
          <Text style={styles.subtitle}>Geral</Text>
          <View style={styles.linha} />

          <EmBreve/>
          
          <Text style={styles.subtitle}>Amigos</Text>
          <View style={styles.linha} />

          <EmBreve/>
          
          <Text style={styles.subtitle}>Estatísticas Pessoais</Text>
          <View style={styles.linha} />
          <View style={styles.estatisticasPessoais}>
            <EstatisticaPessoal titulo={'Acertos Gerais'} texto={'50'}/>
            <EstatisticaPessoal titulo={'Erros Gerais'} texto={'8'}/>
            
            <Text> {'\n'} </Text>

            <EstatisticaPessoal titulo={'Melhor Disciplina'} texto={'Matemática e suas tecnologias'}/>
            <EstatisticaPessoal titulo={'Acertos'} texto={'10'}/>
            <EstatisticaPessoal titulo={'Erros'} texto={'1'}/>

            <Text> {'\n'} </Text>

            <EstatisticaPessoal titulo={'Disciplina a melhorar'} texto={'Ciências Humanas e suas tecnologias'}/>
            <EstatisticaPessoal titulo={'Acertos'} texto={'2'}/>
            <EstatisticaPessoal titulo={'Erros'} texto={'13'}/>

            <Text> {'\n'} </Text>

            <EstatisticaPessoal titulo={'Quantidade de Dias Jogados'} texto={'130'}/>

            <Text> {'\n'} </Text>

            <EstatisticaPessoal titulo={'Melhor Streak'} texto={String(stats.user.best_streak)}/>
          </View>

          <Text style={styles.subtitle}>Histórico de Duelos</Text>
          <View style={styles.linha} />

          <EmBreve/>

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
  containerAll: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 36,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  subtitle: {
    color: '#7BAEFA',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'start',
  },
  linha: {
    width: '100%',
    borderBottomColor: '#7BAEFA', // Cor da linha
    borderBottomWidth: 2
  },
  estatisticasPessoais: {
    marginTop: 15,
    marginBottom: 15,
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
