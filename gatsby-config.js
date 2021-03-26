const description = `
  This blog is a deep dive into a full-stack JavaScript ecosystem.
  Topics ranging from frontend development through the backend, DevOps, and finally remote work and productivity.
  I believe that familiarizing yourself with all aspects of software development will tremendously improve the outcomes of your work.
`

module.exports = {
  siteMetadata: {
    title: "Tomek Kolasa | Deep dive into a full-stack JavaScript",
    description: description.trim().replace(/\s+/, " "),
    siteUrl: "https://tomekkolasa.com/",
    social: {
      twitter: "ognus",
    },
  },
  plugins: [
    {
      resolve: "gatsby-theme-grape-blog",
      options: {
        googleAnalyticsId: "UA-134252917-1",
        gatsbyRemarkPlugins: [
          // overwrite gatsby-remark-images options
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 800,
              wrapperStyle: `
                margin-left: -2rem;
                margin-right: -2rem;
              `,
            },
          },
          "gatsby-remark-prismjs",
        ],
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-use-dark-mode",
      options: {
        classNameDark: "dark",
        classNameLight: "light",
        storageKey: "darkMode",
        minify: true,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Tomek Kolasa",
        short_name: "Tomek Kolasa",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#7b1fff",
        display: "minimal-ui",
        icon: "content/assets/logo.png",
      },
    },
    {
      resolve: "gatsby-plugin-layout",
      options: {
        component: require.resolve("./src/components/layout"),
      },
    },
    "gatsby-plugin-emotion",
  ],
}
