const { JSDOM } = require("jsdom");
const tlsClient = require("tls-client");

const session = new tlsClient.Session({
  clientIdentifier: "chrome_120",
});

const fetchWithTlsClient = async (url) => {
  try {
    const response = await session.get("bazaarica.com", {
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

const crawlPage = async (baseUrl, pageUrl, pages)=>{
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
    await crawlPage(baseUrl, link, pages);
  }

  return pages;
}

module.exports = {
    normalizeUrl,
    extractLinks,
    crawlPage
}