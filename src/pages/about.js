import styled from "@emotion/styled"
import { graphql } from "gatsby"
import Image from "gatsby-image"
import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { theme } from "../theme"

const Header = styled.header`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;

  @media (min-width: ${theme.sizes.contentWidth}) {
    flex-direction: row-reverse;
    align-items: center;
  }
`

const ProfileImage = styled.div`
  flex: 1;
  padding-bottom: 2rem;

  img {
    border-radius: 50%;
  }

  @media (min-width: ${theme.sizes.contentWidth}) {
    padding-left: 1rem;
    padding-bottom: 0;
  }
`

const ProfileText = styled.div`
  flex: 1;
`

const AboutPage = ({ data: { profile } }) => {
  return (
    <Layout>
      <SEO title="About" />

      <Header>
        <ProfileImage>
          <Image fluid={profile.childImageSharp.fluid} />
        </ProfileImage>
        <ProfileText>
          <h1>Hi, I'm Tomek.</h1>
          <p>I’m a full-stack engineer from Poland. </p>
          <p>I currently work and live in Tokyo, Japan.</p>
          <p>
            I started coding over 15 years ago and I don’t feel like stopping. I
            enjoy building web and mobile apps in React.js and React Native,
            building APIs in Node.js, and constructing cloud infrastructures in
            AWS and GCP.
          </p>
        </ProfileText>
      </Header>

      <h2>Let’s connect</h2>
      <p>
        If you have any questions in relation to the blog or you'd like to chat
        with me about software development, feel free to ping me on Twitter at{" "}
        <a href="https://twitter.com/ognus">@ognus</a>.
      </p>

      <p>
        I'm also on{" "}
        <a href="https://www.linkedin.com/in/tomaszkolasa/">LinkedIn</a> and{" "}
        <a href="https://github.com/ognus">GitHub</a>.
      </p>
      <h2>About the blog</h2>
      <p>
        This blog is a deep dive into a full-stack JavaScript ecosystem. Topics
        ranging from frontend development through backend and finally DevOps. I
        believe that familiarizing yourself with all aspects of software
        development will tremendously improve the outcomes of your work.
      </p>

      <p>
        I also write about non-tech challenges we face as software developers,
        especially related to productivity and remote work. Let’s face it, “real
        life” sometimes gets in a way of coding. If you want to be a great
        developer, you have to learn how to deal with it.
      </p>

      <p>I work hard to create quality articles on:</p>
      <ul>
        <li>JavaScript </li>
        <li>Node.js </li>
        <li>TypeScript </li>
        <li>RESTful and GraphQL APIs design </li>
        <li>Cloud Computing (deployment, CI/CD, containers) </li>
        <li>remote work </li>
      </ul>

      <p>
        I do really hope you will find some of my articles useful or interesting
        😀
      </p>

      <p>So feel free to let me know what you need. I am here to help you.</p>

      <p>
        What’s in it for me? You might ask. Well, first of all, I do like
        explaining things, and I really like to dive deeply into the topics,
        that’ how I learn best. I hope blogging would allow me to do just that.
      </p>

      <p>
        I would also like to improve my technical writing skills, and writing in
        general. I hope it will come easier once I get better at it.
      </p>
    </Layout>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query ProfileImageQuery {
    profile: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
