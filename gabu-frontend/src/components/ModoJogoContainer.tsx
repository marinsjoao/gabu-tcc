
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

type ModoJogoProps = {
  nomeModo: string;
  cor: string;
  iconModo: string;
};

export default function ModoJogoContainer({ nomeModo, cor, iconModo }: ModoJogoProps) {
  

  return (
    <Pressable style={[styles.containerModo, {borderColor: cor}]} 
        accessibilityRole="button"
        onPress={() => router.push({
          pathname: 'escolhaMateria',
          params: {
            modoJogo: nomeModo
          }
        })
        }>
      <Text style={[styles.ModoJogoText, {color: cor}]}>
        {nomeModo}
      </Text>
      <View style={styles.containerIcon}>
        <Ionicons
          name={String(iconModo)}
          size={35}
          color={cor}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerModo: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 2,
    borderRadius: 20,
    padding: 30,
    marginTop: 20
  },
  ModoJogoText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  containerIcon: {
    position: 'absolute',
    right: 24,
    flexDirection: 'row',
  }
});
