import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { getLocations } from '../services/locationService';
import { LocationDetail, LocationFilter } from '../types/location';
import { LocationCard } from '../components/LocationCard';
import { SearchFilter } from '../components/SearchFilter';
import { Ionicons } from '@expo/vector-icons';

export default function LocationsScreen() {
  const [locations, setLocations] = useState<LocationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filter, setFilter] = useState<LocationFilter>({});
  
  const router = useRouter();

  useEffect(() => {
    loadData(1, filter, true);
  }, [filter]);

  const loadData = async (targetPage: number, currentFilter: LocationFilter, refresh: boolean = false) => {
    try {
      if (refresh) setLoading(true);
      else setLoadingMore(true);

      const data = await getLocations(targetPage, currentFilter);
      
      if (refresh) {
        setLocations(data.results);
      } else {
        setLocations(prev => [...prev, ...data.results]);
      }

      setPage(targetPage);
      setHasNextPage(!!data.info.next);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setLocations([]);
        setHasNextPage(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (loadingMore || !hasNextPage) return;
    loadData(page + 1, filter);
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
        <Text style={styles.headerTitle}>Localizações</Text>
        <View style={{ width: 40 }} /> 
      </SafeAreaView>

      <SearchFilter 
        placeholder="Buscar localização..." 
        onFilterChange={(name) => setFilter({ name })} 
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#97ce4c" />
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <LocationCard location={item} />}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhuma localização encontrada.</Text>
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
  },
});
