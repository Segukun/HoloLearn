import "../../styles/components/header.css";
import Nav from "./nav.jsx";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <Link to="/" className="brand-link">ホロレン / HoloLearn</Link>
            <Nav />
        </header>
    );
}
