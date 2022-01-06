const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const jsonConfig = JSON.parse(fs.readFileSync('config.json').toString());
const mapping = new Map();

for (const key of Object.keys(jsonConfig["users"])) {
    mapping.set(key, jsonConfig["users"][key]);
}

const adjustmentFactor = jsonConfig["adjustmentHours"];

app.use(express.static(path.join(__dirname, "..", "build")));

app.get('/adjustment_factor', function (req, res) {
    res.send(JSON.stringify(adjustmentFactor));
})

app.get('/sleep_data/:userID', function (req, res) {
    const userID = req.params["userID"];

    if (!mapping.has(userID)) {
        res.send(JSON.stringify("user not found"));
    }

    fetch(mapping.get(userID))
        .then(result => result.json())
        .then(data => res.send(data));
})

app.use((req, res, next) => {
    res.redirect("/");
})

app.listen(port,() => {
    console.log(`Server now listening at http://localhost:${port}`);
})
