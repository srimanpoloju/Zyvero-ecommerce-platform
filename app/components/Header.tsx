"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../store/cart";
import { useSearch } from "../store/search";
import SearchDropdown from "./SearchDropdown";

export default function Header() {
  const count = useCart((s) => s.items.reduce((sum, x) => sum + x.qty, 0));
  const query = useSearch((s) => s.query);
  const setQuery = useSearch((s) => s.setQuery);

  const [user, setUser] = useState<string | null>(null);
  const [openSearch, setOpenSearch] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUser(
      localStorage.getItem("zyvero_user") || sessionStorage.getItem("zyvero_user")
    );
  }, []);

  function logout() {
    localStorage.removeItem("zyvero_user");
    sessionStorage.removeItem("zyvero_user");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between gap-4">
      <Link href="/" className="text-xl font-bold whitespace-nowrap">
        Zyvero
      </Link>

      {/* Search box + dropdown */}
      <div className="relative flex-1">
        <input
          id="zyvero-search"
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpenSearch(true);
          }}
          onFocus={() => setOpenSearch(true)}
          type="text"
          placeholder="Search Zyvero"
          className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <SearchDropdown
          open={openSearch && query.trim().length > 0}
          anchorId="zyvero-search"
          onClose={() => setOpenSearch(false)}
        />
      </div>

      <div className="flex items-center gap-4 whitespace-nowrap">
        {user ? (
          <>
            <span className="text-sm text-gray-200">Hi, {user.split("@")[0]}</span>
            <button onClick={logout} className="hover:underline">
              Logout
            </button>

            <Link href="/cart" className="font-semibold hover:underline">
              Cart 🛒 ({count})
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-yellow-400 text-black px-3 py-2 rounded font-semibold"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
