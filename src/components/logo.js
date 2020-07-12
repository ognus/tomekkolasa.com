import React from "react"
import styled from "@emotion/styled"
import LogoSVG from "../../content/assets/logo.inline.svg"
import { theme } from "../theme"

const LogoImage = styled(LogoSVG)`
  width: 4rem;
  height: 100%;
  margin-top: 2px;

  .text {
    fill: ${theme.colors.primary};
    stroke: ${theme.colors.primary};
    animation: ColorAnimation 30s ease infinite;
  }

  .tag {
    stroke: ${theme.colors.text};
  }

  @keyframes ColorAnimation {
    0% {
      fill: ${theme.colors.primary};
      stroke: ${theme.colors.primary};
    }
    50% {
      fill: ${theme.colors.secondary};
      stroke: ${theme.colors.secondary};
    }
    100% {
      fill: ${theme.colors.primary};
      stroke: ${theme.colors.primary};
    }
  }
`

export const Logo = () => {
  return <LogoImage />
}
