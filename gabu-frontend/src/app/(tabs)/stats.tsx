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
import {
  getAnswerStatistics,
  type AnswerStatistics,
} from '../../database/repositories/answersRepository';
import { getUser } from '../../database/repositories/userRepository';
import type { User } from '../../types';
import { getDisciplineLabel } from '../../data/questions';
import AppHeader from '../../components/AppHeader';
import EmBreve from '../../components/EmBreve';
import EstatisticaPessoal from '../../components/EstatisticaPessoal';

type StatsData = {
  user: User;
  answers: AnswerStatistics;
};

export default function Stats() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadStats() {
        setLoading(true);
        setError(null);
        try {
          const [user, answers] = await Promise.all([
            getUser(db),
            getAnswerStatistics(db),
          ]);
          if (active) {
            setStats({ user, answers });
            setError(null);
          }
        } catch (cause) {
          console.error('Erro ao carregar estatísticas locais:', cause);
          if (active) {
            setError('Não foi possível carregar suas estatísticas locais.');
          }
        } finally {
          if (active) setLoading(false);
        }
      }

      void loadStats();
      return () => {
        active = false;
      };
    }, [db])
  );

  const disciplineStats = stats
    ? Object.entries(stats.answers.byDiscipline)
        .map(([id, result]) => ({
          label: getDisciplineLabel(id),
          ...result,
          accuracy:
            result.correct + result.incorrect === 0
              ? 0
              : result.correct / (result.correct + result.incorrect),
        }))
        .sort((a, b) => b.accuracy - a.accuracy)
    : [];
  const bestDiscipline = disciplineStats[0];
  const worstDiscipline = disciplineStats[disciplineStats.length - 1];

  return (
    <View style={styles.containerAll}>
      <AppHeader />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4E88DF" />
        </View>
      ) : error || !stats ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error ?? 'Estatísticas indisponíveis.'}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Estatísticas</Text>

          <Text style={styles.subtitle}>Geral</Text>
          <View style={styles.linha} />
          <View style={styles.estatisticasPessoais}>
            <EstatisticaPessoal titulo="Moedas disponíveis" texto={String(stats.user.coins)} />
            <EstatisticaPessoal titulo="Recorde de moedas" texto={String(stats.user.best_coins)} />
            <EstatisticaPessoal titulo="Sequência atual" texto={String(stats.user.streak)} />
            <EstatisticaPessoal titulo="Melhor sequência" texto={String(stats.user.best_streak)} />
            <EstatisticaPessoal titulo="Respostas registradas" texto={String(stats.answers.total)} />
            <EstatisticaPessoal titulo="Meta diária" texto={String(stats.user.daily_goal)} />
            <EstatisticaPessoal titulo="Dias estudados" texto={String(stats.answers.daysPlayed)} />
          </View>

          <Text style={styles.subtitle}>Estatísticas Pessoais</Text>
          <View style={styles.linha} />
          <View style={styles.estatisticasPessoais}>
            <EstatisticaPessoal titulo="Acertos gerais" texto={String(stats.answers.correct)} />
            <EstatisticaPessoal titulo="Erros gerais" texto={String(stats.answers.incorrect)} />
            <Text style={styles.groupTitle}>Melhor disciplina</Text>
            <EstatisticaPessoal
              titulo="Disciplina"
              texto={bestDiscipline?.label ?? 'Sem respostas'}
            />
            <EstatisticaPessoal
              titulo="Acertos"
              texto={String(bestDiscipline?.correct ?? 0)}
            />
            <EstatisticaPessoal
              titulo="Erros"
              texto={String(bestDiscipline?.incorrect ?? 0)}
            />
            <Text style={styles.groupTitle}>Disciplina a melhorar</Text>
            <EstatisticaPessoal
              titulo="Disciplina"
              texto={worstDiscipline?.label ?? 'Sem respostas'}
            />
            <EstatisticaPessoal
              titulo="Acertos"
              texto={String(worstDiscipline?.correct ?? 0)}
            />
            <EstatisticaPessoal
              titulo="Erros"
              texto={String(worstDiscipline?.incorrect ?? 0)}
            />
          </View>

          <Text style={styles.subtitle}>Amigos</Text>
          <View style={styles.linha} />
          <EmBreve />

          <Text style={styles.subtitle}>Histórico de Duelos</Text>
          <View style={styles.linha} />
          <EmBreve />
        </ScrollView>
      )}
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
    paddingBottom: 110,
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
  groupTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  error: {
    color: '#FF8A80',
    textAlign: 'center',
  },
});
