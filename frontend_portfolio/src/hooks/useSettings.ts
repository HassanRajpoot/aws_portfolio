import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface SocialLink {
  platform: string;
  url: string;
  [key: string]: unknown;
}

export interface BackendSettings {
  id?: number;
  site_title: string;
  site_subtitle: string;
  about_me: string;
  social_links: SocialLink[];
  contact_email: string;
  logo: string | null;
  favicon: string | null;
  header_image: string | null;
  footer_image: string | null;
  is_maintenance_mode: boolean;
}

/**
 * Public settings — hits the unauthenticated endpoint.
 * Use this on public pages (ContactPage, footer, etc.).
 */
export function usePublicSettings() {
  return useQuery<BackendSettings | null>({
    queryKey: ["public-settings"],
    queryFn: async (): Promise<BackendSettings | null> => {
      const { data } = await apiClient.get<BackendSettings>(
        "/public-settings/",
      );
      return data;
    },
  });
}

/**
 * Admin settings — hits the authenticated endpoint.
 * Use this on admin pages only.
 */
export function useSettings() {
  return useQuery<BackendSettings | null>({
    queryKey: ["settings"],
    queryFn: async (): Promise<BackendSettings | null> => {
      const { data } = await apiClient.get<BackendSettings | BackendSettings[]>(
        "/settings/",
      );
      if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : null;
      }
      return data;
    },
  });
}

/**
 * Mutation to update admin settings via PATCH.
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<BackendSettings>) => {
      const { data } = await apiClient.patch<BackendSettings>(
        "/settings/",
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["public-settings"] });
    },
  });
}
