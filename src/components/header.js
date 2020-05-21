import styled from "@emotion/styled"
import { Link } from "gatsby"
import React from "react"
import { Logo } from "./logo"
import { Menu } from "./menu"
import { theme } from "../theme"
import { ThemeToggle } from "./theme-toggle"

const StyledHeader = styled.header`
  background-color: ${theme.colors.foreground};
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 20px -15px ${theme.colors.shadow};
  transition: background-color 0.2s ease-in-out;
`

const HeaderContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  margin: 0 auto;
  max-width: ${theme.sizes.pageWidth};
`

const ImageLink = styled(Link)`
  display: flex;
  border: 0;
  &:hover .text {
    animation-duration: 1s;
  }
`

const StyledMenu = styled(Menu)`
  margin-left: 1rem;
`

const StyledThemeToggle = styled(ThemeToggle)`
  margin-left: auto;
`

export const Header = () => {
  return (
    <StyledHeader>
      <HeaderContent>
        <ImageLink to="/">
          <Logo />
        </ImageLink>
        <StyledMenu />
        <StyledThemeToggle />
      </HeaderContent>
    </StyledHeader>
  )
}
