import "../../styles/components/nav.css";
import { NavLink } from "react-router-dom";

export default function Nav() {
    return (
        <nav className="nav">
            <ul className="nav-list">
                <li><NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
                <li><NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Courses</NavLink></li>
                <li><NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink></li>
            </ul>
        </nav>
    );
}
