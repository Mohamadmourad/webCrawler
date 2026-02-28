const { FingerprintGenerator } = require('fingerprint-generator');
const { FingerprintInjector } = require('fingerprint-injector');
const { chromium, firefox, webkit } = require('playwright');


const generator = new FingerprintGenerator({
  browsers: [
    { name: 'chrome', minVersion: 115, maxVersion: 125 },
    { name: 'firefox', minVersion: 115, maxVersion: 125 },
    { name: 'safari', minVersion: 17 },
  ],
  operatingSystems: ['windows', 'macos', 'linux', 'android', 'ios'],
  devices: ['desktop', 'mobile'],
});

const injector = new FingerprintInjector();
const fingerprintCache = new Map();

const createPageWithFingerprint = async (browser, baseUrl) => {
  const cacheKey = baseUrl;
  let fingerprint = fingerprintCache.get(cacheKey);

  if (!fingerprint) {
    fingerprint = generateFingerprint(cacheKey);
    fingerprintCache.set(cacheKey, fingerprint);
  }

  const fingerprintData = getFingerprintData(fingerprint);

  const context = await browser.newContext({
    ...fingerprintData,
    userAgent: fingerprintData.userAgent,
    viewport: fingerprintData.viewport,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  await injectFingerprint(page, fingerprint);

  return { page, context, fingerprint };
};

const generateFingerprint = (baseUrl) => {
  const cacheKey = baseUrl;

  if (fingerprintCache.has(cacheKey)) {
    return fingerprintCache.get(cacheKey);
  }

  const fingerprint = generator.getFingerprint();
  fingerprintCache.set(cacheKey, fingerprint);

  return fingerprint;
};

const getFingerprintData = (fingerprint) => {
  const { navigator, screen } = fingerprint.fingerprint;

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    languages: navigator.languages,
    timezone: navigator.timezone,
    viewport: {
      width: screen.width,
      height: screen.height,
    },
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
    },
    locale: navigator.languages[0] || 'en-US',
    timezoneId: navigator.timezone || 'UTC',
    deviceScaleFactor: 1,
    hasTouch: navigator.maxTouchPoints > 0,
  };
};

const injectFingerprint = async (page, fingerprint) => {
  if (!page || !fingerprint) {
    throw new Error('Page and fingerprint are required for injection');
  }

  const context = page.context();
  await injector.attachFingerprintToPlaywright(context, fingerprint);
};

module.exports = {
  createPageWithFingerprint,
  generateFingerprint,
  getFingerprintData,
  injectFingerprint,
};