import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getCharacterById } from '../../services/characterService';
import { getEpisodesByIds } from '../../services/episodeService';
import { Character } from '../../types/character';
import { Episode } from '../../types/episode';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const charData = await getCharacterById(Number(id));
      setCharacter(charData);
      
      // Carregar episódios
      if (charData.episode.length > 0) {
        setLoadingEpisodes(true);
        // Extrair apenas os IDs das URLs dos episódios
        const episodeIds = charData.episode.map(url => {
          const parts = url.split('/');
          return Number(parts[parts.length - 1]);
        });
        
        // Pegar apenas os primeiros 10 episódios para não sobrecarregar
        const episodesData = await getEpisodesByIds(episodeIds.slice(0, 10));
        setEpisodes(episodesData);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
      setLoadingEpisodes(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#97ce4c" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'white' }}>Personagem não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView edges={['top']} style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView bounces={false}>
        <View>
          <Image source={{ uri: character.image }} style={styles.mainImage} />
          <LinearGradient
            colors={['rgba(12, 12, 12, 0.4)', 'transparent', '#0C0C0C']}
            style={styles.imageOverlay}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{character.name}</Text>
          
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: character.status === 'Alive' ? '#55cc44' : character.status === 'Dead' ? '#d63d2e' : '#9e9e9e' }]} />
            <Text style={styles.statusText}>{character.status} - {character.species}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SOBRE O PERSONAGEM</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.gridItem}>
                <Ionicons name="transgender" size={20} color="#97ce4c" />
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridLabel}>Gênero</Text>
                  <Text style={styles.gridValue}>{character.gender}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => {
                  const id = character.origin.url.split('/').pop();
                  if (id) router.push({ pathname: '/location/[id]', params: { id } });
                }}
                disabled={!character.origin.url}
              >
                <Ionicons name="planet" size={20} color="#97ce4c" />
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridLabel}>Origem</Text>
                  <Text style={styles.gridValue}>{character.origin.name}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.gridItem}
                onPress={() => {
                  const id = character.location.url.split('/').pop();
                  if (id) router.push({ pathname: '/location/[id]', params: { id } });
                }}
                disabled={!character.location.url}
              >
                <Ionicons name="navigate" size={20} color="#97ce4c" />
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridLabel}>Localização</Text>
                  <Text style={styles.gridValue}>{character.location.name}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.gridItem}>
                <Ionicons name="tv" size={20} color="#97ce4c" />
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridLabel}>Episódios</Text>
                  <Text style={styles.gridValue}>{character.episode.length}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>APARIÇÕES (ÚLTIMAS 10)</Text>
            {loadingEpisodes ? (
              <ActivityIndicator color="#97ce4c" style={{ marginTop: 10 }} />
            ) : (
              episodes.map((episode) => (
                <TouchableOpacity 
                  key={episode.id} 
                  style={styles.episodeCard}
                  onPress={() => router.push({
                    pathname: '/episode/[id]',
                    params: { id: episode.id }
                  })}
                >
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeCode}>{episode.episode}</Text>
                    <Text style={styles.episodeName} numberOfLines={1}>{episode.name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#444" />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
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
  backButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: width,
    height: width,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoContainer: {
    marginTop: -40,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  name: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#97ce4c',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  gridLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  gridValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  episodeCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  episodeInfo: {
    flex: 1,
    marginRight: 10,
  },
  episodeCode: {
    color: '#97ce4c',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  episodeName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  episodeDate: {
    color: '#888',
    fontSize: 12,
  },
});
