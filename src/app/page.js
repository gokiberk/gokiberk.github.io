import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: {
    absolute: "Gökberk Keskinkılıç — Software Engineer, Traveller, Photographer",
  },
  description:
    "Personal website of Gökberk (Goki) Keskinkılıç. Writing, projects, photography and travel notes from Turkey, Europe and Brazil.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Gökberk Keskinkılıç — Software Engineer, Traveller, Photographer",
    description:
      "Personal website of Gökberk (Goki) Keskinkılıç. Writing, projects, photography and travel notes from Turkey, Europe and Brazil.",
    url: "https://gokiberk.com/",
    images: ["/img/og-gokiberk.webp"],
  },
};

export default function Page() {
  return <HomeClient />;
}
