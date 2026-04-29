import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LocationDetail } from '../types/location';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface LocationCardProps {
  location: LocationDetail;
}

export const LocationCard = ({ location }: LocationCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: '/location/[id]',
        params: { id: location.id }
      })}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="planet-outline" size={24} color="#97ce4c" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{location.name}</Text>
        <Text style={styles.type}>{location.type} • {location.dimension}</Text>
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(151, 206, 76, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  type: {
    color: '#888',
    fontSize: 12,
  },
});
