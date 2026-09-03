export const eras = {
  1995: {
    year: 1995,
    title: "Web 1.0",
    subtitle: "Welcome to the World Wide Web",
    description:
      "A small window into the early internet. Everything is slower, simpler, and proudly pixelated.",
    background: "#c0c0c0",
    text: "#000080",
    border: "#808080",
    font: "monospace",
  },

  2000: {
    year: 2000,
    title: "Web 1.0",
    subtitle: "The web is growing",
    description:
      "Static pages, personal websites, forums, and the beginning of a connected web.",
    background: "#ffffff",
    text: "#0000ee",
    border: "#999999",
    font: "Arial, sans-serif",
  },

  2005: {
    year: 2005,
    title: "Web 2.0",
    subtitle: "The web becomes social",
    description:
      "Blogs, profiles, video sharing, social networks, and user-generated content.",
    background: "#e8f1ff",
    text: "#1f3a5f",
    border: "#8aa4c4",
    font: "Arial, sans-serif",
  },

  2010: {
    year: 2010,
    title: "Social Web",
    subtitle: "Everyone is online",
    description:
      "Social feeds, smartphones, apps, and a web that follows you everywhere.",
    background: "#f5f5f5",
    text: "#222222",
    border: "#cccccc",
    font: "Helvetica, Arial, sans-serif",
  },

  2015: {
    year: 2015,
    title: "Mobile Web",
    subtitle: "The internet fits in your pocket",
    description:
      "Responsive design, mobile apps, streaming, and an increasingly visual internet.",
    background: "#fafafa",
    text: "#111111",
    border: "#dddddd",
    font: "system-ui, sans-serif",
  },

  2020: {
    year: 2020,
    title: "Platform Era",
    subtitle: "The internet becomes the platform",
    description:
      "Creators, algorithms, streaming, remote work, and platforms shaping what we see.",
    background: "#111111",
    text: "#f5f5f5",
    border: "#444444",
    font: "system-ui, sans-serif",
  },

  2026: {
    year: 2026,
    title: "AI Web",
    subtitle: "rewind the internet.",
    description:
      "The modern web, shaped by AI, intelligent interfaces, and increasingly personalized experiences.",
    background: "#000000",
    text: "#ffffff",
    border: "#333333",
    font: "system-ui, sans-serif",
  },
} as const

export const years = Object.keys(eras).map(Number) as Array<keyof typeof eras>