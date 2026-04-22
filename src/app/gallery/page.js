import GalleryClient from "@/components/GalleryClient";

export const metadata = {
  title: "Gallery",
  description:
    "Photo gallery by Gökberk Keskinkılıç — portraits, travel moments, and everyday life.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Gökberk Keskinkılıç",
    description:
      "Photo gallery by Gökberk Keskinkılıç — portraits, travel moments, and everyday life.",
    url: "https://gokiberk.com/gallery",
    images: ["/img/og-gokiberk.webp"],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
