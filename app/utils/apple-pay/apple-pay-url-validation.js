/** @type {string[]} */
const VALID_APPLE_PAY_HOST_NAMES_LIST = [
  'apple-pay-gateway.apple.com',
  'prod-apple-pay-gateway.apay.apple.com',
  'cn-apple-pay-gateway.apple.com',
  'apple-pay-gateway-cert.apple.com',
  'cn-apple-pay-gateway-cert.apple.com'
]

/** @type {Set<string>} */
const VALID_APPLE_PAY_HOST_NAMES_SET = new Set(VALID_APPLE_PAY_HOST_NAMES_LIST)

/** @type {RegExp[]} */
const VALID_APPLE_PAY_HOST_REGEX_LIST = [
  /^apple-pay-gateway-..-pod[0-9]{1,2}\.apple\.com$/,
  /^apple-pay-gateway-..-pod[0-9]{1,2}-dr\.apple\.com$/,
  /^cn-apple-pay-gateway-..-pod[0-9]{1,2}\.apple\.com$/,
  /^cn-apple-pay-gateway-..-pod[0-9]{1,2}-dr\.apple\.com$/
]

/**
 * @param {string} url
 *
 * @returns {{
 *   isValid: true
 * } | {
 *   isValid: false
 *   reason: string
 * }}
 */
function isValidApplePayUrl (url) {
  if (typeof url !== 'string') {
    return {
      isValid: false,
      reason: 'Provided value for URL is not a string'
    }
  }

  const parsedUrl = URL.parse(url)
  if (parsedUrl === null) {
    return {
      isValid: false,
      reason: 'Unable to parse URL'
    }
  }

  if (parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      reason: `Invalid protocol [${parsedUrl.protocol}]`
    }
  }

  const isValidHostname = isValidApplePayHostname(parsedUrl.hostname)

  return isValidHostname
    ? {
        isValid: true
      }
    : {
        isValid: false,
        reason: `Invalid hostname [${parsedUrl.hostname}]`
      }
}

/**
 * @param {string} hostname
 *
 * @returns {boolean}
 */
function isValidApplePayHostname (hostname) {
  if (VALID_APPLE_PAY_HOST_NAMES_SET.has(hostname)) {
    return true
  }

  return VALID_APPLE_PAY_HOST_REGEX_LIST.some((regex) => hostname.match(regex))
}

module.exports = {
  isValidApplePayUrl
}
