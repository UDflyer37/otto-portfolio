# Otto Portfolio

My personal site: one hand-written page of HTML, CSS and JavaScript, plus a
capture-the-flag for anyone who wants to poke at it.

No framework, no build step, no dependencies. The site is the repository root.
The Anvil app this site grew out of is kept in [`archive/anvil-portfolio`](archive/anvil-portfolio)
for reference and is not deployed.

## Sections

- **About**: who I am, what I work on, and a few photographs.
- **Capabilities**: ten areas of work, from applied AI to leadership, each with a
  concrete example.
- **Work**: four projects in a deck you flip through. Each one opens a preview
  panel, and the projects that allow it are embedded live.
- **Career**: the roles, with dates, organisations and what I did in each.
- **Credentials**: clearance, education, certifications.
- **CTF**: three challenges built for this site, covering steganography, a cipher
  and a flag that is not where it looks.
- **Contact**: a short form that composes an email, plus the address to write to
  directly.

## Structure

```
index.html          the whole site
styles.css          design system, layout, motion
main.js             cursor, reveals, project deck, previews, form
vercel.json         caching headers
favicon.ico
assets/
├── img/            optimized .webp photography and project shots
│   └── brand/      signature logo and icon set
└── media/          résumé PDF and podcast audio
ctf/                three standalone challenges
archive/
└── anvil-portfolio/  the original Anvil build (not served)
```

## Running locally

```sh
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>. Any static server works; there is nothing to
install or compile.

## Editing

- Copy, roles and dates live directly in `index.html`.
- The Work section is a deck: each `<article class="project" data-card>` is a
  page. Add or remove one and the counter, arrows and flipping keep working. The
  photo, or the `Preview` button, opens the popout with that card's image, copy
  and link. Two optional attributes change how the popout behaves:
  - `data-live="https://…"` embeds that URL live in the panel instead of showing
    a still. Only works if the site allows framing; `theottoagency.com` sends
    `X-Frame-Options: DENY` and `frame-ancestors 'none'`, so its card has no
    `data-live` and falls back to the screenshot.
  - `data-device="phone"` wraps the live preview in a 390 × 844 phone frame for
    projects built for a phone.

  The popout's arrows (or ← →) step to the next project and move the deck with
  them.
- Colours, type scale and spacing are CSS custom properties at the top of
  `styles.css`.
- Every animation is disabled under `prefers-reduced-motion: reduce`, and the
  custom cursor only appears on fine-pointer devices.
- The contact form composes a `mailto:` message in the visitor's mail client.
  There is no server, so no API keys or secrets are involved. To send server-side
  later, add a `/api/contact` function and point the form at it.

## Brand mark

The logo is my hand-drawn signature. `assets/img/brand/` holds every cut of it:

| file | use |
| --- | --- |
| `signature-nav.webp` | ink, pre-boosted for the 112px nav mark (CSS `mask`) |
| `signature-ink.webp` | ink, the About sign-off (`<img>`) |
| `signature-paper-sm.webp` | paper, footer mark (`mask`) and CTF header (`<img>`) |
| `favicon-32/180/512.png`, `favicon.ico` | icons, cropped to the smiling **O** on an ink tile |

The nav and footer marks are `background-color` + `mask-image` rather than
images, so they inherit `--ink` / `--paper` and shift to clay and brass on
hover. Each asset is colourised from the source PNG's alpha channel, with a
gamma lift on the small sizes so the thin ink survives downscaling. Re-derive
every cut from the original PNG if the signature is ever redrawn.

## Deploying

Hosted on Vercel, connected to this repository's `master` branch. Because the
site is the repository root, the project needs no Root Directory override:
framework preset **Other**, no build command, output directory `.`. Pushes to
`master` deploy on their own.

`vercel.json` only adds a cache header for `/assets/*`; it is optional.

## Notes

- The CTF images and `morse.wav` are kept as the original files. At least one of
  them is a steganography puzzle, so its bytes are the challenge.
- The two embeddable projects load from their own deployments, so a slow Vercel
  cold start shows as a brief blank frame in the preview panel.

## Archive

`archive/anvil-portfolio/` is the original Anvil application: `anvil.yaml`, the
form markup in `client_code/`, the mail-sending server module in `server_code/`,
and the old `theme/` assets. It built the first version of this portfolio and is
kept for history only. Nothing in it is used by the site.

## License

MIT, see [LICENSE.txt](LICENSE.txt).

## Contact

[ottoa98@gmail.com](mailto:ottoa98@gmail.com)
