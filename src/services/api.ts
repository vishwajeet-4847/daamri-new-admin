import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Property, Project, Activity } from '../types';
import { apiClient } from '../lib/apiClient';
import { showErrorToast, showSuccessToast } from '../lib/toastNotification';

// Helper to map MongoDB _id to frontend id
const mapId = (item: any) => ({ ...item, id: item._id || item.id });

// ---------------------------------------------------------
// Properties API Hooks
// ---------------------------------------------------------

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async (): Promise<Property[]> => {
      const response = await apiClient.get<{ success: boolean; data: any[] }>('/api/admin/properties');
      return response.data.map(mapId);
    },
  });
};

export const useProperty = (id: string | null) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: async (): Promise<Property> => {
      const response = await apiClient.get<{ success: boolean; data: any }>(`/api/admin/properties/${id}`);
      return mapId(response.data);
    },
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Property>) => {
      const response = await apiClient.post<{ success: boolean; data: any }>('/api/admin/properties', data);
      return mapId(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showSuccessToast('Property created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to create property';
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      const response = await apiClient.put<{ success: boolean; data: any }>(`/api/admin/properties/${id}`, data);
      return mapId(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
      showSuccessToast('Property updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to update property';
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdatePropertyMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await apiClient.patch<{ success: boolean; data: any }>(`/api/admin/properties/${id}/media`, formData);
      return mapId(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showSuccessToast('Media updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to update media';
      showErrorToast(errorMessage);
    },
  });
};

export const useTogglePropertyStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<{ success: boolean; data: any }>(`/api/admin/properties/${id}/toggle`);
      return mapId(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showSuccessToast('Property status updated!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to update property status';
      showErrorToast(errorMessage);
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/admin/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      showSuccessToast('Property deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to delete property';
      showErrorToast(errorMessage);
    },
  });
};

export const useDeletePropertyMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type, images }: { id: string; type: 'cover-image' | 'brochure' | 'gallery'; images?: string[] }) => {
      if (type === 'gallery') {
        await apiClient.delete(`/api/admin/properties/${id}/gallery`, { data: { images } });
      } else {
        await apiClient.delete(`/api/admin/properties/${id}/${type}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
      showSuccessToast('Media deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to delete media';
      showErrorToast(errorMessage);
    },
  });
};

// ---------------------------------------------------------
// Projects API Hooks
// ---------------------------------------------------------

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const response = await apiClient.get<{ success: boolean; data: any[] }>('/api/admin/projects');
      return response.data.map(mapId);
    },
  });
};

export const useProject = (id: string | null) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async (): Promise<Project> => {
      const response = await apiClient.get<{ success: boolean; data: any }>(`/api/admin/projects/${id}`);
      return mapId(response.data);
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const response = await apiClient.post<{ success: boolean; data: any }>('/api/admin/projects', data);
      return mapId(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showSuccessToast('Project created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to create project';
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      const response = await apiClient.put<{ success: boolean; data: any }>(`/api/admin/projects/${id}`, data);
      return mapId(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      showSuccessToast('Project updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to update project';
      showErrorToast(errorMessage);
    },
  });
};

export const useUpdateProjectMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await apiClient.patch<{ success: boolean; data: any }>(`/api/admin/projects/${id}/media`, formData);
      return mapId(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showSuccessToast('Project media updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to update project media';
      showErrorToast(errorMessage);
    },
  });
};

export const useToggleProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<{ success: boolean; data: any }>(`/api/admin/projects/${id}/toggle`);
      return mapId(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showSuccessToast('Project status updated!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to update project status';
      showErrorToast(errorMessage);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      showSuccessToast('Project deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to delete project';
      showErrorToast(errorMessage);
    },
  });
};

export const useDeleteProjectMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type, images }: { id: string; type: 'cover-image' | 'brochure' | 'gallery'; images?: string[] }) => {
      if (type === 'gallery') {
        await apiClient.delete(`/api/admin/projects/${id}/gallery`, { data: { images } });
      } else {
        await apiClient.delete(`/api/admin/projects/${id}/${type}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      showSuccessToast('Project media deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to delete project media';
      showErrorToast(errorMessage);
    },
  });
};

// ---------------------------------------------------------
// Activities API Hooks (Mocked for now as no API doc was provided)
// ---------------------------------------------------------

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'listing', title: 'Skyline Heights Listed', description: 'Added by Marcus Chen', time: '2 mins ago' },
  { id: '2', type: 'kyc', title: 'KYC Approved', description: 'Investor ID #84922 verified', time: '15 mins ago' },
  { id: '3', type: 'payment', title: 'Payment Received', description: 'Escrow release: $1,240,000', time: '1 hour ago' },
];

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async (): Promise<Activity[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return MOCK_ACTIVITIES;
    },
  });
};

// ---------------------------------------------------------
// Settings API Hooks
// ---------------------------------------------------------

import { AppSettings, DashboardStats } from '../types';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('/api/admin/dashboard-stats');
      return response.data;
    },
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<AppSettings> => {
      const response = await apiClient.get<{ success: boolean; data: AppSettings }>('/api/admin/settings');
      return response.data;
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AppSettings) => {
      const response = await apiClient.put<{ success: boolean; data: AppSettings }>('/api/admin/settings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const usePatchSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<AppSettings>) => {
      const response = await apiClient.patch<{ success: boolean; data: AppSettings }>('/api/admin/settings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useResetSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<{ success: boolean; data: AppSettings }>('/api/admin/settings');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// ---------------------------------------------------------
// Auth API Hooks
// ---------------------------------------------------------

export const useSendPasswordOtp = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/admin/auth/password/send-otp', { email });
      return response;
    },
    onSuccess: () => {
      showSuccessToast('OTP sent to your email!');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to send OTP';
      showErrorToast(errorMessage);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string; newPassword: string; otp: string }) => {
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/admin/auth/password/reset', data);
      return response;
    },
    onSuccess: () => {
      showSuccessToast('Password reset successfully! Please login with your new password.');
    },
    onError: (error: any) => {
      const errorMessage = error.data?.message || error.message || 'Failed to reset password';
      showErrorToast(errorMessage);
    },
  });
};
