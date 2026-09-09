# Harshil Lotwala — Portfolio

[View on Netlify](https://harshil-lotwala-portfolio.netlify.app) · [View on GitHub Pages](https://harshil-lotwala.github.io/Portfolio/)

A responsive, editorial-style portfolio for Harshil Lotwala, presented equally as a product designer and software developer studying Applied Computer Science at Dalhousie University.

The site combines UI/UX case studies, interactive prototypes, eight software projects, professional freelance work, technical skills, education, and contact information in a single accessible page.

## Highlights

- Responsive layouts for small phones, tablets, laptops, desktops, and ultra-wide displays
- Full-screen mobile navigation with keyboard and orientation support
- Three UI/UX case-study cards, including one multi-device DAL Connect project and the FreshLocal mobile experience
- Eight software projects with GitHub and live-demo links where available
- A working DAL Connect Apple Watch experience with messaging, study-space booking, and calendar persistence
- Scroll-triggered content reveals using `IntersectionObserver`
- Clear 50/50 design-and-development positioning
- Accessible focus states, semantic landmarks, reduced-motion support, and a skip link
- Formspree contact form with inline success and error feedback
- Custom portfolio favicon and official Dalhousie University logo asset
- No framework or build step required

## Portfolio Sections

1. **Introduction** — equal product-design and development positioning
2. **Designer Projects** — DAL Connect across phone and watch, FreshLocal, and Housing & Roommate Matching
3. **Developer Projects** — Cricket Perfect Run, Vaibhavi’s Kitchen, Degree Planner, AI Flashcard Generator, GPGC, FocusTrail, Stock Dashboard, and Job Marketplace
4. **About, Experience & Skills** — SCITCO freelance work, UX methods, interface skills, languages, frameworks, APIs, databases, and testing
5. **Education** — Bachelor of Applied Computer Science at Dalhousie University
6. **Contact** — email, social links, and contact form

## Technology

- Semantic HTML5
- Modern CSS with Grid, Flexbox, custom properties, fluid type, and responsive breakpoints
- Vanilla JavaScript
- Google Fonts: Manrope and DM Mono
- Formspree for contact-form delivery
- Netlify for hosting

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
├── Resume_Harshil.pdf      Primary résumé linked by the website
├── dalhousie-logo.svg      Official Dalhousie logo used in Education
├── favicon.svg             Portfolio browser icon
├── netlify.toml            Netlify configuration
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
- Primary résumé: `Resume_Harshil.pdf`
- Browser icon: `favicon.svg`

The main design tokens are declared at the top of `styles.css`:

```css
:root {
  --paper: #f3f0e8;
  --ink: #151515;
  --acid: #d9ff43;
  --blue: #5568ff;
}
```

## Contact Form

The contact form submits to Formspree. To use another Formspree account, replace the endpoint in `index.html`:

```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

## Deployment

The repository supports two static hosts:

- **Netlify** publishes the repository root with no build command.
- **GitHub Pages** deploys through `.github/workflows/deploy-pages.yml` after each push to `main`.

The GitHub Pages deployment is available at [harshil-lotwala.github.io/Portfolio](https://harshil-lotwala.github.io/Portfolio/).

## Author

**Harshil Lotwala**

- [GitHub](https://github.com/Harshil-Lotwala)
- [LinkedIn](https://www.linkedin.com/in/harshil-lotwala)
- [Portfolio](https://harshil-lotwala-portfolio.netlify.app)
- Email: [harshil.lotwala@dal.ca](mailto:harshil.lotwala@dal.ca)

## Credits

- Dalhousie University logo sourced from the university’s official website
- Manrope and DM Mono provided through Google Fonts
- Contact-form delivery provided by Formspree
