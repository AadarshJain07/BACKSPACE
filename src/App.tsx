If you mean “they may detect that I used AI to write the code”, don't try to disguise AI-generated code as human-written. Instead, make the project genuinely yours.

For BACKSPACE, do this:

You decide the UI/layout before coding.
Use AI for guidance, debugging, and explaining concepts, not blindly pasting whole files.
Write the main components yourself.
Understand every line you commit.
Change things based on your own design decisions.
Keep your actual development history in Git commits.
Don't add fake comments or intentionally messy code just to “look human.”

For the current task, I'd suggest we build it together in small pieces instead of me dumping the whole App.tsx.

For example, you write the <main> structure, and I'll tell you what Tailwind classes or React concepts to use. That way you actually build BACKSPACE and can explain it if someone asks.

done now wht

Now Task 3 — Year Selector 🔥

Add these years to the landing page:

1995 · 2000 · 2005 · 2010 · 2015 · 2020 · 2026

Your task
Create a small years array in App.tsx
Use .map() to render each year as a button
Add hover styling
Keep 2026 selected by default
Clicking a year should update a selectedYear state

You'll need:

useState

from React.

Don't build the theme yet. Just make the year buttons work and show which year is selected.

just gige code
import { useState } from "react"

function App() {
  const years = [1995, 2000, 2005, 2010, 2015, 2020, 2026]
  const [selectedYear, setSelectedYear] = useState(2026)

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="text-center max-w-3xl">
        <p className="mb-6 text-sm tracking-[0.4em] uppercase text-white/40">
          Digital Time Machine
        </p>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          BACKSPACE
        </h1>

        <p className="mt-6 text-xl md:text-2xl text-white/60">
          rewind the internet.
        </p>

        <p className="mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed text-white/40">
          Explore how the internet evolved through different eras.
          Pick a year and watch the web transform around you.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedYear === year
                  ? "bg-white text-black border-white"
                  : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <p className="mt-8 text-white/40">
          Currently exploring{" "}
          <span className="text-white">{selectedYear}</span>
        </p>
      </section>
    </main>
  )
}

export default App