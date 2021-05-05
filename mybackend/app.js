const express = require('express');
const request = require('request');
const app = express();
const port = 5000;

const jokesApiUrl = 'https://api.chucknorris.io/jokes'

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/getCategories', (req, res) => {
    request(
        `${jokesApiUrl}/categories`,
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const categories = JSON.parse(body);
                res.send({ categories });
            }
        },
    );
});

app.get('/getRandom', (req, res) => {
    request(
        `${jokesApiUrl}/random`,
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const { value: random_joke } = JSON.parse(body);
                res.send({ random_joke });
            }
        },
    );
});

app.get('/getByCategory', (req, res) => {
    const { category } = req.query;
    request(
        `${jokesApiUrl}/random?category=${category}`,
        function (err, response, body) {
            if (!err && response.statusCode === 200) {
                const { value: category_jokes } = JSON.parse(body);
                res.send({ category_jokes });
            }
        },
    );
});

app.get('/search', (req, res) => {
    const { query, category } = req.query;
    request(
        `${jokesApiUrl}/search?query=${query}`,
        function (err, response, body) {
            if (!err && response.statusCode === 200) {
                const { result } = JSON.parse(body);
                const jokes = !category ? result : result.filter(value => value.categories === category)
                res.send({ jokes });
            }
        },
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
