import React from "react"
import { css } from "@emotion/core"

/**
 * @param {string} html
 * @returns {string}
 */
function convertToOrderedLists(html) {
  return html.replace(/(<\/?)ul(>)/g, "$1ol$2")
}

const TOC = ({ header = "Table of contents", html }) => {
  const tocHtml = convertToOrderedLists(html)

  return (
    <aside
      css={css`
        border-left: 4px solid #f5f2f0;
      `}
    >
      <h2
        css={css`
          margin-top: 0;
        `}
      >
        {header}
      </h2>
      <div
        css={css`
          ol {
            counter-reset: section;
            list-style-type: none;
          }

          li {
            &::before {
              counter-increment: section;
              content: counters(section, ".") ". ";
              padding-right: 0.5em;
            }
            ol {
              margin-top: 0;
            }
            p {
              display: inline;
            }
            li {
              a {
                color: #41b3a3;
              }
            }
          }
        `}
        dangerouslySetInnerHTML={{ __html: tocHtml }}
      ></div>
    </aside>
  )
}

export default TOC
