import styled from "@emotion/styled"
import { Global } from "@emotion/core"

import React from "react"
import { Header } from "./header"
import { global } from "../styles/global"
import { theme } from "../theme"

const Root = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  margin: 0 auto;
`

const Content = styled.div`
  flex: 1 0 auto;
`

const Main = styled.main`
  margin: 0 auto;
  padding: 1.5rem;
  max-width: ${theme.sizes.contentWidth};
`

const Footer = styled.footer`
  flex-shrink: 0;
  margin-top: 5rem;
  margin-bottom: 1rem;
  text-align: center;
`

const Layout = ({ children }) => {
  return (
    <Root>
      <Global styles={global} />

      <Content>
        <Header />
        <Main>{children}</Main>
      </Content>

      <Footer>
        © <a href="https://twitter.com/ognus">Tomek Kolasa</a> &bull;{" "}
        {new Date().getFullYear()} &bull; Open sourced on{" "}
        <a href="https://github.com/ognus/tomekkolasa.com">GitHub</a>
      </Footer>
    </Root>
  )
}

export default Layout
