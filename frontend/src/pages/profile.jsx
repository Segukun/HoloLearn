import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/profile.css";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/img/profileicon.png";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:3000/user/profile", {
                withCredentials: true
            });
            setUser(res.data);
        } catch (err) {
            console.error(err);
            setError("Could not load your profile. Please try again later.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:3000/user/logout",
                {},
                { withCredentials: true }
            );
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Error logging out.");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure? This cannot be undone.")) return;

        try {
            await axios.delete("http://localhost:3000/user/delete", {
                withCredentials: true,
            });
            alert("Account deleted.");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Could not delete account.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-card">

                {/* Avatar */}
                <div className="profile-avatar-container">
                    <img src={avatar} alt="Profile" className="profile-avatar" />
                </div>

                {/* Name under the avatar */}
                {user && (
                    <h2 className="profile-name">{user.full_name}</h2>
                )}

                <h3 className="profile-subtitle">Account information</h3>

                {error && <p className="profile-error">{error}</p>}

                {user && (
                    <div className="profile-info">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.category}</p>
                    </div>
                )}

                <button className="profile-btn logout" onClick={handleLogout}>
                    Logout
                </button>

                <button className="profile-btn delete" onClick={handleDelete}>
                    Delete Account
                </button>
            </div>
        </div>
    );
}
