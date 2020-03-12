import React from "react"
import { css } from "@emotion/core"
import { rhythm, scale, bodyColor } from "../utils/typography"

const TOC = ({ header = "Table of contents", html }) => {
  return (
    <aside
      css={css`
        margin-bottom: ${rhythm(1)};
        padding-left: ${rhythm(3 / 2)};
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
          li {
            ul {
              margin-top: 0;
            }
            p {
              margin-bottom: 0;
            }
            li {
              margin-bottom: ${rhythm(1 / 4)};
              a {
                ${scale(-1 / 5)}
                color: #41b3a3;
                &:hover {
                  color: ${bodyColor};
                }
              }
            }
          }
        `}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </aside>
  )
}

export default TOC
