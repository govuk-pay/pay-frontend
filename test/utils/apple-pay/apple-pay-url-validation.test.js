const { expect } = require('chai')

const { isValidApplePayUrl } = require('../../../app/utils/apple-pay/apple-pay-url-validation')

const APPLE_PAY_URLS_WITH_VALID_HOST_NAMES = [
  'https://apple-pay-gateway.apple.com/some-url-path',
  'https://prod-apple-pay-gateway.apay.apple.com/some-url-path',
  'https://cn-apple-pay-gateway.apple.com/some-url-path',
  'https://apple-pay-gateway-cert.apple.com/some-url-path',
  'https://cn-apple-pay-gateway-cert.apple.com/some-url-path'
]

const APPLE_PAY_URLS_WITH_VALID_HOST_NAMES_WITH_POD_IDS = [
  'https://apple-pay-gateway-pr-pod0.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod1.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod2.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod3.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod4.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod5.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod6.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod7.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod8.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod9.apple.com/some-url-path',
  'https://apple-pay-gateway-pr-pod10.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod0.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod1.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod2.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod3.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod4.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod5.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod6.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod7.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod8.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod9.apple.com/some-url-path',
  'https://apple-pay-gateway-nc-pod10.apple.com/some-url-path'
]

const APPLE_PAY_URLS_WITH_INVALID_HOST_NAMES = [
  { url: 'https://apple-pay-gateway.apple.co.uk/some-url-path', hostname: 'apple-pay-gateway.apple.co.uk' },
  { url: 'https://apple-pay-gateway.appl3.com/some-url-path', hostname: 'apple-pay-gateway.appl3.com' },
  { url: 'https://apple-pay-gateway.apple-pay.com/some-url-path', hostname: 'apple-pay-gateway.apple-pay.com' },
  { url: 'https://apple.com/some-url-path', hostname: 'apple.com' },
  { url: 'https://my-apple-pay-gateway.apple.com/some-url-path', hostname: 'my-apple-pay-gateway.apple.com' },
  { url: 'https://apple-pay-gateway-nc-pod100.apple.com/some-url-path', hostname: 'apple-pay-gateway-nc-pod100.apple.com' },
  { url: 'https://apple-pay-gateway-pr-pod100.apple.com/some-url-path', hostname: 'apple-pay-gateway-pr-pod100.apple.com' }
]

describe('Apple Pay URL Validation tests', () => {
  it('should return valid for URLs with each of the Apple Pay hostnames', () => {
    APPLE_PAY_URLS_WITH_VALID_HOST_NAMES.forEach((url) => {
      const validationResult = isValidApplePayUrl(url)
      expect(validationResult.isValid).to.equal(true)
    })
  })

  it('should return valid for URLs with valid pod IDs', () => {
    APPLE_PAY_URLS_WITH_VALID_HOST_NAMES_WITH_POD_IDS.forEach((url) => {
      const validationResult = isValidApplePayUrl(url)
      expect(validationResult.isValid).to.equal(true)
    })
  })

  it('should return invalid for URLs with no protocol', () => {
    const url = 'apple-pay-gateway.apple.com/some-url-path'
    const validationResult = isValidApplePayUrl(url)
    expect(validationResult.isValid).to.equal(false)
    expect(validationResult.reason).to.equal('Unable to parse URL')
  })

  it('should return invalid for URLs with an invalid protocol', () => {
    const url = 'http://apple-pay-gateway.apple.com/some-url-path'
    const validationResult = isValidApplePayUrl(url)
    expect(validationResult.isValid).to.equal(false)
    expect(validationResult.reason).to.equal('Invalid protocol [http:]')
  })

  it('should return invalid for URLs with an invalid hostname', () => {
    APPLE_PAY_URLS_WITH_INVALID_HOST_NAMES.forEach((testCase) => {
      const validationResult = isValidApplePayUrl(testCase.url)
      expect(validationResult.isValid).to.equal(false)
      expect(validationResult.reason).to.equal(`Invalid hostname [${testCase.hostname}]`)
    })
  })
})
