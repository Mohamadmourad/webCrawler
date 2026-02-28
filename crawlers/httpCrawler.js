const { normalizeUrl, extractLinks, fetchWithTlsClient } = require("../helpers/crawlerHelper");

const httpCrawler = async (baseUrl, pageUrl, pages)=>{
  console.log(pageUrl);
  const mainPageUrl = new URL(baseUrl);
  const incomingPageUrl = new URL(pageUrl);
  if(mainPageUrl.host !== incomingPageUrl.host) return pages;
  const url = normalizeUrl(pageUrl);
  const result = await fetchWithTlsClient(url);
  if(result.status >= 400){
    return pages;
  }
  const contentType = result.headers["content-type"] || result.headers["Content-Type"];
  if(!contentType?.includes("text/html")){
    console.error("invalid html response");
    return pages;
  }
  const pageHtml = result.data;
  if(pages[url] >= 1){
    pages[url]++;
    return pages;
  }
  else{
   pages[url] = 1;
  }

  const pageLinks = await extractLinks(baseUrl, pageHtml);
  for(const link of pageLinks){
    await httpCrawler(baseUrl, link, pages);
  }

  return pages;
}

module.exports = {
  httpCrawler
}