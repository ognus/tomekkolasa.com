function toDate(value) {
  if (typeof value === "string") {
    if (value.includes("T")) {
      return new Date(value)
    }

    const params = value
      .split(/[-/:.\s]/)
      .filter(p => p)
      .map(p => Number.parseInt(p, 10))

    const [, month] = params
    params[1] = month - 1
    return new Date(...params)
  }

  if (typeof value === "number") {
    return new Date(value)
  }

  return value
}

/**
 * Converts loosly defined date to ISO string representation.
 *
 * @param {Date|string|number|undefined} date
 * @return {string|undefined}
 */
export function toISODate(date) {
  if (date) {
    return toDate(date).toISOString()
  }
  return date
}

/**
 * Converts loosly defined date to date string with format "MMMM DD, YYYY"
 *
 * @param {Date|string|number|undefined} date
 * @return {string|undefined}
 */
export function formatDate(date) {
  const validDate = toDate(date)

  if (validDate) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(validDate)
  }

  return validDate
}
