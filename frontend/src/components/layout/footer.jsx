import React from "react";
import "../../styles/components/Footer.css";
import imgHololearnAlt1 from "../../../public/img/logos/HololearnAlt.png";

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
        {/* LOGO Y LEMA */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src={imgHololearnAlt1}
              alt="HoloLearn Logo"
              className="footer-logo-img"
            />
            <h2 className="footer-title">HoloLearn</h2>
          </div>
          <p className="footer-subtitle">Learn, Create, Go live</p>
        </div>

        {/* SECCIONES */}
        <FooterSection
          title="Explore"
          links={["Available Courses", "Categories", "Categories items"]}
        />

        <FooterSection
          title="Information"
          links={["About us", "Privacy Policy", "Terms & Conditions", "Contact"]}
        />
      </div>

      {/* BARRA INFERIOR */}
      <div className="footer-bottom">
        Project developed for educational purposes - ©2025 HoloLearn Team
      </div>
    </footer>
  );
}
