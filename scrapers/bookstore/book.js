const axios = require("axios")
const cheerio = require("cheerio")

const url =
    "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html";
  
async function getBookPageDesc() {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)
        const header = $("h1").text()
        const price = $("p.price_color").text()
        const status = $(".instock.availability").text().trim();
        console.log(`${header}\n${price}\n${status}`)
    } catch(e) {
        console.error(e)
    }
}

getBookPageDesc()