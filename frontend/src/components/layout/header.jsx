import "../../styles/components/header.css";
import Nav from "./nav.jsx";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logos/HololearnAlt.png";
import avatar from "../../assets/img/profileicon.png";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Auth state (logged in or not)
  const [isAuth, setIsAuth] = useState(false);

  const location = useLocation();

  // Apply theme to <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Check if the user is authenticated (session cookie)
  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/auth/check", {
        withCredentials: true,
      });
      setIsAuth(res.data.isAuthenticated === true);
    } catch (err) {
      // 401 = not authenticated → just set false
      setIsAuth(false);
    }
  };

  // Re-check auth whenever the route changes (e.g. after login)
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  // Logout handler
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/user/logout",
        {},
        { withCredentials: true }
      );
      setIsAuth(false);
      // Optional redirect after logout:
      // window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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

      {/* Right: nav + theme toggle + profile menu */}
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
            {isAuth ? (
              <>
                <li role="menuitem">
                  <Link to="/profile">My profile</Link>
                </li>
                
                {/* <li role="menuitem">
                  <Link to="/my-courses">My courses</Link>
                </li> */}

                <li className="divider" aria-hidden="true"></li>
                <li role="menuitem">
                  {/* Use <a> so it uses your existing CSS styles */}
                  <a href="#" onClick={handleLogout}>
                    Log out
                  </a>
                </li>
              </>
            ) : (
              <>
                <li role="menuitem">
                  <Link to="/login">Login</Link>
                </li>
                <li role="menuitem">
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
