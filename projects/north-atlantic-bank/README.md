# North Atlantic Bank — interactive iPhone Duo prototype

Dependency-free static prototype for portfolio embedding. No build command, backend, proprietary Apple assets, or external network requests are required.

## Preview

Open `index.html` through a static server. From the repository root:

```sh
python3 -m http.server 4173
```

Then visit:

```text
http://localhost:4173/projects/north-atlantic-bank/
```

## Portfolio iframe

If this directory sits at `projects/north-atlantic-bank/` in the portfolio repository:

```html
<section class="case-study-prototype" aria-labelledby="nab-prototype-title">
  <h2 id="nab-prototype-title">Try the North Atlantic Bank prototype</h2>
  <iframe
    src="projects/north-atlantic-bank/index.html"
    title="Interactive North Atlantic Bank iPhone Duo prototype"
    loading="lazy"
    allow="clipboard-write"
    style="display:block;width:100%;height:min(800px,92vh);min-height:620px;border:0;border-radius:24px;overflow:hidden"
  ></iframe>
</section>
```

For a page one directory below the portfolio root, use `../projects/north-atlantic-bank/index.html` instead.

The prototype is a separate document, so its CSS cannot modify the parent portfolio and parent CSS cannot leak into it.

## Controls

- Closed: 466 × 678 simulated screen
- Open: 890 × 626 simulated screen with adaptive sidebar
- Split: 890 × 626 contextual master/detail screen
- Light/Dark appearance setting under More → Settings (Light is the default)
- Restart demo
- Rotate control: cycles 0°, 90°, 180°, 260°, and 270° using the same responsive components
- Left Arrow: back
- R: rotate
- Command/Ctrl + K: global search

Device-state changes preserve the current route and selected banking content.
Split mode adds a narrow top-left rail containing only an unboxed Back control. The right rail keeps device status, Back, and unboxed Home, Payments, and More shortcuts; all action controls are hidden throughout authentication. In wide postures the 40/60 master-detail layout runs left/right; in vertical postures it runs top/bottom, with the second Back control placed below the hinge. Payments includes separate Interac e-Transfer and Bills destinations.

## Files

- `index.html`: isolated prototype document and device presentation shell
- `styles.css`: semantic color tokens, light/dark themes, Duo layouts, and components
- `data.js`: consistent fictional customer, account, transaction, card, bill, and investment data
- `app.js`: routing, adaptive rendering, interactions, forms, and prototype state
