import Hero from "@/components/home/Hero";
import Profile from "@/components/home/Profile";
import Projects from "@/components/home/Projects";
import Materials from "@/components/home/Materials";
import Contact from "@/components/home/Contact";
import Stats from "@/components/home/Stats";
import PageWrapper from "@/components/layout/PageWrapper";
import { getProjects } from "@/app/actions/projects";
import { getSettings } from "@/app/actions/settings";
import { getProfile } from "@/app/actions/profile";
import { getMaterials } from "@/app/actions/materials";

export default async function Home() {
  const [projects, settings, profile, materials] = await Promise.all([
    getProjects(),
    getSettings(),
    getProfile(),
    getMaterials(),
  ]);

  return (
    <PageWrapper>
      <Hero 
        heading={settings?.heroHeading} 
        subheading={settings?.heroSubheading} 
      />
      <Stats />
      <Profile data={profile} />
      <Projects initialProjects={projects} />
      <Materials initialMaterials={materials} />
      <Contact />
    </PageWrapper>
  );
}
