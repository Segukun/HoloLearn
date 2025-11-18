import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/register.css";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple front-end check
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/user/create",
        { name, email, password },
        { withCredentials: true }
      );

      console.log("Register response:", res.data);

      // On success go to login page
      navigate("/login");
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;

      if (status === 400) {
        setError("Please complete all fields.");
      } else if (status === 500) {
        setError("Server error while creating the account.");
      } else {
        setError("Could not create the account. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nameInvalid = !!error && !name.trim();
  const emailInvalid = !!error && !email.trim();
  const pwdInvalid = !!error && !password.trim();

  return (
    <main className="register-page" aria-labelledby="reg-title">
      <section className="register-card">
        <header className="reg-header">
          <div className="reg-brand">
            <img
              src="/img/logos/HololearnAlt.png"
              alt="HoloLearn"
              className="reg-logo"
            />
            <div>
              <h1 id="reg-title" className="reg-title">
                Create your HoloLearn account
              </h1>
              <p className="reg-subtitle">Learn, create, go live</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="reg-alert" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-row">
            <label htmlFor="name" className="form-label">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${nameInvalid ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Hoshimachi Suisei"
            />
          </div>

          {/* Email */}
          <div className="form-row">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`form-input ${emailInvalid ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="form-row">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={`form-input ${pwdInvalid ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          {/* Link to Login */}
          <div className="form-row row-inline">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="link-muted">
                Sign in
              </Link>
            </span>
          </div>

          <button
            className="reg-btn"
            type="submit"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}
