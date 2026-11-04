import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { getRandomQuestion } from '../../data/questions';
import { saveAnswer } from '../../database/repositories/answersRepository';
import type { Question } from '../../types';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function Jogos() {
  const db = useSQLiteContext();
  const [question, setQuestion] = useState<Question | undefined>(
    () => getRandomQuestion()
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnswer(index: number) {
    if (!question || selected !== null || saving) return;

    setSaving(true);
    setError(null);
    try {
      await saveAnswer(db, question, index);
      setSelected(index);
    } catch {
      setError('Não foi possível salvar sua resposta no banco local.');
    } finally {
      setSaving(false);
    }
  }

  function handleNextQuestion() {
    setQuestion(getRandomQuestion());
    setSelected(null);
    setError(null);
  }

  const currentQuestion = question;
  if (!currentQuestion) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Nenhuma questão disponível.</Text>
      </View>
    );
  }

  function getOptionStyle(index: number, correctIndex: number) {
    if (selected === null) return styles.option;
    if (index === correctIndex) {
      return [styles.option, styles.optionCorrect];
    }
    if (index === selected) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDisabled];
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hora de jogar!</Text>
      <View style={styles.card}>
        <Text style={styles.materia}>{currentQuestion.materia}</Text>
        <Text style={styles.pergunta}>{currentQuestion.pergunta}</Text>
        {currentQuestion.alternativas.map((alternative, index) => (
          <Pressable
            key={`${currentQuestion.id}-${index}`}
            accessibilityRole="button"
            disabled={selected !== null || saving}
            onPress={() => handleAnswer(index)}
            style={getOptionStyle(index, currentQuestion.correta)}
          >
            <Text style={styles.optionText}>
              {LETTERS[index]}) {alternative}
            </Text>
          </Pressable>
        ))}
        {saving && <ActivityIndicator color="#4E88DF" />}
        {error && <Text style={styles.error}>{error}</Text>}
        {selected !== null && (
          <View style={styles.feedback}>
            <Text style={styles.feedbackTitle}>
              {selected === currentQuestion.correta ? '✅ Acertou!' : '❌ Errou!'}
            </Text>
            {currentQuestion.explicacao ? (
              <Text style={styles.explicacao}>{currentQuestion.explicacao}</Text>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={handleNextQuestion}
              style={styles.resetButton}
            >
              <Text style={styles.resetText}>Próxima questão</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 36,
    backgroundColor: '#000000',
  },
  title: {
    marginBottom: 20,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#111111',
    borderColor: '#263D5A',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  materia: {
    color: '#4E88DF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  pergunta: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  option: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#52657A',
    marginBottom: 10,
    backgroundColor: '#1A1A1A',
  },
  optionCorrect: {
    borderColor: '#2ECC71',
    backgroundColor: '#153323',
  },
  optionWrong: {
    borderColor: '#E74C3C',
    backgroundColor: '#3A1D1B',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  error: {
    color: '#FF8A80',
    marginTop: 10,
  },
  feedback: {
    marginTop: 12,
  },
  feedbackTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  explicacao: {
    color: '#D0D0D0',
    fontSize: 14,
    marginBottom: 12,
  },
  resetButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#4E88DF',
  },
  resetText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
