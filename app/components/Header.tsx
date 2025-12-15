"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../store/cart";
import { useSearch } from "../store/search";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";

const USER_KEY = "zyvero_user";

export default function Header() {
  const count = useCart((s) => s.items.reduce((sum, x) => sum + x.qty, 0));
  const query = useSearch((s) => s.query);
  const setQuery = useSearch((s) => s.setQuery);

  const [user, setUser] = useState<string | null>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    setUser(localStorage.getItem(USER_KEY));
  }, []);

  function openLogin() {
    setAuthMode("login");
    setAuthOpen(true);
  }

  function openSignup() {
    setAuthMode("signup");
    setAuthOpen(true);
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.href = "/";
  }

  return (
    <>
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold whitespace-nowrap">
          Zyvero
        </Link>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search Zyvero"
          className="flex-1 px-4 py-2 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <div className="flex items-center gap-4 whitespace-nowrap">
          {user ? (
            <>
              <span className="text-sm text-gray-200">
                Hi, {user.split("@")[0]}
              </span>

              <Link href="/cart" className="font-semibold hover:underline">
                Cart 🛒 ({count})
              </Link>

              <button onClick={logout} className="hover:underline">
                Logout
              </button>


            </>
          ) : (
            <>
              <button onClick={openLogin} className="hover:underline">
                Sign In
              </button>

              <button
                onClick={openSignup}
                className="bg-yellow-400 text-black px-3 py-2 rounded font-semibold"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <AuthModal
        open={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onAuthed={(email) => setUser(email)}
      />
    </>
  );
}
