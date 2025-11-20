import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ---- FETCH USER PROFILE ----
    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:3000/user/auth/check", {
                withCredentials: true
            });

        setUser(res.data);
    } catch (err) {
        console.error(err);
        setError("Could not load your profile. Please try again later.");
    }
};

// ---- LOGOUT ----
const handleLogout = async () => {
    try {
        await axios.post(
            "http://localhost:3000/account/logout",
            {},
            { withCredentials: true }
        );
        navigate("/login");
    } catch (err) {
        console.error(err);
        alert("Error logging out.");
    }
};

// ---- DELETE ACCOUNT ----
const handleDelete = async () => {
    const yes = confirm("Are you sure? This cannot be undone.");

    if (!yes) return;

    try {
        await axios.delete("http://localhost:3000/user/delete", { withCredentials: true });

        alert("Account deleted.");
        navigate("/register");
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

            <h1 className="profile-title">My Profile</h1>
            <h3 className="profile-subtitle">Account information</h3>

            {error && <p className="profile-error">{error}</p>}

            {user && (
                <div className="profile-info">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.cursante ? "Cursante" : "User"}</p>
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
