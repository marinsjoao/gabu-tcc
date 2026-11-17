import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import ModoJogoContainer from '../../components/ModoJogoContainer';

export default function Jogos() {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader/>

      <Text style={styles.titleModosJogo}>
        Modos de Jogo
      </Text>

      <View style={styles.containerModos}>
        <ModoJogoContainer
          nomeModo="Casual"
          cor="#7BAEFA"
          iconModo="play"
          disponivel
        />
        <ModoJogoContainer
          nomeModo="Desafio contra o tempo"
          cor="#ED6321"
          iconModo="time"
          disponivel={false}
        />
        <ModoJogoContainer
          nomeModo="Disputa de Pênaltis"
          cor="#85FA7B"
          iconModo="football"
          disponivel={false}
        />
        <ModoJogoContainer
          nomeModo="Modo Livre"
          cor="#A100FF"
          iconModo="battery-charging"
          disponivel={false}
        />
        <ModoJogoContainer
          nomeModo="Questões Salvas"
          cor="#FD5457"
          iconModo="save"
          disponivel={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
    padding: 16,
    paddingBottom: 100,
  },
  containerModos: {
    paddingBottom: 24,
  },
  titleModosJogo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
});
