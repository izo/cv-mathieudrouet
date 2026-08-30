#!/usr/bin/env node
/**
 * Content Change Detection Script
 * Watches for changes in CV content during build and updates cache
 */

import { watch, statSync } from 'fs';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
// Une source par langue — voir src/config/i18n.ts. Une traduction modifiée
// seule doit être détectée comme un changement de contenu.
const contentPaths = [
  join(projectRoot, 'src/content/cv/cv.md'),
  join(projectRoot, 'src/content/cv/en/cv.md'),
];
const [contentPath] = contentPaths;
const cacheFile = join(projectRoot, '.content-cache.json');

// Load or create cache
function loadCache() {
  if (existsSync(cacheFile)) {
    try {
      return JSON.parse(readFileSync(cacheFile, 'utf8'));
    } catch (error) {
      console.warn('Failed to load content cache:', error.message);
    }
  }
  return { files: {} };
}

// Save cache
function saveCache(cache) {
  try {
    writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.warn('Failed to save content cache:', error.message);
  }
}

// Generate content hash
function getContentHash(content) {
  return createHash('sha256').update(content).digest('hex');
}

// Check for changes
function checkContentChanges() {
  const cache = loadCache();
  // Un cache au format d'avant l'anglais n'a pas de `files` : tout est vu
  // comme nouveau une fois, puis le format courant prend le relais.
  const previous = cache.files || {};
  const current = {};
  let hasChanged = false;

  for (const path of contentPaths) {
    if (!existsSync(path)) {
      console.warn('CV content file not found:', path);
      continue;
    }

    const hash = getContentHash(readFileSync(path, 'utf8'));
    const modified = statSync(path).mtime.toISOString();
    const key = path.slice(projectRoot.length + 1);
    current[key] = { hash, modified };

    const before = previous[key];
    if (!before || before.hash !== hash || before.modified !== modified) {
      hasChanged = true;
      console.log(`📝 CV content changes detected — ${key}`);
      console.log(`   Hash: ${before?.hash ?? null} → ${hash}`);
      console.log(`   Modified: ${before?.modified ?? null} → ${modified}`);
    }
  }

  if (hasChanged) {
    saveCache({ files: current });
  }

  return hasChanged;
}

// Watch mode
function watchContent() {
  console.log('👀 Watching CV content for changes...');

  // Initial check
  checkContentChanges();

  // Watch for file changes — une langue par fichier surveillé
  for (const path of contentPaths) {
    if (!existsSync(path)) continue;
    watch(path, (eventType, _filename) => {
      if (eventType === 'change') {
        setTimeout(() => {
          if (checkContentChanges()) {
            console.log('🔄 Content updated - build will pick up changes');
          }
        }, 100); // Debounce
      }
    });
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'check':
    const changed = checkContentChanges();
    if (changed) {
      console.log('✅ Content cache updated');
    } else {
      console.log('✅ No content changes detected');
    }
    process.exit(0); // Always exit successfully for build
    
  case 'watch':
    watchContent();
    break;
    
  default:
    console.log('Usage:');
    console.log('  node scripts/watch-content.js check   # Check for changes once');
    console.log('  node scripts/watch-content.js watch   # Watch for changes continuously');
    process.exit(1);
}