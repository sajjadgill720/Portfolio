import {cp, mkdir, rm} from 'node:fs/promises';

// Resolve from this file so the build is independent of the caller's directory.
const source = new URL('../public/', import.meta.url);
const output = new URL('../dist/', import.meta.url);
// Only remove the fixed, generated output directory; never the source tree.
await rm(output, {recursive: true, force: true});
await mkdir(output, {recursive: true});
await cp(source, output, {recursive: true});
console.log('Static portfolio built in dist/.');
