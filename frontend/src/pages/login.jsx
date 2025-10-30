import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem("rememberEmail") || "");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(Boolean(localStorage.getItem("rememberEmail")));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const errRef = useRef(null);

  const emailValid = useMemo(() => /^\S+@\S+\.\S+$/.test(email), [email]);
  const pwdValid = useMemo(() => password.length >= 6, [password]);
  const formValid = emailValid && pwdValid;

  useEffect(() => {
    if (error && errRef.current) errRef.current.focus();
  }, [error]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formValid) {
      setError("Please enter a valid email and a password with at least 6 characters.");
      return;
    }
    setLoading(true);

    // ---- MOCK AUTH (replace with real API later) ----
    try {
      // Simulate server delay
      await new Promise((r) => setTimeout(r, 400));

      // Example success. Replace with real token from server response.
      const fakeToken = "HL_FAKE_TOKEN_" + Date.now();
      localStorage.setItem("authToken", fakeToken);
      localStorage.setItem("authEmail", email);

      if (remember) localStorage.setItem("rememberEmail", email);
      else localStorage.removeItem("rememberEmail");

      navigate("/");
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page" aria-labelledby="login-title">
      <section className="login-card">
        <header className="login-header">
          <div className="login-brand">
            <img src="/img/logos/HololearnAlt.png" alt="HoloLearn" className="login-logo" />
            <div>
              <h1 id="login-title" className="login-title">Sign in to HoloLearn</h1>
              <p className="login-subtitle">Learn, create, go live</p>
            </div>
          </div>
        </header>

        {error && (
          <div
            className="login-alert"
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
            ref={errRef}
          >
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={`form-input ${email && !emailValid ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {email && !emailValid && (
              <span className="form-hint">Please enter a valid email address.</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="pwd-field">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                className={`form-input ${password && !pwdValid ? "is-invalid" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                minLength={6}
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
            {password && !pwdValid && (
              <span className="form-hint">At least 6 characters.</span>
            )}
          </div>

          <div className="form-row row-inline">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <Link to="/forgot" className="link-muted">Forgot password?</Link>
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={!formValid || loading}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <footer className="login-footer">
          <span>Don’t have an account?</span>{" "}
          <Link to="/register">Create one</Link>
        </footer>
      </section>
    </main>
  );
}
