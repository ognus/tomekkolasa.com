const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")
const { showDrafts } = require("./settings")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve("./src/templates/blog-post.js")
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { fields: { visible: { eq: true } } }
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          nodes {
            fields {
              slug
              draft
            }
            frontmatter {
              title
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.nodes

  posts.forEach(post => {
    const { slug } = post.fields

    createPage({
      path: slug,
      component: blogPost,
      context: {
        slug,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    const parent = getNode(node.parent)
    const filePath = createFilePath({ node, getNode })
    const isDraft = parent.sourceInstanceName === "drafts"
    const isVisible = !isDraft || showDrafts

    createNodeField({
      name: "slug",
      value: path.basename(filePath),
      node,
    })

    createNodeField({
      name: "draft",
      value: isDraft,
      node,
    })

    createNodeField({
      name: "visible",
      value: isVisible,
      node,
    })
  }
}
