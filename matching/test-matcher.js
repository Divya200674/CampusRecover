const {
    findMatch
} = require("./matcher");


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
// SAMPLE FOUND ITEM
// ------------------------------------

const foundItem = {

    foundItemId: "F002",

    userId: "U003",

    itemName: "Blue bottle",

    category: "Bottle",

    description: "Water bottle",

    location: "Block B",

    date: "2026-09-20",

    time: "11:00"
};


// ------------------------------------
// RUN MATCHING
// ------------------------------------

const match = findMatch(
    lostItem,
    foundItem
);


// ------------------------------------
// DISPLAY RESULT
// ------------------------------------

console.log("\n==============================");

console.log("CAMPUSRECOVER MATCHING RESULT");

console.log("==============================\n");


if (match) {

    console.log("Possible Match Found");

    console.log("------------------------------");

    console.log("Match ID:", match.matchId);

    console.log("Lost Item ID:", match.lostItemId);

    console.log("Found Item ID:", match.foundItemId);

    console.log("Score:", match.score + "%");

    console.log("Status:", match.status);

    console.log("\nReasons:");

    for (let i = 0; i < match.reasons.length; i++) {

        console.log(
            (i + 1) + ". " + match.reasons[i]
        );
    }

} else {

    console.log(
        "No Possible Match Found"
    );
}


console.log("\n==============================\n");