# Harshil Lotwala — Portfolio

[View Live Portfolio](https://harshil-lotwala.github.io/Portfolio/)

A responsive, editorial-style portfolio for Harshil Lotwala, presented equally as a UX designer and full stack developer studying Applied Computer Science at Dalhousie University.

The site combines UI/UX case studies, interactive prototypes, eight software projects, professional freelance work, technical skills, education, and contact information in a single accessible page.

## Highlights

- Responsive layouts for small phones, tablets, laptops, desktops, and ultra-wide displays
- Full-screen mobile navigation with keyboard and orientation support
- North Atlantic Bank high-fidelity prototype with Closed, Open, Split, and rotation-aware iPhone Duo layouts
- Interactive front-end coursework prototypes for DAL Connect and FreshLocal, plus a detailed low-fidelity housing case study
- Eight software projects with GitHub and live-demo links where available
- A DAL Connect Apple Watch prototype with messaging, study-space booking, and simulated calendar persistence
- Scroll-triggered content reveals using `IntersectionObserver`
- Clear 50/50 design-and-development positioning
- Accessible focus states, semantic landmarks, reduced-motion support, and a skip link
- Formspree contact form with inline success and error feedback
- Custom portfolio favicon and official Dalhousie University logo asset
- No framework or build step required

## Portfolio Sections

1. **Introduction** — equal UX design and full stack development positioning
2. **UI/UX Projects** — North Atlantic Bank, FreshLocal, DAL Connect across phone and watch, and Housing & Roommate Matching
3. **Development Projects** — AI Flashcard Generator, Degree Planner, FocusTrail, Job Marketplace, Vaibhavi’s Kitchen, Stock Dashboard, GPGC, and Cricket Perfect Run
4. **About & Experience** — background and SCITCO freelance product design work
5. **Skills** — UX, interface design, front-end, backend, databases, tools/workflow, and AI-assisted design and development
6. **Education** — Bachelor of Applied Computer Science at Dalhousie University
7. **Contact** — email, social links, and contact form

## Technology

- Semantic HTML5
- Modern CSS with Grid, Flexbox, custom properties, fluid type, and responsive breakpoints
- Vanilla JavaScript
- Google Fonts: Manrope and DM Mono
- Formspree for contact-form delivery
- GitHub Pages for canonical hosting, with the legacy Netlify URL redirected to it

## Responsive Design

The layout is designed for the full device range rather than a desktop/mobile split:

- Extra-small phones: up to 430px
- Phones and small tablets: up to 680px
- Tablets and compact laptops: up to 900px
- Medium laptops: up to 1180px
- Standard desktop layouts
- Large and ultra-wide displays: 1920px and above
- Short landscape screens receive a dedicated navigation and hero treatment

Content width is capped on very large screens so typography and project layouts remain readable instead of stretching across the display.

## Project Structure

```text
.
├── index.html              Main portfolio content
├── styles.css              Visual system and responsive layouts
├── script.js               Navigation, reveals, marquee, and form behavior
├── Resume_Harshil_UIUX.pdf UI/UX and product design résumé
├── Resume_Harshil_Development.pdf
│                           Software development résumé
├── dalhousie-logo.svg      Official Dalhousie logo used in Education
├── favicon.svg             Portfolio browser icon
├── netlify.toml            Redirects the legacy Netlify URL to GitHub Pages
├── projects/
│   └── north-atlantic-bank/ Self-contained interactive banking prototype
└── README.md               Project documentation
```

Additional résumé versions and legacy image/style assets remain in the repository but are not used by the current website.

## Run Locally

The portfolio is static, so it can be opened directly through `index.html`. Running a local server is recommended so browser behavior matches deployment:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Updating Content

- Personal details, project descriptions, and links: `index.html`
- Colors, typography, spacing, and breakpoints: `styles.css`
- Navigation, animations, marquee, and form handling: `script.js`
- North Atlantic Bank prototype: `projects/north-atlantic-bank/`
- UI/UX résumé: `Resume_Harshil_UIUX.pdf`
- Development résumé: `Resume_Harshil_Development.pdf`
- Browser icon: `favicon.svg`

The main design tokens are declared at the top of `styles.css`. The light editorial palette combines warm neutrals with muted sage, sky, rose, forest, slate, claret, and brass accents:

```css
:root {
  --paper: #f4f1ea;
  --surface: #fbfaf7;
  --sand: #e8dfc9;
  --sage: #d9e3da;
  --sky: #dce5ec;
  --rose: #e7d9d7;
  --ink: #202a2a;
  --muted: #606c69;
  --forest: #2f5b50;
  --slate: #3f596a;
  --claret: #764955;
  --brass: #9a7443;
}
```

## Contact Form

The contact form submits to Formspree. To use another Formspree account, replace the endpoint in `index.html`:

```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

## Deployment

GitHub Pages is the canonical deployment and publishes through `.github/workflows/deploy-pages.yml` after each push to `main`.

The legacy Netlify address redirects to [harshil-lotwala.github.io/Portfolio](https://harshil-lotwala.github.io/Portfolio/), ensuring both previously shared portfolio links open the same website.

## Author

**Harshil Lotwala**

- [GitHub](https://github.com/Harshil-Lotwala)
- [LinkedIn](https://www.linkedin.com/in/harshil-lotwala)
- [Portfolio](https://harshil-lotwala.github.io/Portfolio/)
- Email: [harshil.lotwala@dal.ca](mailto:harshil.lotwala@dal.ca)

## Credits

- Dalhousie University logo sourced from the university’s official website
- Manrope and DM Mono provided through Google Fonts
- Contact-form delivery provided by Formspree
