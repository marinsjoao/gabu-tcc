import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
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
        <ModoJogoContainer nomeModo='Casual' cor='#7BAEFA' iconModo='play'/>
        <ModoJogoContainer nomeModo='Desafio contra o tempo' cor='#ED6321' iconModo='time'/>
        <ModoJogoContainer nomeModo='Disputa de Pênaltis' cor='#85FA7B' iconModo='football'/>
        <ModoJogoContainer nomeModo='Modo Livre' cor='#A100FF' iconModo='battery-charging'/>
        <ModoJogoContainer nomeModo='Questões Salvas' cor='#FD5457' iconModo='save'/>
      </View>

    </ScrollView>
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
  containerModos: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
    gap: 20,
  },
  titleModosJogo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10
  },
});
