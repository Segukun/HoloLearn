import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/login.css";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // ui state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/user/login",
        { email, password },
        {
          // sessions / cookies
          withCredentials: true,
        }
      );

      console.log("Login response:", res.data);

      // here you could also store something in localStorage if you want
      // localStorage.setItem("authEmail", res.data.user.email);

      navigate("/"); // go to home after success
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;

      if (status === 404) {
        setError("This account does not exist.");
      } else if (status === 401) {
        setError("Incorrect email or password.");
      } else if (status === 400) {
        setError("Please complete all fields.");
      } else {
        setError("Could not sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page" aria-labelledby="login-title">
      <section className="login-card">
        {/* header / brand – uses your CSS */}
        <header className="login-header">
          <div className="login-brand">
            <img
              src="/img/logos/HololearnAlt.png"
              alt="HoloLearn"
              className="login-logo"
            />
            <div>
              <h1 id="login-title" className="login-title">
                Sign in to HoloLearn
              </h1>
              <p className="login-subtitle">Learn, create, go live.</p>
            </div>
          </div>
        </header>

        {/* error alert */}
        {error && (
          <div className="login-alert" role="alert">
            {error}
          </div>
        )}

        {/* form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-row">
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <input
              id="login-email"          // <-- no more duplicate #email
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="form-row">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div className="pwd-field">
              <input
                id="login-password"    // <-- no more duplicate #password
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
              <button
                type="button"
                className="pwd-toggle"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((v) => !v)}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* “create account” link */}
          <div className="form-row row-inline">
            <span className="link-muted">
              Don’t have an account?{" "}
              <Link to="/register">Create account</Link>
            </span>
          </div>

          {/* submit button */}
          <button
            className="login-btn"
            type="submit"
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
