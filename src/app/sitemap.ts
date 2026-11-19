import type { MetadataRoute } from "next";
import { SUBCONTINENT_ROUTES } from "@/lib/data/subcontinent-routes";

const STATIC_UPDATED = "2026-11-19T00:00:00.000Z";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://desiroute.in",
      lastModified: STATIC_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://desiroute.in/articles",
      lastModified: STATIC_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://desiroute.in/help",
      lastModified: STATIC_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://desiroute.in/about",
      lastModified: STATIC_UPDATED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const routeGuidePages: MetadataRoute.Sitemap = SUBCONTINENT_ROUTES.map((route) => ({
    url: `https://desiroute.in/routes/${route.slug}`,
    lastModified: STATIC_UPDATED,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...routeGuidePages];
}
