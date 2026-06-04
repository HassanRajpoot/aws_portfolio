import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useContact() {
  return useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const { data } = await apiClient.post('/contact/', payload);
      return data;
    },
  });
}
