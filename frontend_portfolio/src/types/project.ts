export type CategoryStyle = "primary" | "secondary" | "tertiary";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  categoryStyle: CategoryStyle;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  icon: string;
};
