import styled from "@emotion/styled"
import { Global } from "@emotion/core"

import React from "react"
import { Header } from "./header"
import { global } from "../styles/global"
import { theme } from "../theme"

const Root = styled.div`
  margin: 0 auto;
`

const Main = styled.main`
  margin: 0 auto;
  padding: 1rem;
  max-width: ${theme.sizes.contentWidth};
`

const Layout = ({ location, children }) => {
  const ROOT_PATH = `${__PATH_PREFIX__}/`
  const titleTag = location.pathname === ROOT_PATH ? "h1" : "p"

  return (
    <Root>
      <Global styles={global} />
      <Header titleAs={titleTag} />
      <Main>{children}</Main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </Root>
  )
}

export default Layout
