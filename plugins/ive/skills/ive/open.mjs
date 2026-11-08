#!/usr/bin/env node
// Opens the person kit pulled into a folder, without copying anything there: Ive's own editor
// (Ive's template pages, KitMake and its canvas) where the Ive plugin carries it, at `editor/`
// beside `skills/`; otherwise this skill's playground. The page and its scripts are served from
// there, and everything else (kit.json, brand.json, brand.css, people.json, ive.json, the fonts
// and pictures) from the folder the kit was pulled into, so the page reads them as its
// neighbours.
//
//   node open.mjs [folder] [--port 4870] [--no-open] [--playground]
//
// It serves on this computer only (127.0.0.1), only files inside the two folders, and only to a
// page of its own address. The editor's Save writes kit.json in the folder and nothing else;
// nothing reaches Ive until /ive:save sends it. Stop it with Ctrl+C.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const skill = dirname(fileURLToPath(import.meta.url));
const playground = join(skill, 'playground');
// The editor, where the plugin (or the plain zip) carries it: `editor/` beside `skills/`.
const built = resolve(skill, '../../editor');
const args = process.argv.slice(2);
const flag = (name) => {
  const at = args.indexOf(name);
  return at < 0 ? undefined : (args[at + 1] ?? '');
};
const folder = resolve(args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--port') ?? '.');
const port = Number(flag('--port') ?? 0);
const editor =
  !args.includes('--playground') && existsSync(join(built, 'index.html')) ? built : null;
const page = editor ?? playground;
/** The most kit.json may be, written from the editor. */
const KIT_MOST = 4 * 1024 * 1024;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

/** The file a path names inside a folder, or null when it is outside it or not a file. */
function inside(root, path) {
  const at = normalize(join(root, path));
  if (at !== root && !at.startsWith(root + sep)) return null;
  return existsSync(at) && statSync(at).isFile() ? at : null;
}

if (!existsSync(join(folder, 'kit.json'))) {
  console.error(
    `There is no kit.json in ${folder}. Pull the kit first (/ive:pull, or as the brand-toolkit guide of the ive skill says).`,
  );
  process.exit(1);
}

function said(response, status, words) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(words);
}

/** Writes kit.json in the folder, whole, from what the editor sent: one JSON object. */
function keepKit(request, response) {
  const chunks = [];
  let size = 0;
  request.on('data', (chunk) => {
    size += chunk.length;
    if (size > KIT_MOST) {
      said(response, 413, 'That is larger than a kit.json the editor writes.');
      request.destroy();
      return;
    }
    chunks.push(chunk);
  });
  request.on('end', () => {
    if (response.writableEnded) return;
    let kit;
    try {
      kit = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return said(response, 400, 'That is not JSON.');
    }
    if (!kit || typeof kit !== 'object' || Array.isArray(kit)) {
      return said(response, 400, 'kit.json is one object: its card, banners and signatures.');
    }
    // Written beside it, then put in its place, so kit.json is never half written.
    const at = join(folder, 'kit.json');
    writeFileSync(`${at}.saving`, `${JSON.stringify(kit, null, 2)}\n`);
    renameSync(`${at}.saving`, at);
    response.writeHead(204, { 'Cache-Control': 'no-store' });
    response.end();
  });
}

const server = createServer((request, response) => {
  const address = server.address();
  const own = typeof address === 'object' && address ? address.port : port;
  // This address only, never a name made to point here; and only this page writes, never
  // another site the browser has open (whose reads the browser keeps from it in any case).
  const host = request.headers.host ?? '';
  if (host !== `127.0.0.1:${own}` && host !== `localhost:${own}`) {
    return said(response, 403, 'Not for this page.');
  }
  const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  if (request.method === 'PUT' && path === '/kit.json' && editor) {
    if (request.headers.origin !== `http://${host}`)
      return said(response, 403, 'Not for this page.');
    if (!(request.headers['content-type'] ?? '').startsWith('application/json')) {
      return said(response, 415, 'kit.json is written as JSON.');
    }
    return keepKit(request, response);
  }
  const asked = path === '/' ? '/index.html' : path;
  // The page's own files first, so a stale copy in the folder never stands in for them.
  const file = inside(page, asked) ?? inside(folder, asked);
  if (!file || (request.method !== 'GET' && request.method !== 'HEAD')) {
    return said(response, 404, 'Not here.');
  }
  response.writeHead(200, {
    'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(request.method === 'HEAD' ? undefined : readFileSync(file));
});

server.listen(port, '127.0.0.1', () => {
  const address = server.address();
  const url = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : port}/`;
  console.log(
    `${editor ? 'The editor' : 'The playground'} is open at ${url} on the kit in ${folder}. Ctrl+C stops it.`,
  );
  if (args.includes('--no-open')) return;
  const [command, ...rest] =
    process.platform === 'darwin'
      ? ['open', url]
      : process.platform === 'win32'
        ? ['cmd', '/c', 'start', '', url]
        : ['xdg-open', url];
  spawn(command, rest, { stdio: 'ignore', detached: true })
    .on('error', () => {})
    .unref();
});
