const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const axios = require("axios");
const http = require("http");
const path = require("path");

app.use("/favicon.ico", express.static(path.join(__dirname, "public/favicon.ico")));

//Fight Outcome responses - Replace Pastebin URL - Make sure it is the raw link
app.get("/randomline", async (req, res) => {
    try {
        const response = await axios.get("https://pastebin.com/raw/QfQw8YkH", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        const lines = response.data.split("\n");
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        res.send(randomLine);
    } catch (error) {
        console.error("Error fetching Pastebin:", error);
        res.status(500).send("Error fetching data");
    }
});

//Replace Pastebin URL - Make sure it is the raw link
app.get("/fight", async (req, res) => {
    const pastebinURL = "https://pastebin.com/raw/QfQw8YkH";
    const response = await fetch(pastebinURL);
    const text = await response.text();
    const lines = text.split("\n");
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    res.send(randomLine);
});

// Handles quote commands
app.get("/quotes", async (req, res) => {
    const externalUrl = "https://twitch.center/customapi/quote/list?token=219131ad";

    try {
        const response = await fetch(externalUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch quotes: ${response.statusText}`);
        }

        const data = await response.text();
        const quotesList = data.split("\n").map((quote) => quote.trim()).filter((quote) => quote);

        const formattedQuotes = quotesList.join("\n");
        
        res.set("Content-Type", "text/plain");
        res.send(formattedQuotes);
    } catch (error) {
        console.error(`Error fetching quotes: ${error.message}`);
        res.status(500).send("Failed to fetch quotes. Please try again later.");
    }
});

// Default route
app.get("/", (req, res) => {
    res.send("Use /fight or /quotes to get a fight outcome or list of quotes.");
  
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${3000}`);
});