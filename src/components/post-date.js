import React from "react"
import { formatDate } from "../utils/date"

export const PostDate = ({ published, updated }) => {
  if (updated) {
    return <>Updated: {formatDate(updated)}</>
  }

  return <>{formatDate(published)}</>
}
