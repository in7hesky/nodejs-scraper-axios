//simple pagination by url tinkering

const axios = require("axios")
const cheerio = require("cheerio")
const j2cp = require("json2csv").Parser
const fs = require("fs")

const baseUrl = "https://books.toscrape.com/catalogue/";
const PRODUCTS_DATA = []
const START_PAGE = 1
let nextPage

async function getCatalogueData(url, counter) {
    try {
        const response = await axios.get(url, {
          signal: AbortSignal.timeout(5000),
        });
        const $ = cheerio.load(response.data)

        console.log("first")
        

        const products = $(".product_pod")
        products.each(function () {
            const title = $(this).find("h3").text()
            const price = $(this).find(".price_color").text()
            const status = $(this).find(".instock.availability").text().trim()

            PRODUCTS_DATA.push({title, price, status})
        })

        if ($(".next a").length > 0) {
            nextPage = baseUrl + `page-${counter}.html`;
            getCatalogueData(nextPage, ++counter)
        } else {
            console.log("writing")
            const csv = new j2cp().parse(PRODUCTS_DATA);
            fs.writeFileSync(__dirname + "/../../scrap/catalogue_data.csv", csv);
        }
    } catch (e) {
        console.log("website behavior changed")
    }
    

}

getCatalogueData(baseUrl + `page-${START_PAGE}.html`, START_PAGE)

