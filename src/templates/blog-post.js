import styled from "@emotion/styled"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
import { Bio } from "../components/bio"
import { SEO } from "../components/seo"
import { PAGE_TYPES } from "../components/seo/schemas"
import TOC from "../components/toc"
import { theme } from "../theme"

const Footer = styled.footer`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.text};
`

const BlogPostTemplate = ({ data: { mdx: post } }) => {
  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        schemaOrgType={PAGE_TYPES.BLOG}
      />
      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p>
            <span>{post.frontmatter.date}</span>
            {post.fields.draft && <span>Draft</span>}
          </p>
        </header>
        <TOC items={post.tableOfContents.items} />
        <section>
          <MDXRenderer slug={post.fields.slug}>{post.body}</MDXRenderer>
        </section>
        <Footer>
          <Bio />
        </Footer>
      </article>
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      tableOfContents(maxDepth: 3)
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
      fields {
        draft
        slug
      }
    }
  }
`
