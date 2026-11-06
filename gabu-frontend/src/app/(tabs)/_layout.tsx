
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,

      tabBarStyle: {
        position: 'absolute',
        bottom: 18,
        left: 12,
        right: 12,

        height: 65,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        borderTopWidth: 0,
        elevation: 8,

        paddingTop: 0,
        paddingBottom: 0,
      },

      // Espaço interno reservado para o ícone
      tabBarIconStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

      // Área clicável de cada aba
      tabBarItemStyle: {
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 0,
      },

      tabBarIcon: ({ focused }) => {
        const icons = {
          home: 'home-outline',
          jogos: 'game-controller-outline',
          stats: 'stats-chart-outline',
          usuario: 'person-circle-outline',
        } as const;

        return (
          <View
            style={[
              styles.iconContainer,
              focused && styles.iconSelected,
            ]}
          >
            <Ionicons
              name={icons[route.name as keyof typeof icons]}
              size={35}
              color={focused ? '#4E88DF' : '#000000'}
            />
          </View>
        );
      },
    })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="jogos" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="usuario" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 46,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },

  iconSelected: {
    backgroundColor: '#DCEBFF',
  },
});
