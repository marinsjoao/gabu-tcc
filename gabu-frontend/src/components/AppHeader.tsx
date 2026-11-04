
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

export default function AppHeader() {
  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/nome_gabu.jpeg')}
        style={styles.nome_gabu}
        resizeMode="contain"
      />

      <View style={styles.streakIndicator}>
        <Image
          source={require('../../assets/fogo.jpeg')}
          style={styles.fireIcon}
          resizeMode="contain"
        />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>8</Text> {/* STREAK MOCKADO */}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 110,
    backgroundColor: '#000000',
    flexDirection: 'row', //Elementos organizados lado a lado
    alignItems: 'center', //Vertical
    justifyContent: 'center', //Horizontal
    borderBottomWidth: 1,
    borderBottomColor: '#4E88DF',
  },

  nome_gabu: {
    width: 140,
    height: 70,
  },

  streakIndicator: {
    position: 'absolute',
    right: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  fireIcon: {
    width: 50,
    height: 50,
  },

  badge: {
    backgroundColor: '#4E88DF',
    width: 25,
    height: 25,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -5,
    marginTop: -5,
  },

  badgeText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
