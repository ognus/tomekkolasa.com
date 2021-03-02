import { graphql } from "gatsby"

export const frontmatter = graphql`
  fragment frontmatter on Mdx {
    frontmatter {
      title
      date
      updated
      description
    }
  }
`

export const postDetails = graphql`
  fragment postDetails on Mdx {
    excerpt(pruneLength: 160)
    fields {
      slug
      draft
    }
    ...frontmatter
  }
`
