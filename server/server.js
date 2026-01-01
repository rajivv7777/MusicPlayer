require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5000;

// SEARCH SONGS
app.get("/api/search", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ data: [] });
    }

    try {
        const response = await axios.get(
            "https://deezerdevs-deezer.p.rapidapi.com/search",
            {
                params: { q: query },
                headers: {
                    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Deezer API error:", error.message);
        res.status(500).json({ error: "Failed to fetch songs" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
