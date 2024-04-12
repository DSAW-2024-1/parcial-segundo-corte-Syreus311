const express = require("express");
const axios = require("axios");
const { users } = require("./utils/users");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.get("/coin/:currency", async (req, res) => {
    try {
        const { currency } = req.params;
        const response = await axios.get(
            `https://api.coincap.io/v2/assets/${currency}`
        );
        const { data } = response.data;

        if (data) {
            const price = data.priceUsd;
            res.json({
                message: `El valor de la moneda ${data.name} es ${price} USD.`,
            });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(404).json({
            error: "El nombre de la moneda no fue encontrado en la base de datos",
        });
    }
});

app.get("/users/:count", (req, res) => {
    const number = parseInt(req.params.count);
    const order = req.query.sort || "asc";

    if (isNaN(number) || number <= 0) {
        return res.status(400).json({
            error: "No se especificó el parametro count",
        });
    }

    const filteredUsers = [...users].slice(0, number);

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (order === "asc") {
            return a.lastName.localeCompare(b.lastName);
        } else if (order === "desc") {
            return b.lastName.localeCompare(a.lastName);
        }
    });

    res.json(sortedUsers);
});

app.post("/users", (req, res) => {
    const {
        name,
        lastname,
        email,
        city = "Bogota",
        country = "Colombia",
    } = req.body;

    if (!name || !lastname || !email) {
        return res
            .status(400)
            .json({ error: "Name, lastname, and email are required" });
    }

    const newUser = {
        name,
        lastname,
        email,
        city,
        country,
    };

    res.status(201).json(newUser);
});

app.get("/", (req, res) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Error</title>
      </head>
      <body>
        <pre>Mi nombre es Juliana Moreno</pre>
      </body>
      </html>
    `;
    res.send(html);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
