"use client";
import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../lib/api";
import "../styles/auth.css";

export default function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/v1/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, username, email, password })
    });

    //const data = await res.json();

    if (!res.ok) {
      alert("could not sign up!")
      
      return;
    }

    window.location.href = "/login";
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Heading */}
        <h1 className="auth-title">Create Account</h1>

        {/* Form */}
        <form onSubmit={handleSignup} className="auth-form">

          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          <button type="submit" className="auth-btn">
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>

  );
}
