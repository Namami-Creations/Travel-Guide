import type { MetadataRoute } from "next";

const STATIC_UPDATED = "2026-11-12T00:00:00.000Z";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
}
