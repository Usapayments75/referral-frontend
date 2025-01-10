import api from './axios';
import { Setting } from '../types';

export const settingsService = {
  async getAllSettings(): Promise<Setting[]> {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async createSetting(key: string, value: string): Promise<Setting> {
    const response = await api.post('/admin/settings', { key, value });
    return response.data;
  },

  async updateSetting(key: string, value: string): Promise<Setting> {
    const response = await api.put(`/admin/settings/${key}`, { value });
    return response.data;
  },

  async deleteSetting(key: string): Promise<void> {
    await api.delete(`/admin/settings/${key}`);
  }
};