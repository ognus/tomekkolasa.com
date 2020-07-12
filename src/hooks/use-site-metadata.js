import { useStaticQuery, graphql } from "gatsby"
import logo from "../../content/assets/logo-dark-rounded.png"

export const useSiteMetadata = (pageSlug = "") => {
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      query SiteMetadataQuery {
        site {
          siteMetadata {
            siteUrl
            title
            description
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const { siteUrl } = siteMetadata

  const pageUrl = new URL(pageSlug, siteUrl).toString()
  const logoUrl = new URL(logo, siteUrl).toString()

  return {
    ...siteMetadata,
    logoUrl,
    pageUrl,
  }
}
