import React, { useState } from "react";
import axios from "axios";
import "../styles/LoginSignup.css";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin, signupMode }) => {
  const [isSignup, setIsSignup] = useState(!!signupMode);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setLoading(false);
      if (onLogin) onLogin();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", {
        username: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: "admin"
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setLoading(false);
      if (onLogin) onLogin();
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || err.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className={`cont${isSignup ? " s--signup" : ""}`}>
      <div className="form sign-in">
        <h2>Welcome</h2>
        <form onSubmit={handleLogin}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={loginData.email}
              onChange={e => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={loginData.password}
              onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
          </label>
          <p className="forgot-pass" >Forgot password?</p>
          <button type="submit" className="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {error && !isSignup && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
        </form>
      </div>
      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>Don't have an account? Please Sign up!</h3>
            <br />
            <h3
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/aboutus")}
            >
              About US
            </h3>
          </div>
          <div className="img__text m--in">
            <h3>If you already have an account, just sign in.</h3>
            <br />
            <h3
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/aboutus")}
            >
              About US
            </h3>
          </div>
          <div className="img__btn" onClick={() => { setIsSignup(!isSignup); setError(""); }}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>
        <div className="form sign-up">
          <h2>Create your Account</h2>
          <form onSubmit={handleSignup}>
            <label>
              <span>Name</span>
              <input
                type="text"
                value={signupData.name}
                onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={signupData.email}
                onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={signupData.password}
                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
            </label>
            <button type="submit" className="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {error && isSignup && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

/*
// Add this to your main App.js or wherever your routes are defined:

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Aboutus from "./components/Aboutus";
// ...other imports...

function App() {
  // ...existing code...
  return (
    <Router>
      <Routes>
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/login" element={<LoginPage />} />
        // ...other routes...
      </Routes>
    </Router>
  );
}

export default App;
*/