import styled from "@emotion/styled"
import { graphql, Link } from "gatsby"
import React from "react"
import { FaRegSadCry, FaArrowLeft } from "react-icons/fa"
import Layout from "../components/layout"
import SEO from "../components/seo"
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

const NotFoundPage = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout title={siteTitle}>
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
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
