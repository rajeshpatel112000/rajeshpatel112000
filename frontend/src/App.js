import React, { useEffect, useState } from "react";
import "./App.css";

const navLinks = ["Home", "Services", "Portfolio", "Pricing", "About", "Contact"];

const services = [
  { title: "Business Websites", icon: "🏢", text: "Conversion-ready websites that present your company with clarity, speed, and premium polish." },
  { title: "Portfolio Websites", icon: "✨", text: "Personal brand experiences for creators, consultants, founders, and service professionals." },
  { title: "Landing Pages", icon: "🚀", text: "High-impact pages built to launch campaigns, capture leads, and validate ideas quickly." },
  { title: "E-commerce Websites", icon: "🛒", text: "Modern online stores with smooth product journeys, mobile checkout, and growth analytics." },
  { title: "AI Chatbots", icon: "🤖", text: "Smart assistants that answer questions, qualify leads, and support customers around the clock." },
  { title: "Website Redesign", icon: "🎯", text: "Transform outdated sites into beautiful, trustworthy digital experiences that perform." },
  { title: "SEO Optimization", icon: "📈", text: "Technical and content improvements that help customers discover your business faster." },
  { title: "Business Automation", icon: "⚙️", text: "Automated workflows for leads, bookings, reminders, reporting, and repetitive operations." },
];

const portfolio = [
  { title: "Restaurant", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80", badge: "Online Menu + Booking" },
  { title: "Gym", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80", badge: "Membership Funnel" },
  { title: "Clinic", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80", badge: "Appointments + AI Help" },
  { title: "Real Estate", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80", badge: "Property Showcase" },
  { title: "Coaching Institute", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80", badge: "Admissions Landing Page" },
  { title: "Hotel", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80", badge: "Booking Experience" },
];

const pricingPlans = [
  { name: "Basic", price: "₹7,999", description: "For new businesses that need a clean, professional start.", features: ["5-page responsive website", "Contact form", "Basic SEO setup", "WhatsApp integration", "7-day support"] },
  { name: "Business", price: "₹14,999", description: "For growing brands that need stronger conversion and automation.", featured: true, features: ["Up to 10 premium pages", "Lead capture automation", "SEO optimization", "Analytics integration", "AI chatbot starter", "15-day support"] },
  { name: "Premium", price: "₹29,999", description: "For teams that want a high-end website with AI-powered workflows.", features: ["Custom premium design", "Advanced AI chatbot", "Business automation flows", "Portfolio/e-commerce modules", "Performance optimization", "30-day priority support"] },
];

const whyChoose = ["Fast Delivery", "AI Powered", "Mobile Responsive", "SEO Friendly", "Affordable Pricing", "Ongoing Support"];

const testimonials = [
  { quote: "Codexa AI Studio gave our business a premium website and automated our enquiry process in one smooth project.", name: "Priya Sharma", role: "Restaurant Owner" },
  { quote: "The design quality feels like a top startup site. Our leads improved after launch and the chatbot saves us hours.", name: "Rahul Mehta", role: "Fitness Studio Founder" },
  { quote: "Professional, fast, and clear communication. They understood our clinic workflow and built exactly what we needed.", name: "Dr. Neha Patel", role: "Clinic Director" },
];

const faqs = [
  { q: "How long does it take to build a website?", a: "Most standard websites are delivered in 5–10 working days depending on pages, content, revisions, and automation requirements." },
  { q: "Can you add AI chatbots to my existing website?", a: "Yes. We can add AI chatbots for FAQs, lead qualification, appointment requests, product guidance, and customer support." },
  { q: "Do you provide mobile responsive websites?", a: "Every website is designed mobile-first and tested for mobile, tablet, and desktop experiences." },
  { q: "Will my website be SEO friendly?", a: "Yes. We include clean structure, metadata, fast-loading layouts, semantic HTML, and SEO-friendly content sections." },
  { q: "Do you offer support after delivery?", a: "Yes. Each plan includes support, and we also provide ongoing maintenance, improvements, and automation upgrades." },
];

const comparisonRows = [
  ["Responsive Design", "✓", "✓", "✓"],
  ["SEO Setup", "Basic", "Advanced", "Advanced"],
  ["AI Chatbot", "—", "Starter", "Advanced"],
  ["Automation", "—", "Lead Flow", "Custom Workflows"],
  ["Support", "7 Days", "15 Days", "30 Days"],
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const section = document.getElementById(id.toLowerCase());
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    alert("Thanks for contacting Codexa AI Studio. We will get back to you soon!");
    event.currentTarget.reset();
  };

  return (
    <div className="site-shell">
      <div className="loader" aria-hidden="true"><span /></div>
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />
      <div className="grid-glow" />

      <header className="navbar">
        <a className="brand" href="#home" aria-label="Codexa AI Studio home">
          <span className="brand-mark">C</span>
          <span><strong>Codexa</strong> AI Studio</span>
        </a>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation" aria-expanded={isMenuOpen}>
          <span /><span /><span />
        </button>
        <nav className={isMenuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          {navLinks.map((link) => <button key={link} onClick={() => scrollTo(link)}>{link}</button>)}
        </nav>
      </header>

      <main>
        <section id="home" className="hero section-pad">
          <div className="hero-content reveal">
            <p className="eyebrow">AI-Powered Websites & Business Solutions.</p>
            <h1>Build Your Business with AI.</h1>
            <p className="hero-subtitle">We create modern websites, AI solutions, and digital experiences that help businesses grow.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => scrollTo("Contact")}>Get Started</button>
              <button className="secondary-btn" onClick={() => scrollTo("Portfolio")}>View Portfolio</button>
            </div>
            <div className="hero-stats" aria-label="Agency highlights">
              <div><strong>50+</strong><span>Launch-ready sections</span></div>
              <div><strong>24/7</strong><span>AI support flows</span></div>
              <div><strong>100%</strong><span>Responsive builds</span></div>
            </div>
          </div>
          <div className="ai-visual reveal" aria-label="Animated AI themed illustration">
            <div className="visual-card main-node"><span>AI</span></div>
            <div className="visual-card node node-a">SEO</div>
            <div className="visual-card node node-b">CRM</div>
            <div className="visual-card node node-c">BOT</div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="pulse-ring" />
          </div>
        </section>

        <section id="services" className="section-pad">
          <SectionHeader label="Services" title="Everything your digital business needs" text="Premium websites, automation, AI assistants, and growth-focused systems built with clean strategy and elegant execution." />
          <div className="card-grid services-grid">
            {services.map((service) => <article className="glass-card service-card" key={service.title}><span className="service-icon">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p></article>)}
          </div>
        </section>

        <section id="portfolio" className="section-pad">
          <SectionHeader label="Portfolio" title="Startup-quality websites for every industry" text="Explore sample concepts designed to help local businesses look premium, attract customers, and automate enquiries." />
          <div className="portfolio-grid">
            {portfolio.map((item) => <article className="portfolio-card" key={item.title}><img src={item.image} alt={`${item.title} website showcase`} loading="lazy" /><div className="portfolio-content"><span>{item.badge}</span><h3>{item.title}</h3><button>View Demo</button></div></article>)}
          </div>
        </section>

        <section id="pricing" className="section-pad">
          <SectionHeader label="Pricing" title="Clear plans for modern businesses" text="Choose a launch package now and upgrade with AI automation as your business grows." />
          <div className="pricing-grid">
            {pricingPlans.map((plan) => <article className={plan.featured ? "price-card featured" : "price-card"} key={plan.name}>{plan.featured && <span className="popular">Most Popular</span>}<h3>{plan.name}</h3><p>{plan.description}</p><strong className="price">{plan.price}</strong><ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><button onClick={() => scrollTo("Contact")}>Start {plan.name}</button></article>)}
          </div>
          <div className="comparison glass-card" aria-label="Feature comparison">
            <h3>Feature comparison</h3>
            <div className="comparison-table">
              <div className="comparison-head"><span>Feature</span><span>Basic</span><span>Business</span><span>Premium</span></div>
              {comparisonRows.map((row) => <div className="comparison-row" key={row[0]}>{row.map((cell, index) => <span key={`${row[0]}-${index}`}>{cell}</span>)}</div>)}
            </div>
          </div>
        </section>

        <section id="about" className="section-pad about-section">
          <div>
            <SectionHeader label="Why Choose Us" title="Built for trust, speed, and measurable growth" text="Codexa AI Studio combines modern design, practical AI, and business-first thinking to launch websites that look premium and work hard." align="left" />
            <div className="why-grid">{whyChoose.map((item) => <div className="why-item" key={item}>✓ {item}</div>)}</div>
          </div>
          <div className="process-card glass-card"><h3>Our AI delivery system</h3><ol><li>Discover your goals and audience.</li><li>Design a premium mobile-first experience.</li><li>Build website, SEO, chatbot, and automations.</li><li>Launch fast with support and improvements.</li></ol></div>
        </section>

        <section className="section-pad testimonials-section">
          <SectionHeader label="Testimonials" title="Trusted by ambitious business owners" text="Modern design, clear communication, and AI-powered outcomes that make every launch feel effortless." />
          <div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial-card glass-card" key={item.name}><p>“{item.quote}”</p><div><strong>{item.name}</strong><span>{item.role}</span></div></article>)}</div>
        </section>

        <section className="section-pad faq-section">
          <SectionHeader label="FAQ" title="Questions before starting?" text="Here are answers to common questions about website development and AI services." />
          <div className="faq-list">{faqs.map((faq) => <details className="faq-item" key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div>
        </section>

        <section id="contact" className="section-pad contact-section">
          <div className="contact-copy"><SectionHeader label="Contact" title="Ready to build your AI-powered website?" text="Tell us about your business and we’ll help you choose the right website, chatbot, and automation package." align="left" /><div className="contact-links"><a href="mailto:hello@codexaai.studio">hello@codexaai.studio</a><a className="whatsapp" href="https://wa.me/919999999999" target="_blank" rel="noreferrer">WhatsApp Us</a><div className="socials"><a href="#home" aria-label="Instagram">◎</a><a href="#home" aria-label="LinkedIn">in</a><a href="#home" aria-label="X">𝕏</a></div></div></div>
          <form className="contact-form glass-card" onSubmit={handleContactSubmit}><label>Name<input type="text" placeholder="Your name" required /></label><label>Email<input type="email" placeholder="you@example.com" required /></label><label>Service<select defaultValue=""><option value="" disabled>Select a service</option>{services.slice(0, 6).map((service) => <option key={service.title}>{service.title}</option>)}</select></label><label>Message<textarea placeholder="Tell us about your project" rows="5" required /></label><button type="submit">Send Project Enquiry</button></form>
        </section>
      </main>

      <footer className="footer">
        <div><a className="brand" href="#home"><span className="brand-mark">C</span><span><strong>Codexa</strong> AI Studio</span></a><p>AI-Powered Websites & Business Solutions.</p></div>
        <div><h4>Quick Links</h4>{navLinks.slice(0, 5).map((link) => <button key={link} onClick={() => scrollTo(link)}>{link}</button>)}</div>
        <div><h4>Services</h4>{services.slice(0, 5).map((service) => <span key={service.title}>{service.title}</span>)}</div>
        <div><h4>Legal</h4><a href="#home">Privacy Policy</a><a href="#home">Terms & Conditions</a><p>© 2026 Codexa AI Studio. All rights reserved.</p></div>
      </footer>

      <button className={showTop ? "back-top show" : "back-top"} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </div>
  );
}

function SectionHeader({ label, title, text, align = "center" }) {
  return <div className={`section-header ${align === "left" ? "left" : ""}`}><p className="eyebrow">{label}</p><h2>{title}</h2><p>{text}</p></div>;
}

export default App;
