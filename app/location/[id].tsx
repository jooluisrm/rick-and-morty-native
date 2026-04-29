import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getLocationById } from '../../services/locationService';
import { getCharactersByIds } from '../../services/characterService';
import { LocationDetail } from '../../types/location';
import { Character } from '../../types/character';
import { CharacterCard } from '../../components/CharacterCard';
import { Ionicons } from '@expo/vector-icons';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [location, setLocation] = useState<LocationDetail | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const locData = await getLocationById(Number(id));
      setLocation(locData);
      
      if (locData.residents.length > 0) {
        setLoadingCharacters(true);
        const charIds = locData.residents.map(url => Number(url.split('/').pop()));
        // Buscar apenas os primeiros 20 residentes para performance
        const charsData = await getCharactersByIds(charIds.slice(0, 20));
        setCharacters(charsData);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhe da localização:", error);
    } finally {
      setLoading(false);
      setLoadingCharacters(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#97ce4c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#97ce4c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{location?.name}</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.infoSection}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{location?.type}</Text>
            </View>
            <Text style={styles.dimensionText}>Dimensão: {location?.dimension}</Text>
            
            <Text style={styles.sectionTitle}>RESIDENTES</Text>
          </View>
        }
        ListFooterComponent={() => loadingCharacters && <ActivityIndicator color="#97ce4c" />}
        ListEmptyComponent={
          !loadingCharacters ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum residente conhecido.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0C0C0C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0C0C0C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  infoSection: {
    paddingVertical: 20,
  },
  typeTag: {
    backgroundColor: 'rgba(151, 206, 76, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: {
    color: '#97ce4c',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dimensionText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  }
});
