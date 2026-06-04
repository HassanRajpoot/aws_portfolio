import { ContactCtaSection } from "@/components/portfolio/ContactCtaSection";
import { FeaturedProjectsSection } from "@/components/portfolio/FeaturedProjectsSection";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ResumePreviewSection } from "@/components/portfolio/ResumePreviewSection";
import { SkillStackSection } from "@/components/portfolio/SkillStackSection";

export function HomePage() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturedProjectsSection />
      <SkillStackSection />
      <ResumePreviewSection />
      <ContactCtaSection />
    </main>
  );
}
