"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // TEMP frontend auth (we will replace with backend later)
    if (email && password) {
      // IMPORTANT: same key used in Header
      localStorage.setItem("zyvero_user", email);

      // Full reload so Header updates immediately
      window.location.href = "/";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Sign in to Zyvero
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded font-semibold"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-sm text-center mt-4">
          New to Zyvero?{" "}
          <a href="/register" className="text-blue-700 hover:underline">
            Create an account
          </a>
        </p>
      </motion.div>
    </main>
  );
}
