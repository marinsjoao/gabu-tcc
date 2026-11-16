import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { UserProvider } from '../../../contexts/UserContext';
import { getRandomQuestion } from '../../../data/questions';
import { saveAnswer } from '../../../database/repositories/answersRepository';
import type { Question } from '../../../types';

const ALTERNATIVE_LETTERS = ['A', 'B', 'C', 'D', 'E'];
const DISCIPLINE_TITLES: Record<string, string> = {
  'ciencias-humanas': 'Ciências Humanas e suas Tecnologias',
  'ciencias-natureza': 'Ciências da Natureza e suas Tecnologias',
  linguagens: 'Linguagens, Códigos e suas Tecnologias',
  matematica: 'Matemática e suas Tecnologias',
};

export default function TelaJogo() {
  const db = useSQLiteContext();
  const { tema: rawTheme } = useLocalSearchParams<{ tema?: string }>();
  const tema = rawTheme || undefined;
  const [question, setQuestion] = useState<Question | undefined>(() =>
    getRandomQuestion({ tema })
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<'question' | 'correct' | 'incorrect'>(
    'question'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savingLock = useRef(false);

  async function handleAnswer(index: number) {
    if (!question || selectedIndex !== null || savingLock.current) return;

    savingLock.current = true;
    setSaving(true);
    setError(null);
    try {
      const isCorrect = await saveAnswer(db, question, index);
      setSelectedIndex(index);
      setPhase(isCorrect ? 'correct' : 'incorrect');
    } catch (cause) {
      console.error('Erro ao salvar resposta local:', cause);
      setError('Não foi possível salvar sua resposta. Tente novamente.');
    } finally {
      savingLock.current = false;
      setSaving(false);
    }
  }

  function handleNextQuestion() {
    if (!question) return;
    setQuestion(getRandomQuestion({ tema, excludeId: question.id }));
    setSelectedIndex(null);
    setPhase('question');
    setError(null);
  }

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/jogos');
    }
  }

  const displayedAlternativeIndexes = !question
    ? []
    : phase === 'question'
      ? question.alternativas.map((_, index) => index)
      : selectedIndex === null
        ? []
        : selectedIndex === question.correta
          ? [question.correta]
          : [selectedIndex, question.correta];

  return (
    <UserProvider>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={goBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.disciplineTitle}>
            {question
              ? DISCIPLINE_TITLES[question.tema ?? ''] ?? question.materia
              : 'Questões'}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          {!question ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma questão disponível.</Text>
            </View>
          ) : (
            <View style={styles.content}>
              <View
                style={[
                  styles.questionCard,
                  phase !== 'question' && styles.questionCardResult,
                ]}
              >
                <Text style={styles.questionTitle}>{question.titulo}</Text>
                {question.contexto ? (
                  <Text style={styles.contexto}>{question.contexto}</Text>
                ) : null}
                {question.imagens.map((image, index) => (
                  <Image
                    key={`${question.id}-image-${index}`}
                    source={image}
                    style={styles.questionImage}
                    resizeMode="contain"
                    accessibilityLabel={`Imagem ${index + 1} da questão ${question.numero}`}
                  />
                ))}
                {question.pergunta ? (
                  <Text style={styles.pergunta}>{question.pergunta}</Text>
                ) : null}
              </View>

              {phase !== 'question' ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={
                    phase === 'correct'
                      ? styles.correctFeedback
                      : styles.incorrectFeedback
                  }
                >
                  {phase === 'correct'
                    ? 'Resposta correta!'
                    : 'Resposta incorreta. Veja a alternativa correta.'}
                </Text>
              ) : null}

              {displayedAlternativeIndexes.map((index) => {
                const isCorrect = index === question.correta;
                const answerStyle =
                  phase === 'question'
                    ? styles.option
                    : isCorrect
                      ? styles.optionCorrect
                      : styles.optionWrong;

                return (
                  <Pressable
                    key={`${question.id}-${index}`}
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: phase !== 'question' || saving,
                    }}
                    disabled={phase !== 'question' || saving}
                    onPress={() => void handleAnswer(index)}
                    style={[
                      answerStyle,
                      phase !== 'question' && styles.resultOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        phase !== 'question' &&
                          (isCorrect
                            ? styles.correctOptionText
                            : styles.incorrectOptionText),
                      ]}
                    >
                      {ALTERNATIVE_LETTERS[index] ?? `${index + 1}`}){' '}
                      {question.alternativas[index]}
                    </Text>
                    {question.imagensAlternativas[index] !== null ? (
                      <Image
                        source={question.imagensAlternativas[index] ?? undefined}
                        style={styles.alternativeImage}
                        resizeMode="contain"
                        accessibilityLabel={`Imagem da alternativa ${ALTERNATIVE_LETTERS[index] ?? index + 1}`}
                      />
                    ) : null}
                  </Pressable>
                );
              })}

              {phase !== 'question' && question.explicacao ? (
                <View style={styles.explanationCard}>
                  <Text style={styles.explanationTitle}>Entenda a resposta</Text>
                  <Text style={styles.explanationText}>
                    {question.explicacao}
                  </Text>
                </View>
              ) : null}

              {saving ? <ActivityIndicator color="#4E88DF" /> : null}
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {phase !== 'question' ? (
                <View style={styles.resultSection}>
                  {phase === 'correct' ? (
                    <View style={styles.rewardCard}>
                      <Text style={styles.rewardLabel}>Recompensas:</Text>
                      <Text style={styles.rewardPlus}>+</Text>
                      <Image
                        source={require('../../../../assets/fogo - black back.jpeg')}
                        style={styles.rewardIcon}
                        resizeMode="contain"
                        accessibilityLabel="Sequência de estudos"
                      />

                      <Text style={styles.rewardAmount}>+</Text>
                      <Image
                        source={require('../../../../assets/star - black back.jpeg')}
                        style={styles.rewardIcon}
                        resizeMode="contain"
                        accessibilityLabel="Moeda"
                      />
                    </View>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleNextQuestion}
                    style={styles.resultButton}
                  >
                    <Text style={styles.resultButtonText}>Jogar Novamente</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.replace('/home')}
                    style={styles.resultButton}
                  >
                    <Text style={styles.resultButtonText}>Sair</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    width: 42,
    height: 44,
    justifyContent: 'center',
  },
  disciplineTitle: {
    flex: 1,
    color: '#7BAEFA',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingRight: 42,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#83A5FF',
    shadowOpacity: 0.65,
    shadowRadius: 8,
    elevation: 8,
  },
  questionCardResult: {
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  questionTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 18,
  },
  contexto: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 23,
  },
  pergunta: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 23,
  },
  questionImage: {
    width: '100%',
    height: 220,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7085A6',
    marginBottom: 12,
    backgroundColor: '#000000',
    shadowColor: '#83A5FF',
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  optionCorrect: {
    borderColor: '#66E978',
    backgroundColor: '#000000',
  },
  optionWrong: {
    borderColor: '#FF4C61',
    backgroundColor: '#000000',
  },
  resultOption: {
    borderWidth: 2,
    minHeight: 64,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  correctOptionText: {
    color: '#7BFF72',
  },
  incorrectOptionText: {
    color: '#FF6578',
  },
  alternativeImage: {
    width: '100%',
    height: 160,
    marginTop: 8,
  },
  error: {
    color: '#FF8A80',
    marginTop: 10,
  },
  correctFeedback: {
    color: '#7BFF72',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  incorrectFeedback: {
    color: '#FF6578',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  explanationCard: {
    padding: 18,
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#4A4A4A',
  },
  explanationTitle: {
    color: '#A9C6FF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  explanationText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 23,
  },
  resultSection: {
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  rewardCard: {
    width: '100%',
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  rewardLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  rewardAmount: {
    color: '#7BFF72',
    fontSize: 18,
    fontWeight: '800',
  },
  rewardPlus: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  rewardIcon: {
    width: 34,
    height: 34,
  },
  resultButton: {
    width: '72%',
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#7BAEFA',
  },
  resultButtonText: {
    color: '#A9C6FF',
    fontSize: 15,
    fontWeight: '600',
  },
});
