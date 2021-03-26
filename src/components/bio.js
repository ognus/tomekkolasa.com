import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import React from "react"
import { SocialLinks } from "./social-links"

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Avatar = styled(GatsbyImage)`
  min-width: 70px;
  border-radius: 100%;
  margin-right: 1rem;
`

const DefaultContent = (
  <>
    Written by <strong>Tomek Kolasa</strong> &ndash; full-stack JavaScript,
    Node.js and TypeScript.
    <SocialLinks />
  </>
)

export const Bio = ({ children = DefaultContent, className }) => {
  const { avatar } = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          gatsbyImageData(width: 70, height: 70, layout: FIXED)
        }
      }
    }
  `)

  return (
    <Container className={className}>
      <Avatar
        image={avatar.childImageSharp.gatsbyImageData}
        alt="Tomek Kolasa"
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div>{children}</div>
    </Container>
  )
}
