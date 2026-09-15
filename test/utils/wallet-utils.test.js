'use strict'

const { expect } = require('chai')

const { validChargeDetails } = require('../fixtures/payment.fixtures')
const { applePayEnabled, googlePayEnabled } = require('../../app/utils/wallet-utils')
const normalise = require('../../app/services/normalise-charge')

const gatewayAccountId = 6

describe('Wallet utils', () => {
  beforeEach(() => {
    delete process.env.WORLDPAY_APPLE_PAY_ENABLED
    delete process.env.WORLDPAY_GOOGLE_PAY_ENABLED
    delete process.env.STRIPE_APPLE_PAY_ENABLED
    delete process.env.STRIPE_GOOGLE_PAY_ENABLED
    delete process.env.PAY_TEST_GATEWAY_ACCOUNTS
    delete process.env.ADYEN_APPLE_PAY_ENABLED
    delete process.env.ADYEN_GOOGLE_PAY_ENABLED
  })

  describe('applePayEnabled', () => {
    describe('Worldpay account', () => {
      it('should return true if globally enabled for Worldpay and enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'true'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createChargeWithApplePayEnabled('worldpay')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return true if environment variable not set and enabled for account', () => {
        const charge = createChargeWithApplePayEnabled('worldpay')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if globally disabled for Worldpay and account is not in test account list', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['33']
        const charge = createChargeWithApplePayEnabled('worldpay')
        expect(applePayEnabled(charge)).to.eq(false)
      })

      it('should return true if globally disabled for Worldpay but account is in test account list', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = [gatewayAccountId.toString()]

        const charge = createChargeWithApplePayEnabled('worldpay')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'true'
        const charge = createCharge('worldpay', false, true)
        expect(applePayEnabled(charge)).to.eq(false)
      })
    })

    describe('Stripe account', () => {
      it('should return true if globally enabled for Stripe and enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'true'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createChargeWithApplePayEnabled('stripe')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return true if environment variable not set and enabled for account', () => {
        const charge = createChargeWithApplePayEnabled('stripe')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if globally disabled for Stripe and account is not in test account list', () => {
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['33']
        const charge = createChargeWithApplePayEnabled('stripe')
        expect(applePayEnabled(charge)).to.eq(false)
      })

      it('should return true if globally disabled for Stripe but account is in test account list', () => {
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['6']

        const charge = createChargeWithApplePayEnabled('stripe')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for account', () => {
        process.env.STRIPE_APPLE_PAY_ENABLED = 'true'
        const charge = createCharge('stripe', false, true)
        expect(applePayEnabled(charge)).to.eq(false)
      })
    })

    describe('Adyen account', () => {
      it('should return true if globally enabled for Adyen and enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'true'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createChargeWithApplePayEnabled('adyen')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return true if environment variable not set and enabled for account', () => {
        const charge = createChargeWithApplePayEnabled('adyen')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if globally disabled for Adyen and account is not in test account list', () => {
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['33']
        const charge = createChargeWithApplePayEnabled('adyen')
        expect(applePayEnabled(charge)).to.eq(false)
      })

      it('should return true if globally disabled for Adyen but account is in test account list', () => {
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['6']

        const charge = createChargeWithApplePayEnabled('adyen')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for account', () => {
        process.env.ADYEN_APPLE_PAY_ENABLED = 'true'
        const charge = createCharge('adyen', false, true)
        expect(applePayEnabled(charge)).to.eq(false)
      })
    })

    describe('Sandbox account', () => {
      it('should return true if globally enabled for Worldpay (and sandbox) and enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'true'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createChargeWithApplePayEnabled('sandbox')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return true if environment variable not set and enabled for account', () => {
        const charge = createChargeWithApplePayEnabled('sandbox')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if globally disabled for Worldpay (and sandbox) and account is not in test account list', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['33']
        const charge = createChargeWithApplePayEnabled('sandbox')
        expect(applePayEnabled(charge)).to.eq(false)
      })

      it('should return true if globally disabled for Worldpay (and sandbox) but account is in test account list', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = [gatewayAccountId.toString()]

        const charge = createChargeWithApplePayEnabled('sandbox')
        expect(applePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'true'
        const charge = createCharge('sandbox', false, true)
        expect(applePayEnabled(charge)).to.eq(false)
      })
    })
  })

  describe('googlePayEnabled', () => {
    describe('Worldpay account', () => {
      it('should return true if globally enabled for Worldpay and enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'true'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createChargeWithGooglePayEnabled('worldpay')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return true if environment variable not set and enabled for account', () => {
        const charge = createChargeWithGooglePayEnabled('worldpay')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return false if globally disabled for Worldpay and account is not in test account list', () => {
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['33']
        const charge = createChargeWithGooglePayEnabled('worldpay')
        expect(googlePayEnabled(charge)).to.eq(false)
      })

      it('should return true if globally disabled for Worldpay but account is in test account list', () => {
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = [gatewayAccountId.toString()]

        const charge = createChargeWithGooglePayEnabled('worldpay')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for account', () => {
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'true'
        const charge = createCharge('worldpay', true, false)
        expect(googlePayEnabled(charge)).to.eq(false)
      })
    })

    describe('Stripe account', () => {
      it('should return true if globally enabled for Stripe and enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'true'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createChargeWithGooglePayEnabled('stripe')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return true if environment variable not set and enabled for account', () => {
        const charge = createChargeWithGooglePayEnabled('stripe')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return false if globally disabled for Stripe and account is not in test account list', () => {
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['33']
        const charge = createChargeWithGooglePayEnabled('stripe')
        expect(googlePayEnabled(charge)).to.eq(false)
      })

      it('should return true if globally disabled for Stripe but account is in test account list', () => {
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = [gatewayAccountId.toString()]

        const charge = createChargeWithGooglePayEnabled('stripe')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for account', () => {
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'true'
        const charge = createCharge('stripe', true, false)
        expect(googlePayEnabled(charge)).to.eq(false)
      })
    })

    describe('Adyen account', () => {
      it('should return true if globally enabled for Adyen and enabled for account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'true'
        const charge = createChargeWithGooglePayEnabled('adyen')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return true if environment variable not set and enabled for account', () => {
        const charge = createChargeWithGooglePayEnabled('adyen')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return false if globally disabled for Adyen and account is not in test account list', () => {
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = ['33']
        const charge = createChargeWithGooglePayEnabled('adyen')
        expect(googlePayEnabled(charge)).to.eq(false)
      })

      it('should return true if globally disabled for Adyen but account is in test account list', () => {
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        process.env.PAY_TEST_GATEWAY_ACCOUNTS = [gatewayAccountId.toString()]

        const charge = createChargeWithGooglePayEnabled('adyen')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for account', () => {
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'true'
        const charge = createCharge('adyen', true, false)
        expect(googlePayEnabled(charge)).to.eq(false)
      })
    })

    describe('Sandbox account', () => {
      it('should return true if enabled for gateway account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createChargeWithGooglePayEnabled('sandbox')
        expect(googlePayEnabled(charge)).to.eq(true)
      })

      it('should return false if not enabled for gateway account', () => {
        process.env.WORLDPAY_APPLE_PAY_ENABLED = 'false'
        process.env.WORLDPAY_GOOGLE_PAY_ENABLED = 'false'
        process.env.STRIPE_APPLE_PAY_ENABLED = 'false'
        process.env.STRIPE_GOOGLE_PAY_ENABLED = 'false'
        process.env.ADYEN_APPLE_PAY_ENABLED = 'false'
        process.env.ADYEN_GOOGLE_PAY_ENABLED = 'false'
        const charge = createCharge('sandbox', true, false)
        expect(googlePayEnabled(charge)).to.eq(false)
      })
    })
  })
})

function createChargeWithApplePayEnabled (paymentProvider) {
  return createCharge(paymentProvider, true, false)
}

function createChargeWithGooglePayEnabled (paymentProvider) {
  return createCharge(paymentProvider, false, true)
}

function createCharge (paymentProvider, allowApplePay, allowGooglePay) {
  const charge = validChargeDetails({
    paymentProvider,
    allowApplePay,
    allowGooglePay,
    gatewayAccountId
  })
  return normalise.charge(charge, charge.charge_id)
}
