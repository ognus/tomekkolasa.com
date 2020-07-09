import styled from "@emotion/styled"
import { graphql, Link } from "gatsby"
import React from "react"
import { Bio } from "../components/bio"
import Layout from "../components/layout"
import { Post } from "../components/post"
import SEO from "../components/seo"
import { SocialLinks } from "../components/social-links"

const About = styled.article`
  margin-top: 2rem;
`

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout>
      <SEO title="Tomek Kolasa" />

      <About>
        <header>
          <Bio>
            <h1>Hi, I’m Tomek.</h1>
          </Bio>
        </header>
        <p>I'm a Full-Stack Developer who lives in Tokyo.</p>
        <p>
          This blog is a deep dive into a full-stack JavaScript ecosystem. From
          frontend to backend and DevOps. All the things I feel really
          passionate about. <br />
          <Link to="/about">Read more...</Link>
        </p>
        <p>Want to connect?</p>
        <SocialLinks />
      </About>

      <h2>Blog</h2>

      {posts.map(({ frontmatter, fields, excerpt }) => {
        const { slug, draft } = fields
        const title = frontmatter.title || slug
        const description = frontmatter.description || excerpt

        return (
          <Post
            key={slug}
            title={title}
            description={description}
            slug={slug}
            date={frontmatter.date}
            isDraft={draft}
          />
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { visible: { eq: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        excerpt
        fields {
          slug
          draft
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
