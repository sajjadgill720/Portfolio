import {cp,mkdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
console.log('Static portfolio built in dist/. Knowledge chat works on static hosting; AI requires the Node server.');
