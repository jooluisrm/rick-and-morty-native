import api from './api';
import { Episode, EpisodeResponse, EpisodeFilter } from '../types/episode';

export const getEpisodes = async (
  page: number = 1, 
  filter: EpisodeFilter = {}
): Promise<EpisodeResponse> => {
  const response = await api.get<EpisodeResponse>(`/episode`, {
    params: { page, ...filter },
  });
  return response.data;
};

export const getEpisodeById = async (id: number): Promise<Episode> => {
  const response = await api.get<Episode>(`/episode/${id}`);
  return response.data;
};

export const getEpisodesByIds = async (ids: number[]): Promise<Episode[]> => {
  if (ids.length === 0) return [];
  const response = await api.get<Episode | Episode[]>(`/episode/${ids.join(',')}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};
