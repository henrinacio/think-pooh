const express = require('express');
var request = require('request');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/getCategories', (req, res) => {
    request(
        `https://api.chucknorris.io/jokes/categories`,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var categories = JSON.parse(body);
                res.send({ categories });
            }
        },
    );
});

app.get('/getRandom', (req, res) => {
    request(
        `https://api.chucknorris.io/jokes/random`,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var parsedBody = JSON.parse(body);
                var random_joke = parsedBody['value'];
                res.send({ random_joke });
            }
        },
    );
});

app.get('/getByCategory', (req, res) => {
    const { category } = req.query;
    request(
        `https://api.chucknorris.io/jokes/random?category=${category}`,
        function (err, response, body) {
            if (!err && response.statusCode == 200) {
                var parsedBody = JSON.parse(body);
                var category_jokes = parsedBody['value'];
                res.send({ category_jokes });
            }
        },
    );
});

app.get('/search', (req, res) => {
    const { query, category } = req.query;
    request(
        `https://api.chucknorris.io/jokes/search?query=${query}`,
        function (err, response, body) {
            if (!err && response.statusCode == 200) {
                var parsedBody = JSON.parse(body);
                var jokes = [];
                category
                    ? (jokes = parsedBody['result'].filter(
                          value => value.categories == category,
                      ))
                    : (jokes = parsedBody['result']);
                res.send({ jokes });
            }
        },
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
