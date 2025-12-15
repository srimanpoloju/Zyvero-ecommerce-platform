"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Mode = "login" | "signup";
type Step = "email" | "password";

const USER_KEY = "zyvero_user";
const LAST_EMAIL_KEY = "zyvero_last_email";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function checkPasswordRules(pw: string) {
  const rules = {
    min8: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const ok = rules.min8 && rules.upper && rules.number && rules.special;
  return { rules, ok };
}

export default function AuthModal({
  open,
  onClose,
  onAuthed,
  initialMode = "login",
}: {
  open: boolean;
  onClose: () => void;
  onAuthed: (email: string) => void;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>("email");

  const [remember, setRemember] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Field-level errors
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  // Loading (for nice UX; later replace with real backend calls)
  const [loadingContinue, setLoadingContinue] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const pwCheck = useMemo(() => checkPasswordRules(password), [password]);

  // Reset + load remembered email when opening
  useEffect(() => {
    if (!open) return;

    setMode(initialMode);
    setStep("email");

    setName("");
    setPassword("");
    setShowPassword(false);
    setRemember(true);

    setNameErr(null);
    setEmailErr(null);
    setPasswordErr(null);

    setLoadingContinue(false);
    setLoadingSubmit(false);

    const last = localStorage.getItem(LAST_EMAIL_KEY) || "";
    setEmail(last);
  }, [open, initialMode]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Validation helpers
  function validateEmailNow(value: string) {
    const v = value.trim();
    if (!v) return "Email is required.";
    if (!isValidEmail(v)) return "Enter a valid email (example: name@gmail.com).";
    return null;
  }

  function validateNameNow(value: string) {
    const v = value.trim();
    if (!v) return "Full name is required.";
    if (v.length < 2) return "Name looks too short.";
    return null;
  }

  function validatePasswordNow(value: string) {
    if (!value) return "Password is required.";
    if (mode === "signup" && !checkPasswordRules(value).ok) {
      return "Password must meet the rules below.";
    }
    return null;
  }

  // Button enabled states (Amazon-like UX)
  const canContinue =
    (mode === "signup" ? !validateNameNow(name) : true) && !validateEmailNow(email);

  const canSubmit =
    !validateEmailNow(email) &&
    (mode === "signup" ? !validateNameNow(name) : true) &&
    !validatePasswordNow(password);

  async function continueToPassword(e: React.FormEvent) {
    e.preventDefault();

    if (loadingContinue) return;

    setNameErr(null);
    setEmailErr(null);

    if (mode === "signup") {
      const ne = validateNameNow(name);
      if (ne) setNameErr(ne);
    }

    const ee = validateEmailNow(email);
    if (ee) {
      setEmailErr(ee);
      return;
    }

    // Remember email for next time
    localStorage.setItem(LAST_EMAIL_KEY, email.trim());

    // Small loading for smooth UX (replace with real API later)
    setLoadingContinue(true);
    setTimeout(() => {
      setLoadingContinue(false);
      setStep("password");
      setPasswordErr(null);
    }, 400);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (loadingSubmit) return;

    setNameErr(null);
    setEmailErr(null);
    setPasswordErr(null);

    if (mode === "signup") {
      const ne = validateNameNow(name);
      if (ne) {
        setNameErr(ne);
        setStep("email");
        return;
      }
    }

    const ee = validateEmailNow(email);
    if (ee) {
      setEmailErr(ee);
      setStep("email");
      return;
    }

    const pe = validatePasswordNow(password);
    if (pe) {
      setPasswordErr(pe);
      return;
    }

    // Remember email for next time
    localStorage.setItem(LAST_EMAIL_KEY, email.trim());

    setLoadingSubmit(true);

    // Fake network delay (replace with backend later)
    setTimeout(() => {
      setLoadingSubmit(false);

      // Remember me: persist vs session
      if (remember) {
        localStorage.setItem(USER_KEY, email.trim());
        sessionStorage.removeItem(USER_KEY);
      } else {
        sessionStorage.setItem(USER_KEY, email.trim());
        localStorage.removeItem(USER_KEY);
      }

      toast.success(
        mode === "login" ? "Signed in successfully" : "Account created successfully"
      );

      onAuthed(email.trim());
      onClose();
    }, 600);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div className="font-bold text-lg">
                {mode === "login" ? "Sign in" : "Create account"}{" "}
                <span className="text-gray-500 font-normal">• Zyvero</span>
              </div>

              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setStep("email");
                  setPassword("");
                  setShowPassword(false);
                  setNameErr(null);
                  setEmailErr(null);
                  setPasswordErr(null);
                }}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  mode === "login"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setStep("email");
                  setPassword("");
                  setShowPassword(false);
                  setNameErr(null);
                  setEmailErr(null);
                  setPasswordErr(null);
                }}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  mode === "signup"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-800"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="p-4">
              {/* STEP 1: Email (Amazon-like Continue) */}
              {step === "email" && (
                <form onSubmit={continueToPassword} className="space-y-3">
                  {mode === "signup" && (
                    <div>
                      <label className="text-sm font-semibold text-gray-800">
                        Full name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameErr) setNameErr(null);
                        }}
                        onBlur={() => setNameErr(mode === "signup" ? validateNameNow(name) : null)}
                        placeholder="John Doe"
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                      {nameErr && (
                        <p className="mt-1 text-xs text-red-600">{nameErr}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-gray-800">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailErr) setEmailErr(null);
                      }}
                      onBlur={() => setEmailErr(validateEmailNow(email))}
                      type="email"
                      placeholder="you@example.com"
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {emailErr && (
                      <p className="mt-1 text-xs text-red-600">{emailErr}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      We’ll ask for your password next.
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={!canContinue || loadingContinue}
                    className={`w-full rounded px-4 py-2 font-semibold ${
                      canContinue && !loadingContinue
                        ? "bg-yellow-400 hover:bg-yellow-500"
                        : "bg-yellow-200 cursor-not-allowed"
                    }`}
                  >
                    {loadingContinue ? "Loading..." : "Continue"}
                  </motion.button>

                  <div className="text-xs text-gray-500 text-center">
                    By continuing, you agree to Zyvero’s Terms & Privacy Policy.
                  </div>
                </form>
              )}

              {/* STEP 2: Password */}
              {step === "password" && (
                <form onSubmit={submit} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Email:</span>{" "}
                      {email || "—"}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setPasswordErr(null);
                      }}
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-800">
                      Password
                    </label>

                    <div className="mt-1 flex items-center gap-2">
                      <input
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordErr) setPasswordErr(null);
                        }}
                        onBlur={() => setPasswordErr(validatePasswordNow(password))}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="w-full border rounded px-3 py-2"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="border rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    {passwordErr && (
                      <p className="mt-1 text-xs text-red-600">{passwordErr}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() =>
                        toast("Password reset will be enabled once backend is added 🔐")
                      }
                      className="text-sm text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Password rules only for signup */}
                  {mode === "signup" && (
                    <div className="rounded-lg border bg-gray-50 p-3">
                      <div className="text-sm font-semibold text-gray-800 mb-2">
                        Password must include:
                      </div>
                      <ul className="text-sm space-y-1">
                        <li
                          className={
                            pwCheck.rules.min8 ? "text-green-700" : "text-gray-700"
                          }
                        >
                          • At least 8 characters
                        </li>
                        <li
                          className={
                            pwCheck.rules.upper ? "text-green-700" : "text-gray-700"
                          }
                        >
                          • 1 uppercase letter (A-Z)
                        </li>
                        <li
                          className={
                            pwCheck.rules.number ? "text-green-700" : "text-gray-700"
                          }
                        >
                          • 1 number (0-9)
                        </li>
                        <li
                          className={
                            pwCheck.rules.special ? "text-green-700" : "text-gray-700"
                          }
                        >
                          • 1 special character (!@#…)
                        </li>
                      </ul>
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember me
                  </label>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={!canSubmit || loadingSubmit}
                    className={`w-full rounded px-4 py-2 font-semibold ${
                      canSubmit && !loadingSubmit
                        ? "bg-yellow-400 hover:bg-yellow-500"
                        : "bg-yellow-200 cursor-not-allowed"
                    }`}
                  >
                    {loadingSubmit
                      ? mode === "login"
                        ? "Signing in..."
                        : "Creating account..."
                      : mode === "login"
                      ? "Sign In"
                      : "Create account"}
                  </motion.button>

                  <div className="text-xs text-gray-500 text-center">
                    Tip: Uncheck “Remember me” on shared computers.
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
