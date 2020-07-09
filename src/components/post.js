import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

import { theme } from "../theme"
import { wide } from "../styles/global"

const PostLink = styled(Link)`
  ${wide}
  display: block;
  padding: 2.5rem 2rem 0;
  margin-top: 2.5rem;
  color: ${theme.colors.text};
  border-top: 1px solid ${theme.colors.gray};
  border-bottom: 0;

  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);

  h3 {
    margin-top: 0;
  }

  p {
    margin-bottom: 0;
  }

  .link {
    color: ${theme.colors.primary};
    border-bottom: 1px solid ${theme.colors.secondaryDim};
  }

  &:hover {
    .link {
      border-bottom-color: ${theme.colors.secondary};
    }
  }

  @media (min-width: ${theme.sizes.contentWidth}) {
    padding: 2.5rem 2rem;
    background-color: ${theme.colors.foreground};
    border-radius: 5px;
    border: 0;

    box-shadow: 0px 1px 2px rgba(46, 41, 51, 0.08),
      0px 2px 4px rgba(71, 63, 79, 0.08);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0px 4px 8px rgba(46, 41, 51, 0.08),
        0px 8px 16px rgba(71, 63, 79, 0.16);
    }
  }
`

export const Post = ({ title, description, slug, date, isDraft }) => {
  return (
    <article>
      <PostLink to={slug}>
        <header>
          <h3>
            {isDraft && <span>Draft</span>}
            <span className="link">{title}</span>
          </h3>
          <small>{date}</small>
        </header>
        <section>
          <p
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </section>
      </PostLink>
    </article>
  )
}
