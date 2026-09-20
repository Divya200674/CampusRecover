const { findPossibleMatch } = require("./matcher");


const lostItem = {
    lostItemId: "L001",
    itemName: "Blue Milton bottle",
    category: "Bottle",
    description: "Blue Milton water bottle",
    location: "Block A",
    date: "2026-09-20",
    time: "10:30"
};


const foundItem = {
    foundItemId: "F001",
    itemName: "Blue bottle",
    category: "Bottle",
    description: "Blue Milton bottle",
    location: "Block A",
    date: "2026-09-20",
    time: "10:45"
};


let match = findPossibleMatch(
    lostItem,
    foundItem
);


console.log("Matching Result:");
console.log(match);