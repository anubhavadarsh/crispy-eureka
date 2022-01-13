const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const temp404 = fs.readFileSync(
  `${__dirname}/templates/template-404.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  switch (pathname) {
    case "/":
    case "/overview": {
      res.writeHead(200, {
        "Content-type": "text/html",
      });

      const cardsHtml = dataObj
        .map((el) => replaceTemplate(tempCard, el))
        .join("");
      const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

      res.end(output);
      break;
    }
    case "/product": {
      const product = dataObj[query.id];
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
      break;
    }
    case "/api":
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(data);
      break;
    default:
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      res.end(temp404);
  }
});

server.listen(8080, "127.0.0.1", () => {
  console.log("listening to port 8080");
});
