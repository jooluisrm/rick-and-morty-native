import api from './api';
import { LocationDetail, LocationResponse, LocationFilter } from '../types/location';

export const getLocations = async (
  page: number = 1, 
  filter: LocationFilter = {}
): Promise<LocationResponse> => {
  const response = await api.get<LocationResponse>(`/location`, {
    params: { page, ...filter },
  });
  return response.data;
};

export const getLocationById = async (id: number): Promise<LocationDetail> => {
  const response = await api.get<LocationDetail>(`/location/${id}`);
  return response.data;
};

export const getLocationsByIds = async (ids: number[]): Promise<LocationDetail[]> => {
  if (ids.length === 0) return [];
  const response = await api.get<LocationDetail | LocationDetail[]>(`/location/${ids.join(',')}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};
