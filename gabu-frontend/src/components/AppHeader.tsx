
import { useCallback } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useUser } from '../contexts/UserContext';

export default function AppHeader() {
  const { user, loading, error, refreshUser } = useUser();

  useFocusEffect(
    useCallback(() => {
      void refreshUser();
    }, [refreshUser])
  );

  const coins = loading ? '...' : user ? String(user.coins) : '--';
  const streak = loading ? '...' : user ? String(user.streak) : '--';

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.coinIndicator}>
          <Image
            source={require('../../assets/star - black back.jpeg')}
            style={styles.icon}
            resizeMode="contain"
            accessibilityLabel="Moedas"
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{coins}</Text>
          </View>
        </View>
        <Image
          source={require('../../assets/nome_gabu.jpeg')}
          style={styles.nome_gabu}
          resizeMode="contain"
        />
        <View style={styles.streakIndicator}>
          <Image
            source={require('../../assets/fogo - black back.jpeg')}
            style={styles.icon}
            resizeMode="contain"
            accessibilityLabel="Sequência diária"
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{streak}</Text>
          </View>
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000000',
  },
  container: {
    height: 110,
    backgroundColor: '#000000',
    flexDirection: 'row', //Elementos organizados lado a lado
    alignItems: 'flex-end', //Vertical
    justifyContent: 'center', //Horizontal
    borderBottomWidth: 1,
    borderBottomColor: '#4E88DF',
  },

  nome_gabu: {
    width: 140,
    height: 70,
  },

  coinIndicator: {
    position: 'absolute',
    left: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  streakIndicator: {
    position: 'absolute',
    right: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  icon: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },

  badge: {
    backgroundColor: '#4E88DF',
    minWidth: 25,
    height: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -5,
    marginTop: -5,
    paddingHorizontal: 3,
  },

  badgeText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF8A80',
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 6,
    textAlign: 'center',
  },
});
