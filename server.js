const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// ===== MATCHING ADDITION =====
const { findPossibleMatches } = require("./matching/match-service");
const { saveMatch } = require("./matching/match-storage");

const app = express();

app.use(cors());
app.use(express.json());

const lostItems = [];
const foundItems = [];
const claims = [];

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CampusRecover Backend is running"
    });
});

// POST /lost-items
app.post("/lost-items", (req, res) => {

    const {
        itemName,
        category,
        description,
        location,
        date,
        time
    } = req.body;

    if (!itemName || !category || !description || !location || !date || !time) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const item = {
        itemId: uuidv4(),
        itemName,
        category,
        description,
        location,
        date,
        time,
        status: "LOST",
        createdAt: new Date().toISOString()
    };

    lostItems.push(item);

    // ===== MATCHING ADDITION =====
    const lostItemForMatching = {
        lostItemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        description: item.description,
        location: item.location,
        date: item.date,
        time: item.time
    };

    const foundItemsForMatching = [];

    for (let i = 0; i < foundItems.length; i++) {
        foundItemsForMatching.push({
            foundItemId: foundItems[i].itemId,
            itemName: foundItems[i].itemName,
            category: foundItems[i].category,
            description: foundItems[i].description,
            location: foundItems[i].location,
            date: foundItems[i].date,
            time: foundItems[i].time
        });
    }

    const possibleMatches = findPossibleMatches(
        lostItemForMatching,
        foundItemsForMatching
    );

    // Save possible matches
    for (let i = 0; i < possibleMatches.length; i++) {
        saveMatch(possibleMatches[i]);
    }

    res.status(201).json({
        success: true,
        message: "Lost item reported successfully",
        itemId: item.itemId,
        item: item,
        possibleMatches: possibleMatches
    });
});

// POST /found-items
app.post("/found-items", (req, res) => {

    const {
        itemName,
        category,
        description,
        location,
        date,
        time
    } = req.body;

    if (!itemName || !category || !description || !location || !date || !time) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const item = {
        itemId: uuidv4(),
        itemName,
        category,
        description,
        location,
        date,
        time,
        status: "FOUND",
        createdAt: new Date().toISOString()
    };

    foundItems.push(item);

    // ===== MATCHING ADDITION =====
    const foundItemForMatching = {
        foundItemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        description: item.description,
        location: item.location,
        date: item.date,
        time: item.time
    };

    const possibleMatches = [];

    for (let i = 0; i < lostItems.length; i++) {

        const lostItemForMatching = {
            lostItemId: lostItems[i].itemId,
            itemName: lostItems[i].itemName,
            category: lostItems[i].category,
            description: lostItems[i].description,
            location: lostItems[i].location,
            date: lostItems[i].date,
            time: lostItems[i].time
        };

        const matches = findPossibleMatches(
            lostItemForMatching,
            [foundItemForMatching]
        );

        for (let j = 0; j < matches.length; j++) {
            possibleMatches.push(matches[j]);
        }
    }

    // Sort by highest score
    for (let i = 0; i < possibleMatches.length; i++) {
        for (let j = i + 1; j < possibleMatches.length; j++) {

            if (possibleMatches[j].score > possibleMatches[i].score) {

                const temp = possibleMatches[i];
                possibleMatches[i] = possibleMatches[j];
                possibleMatches[j] = temp;
            }
        }
    }

    // Save possible matches
    for (let i = 0; i < possibleMatches.length; i++) {
        saveMatch(possibleMatches[i]);
    }

    res.status(201).json({
        success: true,
        message: "Found item reported successfully",
        itemId: item.itemId,
        item: item,
        possibleMatches: possibleMatches
    });
});

// GET /lost-items
app.get("/lost-items", (req, res) => {
    res.json({
        success: true,
        count: lostItems.length,
        items: lostItems
    });
});

// GET /found-items
app.get("/found-items", (req, res) => {
    res.json({
        success: true,
        count: foundItems.length,
        items: foundItems
    });
});

// GET /items
app.get("/items", (req, res) => {
    const allItems = [...lostItems, ...foundItems];

    res.json({
        success: true,
        count: allItems.length,
        items: allItems
    });
});

// GET /items/:id
app.get("/items/:id", (req, res) => {

    const itemId = req.params.id;

    const allItems = [...lostItems, ...foundItems];

    const item = allItems.find(item => item.itemId === itemId);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found"
        });
    }

    res.json({
        success: true,
        item: item
    });
});

// POST /claims
app.post("/claims", (req, res) => {

    const {
        itemId,
        reason
    } = req.body;

    if (!itemId || !reason) {
        return res.status(400).json({
            success: false,
            message: "itemId and reason are required"
        });
    }

    const allItems = [...lostItems, ...foundItems];

    const item = allItems.find(item => item.itemId === itemId);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found"
        });
    }

    const claim = {
        claimId: uuidv4(),
        itemId: itemId,
        reason: reason,
        status: "PENDING",
        createdAt: new Date().toISOString()
    };

    claims.push(claim);

    res.status(201).json({
        success: true,
        message: "Claim submitted successfully",
        claimId: claim.claimId,
        claim: claim
    });
});

// GET /claims
app.get("/claims", (req, res) => {

    res.json({
        success: true,
        count: claims.length,
        claims: claims
    });
});

// GET /claims/:id
app.get("/claims/:id", (req, res) => {

    const claimId = req.params.id;

    const claim = claims.find(claim => claim.claimId === claimId);

    if (!claim) {
        return res.status(404).json({
            success: false,
            message: "Claim not found"
        });
    }

    res.json({
        success: true,
        claim: claim
    });
});

// PATCH /claims/:id
app.patch("/claims/:id", (req, res) => {

    const claimId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "status is required"
        });
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
        return res.status(400).json({
            success: false,
            message: "status must be APPROVED or REJECTED"
        });
    }

    const claim = claims.find(claim => claim.claimId === claimId);

    if (!claim) {
        return res.status(404).json({
            success: false,
            message: "Claim not found"
        });
    }

    claim.status = status;

    res.json({
        success: true,
        message: "Claim status updated successfully",
        claim: claim
    });
});

// PATCH /items/:id
app.patch("/items/:id", (req, res) => {

    const itemId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "status is required"
        });
    }

    const allowedStatuses = ["LOST", "FOUND", "CLAIMED", "RETURNED"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status"
        });
    }

    const item = [...lostItems, ...foundItems]
        .find(item => item.itemId === itemId);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found"
        });
    }

    item.status = status;

    res.json({
        success: true,
        message: "Item status updated successfully",
        item: item
    });
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusRecover backend running on http://localhost:${PORT}`);
});
