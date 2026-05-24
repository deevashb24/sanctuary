import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://sanctuary.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/chat/', '/onboard/', '/insights/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
