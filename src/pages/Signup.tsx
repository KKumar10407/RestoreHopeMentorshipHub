export default function Signup() {
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

  return (
    <main className="min-h-screen bg-[#f1def1] p-4 text-left text-[#3c2941] [color-scheme:light] sm:p-8">
      {/* Page heading */}
      <header className="mb-6 flex items-center gap-4">
        {/* Text placeholder until we add the actual logo */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#3c2941] text-center text-xs font-semibold text-white">
          RESTORE
          <br />
          HOPE
        </div>

        <h1 className="m-0! text-2xl! font-semibold! tracking-normal! text-[#3c2941]!">
          SIGN UP
        </h1>
      </header>

      <form
        className="space-y-6"
        onSubmit={(event) => event.preventDefault()}
      >
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
                        <span className="block">{time.name}</span>
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

        {/* Navigation and account button */}
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs">
            Already have an account?{" "}
            <button type="button" className="font-semibold underline">
              Log in
            </button>
          </p>

          <button
            type="button"
            className="w-full rounded-lg bg-[#b8dedb] px-8 py-3 text-sm font-semibold hover:bg-[#a5cfcc] sm:w-auto"
          >
            CREATE ACCOUNT
          </button>
        </footer>
      </form>
    </main>
  );
}