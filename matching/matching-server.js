const express = require("express");
const { findPossibleMatches } = require("./match-service");

const app = express();

app.use(express.json());

app.post("/match", (req, res) => {
    const lostItem = req.body.lostItem;
    const foundItems = req.body.foundItems;

    if (!lostItem || !foundItems) {
        return res.status(400).json({
            message: "lostItem and foundItems are required"
        });
    }

    const possibleMatches = findPossibleMatches(
        lostItem,
        foundItems
    );

    res.json(possibleMatches);
});

app.get("/", (req, res) => {
    res.json({
        message: "CampusRecover Matching API is running"
    });
});

app.listen(3000, () => {
    console.log("Matching API running on http://localhost:3000");
});