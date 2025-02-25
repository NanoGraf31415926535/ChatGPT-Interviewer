export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./local_packages/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        highlight: {
          "0%": { backgroundColor: "#2f63f1" },
          "100%": { backgroundColor: "black" },
        },
        glow: {
          "0%": {
            textColor: "rgb(255, 40, 180)",
            fontWeight: "900",
            textShadow: "0px 0px 20px rgb(47, 99, 241)",
          },
          "10%": {
            scale: "1.3",
          },
          "50%": {
            textColor: "rgb(255, 40, 180)",
            fontWeight: "normal",
            scale: "1.2",
          },
          "100%": {
            textColor: "black",
            scale: "1",
          },
        },
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1
          }
        }
      },
      animation: {
        highlight: "highlight 1s ease-in-out",
        glow: "glow 1s ease-in-out",
        "fade-in": "fade-in 1.7s ease-in-out forwards"
      },
    },
  },
  variants: {
    extend: {
      animation: ["hover", "focus"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["emerald"],
  },
};
