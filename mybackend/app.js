const express = require("express");
var request = require("request");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getCategories", (req, res) => {
  request(
    "https://api.chucknorris.io/jokes/categories",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var categories = JSON.parse(body);
        res.send({ categories });
      }
    }
  );
});

app.get("/getRandom", (req, res) => {
  request(
    "https://api.chucknorris.io/jokes/random",
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var parsedBody = JSON.parse(body);
        var random_joke = parsedBody["value"];
        res.send({ random_joke });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
