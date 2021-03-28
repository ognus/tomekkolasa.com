import { css } from "@emotion/react"
import { cssVars, theme } from "../theme"
import { prism } from "./prism"

export const wide = css`
  margin-left: -2rem;
  margin-right: -2rem;
`

export const blockquote = css`
  margin-block-start: 1.5rem;
  margin-block-end: 1.5rem;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-block-start: 0.5rem;
  padding-block-end: 0.5rem;
  padding-inline-start: calc(2.5rem - 6px);
  padding-inline-end: 2.5rem;
  border-left: 6px solid ${theme.colors.primary};

  p {
    margin: 0;
    font-size: 1.25rem;
  }

  cite {
    display: block;
    margin-top: 1rem;

    &::before {
      content: "\\2014\\00a0";
    }
  }
`

export const global = css`
  html {
    font-size: ${theme.baseSize[0]};
    font-family: ${theme.fonts.body.join(",")};
    font-weight: ${theme.fontWeights.body};
    line-height: ${theme.lineHeights.body};
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;

    @media (min-width: ${theme.sizes.contentWidth}) {
      font-size: ${theme.baseSize[1]};
    }
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
    line-height: ${theme.lineHeights.heading[0]};
    margin: 1.75em 0 0.5em;
  }

  h1 {
    font-size: ${theme.fontSizes[6]};
    margin-top: 0.5em;
  }

  h2 {
    font-size: ${theme.fontSizes[5]};
    line-height: ${theme.lineHeights.heading[1]};
  }

  h3 {
    font-size: ${theme.fontSizes[4]};
    line-height: ${theme.lineHeights.heading[2]};
  }

  h4 {
    font-size: ${theme.fontSizes[3]};
    line-height: ${theme.lineHeights.heading[3]};
  }

  h5 {
    font-size: ${theme.fontSizes[2]};
  }

  strong {
    font-weight: ${theme.fontWeights.bold};
  }

  p {
    margin: 1.5rem 0;
  }

  p,
  ul,
  ol,
  div {
    font-size: ${theme.baseSize[1]};
  }

  ul {
    padding-inline-start: 2.5rem;
  }

  blockquote {
    ${blockquote}
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

    @media (max-width: ${theme.sizes.contentWidth}) {
      display: block;

      tr {
        display: flex;
        flex-wrap: wrap;

        justify-content: space-between;
      }

      td {
        display: block;

        &:first-of-type {
          width: 100%;
        }
      }

      th:first-of-type {
        display: none;
      }
    }
  }

  tr {
    border-bottom: 1px solid var(--text);
  }

  td,
  th {
    padding: 0.5rem;
  }

  .gatsby-highlight {
    ${wide};

    pre[class*="language-"] {
      padding: 2rem;
      border-radius: 0;

      @media (min-width: ${theme.sizes.contentWidth}) {
        border-radius: 5px;
      }
    }
  }

  ${prism};
`
