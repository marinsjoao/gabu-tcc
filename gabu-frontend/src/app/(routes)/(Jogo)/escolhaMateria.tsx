import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AppHeader from '../../../components/AppHeader';
import { UserProvider } from '../../../contexts/UserContext';
import { QUESTION_DISCIPLINES } from '../../../data/questions';

export default function EscolhaMateria() {
  const { modoJogo } = useLocalSearchParams<{ modoJogo?: string }>();
  const modoDisponivel = modoJogo === 'Casual';

  function iniciarSessao(tema?: string) {
    router.push({
      pathname: '/(routes)/(Jogo)/telaJogo',
      params: { tema: tema ?? '' },
    });
  }

  return (
    <UserProvider>
      <View style={styles.screen}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.container}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/jogos')}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Voltar aos modos</Text>
          </Pressable>
          <Text style={styles.titleModoJogo}>
            {modoDisponivel ? 'Escolha uma matéria' : 'Modo indisponível'}
          </Text>
          {modoDisponivel ? (
            <View style={styles.options}>
              {QUESTION_DISCIPLINES.map((discipline) => (
                <Pressable
                  key={discipline.id}
                  accessibilityRole="button"
                  onPress={() => iniciarSessao(discipline.id)}
                  style={styles.option}
                >
                  <Text style={styles.optionText}>{discipline.label}</Text>
                </Pressable>
              ))}
              <Pressable
                accessibilityRole="button"
                onPress={() => iniciarSessao()}
                style={[styles.option, styles.randomOption]}
              >
                <Text style={styles.optionText}>Conteúdo aleatório</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.message}>
              Esse modo ainda não está disponível. O modo Casual é o único
              liberado no MVP.
            </Text>
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
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 100,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  backText: {
    color: '#7BAEFA',
    fontSize: 16,
  },
  titleModoJogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7BAEFA',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  options: {
    gap: 12,
  },
  option: {
    minHeight: 64,
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#7BAEFA',
    borderRadius: 14,
    backgroundColor: '#111111',
  },
  randomOption: {
    borderColor: '#65D957',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
