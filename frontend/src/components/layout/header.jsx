import "../../styles/components/header.css";
import Nav from "./nav.jsx";
import { Link } from "react-router-dom";
import logo from "../../assets/logos/HololearnAlt.png";
import avatar from "../../assets/img/profileicon.png";
import { useState, useEffect } from "react";

export default function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  return (
    <header className="header">
      {/* Left: branding (clickable home) */}
      <Link to="/" className="brand" aria-label="Go to Home">
        <img src={logo} alt="HoloLearn logo" className="brand-logo" />
        <div className="brand-text">
          <h1 className="brand-title">HoloLearn</h1>
          <p className="brand-tagline">Learn, create, go live.</p>
        </div>
      </Link>

      {/* Right: nav + theme toggle + profile */}
      <div className="header-right">
        <Nav />
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="profile">
          <button className="profile-btn" aria-haspopup="menu" aria-expanded="false">
            <img src={avatar} alt="Profile" />
          </button>
          <ul className="profile-menu" role="menu" aria-label="Profile menu">
            <li role="menuitem"><Link to="/login">Login</Link></li>
            {/* <li role="menuitem"><Link to="/profile">Profile</Link></li>
            <li role="menuitem"><Link to="/my-courses">My Courses</Link></li>
            <li className="divider" aria-hidden="true"></li>
            <li role="menuitem"><Link to="/logout">Log out</Link></li> */}
          </ul>
        </div>
      </div>
    </header>
  );
}
