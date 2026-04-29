import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchFilterProps {
  placeholder: string;
  onFilterChange: (name: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ placeholder, onFilterChange }) => {
  const [text, setText] = useState('');

  const handleChange = (val: string) => {
    setText(val);
    onFilterChange(val);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          value={text}
          onChangeText={handleChange}
        />
        {text.length > 0 && (
          <TouchableOpacity onPress={() => handleChange('')}>
            <Ionicons name="close-circle" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0C0C0C',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
});
