import { Link } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";

export default function Login() {
  const inputClass =
    "h-12 w-full bg-[#fffaff] px-3 text-base text-[#3c2941] focus:outline-none focus:ring-2 focus:ring-[#73457d]";

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

      {/* Shared login form */}
      <div className="mx-auto w-full max-w-sm sm:w-[52%] sm:max-w-[26rem]">
        <form
          className="space-y-4"
          onSubmit={(event) => event.preventDefault()}
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
              required
            />
          </div>

          <button
            type="button"
            className="mx-auto block bg-[#fffaff] px-10 py-1.5 text-sm hover:bg-[#b8dedb]"
          >
            LOG IN
          </button>
        </form>

        {/* Provider buttons are visual placeholders */}
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
              <FcGoogle className="h-14 w-14" aria-hidden="true" />
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

        {/* Keep signup accessible */}
        <p className="mt-8! text-center text-xs">
          Not part of the program yet?{" "}
          <Link to="/signup" className="font-semibold underline">
            Register now
          </Link>
        </p>
      </div>
    </main>
  );
}