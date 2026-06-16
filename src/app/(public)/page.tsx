import Hero from "@/components/home/Hero";
import Profile from "@/components/home/Profile";
import Experience from "@/components/home/Experience";
import Projects from "@/components/home/Projects";
import Materials from "@/components/home/Materials";
import Contact from "@/components/home/Contact";
import PageWrapper from "@/components/layout/PageWrapper";
import { getProjects } from "@/app/actions/projects";
import { getSettings } from "@/app/actions/settings";
import { getProfile } from "@/app/actions/profile";
import { getMaterials } from "@/app/actions/materials";
import { getExperiences } from "@/app/actions/experience";

export default async function Home() {
  const [projects, settings, profile, materials, experiences] = await Promise.all([
    getProjects(),
    getSettings(),
    getProfile(),
    getMaterials(),
    getExperiences(),
  ]);

  const hasProjects = projects && projects.length > 0;
  const hasMaterials = materials && materials.length > 0;
  const hasProfile = !!profile;
  const hasExperience = experiences && experiences.length > 0;

  return (
    <PageWrapper>
      <Hero 
        heading={settings?.heroHeading} 
        subheading={settings?.heroSubheading} 
      />
      
      {hasProfile && <Profile data={profile} />}
      
      {hasExperience && <Experience data={experiences} />}
      
      {hasProjects && <Projects initialProjects={projects} />}
      
      {hasMaterials && <Materials initialMaterials={materials} />}
      
      <Contact />
    </PageWrapper>
  );
}
