import ProjectsClient from "@/components/ProjectsClient";

export const metadata = {
  title: "Projects",
  description:
    "Selected projects by Gökberk Keskinkılıç — including the Transkriptor and SoCoolBus landing pages.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Gökberk Keskinkılıç",
    description:
      "Selected projects by Gökberk Keskinkılıç — including the Transkriptor and SoCoolBus landing pages.",
    url: "https://gokiberk.com/projects",
    images: ["/img/og-gokiberk.webp"],
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
