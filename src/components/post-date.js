import React from "react"

export const PostDate = ({ published, updated }) => {
  if (updated) {
    return <>Updated: {updated}</>
  }

  return <>{published}</>
}
