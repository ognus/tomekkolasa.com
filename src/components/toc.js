import React from "react"
import styled from "@emotion/styled"

const TableOfContents = styled.aside`
  border-left: 6px solid #f5f2f0;
  margin-bottom: 2rem;
  padding-left: 1rem;

  ol {
    counter-reset: section;
    list-style-type: none;
    padding-left: 1rem;
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

    li {
      a {
        opacity: 0.8;
      }
      &::before {
        width: 2.5rem;
      }
    }
  }
`

const NestedList = ({ items = [] }) => (
  <ol>
    {items.map(({ url, title, items: subItems }) => (
      <li key={url}>
        <a href={url}>{title}</a>
        {subItems && <NestedList items={subItems} />}
      </li>
    ))}
  </ol>
)

const TOC = ({ header = "Table of contents", items }) => (
  <TableOfContents>
    <h2>{header}</h2>
    <NestedList items={items} />
  </TableOfContents>
)

export default TOC
