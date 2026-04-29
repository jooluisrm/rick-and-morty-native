import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { getCharacters } from '../services/characterService';
import { Character, CharacterFilter } from '../types/character';
import { CharacterCard } from '../components/CharacterCard';
import { FilterHeader } from '../components/FilterHeader';
import { Ionicons } from '@expo/vector-icons';

export default function CharactersScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filters, setFilters] = useState<CharacterFilter>({});
  
  const router = useRouter();

  useEffect(() => {
    loadData(1, filters, true);
  }, [filters]);

  const loadData = async (targetPage: number, currentFilters: CharacterFilter, refresh: boolean = false) => {
    try {
      if (refresh) setLoading(true);
      else setLoadingMore(true);

      const data = await getCharacters(targetPage, currentFilters);
      
      if (refresh) {
        setCharacters(data.results);
      } else {
        setCharacters(prev => [...prev, ...data.results]);
      }

      setPage(targetPage);
      setHasNextPage(!!data.info.next);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setCharacters([]);
        setHasNextPage(false);
      }
      console.error("Erro ao carregar personagens:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreCharacters = () => {
    if (loadingMore || !hasNextPage) return;
    loadData(page + 1, filters);
  };

  const handleFilterChange = (newFilters: CharacterFilter) => {
    setFilters(newFilters);
  };

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 40 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#97ce4c" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#97ce4c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personagens</Text>
        <View style={{ width: 40 }} /> 
      </SafeAreaView>

      <FilterHeader onFilterChange={handleFilterChange} />
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#97ce4c" />
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString() + Math.random()}
          renderItem={({ item }) => <CharacterCard character={item} />}
          contentContainerStyle={styles.list}
          onEndReached={loadMoreCharacters}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhum personagem encontrado.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  header: {
    backgroundColor: '#0C0C0C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#97ce4c',
    fontSize: 20,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  list: {
    paddingHorizontal: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: 16,
    fontWeight: '500',
  },
});
