const { default: axios } = require("axios");
const { JSDOM } = require("jsdom");

const normalizeUrl = (url)=>{
   const urlObject = new URL(url);

   const cleanUrl = `${urlObject.host}${urlObject.pathname}`;
   if(cleanUrl.length > 0 && cleanUrl.slice(-1) === "/"){
    return `https://${cleanUrl.slice(0, -1)}`;
   }

   return `https://${cleanUrl}`;
}

const extractLinks = (baseUrl, htmlBody)=> {
  const urlResults = [];
  const dom = new JSDOM(htmlBody);
  const extractedUrls = dom.window.document.querySelectorAll('a');

  for(const url of extractedUrls){
    if (url.href.startsWith("/")) {
        urlResults.push(baseUrl + url.href);
      } else {
        urlResults.push(url.href);
      }
  }

  return urlResults;
}

const crawlPage = async (baseUrl, pageUrl, pages)=>{
  console.log(pageUrl);
  const mainPageUrl = new URL(baseUrl);
  const incomingPageUrl = new URL(pageUrl);
  if(mainPageUrl.host !== incomingPageUrl.host) return pages;
  const url = normalizeUrl(pageUrl);
  const result = await axios.get(normalizeUrl(url));
  if(result.status >= 400){
    return pages;
  }
  if(!result.headers["content-type"]?.includes("text/html")){
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
    await crawlPage(baseUrl, link, pages);
  }

  return pages;
}

module.exports = {
    normalizeUrl,
    extractLinks,
    crawlPage
}