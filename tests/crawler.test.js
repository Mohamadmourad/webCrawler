const {test, expect} = require("@jest/globals");
const { normalizeUrl, extractLinks } = require("../helpers/crawlerHelper");

const baseUrl = "https://example.com";

test("normalizeUrl https handle", ()=>{
    const url = "https://example.com";
    const actual = normalizeUrl(url);
    const expected = "https://example.com";
    expect(actual).toEqual(expected);
});

test("normalizeUrl extra slash", ()=>{
    const url = "https://example.com/";
    const actual = normalizeUrl(url);
    const expected = "https://example.com";
    expect(actual).toEqual(expected);
});

test("normalizeUrl https handle", ()=>{
    const url = "https://example.com/";
    const actual = normalizeUrl(url);
    const expected = "https://example.com";
    expect(actual).toEqual(expected);
});

test("normalizeUrl capitals", ()=>{
    const url = "https://ExaMple.com/";
    const actual = normalizeUrl(url);
    const expected = "https://example.com";
    expect(actual).toEqual(expected);
});

test("extractLinks single link", ()=>{
    const htmlBody = `
    <html>
    <body>
        <h1>Welcome to My Website</h1>
        <a href="https://example.com" target="_blank">
            Go to example
        </a>
    </body>
    </html>`;
    const actual = extractLinks(baseUrl, htmlBody);
    const expected = ["https://example.com"];
    expect(actual).toEqual(expected);
});

test("extractLinks multiple links", ()=>{
    const htmlBody = `
    <html>
    <body>
        <h1>Welcome to My Website</h1>
        <a href="https://example.com" target="_blank">
            Go to example
        </a>
        <a href="https://example.com/second" target="_blank">
            Go to second example
        </a>
    </body>
    </html>`;
    const actual = extractLinks(baseUrl, htmlBody);
    const expected = ["https://example.com", "https://example.com/second"];
    expect(actual).toEqual(expected);
});

test("extractLinks relative path", ()=>{
    const htmlBody = `
    <html>
    <body>
        <h1>Welcome to My Website</h1>
        <a href="/second/">
            Go to example
        </a>
    </body>
    </html>`;
    const actual = extractLinks(baseUrl, htmlBody);
    const expected = ["https://example.com/second/"];
    expect(actual).toEqual(expected);
});