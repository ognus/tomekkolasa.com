import styled from "@emotion/styled"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
import { Bio } from "../components/bio"
import { PostDate } from "../components/post-date"
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
  const {
    frontmatter: {
      title,
      description,
      date: datePublished,
      updated: dateUpdated,
    },
  } = post

  return (
    <>
      <SEO
        title={title}
        description={description || post.excerpt}
        schemaOrgType={PAGE_TYPES.BLOG}
        datePublished={datePublished}
        dateModified={dateUpdated}
      />
      <article>
        <header>
          <h1>{title}</h1>
          <p>
            <span>
              <PostDate published={datePublished} updated={dateUpdated} />
            </span>
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
      body
      tableOfContents(maxDepth: 3)
      ...postDetails
    }
  }
`
