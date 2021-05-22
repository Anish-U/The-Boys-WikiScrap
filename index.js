// Importing the libraries
const cheerio = require("cheerio");
const express = require("express");
const fetch = require("node-fetch");
const scraper = require("./scraper");

// Variables
const url = "https://en.wikipedia.org/wiki/The_Boys_(2019_TV_series)";
const port = 3000;

const app = express();

app.get("/", (req, res) => {
  scraper.scrapData(url).then((data) => {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
