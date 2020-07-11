const COLORS = {
  WHITE: "#ffffff",
  BLACK: "#121212",
  PINK: "#ff1e9f",
  PINK_DIM: "#fbdaed",
  PURPLE: "#7b1fff",
  PURPLE_DIM: "#442e63",
  GRAY_DARK: "#282936",
  GRAY_LIGHT: "#eeeeee"
}

const dark = toCSSVars({
  text: COLORS.WHITE,
  background: COLORS.BLACK,
  foreground: COLORS.GRAY_DARK,
  primary: COLORS.PINK,
  secondary: COLORS.PURPLE,
  secondaryDim: COLORS.PURPLE_DIM,
  gray: COLORS.GRAY_DARK,
})

const light = toCSSVars({
  text: COLORS.BLACK,
  background: COLORS.WHITE,
  foreground: COLORS.WHITE,
  primary: COLORS.PURPLE,
  secondary: COLORS.PINK,
  secondaryDim: COLORS.PINK_DIM,
  gray: COLORS.GRAY_LIGHT,
})

export const theme = {
  baseSize: ["12px", "16px"],

  sizes: {
    pageWidth: "48rem",
    contentWidth: "44rem",
  },

  fonts: {
    body: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "sans-serif",
    ],
    heading: ["Raleway", "sans-serif"],
  },

  fontSizes: [
    "0.8rem",
    "1rem",
    "1.25rem",
    "1.563rem",
    "1.953rem",
    "2.441rem",
    "3.052rem",
  ],

  fontWeights: {
    body: 300,
    heading: 500,
    bold: 700,
  },

  lineHeights: {
    body: 1.65,
    heading: [1.125, 1.125, 1.3],
  },

  colors: {
    shadow: COLORS.BLACK,
    ...dark.theme,
    ...light.theme,
  },
}

export const cssVars = {
  dark: dark.css,
  light: light.css,
}

function toCSSVars(themeProps) {
  return Object.entries(themeProps)
    .map(([key, value]) => [key, `--${toKebabCase(key)}`, value])
    .reduce(
      ({ css = {}, theme = {} }, [key, cssVar, value]) => ({
        css: { ...css, [cssVar]: value },
        theme: { ...theme, [key]: `var(${cssVar})` },
      }),
      {}
    )
}

function toKebabCase(camelCase) {
  return camelCase.match(/[A-Z][a-z]+|[a-z]+/g).join("-")
}
