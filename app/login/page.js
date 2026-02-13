"use client";
import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../lib/api";
import "../styles/auth.css";
import {useToast} from "../hooks/toast"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { toast, showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = data.message || "Login failed"; 
      showToast(errorMessage,"error");
      return;
    }

    showToast(data.message || "logged In successfully", "success")
    // success, then redirect
    window.location.href = "/dashboard";
  };

  return (

    

    <div className="auth-container">

      {toast.visible && (
        <div className={`toast-notification toast-${toast.type}`}>
           <span>{toast.message}</span>
        </div>
      )}

      <form className="auth-card" onSubmit={handleLogin}>
        <h2 className="auth-title">Login</h2>

        <input className="auth-input" placeholder="Email or username" onChange={(e)=>setIdentifier(e.target.value)}/>
        <input className="auth-input" type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>

        <button className="auth-btn" type="submit">Login</button>

        <p className="auth-footer">
          Don't have an account? <Link href="/signup">Register</Link>
        </p>
      </form>
  </div>

  );
}
