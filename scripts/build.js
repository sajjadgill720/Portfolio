import {cp, mkdir, writeFile} from 'node:fs/promises';

// Build for local dist
await mkdir('dist', {recursive: true});
await cp('public', 'dist', {recursive: true});

// Build for Vercel Build Output API v3 (Edge Static CDN)
await mkdir('.vercel/output/static', {recursive: true});
await cp('public', '.vercel/output/static', {recursive: true});
await writeFile(
  '.vercel/output/config.json',
  JSON.stringify({
    version: 3,
    routes: [
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/index.html' }
    ]
  }, null, 2)
);

console.log('Static portfolio built in dist/ and .vercel/output/static. Ready for Vercel deployment.');
