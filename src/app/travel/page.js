import TravelClient from "@/components/TravelClient";

export const metadata = {
  title: "Travel",
  description:
    "Travel notes and adventures by Gökberk Keskinkılıç across Turkey, Europe and beyond.",
  alternates: { canonical: "/travel" },
  openGraph: {
    title: "Travel | Gökberk Keskinkılıç",
    description:
      "Travel notes and adventures by Gökberk Keskinkılıç across Turkey, Europe and beyond.",
    url: "https://gokiberk.com/travel",
    images: ["/img/og-gokiberk.webp"],
  },
};

export default function TravelPage() {
  return <TravelClient />;
}
