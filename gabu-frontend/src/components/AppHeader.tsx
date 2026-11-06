
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

type AppHeaderProps = {
  star: number;
  streak: number;
};

export default function AppHeader({ star, streak }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.starIndicator}>
        <Image
          source={require('../../assets/star - black back.jpeg')}
          style={styles.fireIcon}
          resizeMode="contain"
        />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{star}</Text>
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
          style={styles.fireIcon}
          resizeMode="contain"
        />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{streak}</Text>
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
    alignItems: 'flex-end', //Vertical
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

  starIndicator: {
    position: 'absolute',
    left: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  fireIcon: {
    width: 50,
    height: 50,
    marginBottom: 15
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
