# Public Media Repository

A public repository for hosting media files (images, videos, documents) that can be embedded in applications via GitHub's raw content URLs.

## Usage

All media files are organized by type in their respective directories. To use any file in your applications:

### Getting the Direct Link

For any file in this repository, use the GitHub raw content URL format:

```
https://raw.githubusercontent.com/YOUR_USERNAME/github-public-media/main/PATH_TO_FILE
```

**Example:**
```
https://raw.githubusercontent.com/YOUR_USERNAME/github-public-media/main/images/logo.png
```

### Directory Structure

```
.
├── images/          # Image files (PNG, JPG, SVG, etc.)
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
