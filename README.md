# Public Media Repository

A public repository for hosting media files (images, videos, documents) that can be embedded in applications via GitHub's raw content URLs.

## Usage

All media files are organized by type in their respective directories. To use any file in your applications:

### Getting the Direct Link

For any file in this repository, use the GitHub raw content URL format:

```
## Media Link CLI (Bun)

- Purpose: interactively select a file from `videos/`, `images/`, `audio/`, `documents/`, or `misc/` and print a GitHub link (blob or raw).

### Install & Setup
- Prereqs: Bun installed (macOS zsh)

```zsh
cd /Users/ward/repo/github-public-media
bun install
bun link   # makes `media-link` available globally from this repo
```

### Usage
```zsh
# Interactive flow: pick folder → file → format
bun run media-link

# Directly target a folder
bun run media-link --type videos

# All folders, output raw URL
bun run media-link --type all --raw

# Use fzf if installed (brew install fzf)
bun run media-link --fzf --type images
```

- Flags:
	- `--type`: videos|images|audio|documents|misc|all (default: all)
	- `--raw`: output `raw.githubusercontent.com` URL
	- `--branch`: override branch (defaults to current git branch)
	- `--fzf`: use `fzf` for selection if available
	- `--format`: choose `blob|raw|jsdelivr|pages` (if omitted, you’ll be asked interactively)

### Notes
- URLs are composed as:
	- Blob: `https://github.com/yuriyward/github-public-media/blob/<branch>/<path>`
	- Raw: `https://raw.githubusercontent.com/yuriyward/github-public-media/<branch>/<path>`
- Paths are `encodeURI`-encoded to handle spaces and special chars.
https://raw.githubusercontent.com/YOUR_USERNAME/github-public-media/main/PATH_TO_FILE
```

**Example:**
```
https://raw.githubusercontent.com/YOUR_USERNAME/github-public-media/main/images/logo.png
```

### Directory Structure
├── videos/          # Video files (MP4, WebM, etc.)
├── documents/       # PDF and document files
├── audio/           # Audio files (MP3, WAV, etc.)
└── misc/            # Other media types
```

## Adding Media

1. Add your file to the appropriate directory
2. Commit and push to GitHub
3. Use the raw GitHub URL in your applications

## Notes

- This repository is public - do not upload sensitive or private content
- Consider file sizes - GitHub has repository size limits
- For large files or many files, consider using Git LFS (Large File Storage)
- File URLs are cached by GitHub's CDN for better performance
