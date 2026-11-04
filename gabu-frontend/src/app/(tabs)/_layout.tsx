import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4E88DF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#263D5A',
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="jogos" options={{ title: 'Jogos' }} />
      <Tabs.Screen name="stats" options={{ title: 'Estatísticas' }} />
      <Tabs.Screen name="usuario" options={{ title: 'Usuário' }} />
    </Tabs>
  );
}
