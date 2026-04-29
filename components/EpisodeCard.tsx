import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Episode } from '../types/episode';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface EpisodeCardProps {
  episode: Episode;
}

export const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: '/episode/[id]',
        params: { id: episode.id }
      })}
    >
      <View style={styles.codeContainer}>
        <Text style={styles.code}>{episode.episode}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{episode.name}</Text>
        <Text style={styles.date}>{episode.air_date}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  codeContainer: {
    backgroundColor: '#97ce4c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  code: {
    color: '#0C0C0C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    color: '#888',
    fontSize: 12,
  },
});
