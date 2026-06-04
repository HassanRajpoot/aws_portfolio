import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export interface BackendSkill {
  id: string;
  name: string;
  value_label: string | null;
  score: number | null;
  icon: string | null;
  sort_order: number;
}

export type SkillMeterType = { name: string; valueLabel: string; score: number };

export type SkillCategory = {
  id: string;
  title: string;
  icon: string;
  accent: "primary" | "secondary" | "tertiary";
  colSpan: string;
  meters: SkillMeterType[];
  chips?: string[];
};

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await apiClient.get<BackendSkill[]>('/skills/');
      return data.sort((a, b) => a.sort_order - b.sort_order);
    },
  });
}

// ---------------------------------------------------------------------------
// Skills Mutations
// ---------------------------------------------------------------------------
export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<BackendSkill, 'id'>) => {
      const { data } = await apiClient.post<BackendSkill>('/skills/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BackendSkill> }) => {
      const { data } = await apiClient.patch<BackendSkill>(`/skills/${id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/skills/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

