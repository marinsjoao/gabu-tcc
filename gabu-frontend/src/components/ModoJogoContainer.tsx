
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

type IconName = ComponentProps<typeof Ionicons>['name'];

type ModoJogoProps = {
  nomeModo: string;
  cor: string;
  iconModo: IconName;
  disponivel: boolean;
};

export default function ModoJogoContainer({
  nomeModo,
  cor,
  iconModo,
  disponivel,
}: ModoJogoProps) {
  return (
    <Pressable
      style={[
        styles.containerModo,
        { borderColor: cor },
        !disponivel && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !disponivel }}
      disabled={!disponivel}
      onPress={() =>
        router.push({
          pathname: '/(routes)/(Jogo)/escolhaMateria',
          params: { modoJogo: nomeModo },
        })
      }
    >
      <View>
        <Text style={[styles.modoJogoText, { color: cor }]}>{nomeModo}</Text>
        {!disponivel ? <Text style={styles.lockedText}>Bloqueado</Text> : null}
      </View>
      <View style={styles.containerIcon}>
        <Ionicons name={iconModo} size={35} color={cor} />
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
  disabled: {
    opacity: 0.45,
  },
  modoJogoText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  lockedText: {
    color: '#AAB6C5',
    fontSize: 14,
    marginTop: 4,
  },
  containerIcon: {
    position: 'absolute',
    right: 24,
    flexDirection: 'row',
  }
});
