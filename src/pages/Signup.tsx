import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function Signup() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClass =
    "w-full min-w-0 rounded-lg border border-[#e4cce7] bg-white px-3 py-2 text-sm text-[#3c2941] focus:outline-none focus:ring-2 focus:ring-[#73457d]";

  const labelClass =
    "mb-1 block text-xs font-medium uppercase";

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const times = [
    { name: "Morning", hours: "7 AM – 12 PM" },
    { name: "Afternoon", hours: "12 PM – 5 PM" },
    { name: "Evening", hours: "5 PM – 8 PM" },
  ];

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving || success) {
      return;
    }

    setError("");

    // Read the values entered in the form.
    const formData = new FormData(event.currentTarget);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const role = String(formData.get("role") ?? "");
    const phone = String(formData.get("phone") ?? "").trim();
    const dateOfBirth = String(formData.get("dateOfBirth") ?? "");
    const communication = String(formData.get("communication") ?? "");
    const availability = formData.getAll("availability").map(String);

    // Validate the names.
    if (
      !firstName ||
      !lastName ||
      firstName.length > 100 ||
      lastName.length > 100
    ) {
      setError("Enter a first and last name, each up to 100 characters.");
      return;
    }

    // Only mentor and mentee are allowed during signup.
    if (role !== "mentor" && role !== "mentee") {
      setError("Select Mentor or Mentee.");
      return;
    }

    // Match the limits in our Firestore rules.
    if (
      phone.length > 30 ||
      dateOfBirth.length > 10 ||
      availability.length > 21 ||
      !["", "email", "phone", "text"].includes(communication)
    ) {
      setError("Check your contact details and availability.");
      return;
    }

    setSaving(true);

    try {
      // Wait for Firebase to restore any existing session.
      await auth.authStateReady();

      let user = auth.currentUser;

      if (
        user &&
        user.email?.toLowerCase() !== email.toLowerCase()
      ) {
        setError(
          "Another account is signed in. Sign out before registering."
        );
        return;
      }

      // Create the account if the user is not already signed in.
      // Reusing the signed-in account lets us retry a failed profile save.
      if (!user) {
        const status = await validatePassword(auth, password);

        if (!status.isValid) {
          const limits = status.passwordPolicy.customStrengthOptions;
          const missing: string[] = [];

          if (status.meetsMinPasswordLength === false) {
            missing.push(
              `at least ${limits.minPasswordLength} characters`
            );
          }

          if (status.meetsMaxPasswordLength === false) {
            missing.push(
              `no more than ${limits.maxPasswordLength} characters`
            );
          }

          if (status.containsLowercaseLetter === false) {
            missing.push("a lowercase letter");
          }

          if (status.containsUppercaseLetter === false) {
            missing.push("an uppercase letter");
          }

          if (status.containsNumericCharacter === false) {
            missing.push("a number");
          }

          if (status.containsNonAlphanumericCharacter === false) {
            missing.push("an allowed symbol");
          }

          setError(
            missing.length > 0
              ? `Your password needs: ${missing.join(", ")}.`
              : "Choose a stronger password."
          );

          return;
        }

        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        user = result.user;
      }

      // Use the Firebase account's UID as the profile document ID.
      const profileRef = doc(db, "users", user.uid);

      // Passwords are never included in the Firestore profile.
      const profileData = {
        firstName,
        lastName,
        email: user.email,
        role,
        phone,
        dateOfBirth,
        communication,
        availability,
        createdAt: serverTimestamp(),
      };

      // Create the profile only if it does not already exist.
      const createdProfile = await runTransaction(
        db,
        async (transaction) => {
          const existingProfile = await transaction.get(profileRef);

          if (existingProfile.exists()) {
            return false;
          }

          transaction.set(profileRef, profileData);
          return true;
        }
      );

      setSuccess(
        createdProfile
          ? "Your account and profile were created successfully."
          : "Your account already has a saved profile."
      );
    } catch (cause) {
      console.error("Signup failed:", cause);

      if (
        auth.currentUser?.email?.toLowerCase() === email.toLowerCase()
      ) {
        setError(
          "Your account exists, but we couldn't confirm your profile was saved. Try Create Account again."
        );
      } else if (
        cause instanceof FirebaseError &&
        cause.code === "auth/email-already-in-use"
      ) {
        setError("This email already has an account. Use Log in.");
      } else if (
        cause instanceof FirebaseError &&
        cause.code === "auth/network-request-failed"
      ) {
        setError("Check your internet connection and try again.");
      } else if (
        cause instanceof FirebaseError &&
        cause.code === "auth/too-many-requests"
      ) {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError("Unable to complete signup. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f1def1] p-4 text-left text-[#3c2941] [color-scheme:light] sm:p-8">
      {/* Page heading */}
      <header className="mb-6 flex items-center gap-4">
        {/* Placeholder until the actual logo is added */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#3c2941] text-center text-xs font-semibold text-white">
          RESTORE
          <br />
          HOPE
        </div>

        <h1 className="m-0! text-2xl! font-semibold! tracking-normal! text-[#3c2941]!">
          SIGN UP
        </h1>
      </header>

      <form className="space-y-6" onSubmit={handleSignup}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Personal details */}
          <section
            aria-labelledby="details-heading"
            className="min-w-0 rounded-2xl border border-[#e4cce7] bg-[#fffaff] p-5"
          >
            <h2
              id="details-heading"
              className="m-0! text-base! font-semibold! text-[#3c2941]!"
            >
              YOUR DETAILS
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className={labelClass}>
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  maxLength={100}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className={labelClass}>
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  maxLength={100}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className={labelClass}>
                  Date of birth
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="communication" className={labelClass}>
                  Preferred communication
                </label>

                <select
                  id="communication"
                  name="communication"
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a method
                  </option>
                  <option value="email">Email</option>
                  <option value="phone">Phone call</option>
                  <option value="text">Text message</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="role" className={labelClass}>
                  Sign up as
                </label>

                <select
                  id="role"
                  name="role"
                  defaultValue=""
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="mentor">Mentor</option>
                  <option value="mentee">Mentee</option>
                </select>
              </div>
            </div>
          </section>

          {/* Weekly availability */}
          <section
            aria-labelledby="availability-heading"
            className="min-w-0 rounded-2xl border border-[#e4cce7] bg-[#fffaff] p-5"
          >
            <h2
              id="availability-heading"
              className="m-0! text-base! font-semibold! text-[#3c2941]!"
            >
              WEEKLY AVAILABILITY
            </h2>

            <p className="mt-2! text-xs">
              Select all times that work for you.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[280px] table-fixed border-collapse text-xs">
                <caption className="sr-only">
                  Weekly availability by day and time
                </caption>

                <thead className="bg-[#b8dedb]">
                  <tr>
                    <th scope="col" className="p-2 text-left">
                      Day
                    </th>

                    {times.map((time) => (
                      <th
                        key={time.name}
                        scope="col"
                        className="p-2 text-center"
                      >
                        <span className="block">
                          {time.name}
                        </span>

                        <span className="block text-[10px] font-normal">
                          {time.hours}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {days.map((day) => (
                    <tr
                      key={day}
                      className="border-b border-[#e4cce7] last:border-0"
                    >
                      <th
                        scope="row"
                        className="px-2 text-left font-normal"
                      >
                        {day}
                      </th>

                      {times.map((time) => (
                        <td key={time.name}>
                          <label className="flex min-h-11 cursor-pointer items-center justify-center">
                            <span className="sr-only">
                              {day}, {time.name}, {time.hours}
                            </span>

                            <input
                              type="checkbox"
                              name="availability"
                              value={`${day}-${time.name}`}
                              className="h-4 w-4 accent-[#73457d]"
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Error and success messages */}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-800">
            {success}
          </p>
        )}

        {/* Login link and submit button */}
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold underline">
              Log in
            </Link>
          </p>

          <button
            type="submit"
            disabled={saving || success !== ""}
            className="w-full rounded-lg bg-[#b8dedb] px-8 py-3 text-sm font-semibold hover:bg-[#a5cfcc] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving
              ? "SAVING..."
              : success
                ? "ACCOUNT READY"
                : "CREATE ACCOUNT"}
          </button>
        </footer>
      </form>
    </main>
  );
}