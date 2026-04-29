import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Text } from 'react-native';
import { CharacterFilter } from '../types/character';
import { Ionicons } from '@expo/vector-icons';

interface FilterHeaderProps {
  onFilterChange: (filter: CharacterFilter) => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({ onFilterChange }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<CharacterFilter['status']>('');

  const statuses: { label: string; value: CharacterFilter['status'] }[] = [
    { label: 'Todos', value: '' },
    { label: 'Vivo', value: 'alive' },
    { label: 'Morto', value: 'dead' },
    { label: 'Desconhecido', value: 'unknown' },
  ];

  const handleSearch = () => {
    onFilterChange({ name, status });
  };

  const handleStatusChange = (newStatus: CharacterFilter['status']) => {
    setStatus(newStatus);
    onFilterChange({ name, status: newStatus });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar personagem..."
          placeholderTextColor="#9E9E9E"
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {name.length > 0 && (
          <TouchableOpacity onPress={() => { setName(''); onFilterChange({ name: '', status }); }}>
            <Ionicons name="close-circle" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.statusList}
        contentContainerStyle={styles.statusListContent}
      >
        {statuses.map((item) => (
          <TouchableOpacity
            key={item.value || 'all'}
            style={[
              styles.statusChip,
              status === item.value && styles.statusChipActive
            ]}
            onPress={() => handleStatusChange(item.value)}
          >
            <Text style={[
              styles.statusLabel,
              status === item.value && styles.statusLabelActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    backgroundColor: '#0C0C0C',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  statusList: {
    paddingLeft: 16,
  },
  statusListContent: {
    paddingRight: 32,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  statusChipActive: {
    backgroundColor: '#97ce4c',
    borderColor: '#97ce4c',
  },
  statusLabel: {
    color: '#9E9E9E',
    fontSize: 14,
    fontWeight: '600',
  },
  statusLabelActive: {
    color: '#0C0C0C',
  },
});
