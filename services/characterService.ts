import api from './api';
import { CharacterResponse, Character, CharacterFilter } from '../types/character';

export const getCharacters = async (
  page: number = 1, 
  filter: CharacterFilter = {}
): Promise<CharacterResponse> => {
  const response = await api.get<CharacterResponse>(`/character`, {
    params: { page, ...filter },
  });
  return response.data;
};

export const getCharacterById = async (id: number): Promise<Character> => {
  const response = await api.get<Character>(`/character/${id}`);
  return response.data;
};

export const getCharactersByIds = async (ids: number[]): Promise<Character[]> => {
  if (ids.length === 0) return [];
  const response = await api.get<Character | Character[]>(`/character/${ids.join(',')}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};
