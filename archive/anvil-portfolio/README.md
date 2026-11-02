# Anvil portfolio (archived)

The original version of this portfolio, built on [Anvil](https://anvil.works/)
with the apps' Python server and a hand-written HTML form template. It is
archived here for history; nothing in this folder is part of the live site and
nothing is deployed from it.

```
anvil-portfolio/
├── anvil.yaml          app definition and metadata
├── .anvil_editor.yaml  Anvil editor state
├── __init__.py         Anvil package marker
├── client_code/        the page form template (all markup, CSS and JS inline)
├── server_code/        the contact-form mail sender
└── theme/              assets the Anvil app served: photos, résumé, podcast,
                        the original CTF pages
```

To run it as it was, create an Anvil app and upload this folder; the entry point
is the `Home_Page` form. It expects Anvil's mail integration for the contact
form, so `server_code/ServerModule1.py` will not send anything outside that
host.

The current site lives in the repository root. Most of what is here has been
carried over: the photography, the résumé, the podcast and the three CTF
challenges all exist again under `assets/` and `ctf/`, with the layouts rebuilt
from scratch.
