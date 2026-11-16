# OBE Studio — Website

One-page website for OBE Studio. Black background, silver/white/black palette.

## Files

| File | What it is |
| --- | --- |
| `index.html` | All page content (text, links, sections) |
| `styles.css` | Colours, fonts, layout. Colours are at the top under `:root` |
| `assets/logo.png` | OBE logo (silver, transparent background) |
| `assets/images/` | Put your photos here |
| `assets/videos/` | Put your videos here |

Open `index.html` in any browser to view it. No build step needed.

## Adding photos

Find a placeholder in `index.html`:

```html
<div class="media media--photo"><span>Photo — add later</span></div>
```

Replace it with:

```html
<img class="media" src="assets/images/your-photo.jpg" alt="Describe the photo">
```

## Adding videos

Replace a video placeholder:

```html
<div class="media media--video"><span>Video 01 — add later</span></div>
```

with a file:

```html
<video class="media" src="assets/videos/your-video.mp4" controls playsinline></video>
```

or a YouTube embed:

```html
<iframe class="media" style="aspect-ratio:16/9;border:0" src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
```

## Other things to update

- Social links in the footer (`href="#"` for Instagram, YouTube, LinkedIn)
- "Project name" and "Video title" captions
- Privacy policy and terms links

## Contact details used

- Phone: 93216 08240
- Email: obestudio.info@gmail.com
