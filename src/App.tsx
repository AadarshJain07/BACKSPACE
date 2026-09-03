import { useState } from "react"
import { eras, years } from "./eras"

function App() {
  const [selectedYear, setSelectedYear] = useState<keyof typeof eras>(2026)

  const theme = eras[selectedYear]
  const is1995 = selectedYear === 1995

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 transition-all duration-700"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.font,
      }}
    >
      <section className="w-full max-w-4xl">

        {/* Header */}
        <div
          className={`text-center ${
            is1995 ? "border-4 border-double p-6" : ""
          }`}
          style={{
            borderColor: is1995 ? theme.border : "transparent",
          }}
        >
          <p className="mb-6 text-sm tracking-[0.4em] uppercase opacity-50">
            {is1995 ? "WORLD WIDE WEB" : "DIGITAL TIME MACHINE"}
          </p>

          <h1
            className={`font-bold ${
              is1995
                ? "text-5xl md:text-7xl underline"
                : "text-6xl md:text-8xl tracking-tight"
            }`}
          >
            {theme.title}
          </h1>

          <p
            className={`mt-6 ${
              is1995
                ? "text-lg md:text-xl"
                : "text-xl md:text-2xl"
            } opacity-70`}
          >
            {theme.subtitle}
          </p>

          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed opacity-60">
            {theme.description}
          </p>
        </div>

        {/* Year Selector */}
        <div
          className={`mt-12 flex flex-wrap justify-center gap-3 ${
            is1995 ? "border-t border-b py-6" : ""
          }`}
          style={{
            borderColor: is1995 ? theme.border : "transparent",
          }}
        >
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`transition-all duration-300 ${
                is1995
                  ? "px-4 py-2 border"
                  : "px-4 py-2 rounded-full border"
              }`}
              style={{
                borderColor: theme.border,
                backgroundColor:
                  selectedYear === year ? theme.text : "transparent",
                color:
                  selectedYear === year ? theme.background : theme.text,
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Current Era */}
        <div
          className={`mt-8 text-center ${
            is1995 ? "font-bold" : ""
          }`}
        >
          Currently exploring{" "}
          <span className="opacity-100">
            {selectedYear}
          </span>
        </div>

        {/* 1995 browser-style footer */}
        {is1995 && (
          <div
            className="mt-10 text-center text-xs border-t pt-4"
            style={{ borderColor: theme.border }}
          >
            Best viewed with a web browser · © 1995 BACKSPACE
          </div>
        )}
      </section>
    </main>
  )
}

export default App
//day 1 just added basic stuff