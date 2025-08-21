# Personal Portfolio Website

A modern, responsive portfolio website built with HTML5, CSS3, and JavaScript featuring interactive animations, custom cursor effects, and dynamic content presentation.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints for all device sizes
- **Dynamic Typing Animation**: Animated text that cycles through different roles with realistic typing variations
- **Custom Mouse Cursor**: Interactive cursor with trailing effects and hover animations
- **Smooth Scrolling**: Navigation with smooth scroll behavior and active section highlighting
- **Contact Form Integration**: Formspree-powered contact form with validation and submission feedback
- **Interactive Animations**: Scroll-triggered animations, floating tech icons, and hover effects
- **Modern UI/UX**: Gradient backgrounds, glassmorphism effects, and professional styling
- **Project Showcase**: Timeline layout displaying development projects with GitHub integration

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom Properties, Keyframe Animations
- **Form Handling**: Formspree API
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Space Grotesk, JetBrains Mono)
- **Version Control**: Git

## Key Sections

### Hero Section
- Animated name with letter floating effects
- Dynamic typing animation cycling through roles
- Interactive floating tech icons
- Call-to-action buttons with hover effects

### About Section
- Personal introduction and background
- Technical skills organized by category
- Professional experience summary

### Education Section
- Academic background and qualifications
- University and high school education details
- Responsive card layout with educational icons

### Project Experience
- Timeline layout with project details
- GitHub repository links
- Technology stack information
- Project descriptions and achievements

### Featured Projects
- Project showcase with hover effects
- External links to repositories and demos
- Technology tags and descriptions

### Contact Section
- Interactive contact form with validation
- Social media and professional links
- Real-time form submission feedback

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/Harshil-Lotwala/Portfolio.git
```

2. Navigate to the project directory:
```bash
cd Portfolio
```

3. Open `index.html` in your web browser or serve with a local development server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Or simply open index.html in your browser
```

## Customization

### Updating Personal Information
- Edit content in `index.html` for personal details, projects, and contact information
- Replace `Resume_2025.pdf` with your own resume file
- Update social media links and contact information

### Modifying Animations
- Typing animation words can be changed in `script.js`:
```javascript
let typingWords = ['Developer', 'Designer', 'Gamer', 'Creator', 'Problem Solver', 'Tech Enthusiast'];
```

- Animation timing and effects can be adjusted in the CSS file
- Custom cursor behavior can be modified in the cursor initialization function

### Styling Changes
- Color scheme is defined using CSS custom properties in `:root`
- Responsive breakpoints can be adjusted in the media queries
- Typography and spacing can be modified through CSS variables

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Optimized CSS and JavaScript for fast loading
- Throttled scroll events for smooth performance
- Lazy-loaded animations triggered by intersection observer
- Efficient DOM manipulation and event handling

## Contact Form Setup

The contact form uses Formspree for handling submissions. The form is already configured with the endpoint:

```html
<form action="https://formspree.io/f/manbgkop" method="POST">
```

To set up your own form:
1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form and get your endpoint URL
3. Replace the form action in `index.html` with your form ID

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome. Feel free to open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Harshil Lotwala**
- GitHub: [@Harshil-Lotwala](https://github.com/Harshil-Lotwala)
- LinkedIn: [Harshil Lotwala](https://www.linkedin.com/in/harshil-lotwala)
- Email: hashilv3034@gmail.com

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Formspree for contact form handling
- Inspiration from modern web design trends and best practices
