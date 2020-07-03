function getBoolean(envVarName) {
  const value = process.env[envVarName] || ""

  switch (value.toLowerCase()) {
    case "true":
      return true
    case "false":
      return false
    default:
      return null
  }
}

const isDev = (process.env.NODE_ENV || "").startsWith("dev")
const showDrafts = getBoolean("SHOW_DRAFTS")

module.exports = {
  isDev,
  showDrafts: showDrafts === null ? isDev : showDrafts,
}
