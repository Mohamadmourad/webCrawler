const { httpCrawler } = require("./crawlers/httpCrawler");

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
    const pages = await httpCrawler(baseUrl, baseUrl, {});
    console.log(pages);
}

main()