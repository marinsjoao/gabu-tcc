
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';

import AppHeader from '../components/AppHeader';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [saudacao, setSaudacao] = useState('');

  useEffect(() => {
    const atualizaSaudacao = () => {
      const dateNow = new Date();
      const horaAtual = dateNow.getHours();

      switch (true) {
        case (horaAtual >= 4 && horaAtual < 12):
          setSaudacao('Bom dia, ');
        case (horaAtual >= 12 && horaAtual < 18):
          setSaudacao('Boa tarde, ');
        case (horaAtual >= 18):
          setSaudacao('Boa noite, ');
        default:
          setSaudacao('Olá, ');
      }
    }

    atualizaSaudacao();
    const intervalo = setInterval(atualizaSaudacao, 60000); //Intervalo para atualizar a saudação a cada minuto

    return () => clearInterval(intervalo);
  }) 
  function handleJogar() {
    console.log('Jogar');
  }

  function handleRanking() {
    console.log('Abrir classificação');
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <AppHeader />

      {/* Conteúdo da Home */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Card de sequência */}
        <View style={styles.streakCard}>

          <Image
            source={require('../../assets/fogo.jpeg')}
            style={styles.fireImage}
            resizeMode="contain"
          />

          <View style={styles.streakContent}>
            <View style={styles.streakContentGreeting}>
              <Text style={styles.greeting}>
                {saudacao} <Text style={styles.bold}>Gabriel!</Text> {/* NOME MOCKADO */}
              </Text>
            </View>
          
            <View style={styles.streakBox}>
              <Text style={styles.streakTitle}>
                8 Dias Seguidos {/* STREAK MOCKADO */}
              </Text>

              <Text style={styles.streakSubtitle}>
                Mantenha sua sequência! {/* Adicionar verificação para a frase mudar a cada quantidade de streak */} 
              </Text>
            </View>
          </View>

        </View>

        {/* Card de classificação */}
        <Pressable
          style={styles.rankingCard}
          onPress={handleRanking}
        >

          <Image
            source={require('../../assets/trofeu.jpg')}
            style={styles.trophyImage}
            resizeMode="contain"
          />

          <View style={styles.rankingContent}>
            <Text style={styles.rankingTitle}>
              Uau! Você está no top 152! {/* TOP MOCKADO */} {/* Adicionar verificação para mudar a cada posição no top */}
            </Text>

            <Text style={styles.rankingLink}>
              Confira o placar de líderes
            </Text>
          </View>

        </Pressable>

        {/* Botão jogar */}
        <Pressable
          style={styles.playButton}
          onPress={handleJogar}
        >
          <Text style={styles.playText}>
            JOGAR
          </Text>

          <Text style={styles.playArrow}>
            ▶
          </Text>
        </Pressable>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
    gap: 20,
  },

  streakCard: {
    height: 300,
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
    width: 300,
    height: 300,
  },

  streakContent: {
    flex: 1,
    padding: 30, 
    alignItems: 'center',
  },

  streakContentGreeting: {
    paddingLeft: 100
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 36,
    marginBottom: 12,
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
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  streakSubtitle: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 8,
  },

  rankingCard: {
    height: 180,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#263D5A',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
  },

  trophyImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    left: -90
  },

  rankingContent: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center'
  },

  rankingTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    marginLeft: 30,
    fontWeight: 'bold',
  },

  rankingLink: {
    color: '#4E88DF',
    fontSize: 24,
    textDecorationLine: 'underline',
    marginTop: 5,
  },

  playButton: {
    height: 150,
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
    fontSize: 56,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  playArrow: {
    color: '#FFFFFF',
    fontSize: 90,
  },

});
