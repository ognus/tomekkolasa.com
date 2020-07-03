import styled from "@emotion/styled"
import React from "react"
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa"

const List = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  list-style-type: none;

  li {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  svg {
    margin-right: 0.2rem;
  }
`

export const SocialLinks = ({ className }) => (
  <List className={className}>
    <li>
      <FaTwitter />
      <a href="https://twitter.com/ognus">Twitter</a>
    </li>
    <li>
      <FaGithub />
      <a href="https://github.com/ognus">GitHub</a>
    </li>
    <li>
      <FaLinkedinIn />
      <a href="https://www.linkedin.com/in/tomaszkolasa/">LinkedIn</a>
    </li>
  </List>
)
