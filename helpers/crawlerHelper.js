const { JSDOM } = require("jsdom");
const tlsClient = require("tls-client");

const session = new tlsClient.Session({
  clientIdentifier: "chrome_120",
});

const fetchWithTlsClient = async (url) => {
  try {
    const response = await session.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    return {
      data: response.text,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    console.error("Fetch error:", error.message);
    return { data: "", status: 500 };
  }
};

const normalizeUrl = (url) => {
  const urlObject = new URL(url);

  const cleanUrl = `${urlObject.host}${urlObject.pathname}`;
  if (cleanUrl.length > 0 && cleanUrl.slice(-1) === "/") {
    return `https://${cleanUrl.slice(0, -1)}`;
  }

  return `https://${cleanUrl}`;
};

const extractLinks = (baseUrl, htmlBody) => {
  const urlResults = [];
  const dom = new JSDOM(htmlBody);
  const extractedUrls = dom.window.document.querySelectorAll('a');
  const baseOrigin = new URL(baseUrl).origin; 

  for(const link of extractedUrls){
    const href = link.getAttribute("href");
    if (!href) continue;

    if (href.startsWith("/")) {
      urlResults.push(baseOrigin + href);
    } else if (href.startsWith("http")) {
      urlResults.push(href);
    }
  }

  return urlResults;
};

const fetchPlaywrightPage = async (page, url) => {
  try {
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'max-age=0',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
    });

    const randomDelay = Math.random() * 2000 + 500;
    await page.waitForTimeout(randomDelay);

    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    if (!response || response.status() >= 400) {
      return { success: false, status: response?.status() || 500 };
    }

    const contentType = response.headers()['content-type'] || '';
    if (!contentType.includes('text/html')) {
      return { success: false, status: 415 };
    }

    const html = await page.content();
    return { success: true, html, status: response.status() };
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error.message);
    return { success: false, status: 500, error: error.message };
  }
};

module.exports = {
    normalizeUrl,
    extractLinks,
    fetchWithTlsClient,
    fetchPlaywrightPage
}