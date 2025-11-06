import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/register.css";

export default function Register() {
    const navigate = useNavigate();

    // form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const errRef = useRef(null);

    // validation
    const nameValid = useMemo(() => name.trim().length >= 2, [name]);
    const emailValid = useMemo(() => /^\S+@\S+\.\S+$/.test(email), [email]);
    const pwdValid = useMemo(() => pwd.length >= 6, [pwd]);
    const matchValid = useMemo(() => pwd && pwd === pwd2, [pwd, pwd2]);
    const formValid = nameValid && emailValid && pwdValid && matchValid && agree;

    useEffect(() => {
        if (error && errRef.current) errRef.current.focus();
    }, [error]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!formValid) {
            setError("Please complete all fields correctly and accept the terms.");
            return;
        }
        setLoading(true);
        try {
            // --- MOCK REGISTER: replace with real API call later ---
            await new Promise((r) => setTimeout(r, 500));

            // After success, you might receive a token from the server
            const fakeToken = "HL_NEW_USER_" + Date.now();
            localStorage.setItem("authToken", fakeToken);
            localStorage.setItem("authEmail", email);
            localStorage.setItem("authName", name);

            navigate("/");
        } catch (e1) {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-page" aria-labelledby="reg-title">
            <section className="register-card">
                <header className="reg-header">
                    <div className="reg-brand">
                        <img src="/img/logos/HololearnAlt.png" alt="HoloLearn" className="reg-logo" />
                        <div>
                            <h1 id="reg-title" className="reg-title">Create your HoloLearn account</h1>
                            <p className="reg-subtitle">Learn, create, go live</p>
                        </div>
                    </div>
                </header>

                {error && (
                    <div
                        className="reg-alert"
                        role="alert"
                        aria-live="assertive"
                        tabIndex={-1}
                        ref={errRef}
                    >
                        {error}
                    </div>
                )}

                <form className="reg-form" onSubmit={onSubmit} noValidate>
                    {/* Name */}
                    <div className="form-row">
                        <label htmlFor="name" className="form-label">Full name</label>
                        <input
                            id="name"
                            type="text"
                            className={`form-input ${name && !nameValid ? "is-invalid" : ""}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Hoshimachi Suisei"
                            required
                        />
                        {name && !nameValid && <span className="form-hint">At least 2 characters.</span>}
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div className="form-row">
                        <label htmlFor="pwd" className="form-label">Password</label>
                        <div className="pwd-field">
                            <input
                                id="pwd"
                                type={showPwd ? "text" : "password"}
                                autoComplete="new-password"
                                className={`form-input ${pwd && !pwdValid ? "is-invalid" : ""}`}
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                placeholder="••••••"
                                minLength={6}
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
                        {pwd && !pwdValid && <span className="form-hint">At least 6 characters.</span>}
                    </div>

                    {/* Confirm */}
                    <div className="form-row">
                        <label htmlFor="pwd2" className="form-label">Confirm password</label>
                        <div className="pwd-field">
                            <input
                                id="pwd2"
                                type={showPwd2 ? "text" : "password"}
                                autoComplete="new-password"
                                className={`form-input ${pwd2 && !matchValid ? "is-invalid" : ""}`}
                                value={pwd2}
                                onChange={(e) => setPwd2(e.target.value)}
                                placeholder="••••••"
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                className="pwd-toggle"
                                aria-label={showPwd2 ? "Hide password" : "Show password"}
                                onClick={() => setShowPwd2((v) => !v)}
                            >
                                {showPwd2 ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {pwd2 && !matchValid && <span className="form-hint">Passwords do not match.</span>}
                    </div>

                    {/* Terms */}
                    <div className="form-row row-inline">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                                required
                            />
                            <span>
                                I agree to the <Link to="https://shop.hololivepro.com/pages/terms">Terms & Conditions</Link> and{" "}
                                <Link to="https://shop.hololivepro.com/pages/privacy-policy">Privacy Policy</Link>.
                            </span>
                        </label>
                        <Link to="/login" className="link-muted">Already have an account?</Link>
                    </div>

                    <button
                        className="reg-btn"
                        type="submit"
                        disabled={!formValid || loading}
                        aria-busy={loading ? "true" : "false"}
                    >
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>
            </section>
        </main>
    );
}
