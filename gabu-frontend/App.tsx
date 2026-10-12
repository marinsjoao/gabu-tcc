import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

// ⚠️ Ajuste conforme o ambiente:
// - Navegador / iOS Simulator: http://localhost:3333
// - Emulador Android: http://10.0.2.2:3333
// - Celular físico: http://SEU_IP_LOCAL:3333
const API_URL = 'http://192.168.1.3:3333';

export default function App() {
  const [status, setStatus] = useState('Conectando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/health`)
      .then((res) =>
        setStatus(`✅ ${res.data.message} (${res.data.usersCount} usuários)`)
      )
      .catch((err) => {
        console.error(err);
        setStatus('❌ Erro ao conectar no backend');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GABU</Text>
      <Text style={styles.subtitle}>Seu assistente de estudos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <Text style={styles.status}>{status}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F8FF',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});