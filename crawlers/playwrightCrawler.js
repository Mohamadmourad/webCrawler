const { getOrCreateBrowser } = require('../helpers/browserHelper');
const { normalizeUrl, extractLinks, fetchPlaywrightPage } = require('../helpers/crawlerHelper');
const { createPageWithFingerprint } = require('../helpers/fingerprintHelper');

const playwrightCrawler = async (baseUrl, pageUrl, pages = {}, browser = null, depth = 0, maxDepth) => {
  if (depth > maxDepth) return pages;

  console.log(`[${depth}] Crawling: ${pageUrl}`);

  const mainPageUrl = new URL(baseUrl);
  const incomingPageUrl = new URL(pageUrl);

  if (mainPageUrl.host !== incomingPageUrl.host) {
    return pages;
  }

  const url = normalizeUrl(pageUrl);

  if (pages[url]) {
    pages[url]++;
    return pages;
  }

  if (!browser) {
    browser = await getOrCreateBrowser();
  }

  const { page, context } = await createPageWithFingerprint(browser, baseUrl);

  try {
    const result = await fetchPlaywrightPage(page, url);

    if (!result.success) {
      await context.close();
      return pages;
    }

    pages[url] = 1;

    const pageLinks = extractLinks(baseUrl, result.html);

    for (const link of pageLinks) {
      await playwrightCrawler(baseUrl, link, pages, browser, depth + 1, maxDepth);
    }
  } finally {
    await context.close();
  }

  return pages;
};

module.exports = {
  playwrightCrawler,
};
