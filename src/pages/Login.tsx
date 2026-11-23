import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { auth } from "../firebaseConfig";

export default function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "h-12 w-full bg-[#fffaff] px-3 text-base text-[#3c2941] focus:outline-none focus:ring-2 focus:ring-[#73457d]";

  // Track login, logout, and restored sessions after refreshing.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingSession(false);
    });

    return unsubscribe;
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setError("");
    setSaving(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (cause) {
      console.error("Login failed:", cause);

      if (cause instanceof FirebaseError) {
        if (
          cause.code === "auth/invalid-credential" ||
          cause.code === "auth/user-not-found" ||
          cause.code === "auth/wrong-password"
        ) {
          setError("The email or password is incorrect.");
        } else if (cause.code === "auth/invalid-email") {
          setError("Enter a valid email address.");
        } else if (cause.code === "auth/too-many-requests") {
          setError("Too many attempts. Please wait and try again.");
        } else if (cause.code === "auth/network-request-failed") {
          setError("Check your internet connection and try again.");
        } else if (cause.code === "auth/user-disabled") {
          setError("This account is disabled. Contact program staff.");
        } else {
          setError("Unable to log in. Please try again.");
        }
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    if (saving) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await signOut(auth);
    } catch (cause) {
      console.error("Logout failed:", cause);
      setError("Unable to log out. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#f1def1] px-5 py-6 text-left text-[#3c2941] [color-scheme:light] sm:p-8">
      <h1 className="sr-only m-0!">Log in</h1>

      {/* Logo placeholder */}
      <div className="mb-6 sm:absolute sm:left-8 sm:top-8 sm:mb-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#3c2941] text-center text-xs font-semibold text-white">
          RESTORE
          <br />
          HOPE
        </div>
      </div>

      <div className="mx-auto w-full max-w-sm sm:w-[52%] sm:max-w-[26rem]">
        {checkingSession ? (
          <p role="status" className="text-center">
            Checking sign-in…
          </p>
        ) : user ? (
          <section className="rounded-xl bg-[#fffaff] p-6 text-center">
            <p className="font-semibold">You are signed in as:</p>

            <p className="mt-2! break-words">
              {user.email}
            </p>

            <button
              type="button"
              onClick={handleLogout}
              disabled={saving}
              className="mt-6 rounded-lg bg-[#b8dedb] px-8 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "LOGGING OUT..." : "LOG OUT"}
            </button>
          </section>
        ) : (
          <>
            {/* Shared login form */}
            <form
              className="space-y-4"
              onSubmit={handleLogin}
              aria-busy={saving}
            >
              <div>
                <label
                  htmlFor="loginEmail"
                  className="mb-1 block text-lg uppercase"
                >
                  Email address
                </label>

                <input
                  id="loginEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  disabled={saving}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="loginPassword"
                  className="mb-1 block text-lg uppercase"
                >
                  Password
                </label>

                <input
                  id="loginPassword"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={inputClass}
                  disabled={saving}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mx-auto block bg-[#fffaff] px-10 py-1.5 text-sm hover:bg-[#b8dedb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "LOGGING IN..." : "LOG IN"}
              </button>
            </form>

            {/* Optional providers remain disabled */}
            <div className="mt-7 text-center">
              <p className="text-lg uppercase">
                Or log in with...
              </p>

              <div className="mx-auto mt-4 flex max-w-xs items-center justify-between gap-4">
                <button
                  type="button"
                  aria-label="Log in with Google"
                  className="flex h-16 w-16 items-center justify-center"
                  disabled
                >
                  <FcGoogle
                    className="h-14 w-14"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  aria-label="Log in with Apple"
                  className="flex h-16 w-16 items-center justify-center"
                  disabled
                >
                  <FaApple
                    className="h-14 w-14 text-black"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  aria-label="Log in with Microsoft"
                  className="flex h-16 w-16 items-center justify-center"
                  disabled
                >
                  <span
                    className="grid h-12 w-12 grid-cols-2 grid-rows-2 gap-0.5"
                    aria-hidden="true"
                  >
                    <span className="bg-[#f25022]" />
                    <span className="bg-[#7fba00]" />
                    <span className="bg-[#00a4ef]" />
                    <span className="bg-[#ffb900]" />
                  </span>
                </button>
              </div>
            </div>

            <p className="mt-8! text-center text-xs">
              Not part of the program yet?{" "}
              <Link
                to="/signup"
                className="font-semibold underline"
              >
                Register now
              </Link>
            </p>
          </>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5! text-center text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}