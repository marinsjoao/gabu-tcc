import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { questions } from '../data/questions';
import { saveAnswer } from '../database/repositories/answersRepository';
import { getUser } from '../database/repositories/userRepository';
import type { User } from '../types';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function HomeScreen() {
  const db = useSQLiteContext();
  const question = questions[0]; // por enquanto, só 1 questão para teste

  const [user, setUser] = useState<User | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const loadUser = useCallback(async () => {
    setUser(await getUser(db));
  }, [db]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function handleAnswer(index: number) {
    if (selected !== null) return; // já respondeu
    setSelected(index);
    await saveAnswer(db, question, index);
    await loadUser();
  }

  function getOptionStyle(index: number) {
    if (selected === null) return styles.option;
    if (index === question.correta) return [styles.option, styles.optionCorrect];
    if (index === selected) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDisabled];
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>GABU</Text>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>⭐ {user.xp} XP</Text>
        <Text style={styles.stat}>🪙 {user.coins}</Text>
        <Text style={styles.stat}>🔥 {user.streak}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.materia}>{question.materia}</Text>
        <Text style={styles.pergunta}>{question.pergunta}</Text>

        {question.alternativas.map((alt, i) => (
          <Pressable
            key={i}
            style={getOptionStyle(i)}
            onPress={() => handleAnswer(i)}
            disabled={selected !== null}
          >
            <Text style={styles.optionText}>
              {LETTERS[i]}) {alt}
            </Text>
          </Pressable>
        ))}

        {selected !== null && (
          <View style={styles.feedback}>
            <Text style={styles.feedbackTitle}>
              {selected === question.correta ? '✅ Acertou!' : '❌ Errou!'}
            </Text>
            <Text style={styles.explicacao}>{question.explicacao}</Text>
            <Pressable style={styles.resetButton} onPress={() => setSelected(null)}>
              <Text style={styles.resetText}>Tentar de novo</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F8F8FF',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C63FF',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  stat: { fontSize: 16, fontWeight: '600', color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  materia: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pergunta: { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#222' },
  option: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DDD',
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
  },
  optionCorrect: { borderColor: '#2ECC71', backgroundColor: '#E8F8EF' },
  optionWrong: { borderColor: '#E74C3C', backgroundColor: '#FDEDEC' },
  optionDisabled: { opacity: 0.5 },
  optionText: { fontSize: 16, color: '#333' },
  feedback: { marginTop: 12 },
  feedbackTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  explicacao: { fontSize: 14, color: '#555', marginBottom: 12 },
  resetButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#6C63FF',
  },
  resetText: { color: '#fff', fontWeight: '600' },
});