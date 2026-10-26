import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import chat from '../api/chat.js';

function response() {
  return {
    statusCode: 200,
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test('Vercel chat handles parsed bodies, malformed JSON, and size limits', async () => {
  const cases = [
    [{messages: [{role: 'user', content: 'Tell me about GymRetain'}]}, 200],
    ['{', 400], ['null', 400],
    [{messages: [{role: 'user', content: 'x'.repeat(25000)}]}, 413]
  ];
  for (const [body, expected] of cases) {
    const res = response();
    await chat({method: 'POST', headers: {'content-type': 'application/json'}, body}, res);
    assert.equal(res.statusCode, expected);
    if (expected === 200) assert.match(res.body.text, /GymRetain/);
  }
});

test('static build removes stale entrypoints and ships every local HTML/module reference', async () => {
  const root = new URL('../', import.meta.url);
  const build = () => execFileSync(process.execPath, ['scripts/build.js'], {cwd: root});
  build();
  await writeFile(new URL('dist/app.js', root), 'stale entrypoint');
  build();
  const files = await readdir(new URL('dist/', root), {recursive: true});
  assert.ok(files.includes('index.html'));
  assert.ok(!files.includes('app.js'));
  assert.ok(!files.includes('brief.js'));
  for (const filename of files.filter(name => /\.(html|js)$/.test(name))) {
    const url = new URL(`dist/${filename}`, root);
    const source = await readFile(url, 'utf8');
    const references = filename.endsWith('.html')
      ? [...source.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)]
      : [...source.matchAll(/(?:from\s*|import\s*)['"](\.\/[^'"]+)['"]/g)];
    for (const [, reference] of references) {
      await assert.doesNotReject(readFile(new URL(reference, url)), `${filename}: missing ${reference}`);
    }
  }
  const config = JSON.parse(await readFile(new URL('vercel.json', root), 'utf8'));
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'dist');
});
