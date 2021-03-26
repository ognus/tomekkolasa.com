import styled from "@emotion/styled"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { SEO } from "gatsby-theme-grape-blog/src/components/seo"
import { ShareButtons } from "gatsby-theme-grape-blog/src/components/social/share-buttons"
import { PAGE_TYPES } from "gatsby-theme-grape-blog/src/utils/schema-org"
import React from "react"
import { Bio } from "../../components/bio"
import { PostDate } from "../../components/post-date"
import TOC from "../../components/toc"
import { theme } from "../../theme"

const Footer = styled.footer`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.colors.text};
`

const SocialSection = styled.section`
  margin-top: 3rem;
  strong {
    font-size: ${theme.fontSizes[0]};
  }
`

export const Post = ({ data: { mdx: post } }) => {
  const {
    frontmatter: { title, date, updated, author, description = post.excerpt },
    fields: { slug, draft },
  } = post

  return (
    <>
      <SEO
        slug={slug}
        title={title}
        author={author}
        description={description}
        schemaOrgType={PAGE_TYPES.BLOG}
        datePublished={date}
        dateModified={updated}
      />
      <article>
        <header>
          <h1>{title}</h1>
          <p>
            <span>
              <PostDate published={date} updated={updated} />
            </span>
            {draft && <span>Draft</span>}
          </p>
        </header>
        <TOC items={post.tableOfContents.items} />
        <section>
          <MDXRenderer slug={slug}>{post.body}</MDXRenderer>
        </section>
        <SocialSection>
          <strong>Consider sharing if you liked it:</strong>
          <ShareButtons
            slug={slug}
            textOrTitle={title}
            platforms={["twitter", "linkedin", "facebook", "reddit"]}
          />
        </SocialSection>
        <Footer>
          <Bio />
        </Footer>
      </article>
    </>
  )
}
