# alexander-t-otto.com — static site

The redesigned portfolio: a single hand-written page plus three CTF challenges.
No framework, no build step, no dependencies.

```
web/
├── index.html          # the whole site
├── styles.css          # design system, layout, motion
├── main.js             # cursor, reveals, project deck, form
├── vercel.json         # caching headers
├── favicon.ico
├── assets/
│   ├── img/            # optimized .webp photography + project shots
│   │   └── brand/      # signature logo + icon set
│   └── media/          # résumé PDF, AI-podcast mp3
└── ctf/                # three standalone challenges (kept byte-for-byte,
                        # only asset paths rewritten to be relative)
```

## Run locally

From this folder:

```sh
python3 -m http.server 8000
# → http://127.0.0.1:8000
```

Any static server works. There is nothing to install or compile.

## Deploy to Vercel

1. Import the repository in Vercel.
2. **Set Root Directory to `web`.** This is the only setting that matters; the
   repo root also contains the legacy Anvil project, which should not be served.
3. Framework preset: **Other**. Build command: none. Output directory: `.`
   (the default when no build step runs).

`vercel.json` only adds a cache header for `/assets/*`; it is optional.

## Editing

- Copy, roles, and dates live directly in `index.html`.
- The Work section is a deck: each `<article class="project" data-card>` is a page.
  Add or remove one and the counter, arrows, and flipping keep working. The photo,
  or the `Preview` button, opens the popout with that card's image, copy and link.
  Two optional attributes change how the popout behaves:
  - `data-live="https://…"` embeds that URL live in the panel instead of showing a
    still. Only works if the site allows framing; `theottoagency.com` sends
    `X-Frame-Options: DENY` and `frame-ancestors 'none'`, so its card has no
    `data-live` and falls back to the screenshot.
  - `data-device="phone"` wraps the live preview in a 390 × 844 phone frame for
    projects built for a phone.
  The popout's arrows (or ← →) step to the next project and move the deck with them.
- Colours, type scale, and spacing are CSS custom properties at the top of
  `styles.css`.
- Every animation is disabled automatically under
  `prefers-reduced-motion: reduce`; the custom cursor only appears on
  fine-pointer devices.
- The contact form composes a `mailto:` message in the visitor's mail client.
  There is no server, so no API keys or secrets are involved. To send server-side
  later, add a `/api/contact` function and point the form at it.

## Brand mark

The logo is Alex's hand-drawn signature (`Extended A Signature with Smiley O`).
`assets/img/brand/` holds every cut of it:

| file | use |
| --- | --- |
| `signature-nav.webp` | ink, pre-boosted for the 112px nav mark (CSS `mask`) |
| `signature-ink.webp` | ink, the About sign-off (`<img>`) |
| `signature-paper-sm.webp` | paper, footer mark (CSS `mask`) and CTF header (`<img>`) |
| `favicon-32/180/512.png`, `web/favicon.ico` | icons, cropped to the smiling **O** on an ink tile |

The nav and footer marks are `background-color` + `mask-image`, not images, so
they inherit `--ink` / `--paper` and shift to clay / brass on hover — no second
file, no recolouring. Each asset is colourised from the source PNG's alpha
channel, with a gamma lift on the small sizes so the thin ink survives
downscaling. Re-derive every cut from the original PNG if the signature is ever
redrawn.

## Notes

- The CTF pages are the original Anvil-hosted files with relative asset paths.
  Keep their images (`bennysteg.jpg`, `honeymoon.png`, `office.png`) and
  `morse.wav` as originals rather than re-compressing them: at least
  `bennysteg.jpg` is a steganography puzzle, so its bytes are the challenge.
