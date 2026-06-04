import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Project } from "@/types/project";

// Backend project type based on Django model
export interface BackendProject {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  summary: string;
  media_assets: string[];
  cover_image: string | null;
  body_markdown: string | null;
  status: string;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORY_STYLES: Array<Project["categoryStyle"]> = [
  "primary",
  "secondary",
  "tertiary",
];

function mapBackendProject(p: BackendProject, index: number): Project {
  let coverUrl = p.cover_image ?? p.media_assets?.[0] ?? "";
  
  // If the path is relative (local media folder fallback), prepend the backend base host URL
  if (coverUrl && coverUrl.startsWith("/")) {
    coverUrl = `http://localhost:8000${coverUrl}`;
  }

  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.category ?? "",
    description: p.summary,
    category: p.category ?? "Uncategorized",
    categoryStyle: CATEGORY_STYLES[index % 3],
    tags: [],
    imageSrc: coverUrl,
    imageAlt: p.title,
    icon: "open_in_new",
  };
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data } = await apiClient.get<BackendProject[]>("/projects/");
      return data.map(mapBackendProject);
    },
  });
}

// Raw projects query (not mapped) for admin views
export function useRawProjects() {
  return useQuery({
    queryKey: ["raw-projects"],
    queryFn: async (): Promise<BackendProject[]> => {
      const { data } = await apiClient.get<BackendProject[]>("/projects/");
      return data;
    },
  });
}

export function useProject(slug?: string) {
  return useQuery({
    queryKey: ["projects", slug],
    queryFn: async (): Promise<Project | null> => {
      if (!slug) return null;
      // Use the slug-based endpoint for efficient single-project fetch
      try {
        const { data } = await apiClient.get<BackendProject>(
          `/projects/by-slug/${slug}/`,
        );
        return mapBackendProject(data, 0);
      } catch {
        return null;
      }
    },
    enabled: !!slug,
  });
}

// Raw project query by ID/slug for admin editors
export function useRawProject(idOrSlug?: string) {
  return useQuery({
    queryKey: ["raw-project", idOrSlug],
    queryFn: async (): Promise<BackendProject | null> => {
      if (!idOrSlug) return null;
      try {
        // First try fetching by ID, fallback to slug-based endpoint if it doesn't match UUID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        const url = isUuid ? `/projects/${idOrSlug}/` : `/projects/by-slug/${idOrSlug}/`;
        const { data } = await apiClient.get<BackendProject>(url);
        return data;
      } catch {
        return null;
      }
    },
    enabled: !!idOrSlug,
  });
}

// ---------------------------------------------------------------------------
// Projects Mutations
// ---------------------------------------------------------------------------
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<BackendProject, 'id' | 'created_at' | 'updated_at'>) => {
      const { data } = await apiClient.post<BackendProject>('/projects/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['raw-projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BackendProject> }) => {
      const { data } = await apiClient.patch<BackendProject>(`/projects/${id}/`, payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['raw-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.slug] });
      queryClient.invalidateQueries({ queryKey: ['raw-project', data.id] });
      queryClient.invalidateQueries({ queryKey: ['raw-project', data.slug] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['raw-projects'] });
    },
  });
}

