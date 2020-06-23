import React from "react"
import { theme } from "../theme"
import styled from "@emotion/styled"

/**
 * @param {string} html
 * @returns {string}
 */
function convertToOrderedLists(html) {
  return html
    .replace(/>\s+/g, ">") // remove trailing space
    .replace(/(<\/?)ul(>)/g, "$1ol$2") // replace ul to ol
}

const TableOfContents = styled.aside`
  border-left: 4px solid #f5f2f0;
  padding-left: 2rem;

  ol {
    counter-reset: section;
    list-style-type: none;
    padding-left: 2rem;
  }

  li {
    &::before {
      counter-increment: section;
      content: counters(section, ".") ". ";
      width: 1.75rem;
      display: inline-block;
    }

    ol {
      margin-top: 0;
    }

    p {
      display: inline;
      margin: 0;
    }

    li {
      a { opacity: 0.8 }
      &::before {
        width: 2.5rem;
      }
    }
  }
`

const TOC = ({ header = "Table of contents", html }) => {
  const tocHtml = convertToOrderedLists(html)

  return (
    <TableOfContents>
      <h2>{header}</h2>
      <div dangerouslySetInnerHTML={{ __html: tocHtml }}></div>
    </TableOfContents>
  )
}

export default TOC
