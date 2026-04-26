import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://gazzali-perfumes.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://gazzali-perfumes.vercel.app/shop',
      lastModified: new Date(),
    },
  ]
}
