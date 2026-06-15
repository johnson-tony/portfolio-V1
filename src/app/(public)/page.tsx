import Hero from "@/components/home/Hero";
import Profile from "@/components/home/Profile";
import Projects from "@/components/home/Projects";
import Materials from "@/components/home/Materials";
import Contact from "@/components/home/Contact";
import Stats from "@/components/home/Stats";
import PageWrapper from "@/components/layout/PageWrapper";
import { getProjects, getProjectsCount } from "@/app/actions/projects";
import { getSettings } from "@/app/actions/settings";
import { getProfile } from "@/app/actions/profile";
import { getMaterials, getMaterialsCount } from "@/app/actions/materials";

export default async function Home() {
  const [projects, settings, profile, materials, projectsCount, materialsCount] = await Promise.all([
    getProjects(),
    getSettings(),
    getProfile(),
    getMaterials(),
    getProjectsCount(),
    getMaterialsCount(),
  ]);

  const hasProjects = projects && projects.length > 0;
  const hasMaterials = materials && materials.length > 0;
  const hasProfile = !!profile;

  return (
    <PageWrapper>
      <Hero 
        heading={settings?.heroHeading} 
        subheading={settings?.heroSubheading} 
      />
      
      {/* Dynamic Stats */}
      <Stats 
        projectsCount={projectsCount} 
        materialsCount={materialsCount} 
      />
      
      {hasProfile && <Profile data={profile} />}
      
      {hasProjects && <Projects initialProjects={projects} />}
      
      {hasMaterials && <Materials initialMaterials={materials} />}
      
      <Contact />
    </PageWrapper>
  );
}
