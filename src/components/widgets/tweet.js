import React from "react"
import { useSiteMetadata } from "../../hooks/use-site-metadata"

function getTweetIntent({ text, url, via, hashtags = [] }) {
  const intent = new URL("https://twitter.com/intent/tweet")

  intent.searchParams.append("url", url)
  intent.searchParams.append("text", text)
  intent.searchParams.append("via", via)

  if (hashtags.length) {
    intent.searchParams.append("hashtags", hashtags.join(","))
  }

  return intent.href
}

export const Tweet = ({ text, slug, hashtags }) => {
  const { pageUrl, social } = useSiteMetadata(slug)

  const url = getTweetIntent({
    text,
    hashtags,
    url: pageUrl,
    via: social.twitter,
  })

  return <a href={url}>Tweet this</a>
}
