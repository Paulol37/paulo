import { useState } from "react";
import { login, register } from "../Services/Auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ kind: "idle", msg: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  function toggleMode(e) {
    e.preventDefault();
    setStatus({ kind: "idle", msg: "" });
    setMode(mode === "login" ? "register" : "login");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({
      kind: "loading",
      msg: mode === "login" ? "Signing in..." : "Creating account...",
    });

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error("Name is required.");
        if (password.length < 6)
          throw new Error("Password must be at least 6 characters.");
        if (password !== confirm) throw new Error("Passwords do not match.");

        const res = await register(name, email, password);

        if (!res?.token) {
          await login(email, password);
        }
      }

      setStatus({
        kind: "ok",
        msg: mode === "login" ? "Welcome back!" : "Account created!",
      });
      navigate(from, { replace: true });
    } catch (e) {
      setStatus({ kind: "err", msg: e.message || "Something went wrong" });
    }
  }

  const isLoading = status.kind === "loading";

  return (
    <div className="auth-wrap">
      <div
        className="auth-card"
        role="region"
        aria-label={mode === "login" ? "Sign in form" : "Register form"}
      >
        {/* Header */}
        <div className="auth-header">
          <img className="logo" src="/vite.svg" alt="App logo" />
          <div>
            <div className="auth-title">
              {mode === "login" ? "Sign in" : "Create account"}
            </div>
            <div className="auth-sub">
              {mode === "login"
                ? "Access your dashboard"
                : "Join to manage employees"}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} noValidate>
          {mode === "register" && (
            <div className="field">
              <label htmlFor="name" className="label">
                Name
              </label>
              <div className="control">
                <input
                  id="name"
                  className="input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          <div className="field">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="control">
              <input
                id="email"
                className="input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="control">
              <input
                id="password"
                className="input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div className="field">
              <label htmlFor="confirm" className="label">
                Confirm password
              </label>
              <div className="control">
                <input
                  id="confirm"
                  className="input"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
          )}

          {/* Extras */}
          <div className="row">
            {mode === "login" ? (
              <>
                <label className="check">
                  <input type="checkbox" style={{ accentColor: "var(--brand)" }} />
                  Remember me
                </label>
                <a className="link" href="#" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </>
            ) : (
              <span className="check" />
            )}
          </div>

          {/* Submit */}
          <div style={{ marginTop: 16 }}>
            <button className="btn" disabled={isLoading}>
              {isLoading
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating…"
                : mode === "login"
                ? "Login"
                : "Register"}
            </button>
          </div>

          {/* Status */}
          {status.msg && (
            <div
              className={`status ${
                status.kind === "err" ? "err" : status.kind === "ok" ? "ok" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {status.msg}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="auth-foot">
          {mode === "login" ? (
            <>
              No account?{" "}
              <a className="link" href="#" onClick={toggleMode}>
                Create one
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a className="link" href="#" onClick={toggleMode}>
                Sign in
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
