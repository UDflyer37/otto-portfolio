# Otto Portfolio

My personal site: one hand-written page of HTML, CSS and JavaScript, plus a
capture-the-flag for anyone who wants to poke at it.

The site is the [`web/`](web) folder. The repository root still holds the original
Anvil application it grew out of. That version is kept for reference and is not
deployed.

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

## Running locally

```sh
cd web
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>. There is nothing to install or compile, and any
static server works.

## Deploying

The site is hosted on Vercel:

1. Import this repository.
2. Set **Root Directory** to `web`.
3. Framework preset **Other**, no build command, output directory `.`.

`web/vercel.json` adds a long cache header for `/assets/*`.

## Structure

```
web/
├── index.html      the whole site
├── styles.css      layout, type and motion
├── main.js         navigation, project deck, previews, form
├── vercel.json
├── assets/         photography, brand marks, résumé, podcast
└── ctf/            three standalone challenge pages
```

How the work deck and the preview panels are put together is documented in
[web/README.md](web/README.md).

## Notes

- The CTF images and `morse.wav` are kept as the original files. At least one of
  them is a steganography puzzle, so its bytes are the challenge.
- `theottoagency.com` refuses to be framed (`X-Frame-Options: DENY`), so that
  project shows a still rather than a live embed.

## License

MIT, see [LICENSE.txt](LICENSE.txt).

## Contact

[ottoa98@gmail.com](mailto:ottoa98@gmail.com)
