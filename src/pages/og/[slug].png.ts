import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

async function fetchFont(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Outfit:wght@${weight}`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } }
  ).then((r) => r.text());

  const urlMatch = css.match(/src: url\(([^)]+)\)/);
  if (!urlMatch) throw new Error(`Could not find font URL for Outfit:${weight}`);

  return fetch(urlMatch[1]).then((r) => r.arrayBuffer());
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const { title, tags, date } = post.data;

  const [fontNormal, fontBold] = await Promise.all([
    fetchFont(400),
    fetchFont(700),
  ]);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fontSize = title.length > 55 ? 48 : title.length > 35 ? 58 : 68;
  const visibleTags = (tags as string[]).slice(0, 3);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
        },
        children: [
          // Top: branding
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#CFFF04',
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontFamily: 'Outfit',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#CFFF04',
                      letterSpacing: '3px',
                    },
                    children: 'KOMODO LABS',
                  },
                },
              ],
            },
          },
          // Middle: accent bar + title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '24px',
                flexGrow: 1,
                paddingTop: '48px',
                paddingBottom: '48px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '4px',
                      alignSelf: 'stretch',
                      background: '#CFFF04',
                      borderRadius: '2px',
                      flexShrink: 0,
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontFamily: 'Outfit',
                      fontWeight: 700,
                      fontSize: `${fontSize}px`,
                      color: '#ffffff',
                      letterSpacing: '-2px',
                      lineHeight: 1.1,
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Bottom: tags + date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '8px',
                    },
                    children: visibleTags.map((tag: string) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'Outfit',
                          fontWeight: 400,
                          fontSize: '13px',
                          color: '#525252',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          borderColor: '#222222',
                          borderRadius: '5px',
                          paddingTop: '5px',
                          paddingBottom: '5px',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontFamily: 'Outfit',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#525252',
                    },
                    children: formattedDate,
                  },
                },
              ],
            },
          },
          // Neon bottom strip
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '0px',
                left: '0px',
                width: '1200px',
                height: '4px',
                background: '#CFFF04',
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Outfit', data: fontNormal, weight: 400 },
        { name: 'Outfit', data: fontBold, weight: 700 },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
