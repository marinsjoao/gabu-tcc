import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  const progress = useRef(new Animated.Value(-72)).current;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.getElementById('gabu-initial-loader')?.remove();
    }

    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 240,
        duration: 1100,
        useNativeDriver: false,
      })
    );

    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>GABU</Text>
      <View
        accessibilityLabel="Carregando o Gabu"
        accessibilityRole="progressbar"
        style={styles.progressTrack}
      >
        <Animated.View
          style={[
            styles.progressBar,
            { transform: [{ translateX: progress }] },
          ]}
        />
      </View>
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000000',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 8,
  },
  progressTrack: {
    width: 240,
    height: 6,
    marginTop: 28,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: '#333333',
  },
  progressBar: {
    width: 72,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7BAEFA',
  },
  loadingText: {
    marginTop: 14,
    color: '#B8C6DC',
    fontSize: 14,
  },
});
