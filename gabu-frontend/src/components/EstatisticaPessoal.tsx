
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

type EstatisticaPessoalProps = {
  titulo: string;
  texto: string;
};

export default function EstatisticaPessoal({ titulo, texto }: EstatisticaPessoalProps) {
  return (
    <View style={styles.containerStat}>
      <Text style={styles.tituloStat}>
        {titulo}: {' '}
      </Text>
      <Text style={styles.textoStat}>
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStat: {
    backgroundColor: '#000000',
    flexDirection: 'row', //Elementos organizados lado a lado
    alignItems: 'flex-start', //Vertical
    justifyContent: 'flex-start', //Horizontal
  },
  tituloStat: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  textoStat: {
    fontSize: 15,
    color: '#FFFFFF'
  },
});
