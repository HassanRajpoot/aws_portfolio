import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface BackendExperience {
  id: string;
  company_name: string;
  role_title: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  employment_type: string | null;
  description: string | null;
  sort_order: number;
}

export interface BackendEducation {
  id: string;
  institution: string;
  degree: string;
  start_date: string | null;
  end_date: string | null;
  details: string | null;
  sort_order: number;
}

export function useExperience() {
  return useQuery({
    queryKey: ['resume-experience'],
    queryFn: async () => {
      const { data } = await apiClient.get<BackendExperience[]>('/resume/experience/');
      return data.sort((a, b) => a.sort_order - b.sort_order);
    },
  });
}

export function useEducation() {
  return useQuery({
    queryKey: ['resume-education'],
    queryFn: async () => {
      const { data } = await apiClient.get<BackendEducation[]>('/resume/education/');
      return data.sort((a, b) => a.sort_order - b.sort_order);
    },
  });
}

// ---------------------------------------------------------------------------
// Experience Mutations
// ---------------------------------------------------------------------------
export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<BackendExperience, 'id'>) => {
      const { data } = await apiClient.post<BackendExperience>('/resume/experience/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-experience'] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BackendExperience> }) => {
      const { data } = await apiClient.patch<BackendExperience>(`/resume/experience/${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-experience'] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/resume/experience/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-experience'] });
    },
  });
}

// ---------------------------------------------------------------------------
// Education Mutations
// ---------------------------------------------------------------------------
export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<BackendEducation, 'id'>) => {
      const { data } = await apiClient.post<BackendEducation>('/resume/education/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-education'] });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BackendEducation> }) => {
      const { data } = await apiClient.patch<BackendEducation>(`/resume/education/${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-education'] });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/resume/education/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-education'] });
    },
  });
}


// ---------------------------------------------------------------------------
// Certification Types & Hooks
// ---------------------------------------------------------------------------
export interface BackendCertification {
  id: string;
  title: string;
  icon: string;
  meta: string | null;
  sort_order: number;
}

export function useCertifications() {
  return useQuery({
    queryKey: ['resume-certifications'],
    queryFn: async () => {
      const { data } = await apiClient.get<BackendCertification[]>('/resume/certification/');
      return data.sort((a, b) => a.sort_order - b.sort_order);
    },
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<BackendCertification, 'id'>) => {
      const { data } = await apiClient.post<BackendCertification>('/resume/certification/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-certifications'] });
    },
  });
}

export function useUpdateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BackendCertification> }) => {
      const { data } = await apiClient.patch<BackendCertification>(`/resume/certification/${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-certifications'] });
    },
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/resume/certification/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-certifications'] });
    },
  });
}


