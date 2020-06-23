import { css } from "@emotion/core"
import { cssVars, theme } from "../theme"
import { prism } from "./prism"

export const global = css`
  html {
    font-size: ${theme.baseSize};
    font-family: ${theme.fonts.body.join(",")};
    font-weight: ${theme.fontWeights.body};
    line-height: ${theme.lineHeights.body};
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;
  }

  body {
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
    transition: color, background-color 0.2s ease-in-out;
  }

  .dark {
    ${cssVars.dark}
  }

  .light {
    ${cssVars.light}
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: ${theme.fonts.heading.join(",")};
    font-weight: ${theme.fontWeights.heading};
    line-height: ${theme.lineHeights.heading};
    margin: 2.75rem 0 1.05rem;
  }

  h1 {
    font-size: ${theme.fontSizes[6]};
  }

  h2 {
    font-size: ${theme.fontSizes[5]};
  }

  h3 {
    font-size: ${theme.fontSizes[4]};
  }

  h4 {
    font-size: ${theme.fontSizes[3]};
  }

  h5 {
    font-size: ${theme.fontSizes[2]};
  }

  small {
    font-size: ${theme.fontSizes[0]};
  }

  strong {
    font-weight: ${theme.fontWeights.bold};
  }

  p {
    margin: 1.75rem 0;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    border-bottom: 1px solid ${theme.colors.secondaryDim};

    &:hover {
      border-bottom-color: ${theme.colors.secondary};
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td,
  th {
    padding: 0.5rem;
    border-bottom: 1px solid ${theme.colors.text};
  }

  .gatsby-highlight {
    margin-left: -3rem;
    margin-right: -3rem;
  }

  ${prism};
`
