import "../../styles/components/header.css";
import Nav from "./nav.jsx";
import { Link } from "react-router-dom";
import logo from "../../assets/logos/HololearnAlt.png";
import avatar from "../../assets/img/profileicon.png";

export default function Header() {
    return (
        <header className="header">
            {/* Left: branding */}
            <Link to="/" className="brand" aria-label="Go to Home">
                <img src={logo} alt="HoloLearn logo" className="brand-logo" />
                <div className="brand-text">
                    <h1 className="brand-title">HoloLearn</h1>
                    <p className="brand-tagline">Learn, create, go live</p>
                </div>
            </Link>

            {/* Right: nav + profile */}
            <div className="header-right">
                <Nav />
                <div className="profile">
                    <button className="profile-btn" aria-haspopup="menu" aria-expanded="false">
                        <img src={avatar} alt="Profile" />
                    </button>
                    <ul className="profile-menu" role="menu" aria-label="Profile menu">
                        <li role="menuitem"><Link to="/profile">Profile</Link></li>
                        <li role="menuitem"><Link to="/my-courses">My Courses</Link></li>
                        <li role="menuitem"><Link to="/settings">Settings</Link></li>
                        <li className="divider" aria-hidden="true"></li>
                        <li role="menuitem"><Link to="/logout">Log out</Link></li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
