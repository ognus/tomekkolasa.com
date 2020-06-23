/*
 * Dracula Theme for Prism.JS
 *
 * @author Gustavo Costa
 * e-mail: gusbemacbe@gmail.com
 *
 * @contributor Jon Leopard
 * e-mail: jonlprd@gmail.com
 *
 * @license MIT 2016-2020
 */
import { css } from "@emotion/core"

export const prism = css`
  .dark {
    pre[class*="language-"],
    code[class*="language-"] {
      --background: #282a36;
      --comment: #6272a4;
      --foreground: #f8f8f2;
      --selection: #44475a;

      --cyan: #8be9fd;
      --green: #50fa7b;
      --orange: #ffb86c;
      --pink: #ff79c6;
      --purple: #bd93f9;
      --red: #ff5555;
      --yellow: #f1fa8c;
    }
  }

  .light {
    pre[class*="language-"],
    code[class*="language-"] {
      --background: #f8f8f2;
      --comment: #6272a4;
      --foreground: #282a36;
      --selection: #44475a;

      --cyan: #00b4da;
      --green: #00b900;
      --orange: #ff8f16;
      --pink: #ff1e9f;
      --purple: #7b1fff;
      --red: #ff5555;
      --yellow: #2e009c;
    }
  }

  /* Scrollbars */

  pre::-webkit-scrollbar {
    width: 14px;
  }

  pre::-webkit-scrollbar-track {
    background-color: var(--comment);
    border-radius: 0px;
  }

  pre::-webkit-scrollbar-thumb {
    background-color: var(--purple);
    border-radius: 0px;
  }

  /* Selection */

  pre[class*="language-"]::-moz-selection,
  pre[class*="language-"] ::-moz-selection,
  code[class*="language-"]::-moz-selection,
  code[class*="language-"] ::-moz-selection {
    text-shadow: none;
    background-color: var(--selection);
  }

  pre[class*="language-"]::selection,
  pre[class*="language-"] ::selection,
  code[class*="language-"]::selection,
  code[class*="language-"] ::selection {
    text-shadow: none;
    background-color: var(--selection);
  }

  /* Line numbers */

  pre.line-numbers {
    position: relative;
    padding-left: 3.8em;
    counter-reset: linenumber;
  }

  pre.line-numbers > code {
    position: relative;
    white-space: inherit;
  }

  .line-numbers .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 0;
    font-size: 100%;
    left: -3.8em;
    width: 3em; /* works for line-numbers below 1000 lines */
    letter-spacing: -1px;
    border-right: 1px solid #999;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .line-numbers-rows > span {
    pointer-events: none;
    display: block;
    counter-increment: linenumber;
  }

  .line-numbers-rows > span:before {
    content: counter(linenumber);
    color: #999;
    display: block;
    padding-right: 0.8em;
    text-align: right;
  }

  /* Toolbar for copying */

  div.code-toolbar {
    position: relative;
  }

  div.code-toolbar > .toolbar {
    position: absolute;
    top: 0.3em;
    right: 0.2em;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }

  div.code-toolbar:hover > .toolbar {
    opacity: 1;
  }

  div.code-toolbar > .toolbar .toolbar-item {
    display: inline-block;
    padding-right: 20px;
  }

  div.code-toolbar > .toolbar a {
    cursor: pointer;
  }

  div.code-toolbar > .toolbar button {
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    line-height: normal;
    overflow: visible;
    padding: 0;
    -webkit-user-select: none; /* for button */
    -moz-user-select: none;
    -ms-user-select: none;
  }

  div.code-toolbar > .toolbar a,
  div.code-toolbar > .toolbar button,
  div.code-toolbar > .toolbar span {
    color: var(--foreground);
    font-size: 0.8em;
    padding: 0.5em;
    background: var(--comment);
    border-radius: 0.5em;
  }

  div.code-toolbar > .toolbar a:hover,
  div.code-toolbar > .toolbar a:focus,
  div.code-toolbar > .toolbar button:hover,
  div.code-toolbar > .toolbar button:focus,
  div.code-toolbar > .toolbar span:hover,
  div.code-toolbar > .toolbar span:focus {
    color: inherit;
    text-decoration: none;
    background-color: var(--green);
  }

  /* Remove text shadow for printing */

  @media print {
    code[class*="language-"],
    pre[class*="language-"] {
      text-shadow: none;
    }
  }

  code[class*="language-"],
  pre[class*="language-"] {
    color: var(--foreground);
    background: var(--background);
    text-shadow: none;
    font-family: PT Mono, Consolas, Monaco, "Andale Mono", "Ubuntu Mono",
      monospace;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */

  pre[class*="language-"] {
    background: var(--background);
    border-radius: 0.5em;
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    height: auto;
  }

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
    background: var(--background);
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
    padding: 4px 7px;
    border-radius: 0.3em;
    white-space: normal;
  }

  /* Code box limit */

  .limit-300 {
    height: 300px !important;
  }

  .limit-400 {
    height: 400px !important;
  }

  .limit-500 {
    height: 500px !important;
  }

  .limit-600 {
    height: 600px !important;
  }

  .limit-700 {
    height: 700px !important;
  }

  .limit-800 {
    height: 800px !important;
  }

  .token {
    color: var(--pink);
  }

  .token.script {
    color: var(--foreground);
  }

  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.atrule,
  .token.attr-name,
  .token.attr-value {
    color: var(--green);
  }

  .language-html .token.attr-value,
  .language-markup .token.attr-value {
    color: var(--yellow);
  }

  .token.boolean {
    color: var(--purple);
  }

  .token.builtin,
  .token.class-name {
    color: var(--cyan);
  }

  .token.comment {
    color: var(--comment);
  }

  .token.constant {
    color: var(--purple);
  }

  .language-javascript .token.constant {
    color: var(--orange);
    font-style: italic;
  }

  .token.entity {
    color: var(--pink);
  }

  .language-css .token.entity {
    color: var(--green);
  }

  .language-html .token.entity {
    color: var(--pink);
  }

  .token.function {
    color: var(--green);
  }

  .token.important,
  .token.keyword {
    color: var(--pink);
  }

  .token.prolog {
    color: var(--foreground);
  }

  .token.property {
    color: var(--orange);
  }

  .token.punctuation {
    color: var(--pink);
  }

  .language-html .token.punctuation,
  .language-markup .token.punctuation {
    color: var(--foreground);
  }

  .token.selector {
    color: var(--pink);
  }

  .language-css .token.selector {
    color: var(--pink);
  }

  .token.regex {
    color: var(--red);
  }

  .token.string {
    color: var(--yellow);
  }

  .token.tag {
    color: var(--pink);
  }

  .token.url {
    color: var(--cyan);
  }

  .token.variable {
    color: var(--comment);
  }

  .token.number {
    color: var(--purple);
  }

  .token.operator {
    color: var(--cyan);
  }

  .token.char {
    color: rgba(255, 135, 157, 1);
  }

  .token.symbol {
    color: var(--orange);
  }

  .token.deleted {
    color: #e2777a;
  }

  .token.namespace {
    color: #e2777a;
  }
`
