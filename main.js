/* =========================================================
   Alexander T. Otto — portfolio interactions
   Vanilla JS. No dependencies.
   ========================================================= */
(() => {
  "use strict";

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /* ---------------------------------------------------------
     scroll progress
     --------------------------------------------------------- */
  const progressBar = document.querySelector("[data-progress]");
  const nav = document.querySelector("[data-nav]");
  let scrollQueued = false;

  function onScrollFrame() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.setProperty("--p", pct + "%");
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 40);
    scrollQueued = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(onScrollFrame);
    },
    { passive: true }
  );
  onScrollFrame();

  /* ---------------------------------------------------------
     custom cursor
     --------------------------------------------------------- */
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector("[data-cursor-dot]");
  const cursorRing = document.querySelector("[data-cursor-ring]");
  const cursorLabel = document.querySelector("[data-cursor-label]");

  if (cursor && cursorDot && cursorRing && finePointer.matches && !reducedMotion.matches) {
    document.body.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let visible = false;

    window.addEventListener(
      "pointermove",
      (e) => {
        pos.x = e.clientX;
        pos.y = e.clientY;
        if (!visible) {
          visible = true;
          cursor.style.opacity = "1";
        }
      },
      { passive: true }
    );

    document.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      visible = false;
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      visible = true;
    });

    const HOVERABLE = "a, button, [data-cursor], input, textarea, summary";

    function setCursorState(target) {
      const hit = target.closest(HOVERABLE);
      if (!hit) {
        cursor.classList.remove("is-active", "is-hover");
        cursorLabel.textContent = "";
        return;
      }
      const label = hit.getAttribute("data-cursor");
      if (label) {
        cursor.classList.add("is-active");
        cursor.classList.remove("is-hover");
        cursorLabel.textContent = label;
      } else {
        cursor.classList.remove("is-active");
        cursor.classList.add("is-hover");
        cursorLabel.textContent = "";
      }
    }

    document.addEventListener("pointerover", (e) => setCursorState(e.target), { passive: true });

    (function loop() {
      pos.x = clamp(pos.x, 0, window.innerWidth);
      pos.y = clamp(pos.y, 0, window.innerHeight);
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      cursorDot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------------------------------------------------
     magnetic buttons
     --------------------------------------------------------- */
  if (finePointer.matches && !reducedMotion.matches) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      let raf = null;
      let tx = 0;
      let ty = 0;

      const apply = () => {
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        raf = null;
      };

      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 14;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 10;
        if (!raf) raf = requestAnimationFrame(apply);
      });

      el.addEventListener("pointerleave", () => {
        tx = 0;
        ty = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      });
    });
  }

  /* ---------------------------------------------------------
     mobile menu
     --------------------------------------------------------- */
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");

  if (menu && menuToggle) {
    const setMenu = (open) => {
      menuToggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        menu.querySelector("a")?.focus({ preventScroll: true });
      } else {
        menuToggle.focus({ preventScroll: true });
      }
    };

    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ---------------------------------------------------------
     reveal on scroll
     --------------------------------------------------------- */
  const revealables = Array.from(document.querySelectorAll("[data-reveal]"));

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const siblings = Array.from(el.parentElement?.children || []).filter((n) =>
            n.hasAttribute?.("data-reveal")
          );
          const idx = Math.max(0, siblings.indexOf(el));
          el.style.setProperty("--d", Math.min(idx * 0.07, 0.35) + "s");
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------------------------------------------------------
     stat counters
     --------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    const target = parseFloat(el.dataset.count || "0");
    const suffix = el.dataset.suffix || "";
    const decimals = String(el.dataset.count).includes(".") ? 1 : 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent =
        value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window && !reducedMotion.matches) {
      const co = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            co.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((c) => co.observe(c));
    }
  }

  /* ---------------------------------------------------------
     skills: hover reveal + preview panel
     --------------------------------------------------------- */
  const skills = Array.from(document.querySelectorAll("[data-skill]"));
  const previewNum = document.querySelector("[data-preview-num]");
  const previewName = document.querySelector("[data-preview-name]");
  const previewTag = document.querySelector("[data-preview-tag]");
  const previewBlob = document.querySelector("[data-preview-blob]");
  const previewPalette = ["#b0522c", "#c2a15e", "#7a5230", "#9c4726", "#4f5b45"];

  function openSkill(skill) {
    skills.forEach((s) => {
      const isTarget = s === skill;
      s.classList.toggle("is-open", isTarget);
      s.querySelector(".skill__head")?.setAttribute("aria-expanded", String(isTarget));
    });

    if (previewNum) previewNum.textContent = skill.dataset.num || "";
    if (previewName) previewName.textContent = skill.dataset.name || "";
    if (previewTag) previewTag.textContent = skill.dataset.tag || "";
    if (previewBlob) {
      const i = skills.indexOf(skill);
      previewBlob.style.setProperty("--pv", previewPalette[i % previewPalette.length]);
    }
  }

  skills.forEach((skill) => {
    const head = skill.querySelector(".skill__head");

    head?.addEventListener("click", () => {
      const isOpen = skill.classList.contains("is-open");
      if (isOpen) {
        skill.classList.remove("is-open");
        head.setAttribute("aria-expanded", "false");
      } else {
        openSkill(skill);
      }
    });

    if (finePointer.matches) {
      skill.addEventListener("pointerenter", () => openSkill(skill));
    }
  });

  // seed the preview panel with the first skill
  if (skills.length) {
    if (previewNum) previewNum.textContent = skills[0].dataset.num || "";
    if (previewName) previewName.textContent = skills[0].dataset.name || "";
    if (previewTag) previewTag.textContent = skills[0].dataset.tag || "";
  }

  /* ---------------------------------------------------------
     draggable galleries
     --------------------------------------------------------- */
  function makeDraggable(track, onScroll) {
    if (!track) return;
    let down = false;
    let captured = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;

    // A native image drag hijacks the gesture, so the strip can't be dragged from a
    // photo without this. `draggable="false"` + `-webkit-user-drag` cover it too.
    track.addEventListener("dragstart", (e) => e.preventDefault());

    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      captured = false;
      moved = 0;
      startX = e.clientX;
      startLeft = track.scrollLeft;
    });

    track.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));

      // Capture only once this is a real drag. Capturing on pointerdown makes the
      // browser retarget the follow-up click to the track, so links inside never fire.
      if (!captured) {
        if (Math.abs(dx) < 8) return;
        captured = true;
        track.classList.add("is-dragging");
        try {
          track.setPointerCapture?.(e.pointerId);
        } catch {
          /* capture is a nicety, not a requirement */
        }
      }

      track.scrollLeft = startLeft - dx;
      onScroll?.();
    });

    const end = (e) => {
      if (!down) return;
      const dragged = moved > 8;
      down = false;
      captured = false;
      track.classList.remove("is-dragging");
      if (track.hasPointerCapture?.(e.pointerId)) track.releasePointerCapture(e.pointerId);

      // Proximity snap pulls a free drag back to the nearest card the moment you let go,
      // which reads as the strip fighting the pointer. Hand-dragged means free movement.
      if (dragged) track.style.scrollSnapType = "none";
    };

    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    track.addEventListener("pointerleave", (e) => {
      if (down && e.pointerType === "mouse") end(e);
    });

    // a drag shouldn't fire the link underneath it
    track.addEventListener(
      "click",
      (e) => {
        if (moved > 8) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const step = track.querySelector(":scope > *")?.getBoundingClientRect().width || 320;
        track.scrollBy({ left: e.key === "ArrowRight" ? step + 24 : -(step + 24), behavior: "smooth" });
      }
    });
  }

  // photography strip
  makeDraggable(document.querySelector("[data-gallery-track]"));

  /* ---------------------------------------------------------
     work deck: tap or drag a page to flip through the stack
     --------------------------------------------------------- */
  const deck = document.querySelector("[data-deck]");
  const deckCards = deck ? Array.from(deck.querySelectorAll("[data-card]")) : [];
  const workBar = document.querySelector("[data-work-bar]");
  const workCurrent = document.querySelector("[data-work-current]");
  const workPrev = document.querySelector("[data-work-prev]");
  const workNext = document.querySelector("[data-work-next]");

  // filled in by the deck and popout blocks below so they can drive each other
  let deckGoTo = null;
  let openProjectPreview = null;

  if (deck && deckCards.length) {
    const total = deckCards.length;
    let current = 0;
    let turning = false;

    deckGoTo = (index) => {
      if (turning) return;
      current = (index + total) % total;
      layout();
    };

    function sizeDeck() {
      let max = 0;
      deckCards.forEach((card) => {
        max = Math.max(max, card.offsetHeight);
      });
      // leave room for the pages peeking out beneath the top card
      if (max) deck.style.setProperty("--deck-h", Math.ceil(max + 62) + "px");
    }

    function layout() {
      deckCards.forEach((card, idx) => {
        const order = (idx - current + total) % total;
        card.style.setProperty("--i", order);
        card.classList.toggle("is-top", order === 0);
        card.setAttribute("aria-hidden", order === 0 ? "false" : "true");
        if (order === 0) card.removeAttribute("inert");
        else card.setAttribute("inert", "");
      });
      if (workCurrent) workCurrent.textContent = String(current + 1).padStart(2, "0");
      if (workBar) workBar.style.setProperty("--w", ((current + 1) / total) * 100 + "%");
    }

    function turn(dir) {
      if (turning || total < 2) return;
      turning = true;

      if (dir > 0) {
        const out = deckCards[current];
        out.classList.add("is-out");
        window.setTimeout(() => {
          current = (current + 1) % total;
          layout();
        }, 260);
        window.setTimeout(() => {
          out.classList.add("is-snap");
          out.classList.remove("is-out");
          requestAnimationFrame(() => out.classList.remove("is-snap"));
          turning = false;
        }, 880);
      } else {
        current = (current - 1 + total) % total;
        const incoming = deckCards[current];
        incoming.classList.add("is-snap", "is-out");
        layout();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            incoming.classList.remove("is-snap");
            incoming.classList.remove("is-out");
          });
        });
        window.setTimeout(() => {
          turning = false;
        }, 880);
      }
    }

    /* drag a page */
    let drag = null;

    deck.addEventListener("pointerdown", (e) => {
      if (turning) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest("a, button")) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, active: false };
    });

    deck.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;

      if (!drag.active) {
        if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
        drag.active = true;
        deck.classList.add("is-dragging");
        deckCards[current].classList.add("is-snap");
        try {
          deck.setPointerCapture?.(e.pointerId);
        } catch {
          /* capture is a nicety, not a requirement */
        }
      }

      drag.dx = dx;
      const rot = clamp(-dx * 0.05, -16, 16);
      deckCards[current].style.transform =
        `translate3d(${dx}px, ${dx * 0.02}px, 34px) rotateY(${rot}deg) rotate(${dx * 0.008}deg)`;
    });

    const endDrag = (e) => {
      if (!drag) return;
      const { active, dx } = drag;
      const id = drag.id;
      drag = null;
      if (deck.hasPointerCapture?.(id)) deck.releasePointerCapture(id);
      deck.classList.remove("is-dragging");
      if (!active) return;

      const card = deckCards[current];
      card.classList.remove("is-snap");
      card.style.transform = "";
      if (Math.abs(dx) > 90) turn(dx < 0 ? 1 : -1);
    };

    deck.addEventListener("pointerup", endDrag);
    deck.addEventListener("pointercancel", endDrag);

    /* tap a photo to open its preview; the one card without one still flips */
    deck.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      const media = e.target.closest("[data-flip]");
      if (!media) return;
      const card = media.closest("[data-card]");
      if (card && card.querySelector("[data-preview]") && openProjectPreview) {
        openProjectPreview(card);
      } else {
        turn(1);
      }
    });

    deck.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        turn(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        turn(-1);
      }
    });

    workPrev?.addEventListener("click", () => turn(-1));
    workNext?.addEventListener("click", () => turn(1));

    layout();
    sizeDeck();
    window.addEventListener("resize", sizeDeck);
    window.addEventListener("load", sizeDeck);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeDeck);
    deck.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", sizeDeck, { once: true });
    });
  }

  /* ---------------------------------------------------------
     marquee: duplicate content for a seamless loop
     --------------------------------------------------------- */
  const marquee = document.querySelector("[data-marquee]");
  if (marquee) marquee.innerHTML += marquee.innerHTML;

  /* ---------------------------------------------------------
     active nav link
     --------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll(".nav__links a"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const seen = new Map();
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        let bestId = null;
        let best = 0;
        seen.forEach((ratio, id) => {
          if (ratio > best) {
            best = ratio;
            bestId = id;
          }
        });
        navLinks.forEach((a) => {
          a.classList.toggle("is-current", best > 0.05 && a.getAttribute("href") === "#" + bestId);
        });
      },
      { threshold: [0, 0.15, 0.35, 0.6], rootMargin: "-20% 0px -40% 0px" }
    );
    sections.forEach((s) => so.observe(s));
  }

  /* ---------------------------------------------------------
     copy email
     --------------------------------------------------------- */
  const emailLink = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");

  if (emailLink) {
    emailLink.addEventListener("click", async (e) => {
      const email = "ottoa98@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        e.preventDefault();
        if (copyStatus) copyStatus.textContent = "Copied: " + email;
        window.setTimeout(() => {
          if (copyStatus) copyStatus.textContent = "";
        }, 3200);
      } catch {
        // clipboard blocked: let the mailto: link do its job
        if (copyStatus) copyStatus.textContent = "Opening your mail app…";
      }
    });
  }

  /* ---------------------------------------------------------
     local time in Sunbury
     --------------------------------------------------------- */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => {
      clock.textContent = fmt.format(new Date());
    };
    tick();
    window.setInterval(tick, 30000);
  }

  /* ---------------------------------------------------------
     contact form → email client
     --------------------------------------------------------- */
  const form = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");

  if (form) {
    const fields = Array.from(form.querySelectorAll("input, textarea"));

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

    const validate = (field) => {
      let ok = field.value.trim().length > 0;
      if (ok && field.type === "email") ok = isEmail(field.value.trim());
      field.closest(".field")?.classList.toggle("has-error", !ok);
      field.setAttribute("aria-invalid", String(!ok));
      return ok;
    };

    fields.forEach((f) => {
      f.addEventListener("input", () => {
        if (f.closest(".field")?.classList.contains("has-error")) validate(f);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = fields.map(validate);
      const firstBad = fields[results.indexOf(false)];
      if (firstBad) {
        firstBad.focus();
        if (formStatus) formStatus.textContent = "A couple of fields still need filling in.";
        return;
      }

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value.trim();

      const subject = `Portfolio enquiry from ${name}`;
      const body =
        `${message}\n\n${name}\n${email}`;
      const href =
        `mailto:ottoa98@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formStatus) {
        formStatus.textContent = "Opening your email client with the message ready to send…";
      }
      window.location.href = href;
    });
  }

  /* ---------------------------------------------------------
     hero parallax (blobs + title drift)
     --------------------------------------------------------- */
  if (!reducedMotion.matches && finePointer.matches) {
    const blobs = Array.from(document.querySelectorAll("[data-blob]"));
    const hero = document.querySelector("[data-hero]");
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    if (hero && blobs.length) {
      hero.addEventListener(
        "pointermove",
        (e) => {
          const r = hero.getBoundingClientRect();
          targetX = (e.clientX - r.left) / r.width - 0.5;
          targetY = (e.clientY - r.top) / r.height - 0.5;
        },
        { passive: true }
      );

      const drift = () => {
        curX += (targetX - curX) * 0.05;
        curY += (targetY - curY) * 0.05;
        blobs.forEach((b, i) => {
          const depth = (i + 1) * 12;
          b.style.marginLeft = curX * depth + "px";
          b.style.marginTop = curY * depth + "px";
        });
        requestAnimationFrame(drift);
      };
      requestAnimationFrame(drift);
    }
  }

  /* ---------------------------------------------------------
     project preview popout
     --------------------------------------------------------- */
  const popoutEl = document.querySelector("[data-popout]");

  if (popoutEl) {
    const shot = popoutEl.querySelector("[data-popout-img]");
    const titleEl = popoutEl.querySelector("[data-popout-title]");
    const tagEl = popoutEl.querySelector("[data-popout-tag]");
    const descEl = popoutEl.querySelector("[data-popout-desc]");
    const openLink = popoutEl.querySelector("[data-popout-open]");
    const closeBtn = popoutEl.querySelector(".popout__close");
    const stage = popoutEl.querySelector("[data-popout-stage]");
    const frame = popoutEl.querySelector("[data-popout-frame]");
    const hint = popoutEl.querySelector("[data-popout-hint]");
    const reloadBtn = popoutEl.querySelector("[data-popout-reload]");
    const prevBtn = popoutEl.querySelector("[data-popout-prev]");
    const nextBtn = popoutEl.querySelector("[data-popout-next]");
    let lastFocus = null;
    let closeTimer = 0;
    let frameUrl = "";
    let currentCard = null;
    let cursorWasOn = false;

    // the custom cursor cannot follow the pointer into an iframe, so hand the
    // cursor back to the system while the panel is open
    const parkCursor = () => {
      cursorWasOn = document.body.classList.contains("has-cursor");
      if (cursorWasOn) document.body.classList.remove("has-cursor");
    };
    const restoreCursor = () => {
      if (cursorWasOn) document.body.classList.add("has-cursor");
      cursorWasOn = false;
    };

    const stopFrame = () => {
      stage.classList.remove("is-ready");
      if (!frame) return;
      frameUrl = "";
      frame.hidden = true;
      frame.removeAttribute("src");
    };

    const startFrame = (url, title) => {
      if (!frame || !url) return;
      stage.classList.remove("is-ready");
      // drop the old page at once: a frame keeps painting its previous site
      // until the next one commits, which looks like the wrong project
      frame.style.transition = "none";
      frame.style.opacity = "0";
      frameUrl = url;
      frame.hidden = false;
      frame.title = title + " live preview";
      if (frame.getAttribute("src") === url) {
        // same address again: bounce through about:blank so the page reloads
        frame.src = "about:blank";
        requestAnimationFrame(() => { frame.src = url; });
      } else {
        frame.src = url;
      }
    };

    if (frame) {
      frame.addEventListener("load", () => {
        // ignore the about:blank step used to force a fresh load
        if (!frameUrl || frame.getAttribute("src") !== frameUrl) return;
        stage.classList.add("is-ready");
        requestAnimationFrame(() => {
          frame.style.transition = "";
          frame.style.opacity = "";
        });
      });
    }

    // the phone frame is a fixed 390x844; scale it to whatever room the panel has
    const fitPhone = () => {
      if (!stage.classList.contains("is-phone")) return;
      const pad = 26;
      const scale = Math.min(
        (stage.clientWidth - pad * 2) / 390,
        (stage.clientHeight - pad * 2) / 844,
        1
      );
      stage.style.setProperty("--phone-scale", Math.max(0.35, scale).toFixed(3));
    };
    window.addEventListener("resize", fitPhone);

    const openPopout = (card) => {
      const visit = card.querySelector('.project__acts a[href^="http"]');
      if (!visit) return;
      const href = visit.getAttribute("href");
      if (!href || !/^https?:/i.test(href)) return;

      const img = card.querySelector(".project__media img");
      const desc = card.querySelector(".project__desc");
      const title = (card.querySelector("h3") || {}).textContent?.trim() || "Project";
      const live = card.getAttribute("data-live");
      const isPhone = card.getAttribute("data-device") === "phone";
      currentCard = card;

      const wasOpen = popoutEl.classList.contains("is-open");
      window.clearTimeout(closeTimer);
      if (!wasOpen) {
        lastFocus = document.activeElement;
        parkCursor();
      }
      titleEl.textContent = title;
      tagEl.textContent = (card.querySelector(".project__tag") || {}).textContent?.trim() || "";
      descEl.textContent = desc ? desc.textContent.replace(/\s+/g, " ").trim() : "";
      openLink.href = href;
      if (img) {
        shot.src = img.currentSrc || img.src;
        shot.alt = img.alt || title + " preview";
      }

      stage.classList.toggle("is-phone", isPhone);
      popoutEl.classList.toggle("is-phone", isPhone);

      if (live) {
        startFrame(live, title);
        if (reloadBtn) reloadBtn.hidden = false;
        if (hint) {
          hint.hidden = false;
          hint.textContent = "Loading live preview…";
        }
      } else {
        stopFrame();
        if (reloadBtn) reloadBtn.hidden = true;
        if (hint) hint.hidden = true;
      }

      popoutEl.hidden = false;
      document.body.classList.add("is-popout");
      document.documentElement.classList.add("is-popout");
      requestAnimationFrame(() => {
        popoutEl.classList.add("is-open");
        fitPhone();
        if (!wasOpen) closeBtn.focus();
      });
    };

    const closePopout = () => {
      restoreCursor();
      popoutEl.classList.remove("is-open");
      document.body.classList.remove("is-popout");
      document.documentElement.classList.remove("is-popout");
      stopFrame();
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(
        () => { popoutEl.hidden = true; },
        reducedMotion.matches ? 0 : 440
      );
      // the card we came from may have been shuffled back into the deck
      let back = lastFocus;
      if (!back || !back.focus || back.closest("[inert]")) {
        back = document.querySelector(".project.is-top [data-preview]");
      }
      if (back && back.focus) back.focus();
    };

    if (reloadBtn) {
      reloadBtn.addEventListener("click", () => {
        if (frameUrl) startFrame(frameUrl, titleEl.textContent);
      });
    }

    // move to the next project without leaving the preview
    const stepProject = (dir) => {
      const all = Array.from(document.querySelectorAll("[data-card]"));
      const previewable = all.filter((c) => c.querySelector(".project__acts a[href^=\"http\"]"));
      if (previewable.length < 2 || !currentCard) return;
      const at = previewable.indexOf(currentCard);
      if (at < 0) return;
      const next = previewable[(at + dir + previewable.length) % previewable.length];
      if (deckGoTo) deckGoTo(all.indexOf(next));
      openPopout(next);
    };

    if (prevBtn) prevBtn.addEventListener("click", () => stepProject(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => stepProject(1));

    openProjectPreview = openPopout;

    document.querySelectorAll(".project [data-preview]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = btn.closest(".project");
        if (!card) return;
        e.preventDefault();
        openPopout(card);
      });
    });

    popoutEl.querySelectorAll("[data-popout-close]").forEach((el) => {
      el.addEventListener("click", closePopout);
    });

    document.addEventListener("keydown", (e) => {
      if (popoutEl.hidden) return;
      if (e.key === "Escape") {
        closePopout();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepProject(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepProject(1);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        popoutEl.querySelectorAll("a[href], button")
      ).filter((n) => n.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
})();
