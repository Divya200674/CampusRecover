const {
    findPossibleMatches
} = require("./match-service");

const {
    saveMatch
} = require("./match-storage");


// ------------------------------------
// SAMPLE LOST ITEM
// ------------------------------------

const lostItem = {

    lostItemId: "L001",

    userId: "U001",

    itemName: "Blue Milton bottle",

    category: "Bottle",

    description: "Blue Milton water bottle",

    location: "Block A",

    date: "2026-09-20",

    time: "10:30"
};


// ------------------------------------
// MULTIPLE FOUND ITEMS
// ------------------------------------

const foundItems = [

    {
        foundItemId: "F001",

        userId: "U002",

        itemName: "Blue bottle",

        category: "Bottle",

        description: "Blue Milton water bottle",

        location: "Block A",

        date: "2026-09-20",

        time: "10:45"
    },

    {
        foundItemId: "F002",

        userId: "U003",

        itemName: "Blue water bottle",

        category: "Bottle",

        description: "Water bottle",

        location: "Block B",

        date: "2026-09-20",

        time: "11:00"
    },

    {
        foundItemId: "F003",

        userId: "U004",

        itemName: "Black wallet",

        category: "Wallet",

        description: "Black leather wallet",

        location: "Block D",

        date: "2026-09-18",

        time: "16:30"
    },

    {
        foundItemId: "F004",

        userId: "U005",

        itemName: "Red bottle",

        category: "Bottle",

        description: "Red water bottle",

        location: "Block A",

        date: "2026-09-20",

        time: "12:00"
    }
];


// ------------------------------------
// FIND POSSIBLE MATCHES
// ------------------------------------

const possibleMatches = findPossibleMatches(
    lostItem,
    foundItems
);


// ------------------------------------
// SAVE POSSIBLE MATCHES
// ------------------------------------

for (let i = 0; i < possibleMatches.length; i++) {

    saveMatch(possibleMatches[i]);
}


// ------------------------------------
// DISPLAY RESULT
// ------------------------------------

console.log("\n==============================");

console.log("CAMPUSRECOVER MULTIPLE MATCHING");

console.log("==============================\n");

console.log(
    "Lost Item:",
    lostItem.itemName
);

console.log(
    "Lost Item ID:",
    lostItem.lostItemId
);

console.log("\nPossible Matches:");

console.log("------------------------------");


if (possibleMatches.length === 0) {

    console.log("No Possible Match Found");

} else {

    for (let i = 0; i < possibleMatches.length; i++) {

        const match = possibleMatches[i];

        console.log("\nMatch " + (i + 1));

        console.log(
            "Match ID:",
            match.matchId
        );

        console.log(
            "Found Item ID:",
            match.foundItemId
        );

        console.log(
            "Score:",
            match.score + "%"
        );

        console.log(
            "Status:",
            match.status
        );

        console.log("Reasons:");

        for (let j = 0; j < match.reasons.length; j++) {

            console.log(
                "  " +
                (j + 1) +
                ". " +
                match.reasons[j]
            );
        }
    }
}


console.log("\n==============================\n");