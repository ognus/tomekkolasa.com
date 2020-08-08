import styled from "@emotion/styled"
import React, { useEffect, useRef, useState } from "react"
import { FaTwitter } from "react-icons/fa"
import { blockquote } from "../../styles/global"
import { Tweet } from "./tweet"

const Container = styled.div`
  ${blockquote}
`

const Tweetable = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  svg {
    margin-right: 0.2rem;
  }
`

export const Block = ({
  isQuote,
  cite,
  tweetSlug,
  tweetText,
  tweetHashtags = "",
  children,
}) => {
  const isQuoteBlock = isQuote || cite
  const isTweetable = tweetSlug || tweetText

  const [textToTweet, setTextToTweet] = useState()
  const contentRef = useRef()

  const hashtags = tweetHashtags.split(/\s*,\s*/)

  useEffect(() => {
    const text = contentRef.current.innerText
    setTextToTweet(tweetText || text)
  }, [tweetText])

  return (
    <Container as={isQuoteBlock ? "blockquote" : "div"}>
      <div ref={contentRef}>
        <p>{children}</p>
        {cite && <cite>{cite}</cite>}
      </div>
      {isTweetable && (
        <Tweetable>
          <FaTwitter />
          <Tweet text={textToTweet} slug={tweetSlug} hashtags={hashtags} />
        </Tweetable>
      )}
    </Container>
  )
}
