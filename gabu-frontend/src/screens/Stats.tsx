
import { View, Text, TextInput, StyleSheet, Image, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';

export default function Stats() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    console.log('login');
  }

  function handleLoginVisit() {
    console.log('visitante');
  }

  function handleEsqueciSenha() {
    console.log('esqueci minha senha');
  }
  

  return (
    <View style={styles.container}>
        <Image
          source={require("../../assets/logo.jpeg")}
          style={styles.logo}
          resizeMode="contain"
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
    logo: {
    width: 300,
    height: 300,
    marginBottom: 20
  },
  inputLogin: {
    fontSize: 20,
    height: 65,
    width: 420,
    borderRadius: 20,
    paddingHorizontal: 14,
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'left',
    backgroundColor: '#FFFFFF',
    color: '#000000'
  },
  buttonEntrar: {
    height: 70,
    width: 420,
    backgroundColor: '#4E88DF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  TextEntrar: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
    buttonVisitante: {
    marginTop: 24,
  },
  TextVisitante: {
    color: '#4E88DF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewEsqueciSenha: {
    alignItems: 'flex-end'
  },
  divider: {
    width: '85%',
    height: 1,
    backgroundColor: '#555555',
    marginTop: 24,
    marginBottom: 20,
  },

  textCadastro: {
    color: '#FFFFFF',
    fontSize: 20,
  },

  linkCadastro: {
    color: '#4E88DF',
    fontWeight: 'bold',
  },

});
