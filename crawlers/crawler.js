const { httpCrawler } = require("./httpCrawler");
const { playwrightCrawler } = require("./playwrightCrawler");
const { isJsRendered, closeBrowser } = require("../helpers/browserHelper");
const { fetchWithTlsClient } = require("../helpers/crawlerHelper");
const { emptyFingerprintCache } = require("../helpers/fingerprintHelper");

const crawler = async (baseUrl, maxDepth) => {
  let pages = {};
  const result = await fetchWithTlsClient(baseUrl);
  const pageHtml = result.data;

  if(isJsRendered(pageHtml)){
    console.log("Using Playwright crawler...");
    pages = await playwrightCrawler(baseUrl, baseUrl, pages, null, 0, maxDepth);
  }
  else{
    console.log("Using HTTP crawler...");
    pages = await httpCrawler(baseUrl, baseUrl, pages, 0, maxDepth);
  }
  
  closeBrowser();
  emptyFingerprintCache();
  return pages;

};


module.exports = { crawler };