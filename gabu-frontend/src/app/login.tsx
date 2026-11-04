import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getUser, saveUserName } from '../database/repositories/userRepository';

export default function Login() {
  const db = useSQLiteContext();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const user = await getUser(db);
        if (!active) return;
        if (user.name?.trim()) {
          router.replace('/home');
        } else {
          setLoading(false);
        }
      } catch {
        if (active) {
          setError('Não foi possível carregar os dados locais. Tente novamente.');
          setLoading(false);
        }
      }
    }

    void checkUser();
    return () => {
      active = false;
    };
  }, [db]);

  async function handleContinue() {
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError('Digite seu nome para continuar.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await saveUserName(db, normalizedName);
      router.replace('/home');
    } catch {
      setError('Não foi possível salvar seu nome. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4E88DF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GABU</Text>
      <Text style={styles.subtitle}>Como podemos chamar você?</Text>
      <TextInput
        accessibilityLabel="Seu nome"
        autoCapitalize="words"
        autoComplete="name"
        onChangeText={setName}
        onSubmitEditing={handleContinue}
        placeholder="Seu nome"
        placeholderTextColor="#888888"
        returnKeyType="done"
        style={styles.input}
        value={name}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable
        accessibilityRole="button"
        disabled={saving}
        onPress={handleContinue}
        style={[styles.button, saving && styles.buttonDisabled]}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Continuar</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 20,
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontSize: 18,
  },
  error: {
    marginTop: 12,
    color: '#FF8A80',
    textAlign: 'center',
  },
  button: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#4E88DF',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
