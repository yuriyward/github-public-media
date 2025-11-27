#!/usr/bin/env bun
import meow from 'meow';
import { globby } from 'globby';
import ora from 'ora';
import prompts from 'prompts';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const owner = 'yuriyward';
const repo = 'github-public-media';

function getBranch() {
  const res = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: resolve(__dirname, '..') });
  const out = res.stdout?.toString().trim();
  return out || 'main';
}

const cli = meow(
  `\nUsage\n  $ media-link [options]\n\nOptions\n  --type     Folder type to search (videos|images|audio|documents|misc|all)\n  --raw      Output raw.githubusercontent.com URL instead of GitHub blob\n  --branch   Git branch name (defaults to current)\n  --fzf      Use fzf for selection if available\n  --format   Output format: blob|raw|jsdelivr|pages (default: blob)\n\nExamples\n  $ media-link --type videos\n  $ media-link --type all --raw\n  $ media-link --fzf --type images\n  $ media-link --format jsdelivr\n`,
  {
    importMeta: import.meta,
    flags: {
      type: { type: 'string' },
      raw: { type: 'boolean', default: false },
      branch: { type: 'string', default: getBranch() },
      fzf: { type: 'boolean', default: false },
      format: { type: 'string' }
    }
  }
);

const patterns = {
  videos: ['videos/**/*'],
  images: ['images/**/*'],
  audio: ['audio/**/*'],
  documents: ['documents/**/*'],
  misc: ['misc/**/*'],
  all: ['{videos,images,audio,documents,misc}/**/*']
};

async function main() {
  // Step 1: pick folder type if not provided
  let folderType = cli.flags.type;
  if (!folderType) {
    const typeResp = await prompts({
      type: 'select',
      name: 'type',
      message: 'Choose folder',
      choices: [
        { title: 'videos', value: 'videos' },
        { title: 'images', value: 'images' },
        { title: 'audio', value: 'audio' },
        { title: 'documents', value: 'documents' },
        { title: 'misc', value: 'misc' },
        { title: 'all', value: 'all' }
      ],
      initial: 0
    });
    folderType = typeResp.type || 'all';
  }

  const spinner = ora(`Scanning files in ${folderType}...`).start();
  const files = (await globby(patterns[folderType], { onlyFiles: true })).sort();
  spinner.succeed(`Found ${files.length} files`);

  if (!files.length) {
    console.error('No files found.');
    process.exit(1);
  }

  let chosen;

  if (cli.flags.fzf) {
    const check = spawnSync('which', ['fzf']);
    if (check.status === 0) {
      const fzf = spawnSync('fzf', { input: files.join('\n') });
      chosen = fzf.stdout?.toString().trim();
    }
  }

  if (!chosen) {
    const response = await prompts({
      type: 'autocomplete',
      name: 'file',
      message: 'Select a file',
      choices: files.map(f => ({ title: f, value: f })),
      suggest: (input, choices) => {
        const q = (input || '').toLowerCase();
        return Promise.resolve(
          choices.filter(c => c.title.toLowerCase().includes(q)).slice(0, 100)
        );
      }
    });
    chosen = response.file;
  }

  if (!chosen) {
    console.error('No file selected.');
    process.exit(1);
  }

  const branch = cli.flags.branch || 'main';
  let format = cli.flags.format || (cli.flags.raw ? 'raw' : 'blob');
  if (!cli.flags.format) {
    const fmtResp = await prompts({
      type: 'select',
      name: 'format',
      message: 'Output link format',
      choices: [
        { title: 'GitHub blob (web UI)', value: 'blob' },
        { title: 'Raw content (direct file)', value: 'raw' },
        { title: 'jsDelivr CDN (recommended for embeds)', value: 'jsdelivr' },
        { title: 'GitHub Pages (requires Pages enabled)', value: 'pages' }
      ],
      initial: 2
    });
    format = fmtResp.format || format;
  }
  const path = encodeURI(chosen);

  let url;
  if (format === 'raw') {
    url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  } else if (format === 'jsdelivr') {
    url = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
  } else if (format === 'pages') {
    url = `https://${owner}.github.io/${repo}/${path}`;
  } else {
    url = `https://github.com/${owner}/${repo}/blob/${branch}/${path}`;
  }

  console.log(url);

  // Copy to clipboard (macOS)
  try {
    spawnSync('pbcopy', { input: url });
    console.log('✓ Copied to clipboard');
  } catch (err) {
    // pbcopy not available, skip
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
