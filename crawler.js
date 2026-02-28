const { httpCrawler } = require("./crawlers/httpCrawler");
const { playwrightCrawler } = require("./crawlers/playwrightCrawler");
const { isJsRendered } = require("./helpers/browserHelper");
const { fetchWithTlsClient } = require("./helpers/crawlerHelper");

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
  return pages;

};


module.exports = { crawler };