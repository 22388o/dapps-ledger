import { createSitemap } from '../seo/createSitemap';

export const loader = async () => {
  const content = await createSitemap();

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
