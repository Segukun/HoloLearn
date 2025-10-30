import React from "react";
import "../../styles/components/footer.css";

// small presentational item
function FooterLink({ text }) {
  return <li className="footer-link">{text}</li>;
}

function FooterSection({ title, links }) {
  return (
    <div className="footer-section">
      <h3 className="footer-section-title">{title}</h3>
      <ul className="footer-links">
        {links.map((link, index) => (
          <FooterLink key={index} text={link} />
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            {/* When using /public, reference with an absolute path */}
            <img
              src="/img/logos/HololearnAlt.png"
              alt="HoloLearn Logo"
              className="footer-logo-img"
            />
            <h2 className="footer-title">HoloLearn</h2>
          </div>
          <p className="footer-subtitle">Learn, Create, Go live</p>
        </div>

        {/* Sections */}
        <FooterSection
          title="Explore"
          links={["Available Courses", "Categories", "Categories items"]}
        />
        <FooterSection
          title="Information"
          links={["About us", "Privacy Policy", "Terms & Conditions", "Contact"]}
        />
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        Project developed for educational purposes - ©2025 HoloLearn Team
      </div>
    </footer>
  );
}
