const cheerio = require('cheerio');

const scrapePage = async (url, html) => {
  const $ = cheerio.load(html);

}

module.exports = {
  scrapePage,
}