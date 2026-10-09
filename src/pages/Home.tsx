import HeroSection from '@/components/sections/HeroSection';
import BeginningSection from '@/components/sections/BeginningSection';
import ExplorationSection from '@/components/sections/ExplorationSection';
import BuilderSection from '@/components/sections/BuilderSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import UniverseSection from '@/components/sections/UniverseSection';
import ChallengesSection from '@/components/sections/ChallengesSection';
import PresentSection from '@/components/sections/PresentSection';
import NextChapterSection from '@/components/sections/NextChapterSection';

/**
 * The journey, in order. Each section owns its own scene and choreography; the only
 * things they share are the content files, the terrain generator and the scroll helpers.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <BeginningSection />
      <ExplorationSection />
      <BuilderSection />
      <ProjectsSection />
      <UniverseSection />
      <ChallengesSection />
      <PresentSection />
      <NextChapterSection />
    </>
  );
}
