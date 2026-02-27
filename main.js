const { crawlPage } = require("./crawler");

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
    const pages = await crawlPage(baseUrl, baseUrl, {});
    console.log(pages);
}

main()