const { getAllMatches } = require("./match-storage");

function getMatchesForLostItem(lostItemId) {
    const allMatches = getAllMatches();

    let matches = [];

    for (let i = 0; i < allMatches.length; i++) {
        if (allMatches[i].lostItemId === lostItemId) {
            matches.push(allMatches[i]);
        }
    }

    return matches;
}

// Test
const lostItemId = "L001";

const matches = getMatchesForLostItem(lostItemId);

console.log("");
console.log("Possible Matches for Lost Item:", lostItemId);
console.log("==============================");

if (matches.length === 0) {
    console.log("No Possible Matches Found");
} else {
    for (let i = 0; i < matches.length; i++) {
        console.log("");
        console.log("Found Item ID:", matches[i].foundItemId);
        console.log("Score:", matches[i].score + "%");
        console.log("Status:", matches[i].status);
        console.log("Reasons:");

        for (let j = 0; j < matches[i].reasons.length; j++) {
            console.log("  " + (j + 1) + ". " + matches[i].reasons[j]);
        }
    }
}

console.log("");
console.log("==============================");