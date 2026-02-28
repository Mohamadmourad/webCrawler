const { crawler } = require("./crawler");
const { httpCrawler } = require("./crawlers/httpCrawler");
const { playwrightCrawler } = require("./crawlers/playwrightCrawler");

async function main(){
    if(process.argv < 3){
        console.error("No website link provided");
        return;
    }
    if(process.argv > 3){
        console.error("Too many args");
        return;
    }
    const baseUrl = process.argv[2];
    console.log("staring crawling...");
    const maxDepth = 2;
    const pages = await crawler(baseUrl, maxDepth);
    // const pages = await playwrightCrawler(baseUrl, baseUrl, {}, null, 0, maxDepth);
    console.log(pages);
}

main()