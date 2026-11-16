import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EmBreve from '../../../components/EmBreve';
import { router, useLocalSearchParams } from 'expo-router';
import AppHeader from '../../../components/AppHeader';
import { UserProvider } from '../../../contexts/UserContext';
import BackButton from '../../../components/backButton';

const modosJogoEmBreve = ['Desafio contra o tempo', 'Disputa de Pênaltis', 'Modo Livre', 'Questões Salvas']

export default function EscolhaMateria() {
    const { modoJogo } = useLocalSearchParams<{
        modoJogo: string
    }>();

    if (modosJogoEmBreve.includes(modoJogo)) {
        return (
        <UserProvider>
            <AppHeader/>
            <View style={styles.emBreveCard}>
                <BackButton/>
                <EmBreve/>
            </View>
        </UserProvider>
        );
                
    }

    let corItens = '#FFFFFF';
    switch (modoJogo) {
        case 'Casual':
            corItens = '#7BAEFA';
            break;
        case 'Desafio contra o tempo':
            corItens = '#ED6321';
            break;
        case 'Disputa de Pênaltis':
            corItens = '#85FA7B';
            break;
        case 'Modo Livre':
            corItens = '#A100FF';
            break;
        case 'Questões Salvas':
            corItens = '#FD5457';
            break;
    }

    return (
        <UserProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.titleModoJogo, {color: corItens}]}>{modoJogo}</Text>
                <View>

                </View>

            </ScrollView>
        </UserProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },
  emBreveCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000'
  },
  titleModoJogo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10
  },
});
