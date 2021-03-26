import styled from "@emotion/styled"
import { Link } from "gatsby"
import React from "react"
import { FaArrowLeft, FaRegSadCry } from "react-icons/fa"
import { SEO } from "gatsby-theme-grape-blog/src/components/seo"
import { theme } from "../theme"

const Container = styled.div`
  text-align: center;
`

const IconHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
  font-size: 10rem;
  font-weight: ${theme.fontWeights.bold};
`

const BackLink = styled(Link)`
  font-size: 2rem;

  svg {
    vertical-align: text-bottom;
  }
`

const NotFoundPage = () => (
  <>
    <SEO title="404: Not Found" />
    <Container>
      <IconHeader>
        4 <FaRegSadCry /> 4
      </IconHeader>

      <div>
        <h1>Not Found</h1>
        <BackLink to="/">
          <FaArrowLeft /> Home page
        </BackLink>
      </div>
    </Container>
  </>
)

export default NotFoundPage
