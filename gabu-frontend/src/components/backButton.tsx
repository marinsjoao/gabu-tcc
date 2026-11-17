
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

export default function BackButton() {
  
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}        
              accessibilityRole="button"
              onPress={() => router.back()}>
          <Ionicons name='arrow-back' color='#FFFFFF' size={35}/>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {

  }
});
