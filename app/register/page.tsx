"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // TEMP register (frontend demo)
    if (name && email && password) {
      localStorage.setItem("zyvero_user", email);
      setTimeout(() => router.push("/"), 400);
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
          Create your Zyvero account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            placeholder="Full name"
            className="w-full border p-3 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Sign Up
          </motion.button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-700 hover:underline">
            Sign in
          </a>
        </p>
      </motion.div>
    </main>
  );
}
