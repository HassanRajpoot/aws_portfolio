import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source_page: string | null;
  status: string;
  created_at: string;
}

export function useContactInquiries() {
  return useQuery<ContactInquiry[]>({
    queryKey: ["contact-inquiries"],
    queryFn: async (): Promise<ContactInquiry[]> => {
      const { data } = await apiClient.get<ContactInquiry[]>("/contact/inquiries/");
      return data;
    },
  });
}
