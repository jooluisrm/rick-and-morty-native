import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getEpisodeById } from '../../services/episodeService';
import { getCharactersByIds } from '../../services/characterService';
import { Episode } from '../../types/episode';
import { Character } from '../../types/character';
import { CharacterCard } from '../../components/CharacterCard';
import { Ionicons } from '@expo/vector-icons';

export default function EpisodeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [episode, setEpisode] = useState<Episode | null>(null);
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
      const epData = await getEpisodeById(Number(id));
      setEpisode(epData);
      
      if (epData.characters.length > 0) {
        setLoadingCharacters(true);
        const charIds = epData.characters.map(url => Number(url.split('/').pop()));
        const charsData = await getCharactersByIds(charIds);
        setCharacters(charsData);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhe do episódio:", error);
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.episodeCode}>{episode?.episode}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{episode?.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CharacterCard character={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>PERSONAGENS NESTE EPISÓDIO</Text>
            <Text style={styles.airDate}>Lançado em: {episode?.air_date}</Text>
          </View>
        }
        ListFooterComponent={() => loadingCharacters && <ActivityIndicator color="#97ce4c" />}
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  episodeCode: {
    color: '#97ce4c',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  infoSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#97ce4c',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  airDate: {
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 16,
  },
});
