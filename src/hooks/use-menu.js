import { useStaticQuery, graphql } from "gatsby"

export const useMenu = () => {
  const {
    allMenuYaml: { menu },
  } = useStaticQuery(
    graphql`
      query MenuQuery {
        allMenuYaml {
          menu: nodes {
            value
            slug
          }
        }
      }
    `
  )

  return menu
}
