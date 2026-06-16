import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProjects } from "@/app/actions/projects";
import { getProfile } from "@/app/actions/profile";
import { getMaterials } from "@/app/actions/materials";
import { getExperiences } from "@/app/actions/experience";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, profile, materials, experiences] = await Promise.all([
    getProjects(),
    getProfile(),
    getMaterials(),
    getExperiences(),
  ]);

  const navLinks = [];
  
  if (profile) {
    navLinks.push({ name: "Profile", href: "/#profile" });
  }
  
  if (experiences && experiences.length > 0) {
    navLinks.push({ name: "Experience", href: "/#experience" });
  }
  
  if (projects && projects.length > 0) {
    navLinks.push({ name: "Projects", href: "/#projects" });
  }
  
  if (materials && materials.length > 0) {
    navLinks.push({ name: "Materials", href: "/#materials" });
  }
  
  // Contact is always present
  navLinks.push({ name: "Contact", href: "/#contact" });

  return (
    <>
      <Navbar links={navLinks} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
