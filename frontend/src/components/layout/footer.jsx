import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "../../styles/components/footer.css";

function FooterList({ children }) {
  return <ul className="footer-links">{children}</ul>;
}

function FooterItem({ children }) {
  return <li className="footer-link">{children}</li>;
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
          <p className="footer-subtitle">Learn, create, go live.</p>
        </div>

        {/* Explore (kept intact) */}
        <div className="footer-section">
          <h3 className="footer-section-title">Explore</h3>
          <FooterList>
            <FooterItem>
              <Link to="/courses">Available Courses</Link>
            </FooterItem>
            <FooterItem>
              <Link to="/categories">Categories</Link>
            </FooterItem>
            <FooterItem>
              <Link to="/categories/items">Categories items</Link>
            </FooterItem>
          </FooterList>
        </div>

        {/* Information (now smooth-scrolling to About sections) */}
        <div className="footer-section">
          <h3 className="footer-section-title">Information</h3>
          <FooterList>
            <FooterItem>
              <HashLink smooth to="/about#information">Information</HashLink>
            </FooterItem>
            <FooterItem>
              <HashLink smooth to="/about#about-us">About us</HashLink>
            </FooterItem>
            <FooterItem>
              <HashLink smooth to="/about#privacy-policy">Privacy Policy</HashLink>
            </FooterItem>
            <FooterItem>
              <HashLink smooth to="/about#terms">Terms &amp; Conditions</HashLink>
            </FooterItem>
            <FooterItem>
              <HashLink smooth to="/about#contact">Contact</HashLink>
            </FooterItem>
          </FooterList>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        Project developed for educational purposes - ©2025 HoloLearn Team
      </div>
    </footer>
  );
}
