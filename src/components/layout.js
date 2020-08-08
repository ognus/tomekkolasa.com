import styled from "@emotion/styled"
import { Global } from "@emotion/core"
import { MDXProvider } from "@mdx-js/react"

import React from "react"
import { Header } from "./header"
import { global } from "../styles/global"
import { theme } from "../theme"
import { Tweet } from "./widgets/tweet"
import { Block } from "./widgets/block"

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
  padding: 2rem;
  max-width: ${theme.sizes.contentWidth};
`

const Footer = styled.footer`
  flex-shrink: 0;
  margin-top: 5rem;
  margin-bottom: 1rem;
  text-align: center;
`

const Layout = ({ children }) => {
  const shortcodes = { Tweet, Block }

  return (
    <Root>
      <Global styles={global} />

      <Content>
        <Header />
        <Main>
          <MDXProvider components={shortcodes}>{children}</MDXProvider>
        </Main>
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
