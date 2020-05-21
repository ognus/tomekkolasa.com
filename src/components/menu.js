import styled from "@emotion/styled"
import { Link } from "gatsby"
import React from "react"
import { useMenu } from "../hooks/use-menu"

const Nav = styled.nav`
  ul {
    display: flex;
    list-style-type: none;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  li {
    margin-left: 1rem;
    margin-bottom: 0;
  }

  a {
    border-bottom-width: 0;
    &:hover {
      border-bottom-width: 2px;
    }
  }
`

export const Menu = ({ className }) => {
  const menu = useMenu()

  return (
    <Nav className={className}>
      <ul>
        {menu.map(({ value, slug }) => (
          <li key={slug}>
            <Link to={slug}>{value}</Link>
          </li>
        ))}
      </ul>
    </Nav>
  )
}
