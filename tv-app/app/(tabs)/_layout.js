import { Tabs } from 'expo-router';
import { Home, Tv2, Film, Clapperboard, Settings } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#000',
                    borderTopColor: '#333',
                    height: 60,
                    paddingBottom: 5,
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#666',
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="channels"
                options={{
                    title: 'Canales',
                    tabBarIcon: ({ color, size }) => <Tv2 color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="series"
                options={{
                    title: 'Series',
                    tabBarIcon: ({ color, size }) => <Clapperboard color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="movies"
                options={{
                    title: 'Peliculas',
                    tabBarIcon: ({ color, size }) => <Film color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
