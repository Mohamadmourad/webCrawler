# CrawlerCore

A powerful, flexible web crawler built with Node.js that intelligently adapts to different website structures. CrawlerCore automatically detects JavaScript-rendered content and switches between lightweight HTTP requests and headless browser automation for optimal performance.

## ✨ Features

- **Intelligent Protocol Detection**: Automatically detects JavaScript-rendered content and switches between HTTP and Playwright crawlers
- **Mixed Crawling Approach**: Uses fast HTTP requests for static sites and Playwright for dynamic content
- **TLS Fingerprinting**: Advanced fingerprinting techniques to bypass common anti-scraping measures
- **Recursive Link Extraction**: Automatically discovers and crawls linked pages within the same domain
- **Configurable Depth**: Control crawling depth to manage scope and performance
- **HTML Parsing with Cheerio**: Easy-to-use jQuery-like syntax for data extraction
- **Browser Session Management**: Efficient browser lifecycle management with automatic cleanup

## 📋 How It Works

CrawlerCore uses a smart, three-layer crawling strategy:

1. **Detection Layer**: Sends an initial request to analyze if the target site uses JavaScript rendering
2. **Crawling Layer**: Based on detection, chooses the optimal crawler:
   - **HTTP Crawler**: For static sites (fast and lightweight)
   - **Playwright Crawler**: For JavaScript-heavy sites (handles dynamic content)
3. **Extraction Layer**: Parses HTML using Cheerio and extracts data according to your custom scraper

### Architecture

```
User Input (URL)
    ↓
Initial Request (TLS Client)
    ↓
JS Detection Check
    ├→ Static Content → HTTP Crawler
    └→ JavaScript Rendered → Playwright Crawler
    ↓
Link Extraction
    ↓
Recursive Crawling (up to maxDepth)
    ↓
Data Extraction (Cheerio Parser)
    ↓
Results Object
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crawlercore
```

2. Install dependencies:
```bash
npm install
```

### Basic Usage

1. Create a `config.json` file in the root directory:
```json
{
  "maxDepth": 5
}
```

2. Run the crawler:
```bash
npm start https://example.com
```

The crawler will output a pages object showing all discovered URLs:
```javascript
{
  "https://example.com": 1,
  "https://example.com/about": 1,
  "https://example.com/contact": 1
}
```

## 🛠️ Customizing Data Extraction with Cheerio

The `scraper.js` file is where you define what data to extract from each page. It uses **Cheerio**, a jQuery-like library for parsing HTML.

### Basic Cheerio Syntax

```javascript
const cheerio = require('cheerio');

const scrapePage = async (url, html) => {
  // Load the HTML
  const $ = cheerio.load(html);

  // Extract data using CSS selectors
  const title = $('h1').text(); // Get text content
  const links = $('a'); // Select all links

  // Iterate over elements
  $('p').each((index, element) => {
    console.log($(element).text());
  });

  // Get attributes
  const href = $('a').attr('href');

  // Complex selections
  const prices = $('.price').map((i, el) => $(el).text()).get();
};

module.exports = { scrapePage };
```

### Common Cheerio Methods

| Method | Description | Example |
|--------|-------------|---------|
| `$('selector')` | Select elements | `$('div.product')` |
| `.text()` | Get text content | `$('h1').text()` |
| `.html()` | Get HTML content | `$('div').html()` |
| `.attr(name)` | Get attribute value | `$('a').attr('href')` |
| `.attr(name, value)` | Set attribute | `$('a').attr('href', 'new-url')` |
| `.addClass(name)` | Add class | `$('div').addClass('active')` |
| `.each(fn)` | Iterate elements | `$('li').each((i, el) => {...})` |
| `.map(fn)` | Transform elements | `$('p').map((i, el) => $(el).text())` |
| `.find(selector)` | Find nested elements | `$('div').find('p')` |
| `.parent()` | Get parent element | `$('span').parent()` |
| `.next()` / `.prev()` | Get next/previous sibling | `$('li').next()` |

### Practical Example: E-commerce Scraper

```javascript
const cheerio = require('cheerio');

const scrapePage = async (url, html) => {
  const $ = cheerio.load(html);

  // Extract product information
  const products = [];

  $('.product-item').each((index, element) => {
    const product = {
      name: $(element).find('.product-name').text().trim(),
      price: $(element).find('.product-price').text().trim(),
      link: $(element).find('a').attr('href'),
      image: $(element).find('img').attr('src'),
      rating: $(element).find('.rating').attr('data-rating'),
      inStock: $(element).find('.in-stock').length > 0
    };
    products.push(product);
  });

  console.log(`Scraped ${products.length} products from ${url}`);
  console.log(products);

  return products;
};

module.exports = { scrapePage };
```

### Advanced Selectors

```javascript
const $ = cheerio.load(html);

// CSS Selectors
$('div > p')           // Direct child
$('div p')             // Any descendant
$('.class')            // By class
$('#id')               // By ID
$('[data-id="123"]')   // By attribute
$('div:first-child')   // Pseudo-selector
$('div:nth-child(2)')  // Nth element
$('h1, h2')            // Multiple selectors

// jQuery Extensions
$(':contains("text"')  // Contains text
$(':has("p")')         // Has element
```

## 📝 Configuration

Edit `config.json` to customize crawler behavior:

```json
{
  "maxDepth": 5
}
```

### Configuration Options

- **maxDepth** (number): Maximum recursion depth for crawling. Default: 5
  - Depth 0 = only the initial page
  - Depth 5 = initial page + 5 levels of linked pages

## 🔧 Project Structure

```
crawlercore/
├── crawlers/
│   ├── crawler.js           # Main crawling orchestrator
│   ├── httpCrawler.js       # HTTP-based crawler for static sites
│   └── playwrightCrawler.js # Browser-based crawler for JS-heavy sites
├── helpers/
│   ├── crawlerHelper.js     # URL normalization and link extraction
│   ├── browserHelper.js     # Browser instance management
│   └── fingerprintHelper.js # TLS fingerprinting utilities
├── tests/
│   └── crawler.test.js      # Test suite
├── scraper.js              # Custom data extraction logic
├── config.json             # Crawler configuration
├── main.js                 # Entry point
├── package.json            # Dependencies
└── README.md               # This file
```

## 📦 Dependencies

- **cheerio**: jQuery-like syntax for HTML parsing
- **playwright**: Headless browser automation
- **tls-client**: Advanced TLS fingerprinting
- **fingerprint-generator**: Browser fingerprint generation
- **fingerprint-injector**: Fingerprint injection
- **jsdom**: JavaScript DOM simulation

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### MIT License Summary

The MIT License is a permissive open-source license that allows you to:
- ✅ Use the software for any purpose
- ✅ Modify the source code
- ✅ Distribute the software
- ✅ Use it in closed-source projects

With the conditions that:
- 📋 Include a copy of the license
- 📋 Include a copy of the copyright notice
- 📋 State changes made to the code

## ⚠️ Legal Notice

When using CrawlerCore, please respect:
- Website **Terms of Service**
- **Robots.txt** files
- **Rate limits**
- **Copyright** and **data protection** laws

Always check if you have permission to scrape a website before using this tool.

## 🐛 Known Limitations

- JavaScript rendering requires Playwright (heavier resource usage)
- Recursive crawling can be slow for large sites (use `maxDepth` to limit)
- Some sites may block requests even with fingerprinting

## 📚 Resources

- [Cheerio Documentation](https://cheerio.js.org/)
- [Playwright Documentation](https://playwright.dev/)

## 🙋 Support

If you encounter issues:

1. Check that all dependencies are installed: `npm install`
2. Verify the target URL is accessible
3. Check your `config.json` settings
4. Review the error logs carefully

## 📝 Changelog

### v1.0.0
- Initial release
- Intelligent JS detection
- Mixed crawling approach (HTTP + Playwright)
- Recursive link extraction
- Custom Cheerio-based scraping

---

**Happy Crawling! 🕷️**
