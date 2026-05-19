import Hero from "@/components/home/Hero";
import Profile from "@/components/home/Profile";
import Projects from "@/components/home/Projects";
import Materials from "@/components/home/Materials";
import Contact from "@/components/home/Contact";
import PageWrapper from "@/components/layout/PageWrapper";
import { getProjects } from "@/app/actions/projects";

export default async function Home() {
  const projects = await getProjects();

  return (
    <PageWrapper>
      <Hero />
      <Profile />
      <Projects initialProjects={projects} />
      <Materials />
      <Contact />
    </PageWrapper>
  );
}
