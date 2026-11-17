
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function EmBreve() {
  
  return (
    <View style={styles.container}>
      <Text style={styles.textEmBreve}>
        Essa funcionalidade está em processo de desenvolvimento e em breve estará disponível!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#000000',
    borderColor: '#7BAEFA',
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textEmBreve: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
