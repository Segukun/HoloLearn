import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/login.css";

export default function Login() {
  const navigate = useNavigate();

  // Form state (controlled for validation classes)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // UI state
  const [status, setStatus] = useState("");     // success / error message
  const [loading, setLoading] = useState(false);
  const errRef = useRef(null);

  // Basic validation, matching your CSS states
  const emailValid = useMemo(() => /^\S+@\S+\.\S+$/.test(email), [email]);
  const pwdValid = useMemo(() => password.length >= 1, [password]); // backend decides strength
  const formValid = emailValid && pwdValid;

  useEffect(() => {
    if (status.startsWith("Error") && errRef.current) errRef.current.focus();
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!formValid) {
      setStatus("Error: Please complete all fields correctly.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json();
      console.log("POST response:", data);

      setStatus("Signed in successfully");
      // Aca va el token de base de datos 👈(ﾟヮﾟ👈)
      // localStorage.setItem("authToken", data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
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

        {status && status.startsWith("Error") && (
          <div
            className="login-alert"
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
            ref={errRef}
          >
            {status}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
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
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                className={`form-input ${password && !pwdValid ? "is-invalid" : ""}`}
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

          <div className="form-row row-inline">
              Don’t have an account? <span className="link-muted"><Link to="/register">Create one</Link></span>
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

        {!status.startsWith("Error") && status && (
          <p className="login-footer">{status}</p>
        )}
      </section>
    </main>
  );
}
