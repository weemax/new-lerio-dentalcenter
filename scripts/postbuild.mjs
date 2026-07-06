#!/usr/bin/env node
/**
 * postbuild.mjs — Generates static HTML files for each service route.
 *
 * After `vite build` produces dist/index.html (SPA shell), this script
 * copies it to dist/services/<slug>/index.html for each service slug.
 * This makes service article URLs like /services/general-family-dentistry
 * return real HTML on any static host, satisfying Google's crawl requirements.
 *
 * Run automatically via: npm run build
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { articles } from '../src/data/articles/index.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Slugs must match src/data/content.ts slugs
const SLUGS = Object.keys(articles);

// Read the built index.html to use as the base for each route
const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

for (const slug of SLUGS) {
  const dir = join(distDir, 'services', slug);
  mkdirSync(dir, { recursive: true });

  const article = articles[slug];
  if (!article) {
    console.warn(`[postbuild] No article found for slug: ${slug}`);
    continue;
  }

  const pageHtml = baseHtml
    // Set page title from article data
    .replace(
      /<title>.*<\/title>/,
      `<title>${article.title} — Lerio Dental Center</title>`
    )
    // Update og:title from article data
    .replace(
      /<meta property="og:title" content="[^"]*"(\s*\/)?>/,
      `<meta property="og:title" content="${article.title} — Lerio Dental Center" />`
    )
    // Set meta description from article data
    .replace(
      /<meta name="description" content="[^"]*"(\s*\/)?>/,
      `<meta name="description" content="${article.metaDescription}" />`
    )
    // Add canonical URL
    .replace(
      '</head>',
      `  <link rel="canonical" href="https://www.leriodentalcenter.com/services/${slug}" />\n</head>`
    );

  writeFileSync(join(dir, 'index.html'), pageHtml, 'utf-8');
  console.log(`[postbuild] Created dist/services/${slug}/index.html`);
}

// Copy robots.txt to /services/ too so sub-routes are crawlable
const robotsSrc = join(distDir, 'robots.txt');
if (existsSync(robotsSrc)) {
  for (const slug of SLUGS) {
    cpSync(robotsSrc, join(distDir, 'services', slug, 'robots.txt'));
  }
  console.log('[postbuild] Copied robots.txt to each service route');
}

// Generate sitemap.xml with all service routes
const BASE_URL = 'https://www.leriodentalcenter.com';
const today = new Date().toISOString().split('T')[0];

const sitemapUrls = [
  { loc: BASE_URL + '/', changefreq: 'daily', priority: '1.0' },
  { loc: BASE_URL + '/design', changefreq: 'monthly', priority: '0.3' },
  ...SLUGS.map((slug) => ({
    loc: `${BASE_URL}/services/${slug}`,
    changefreq: 'weekly',
    priority: '0.7',
  })),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`[postbuild] Generated dist/sitemap.xml with ${sitemapUrls.length} URLs`);

console.log('[postbuild] Done.');
