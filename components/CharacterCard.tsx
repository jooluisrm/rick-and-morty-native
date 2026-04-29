import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Character } from '../types/character';
import { useRouter } from 'expo-router';

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: '/character/[id]',
        params: { id: character.id }
      })}
    >
      <Image source={{ uri: character.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={1}>{character.name}</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: character.status === 'Alive' ? '#55cc44' : character.status === 'Dead' ? '#d63d2e' : '#9e9e9e' }
          ]} />
          <Text style={styles.statusText}>{character.status} - {character.species}</Text>
        </View>
        
        <Text style={styles.label}>Última localização:</Text>
        <Text style={styles.value} numberOfLines={1}>{character.location.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3c3e44',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: 120,
    height: 120,
  },
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    color: '#9e9e9e',
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    color: '#f5f5f5',
    fontSize: 14,
  },
});
