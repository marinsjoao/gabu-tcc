
import { View, Text, TextInput, StyleSheet, Image, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    navigation.navigate('Home', {
      visitante: false,
    });
  }

  function handleLoginVisit() {
    navigation.navigate('Home', {
      visitante: true,
    });
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
        <TextInput 
          style={styles.inputLogin} 
          placeholder="E-mail"
          keyboardType="email-address" 
        />

        <TextInput 
          style={styles.inputLogin} 
          placeholder="Senha"
          keyboardType="visible-password" 
        />

        <View style={styles.viewEsqueciSenha}>
          <Pressable
            style={styles.buttonVisitante}
            onPress={handleLogin}
          >
            <Text style={styles.TextVisitante}>
              Esqueci minha senha
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.buttonEntrar}
          onPress={handleLogin}
        >
          <Text style={styles.TextEntrar}>
            Entrar
          </Text>
        </Pressable>

        <Pressable
          style={styles.buttonVisitante}
          onPress={handleLoginVisit}
        >
          <Text style={styles.TextVisitante}>
            Entrar como visitante
          </Text>
        </Pressable>

        <View style={styles.divider} />

        <Text style={styles.textCadastro}>
          Ainda não tem conta?{' '}
          <Text
            style={styles.linkCadastro}
            onPress={handleEsqueciSenha}
          >
            Cadastre-se
          </Text>
        </Text>

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
    width: 460,
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
    width: 460,
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
  width: '85%',
  alignItems: 'flex-start'
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
