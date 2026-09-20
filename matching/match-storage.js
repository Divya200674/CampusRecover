const fs = require("fs");

const FILE_NAME = "matches.json";


// ------------------------------------
// SAVE MATCH
// ------------------------------------

function saveMatch(match) {

    let matches = [];

    if (fs.existsSync(FILE_NAME)) {

        const data = fs.readFileSync(
            FILE_NAME,
            "utf8"
        );

        if (data.trim() !== "") {
            matches = JSON.parse(data);
        }
    }


    // --------------------------------
    // CHECK FOR DUPLICATE MATCH
    // --------------------------------

    let alreadyExists = false;

    for (let i = 0; i < matches.length; i++) {

        if (
            matches[i].lostItemId === match.lostItemId &&
            matches[i].foundItemId === match.foundItemId
        ) {

            alreadyExists = true;
            break;
        }
    }


    // --------------------------------
    // SAVE ONLY IF NEW
    // --------------------------------

    if (!alreadyExists) {

        matches.push(match);

        fs.writeFileSync(
            FILE_NAME,
            JSON.stringify(matches, null, 4)
        );

        return true;
    }


    return false;
}


// ------------------------------------
// GET ALL MATCHES
// ------------------------------------

function getAllMatches() {

    if (!fs.existsSync(FILE_NAME)) {
        return [];
    }

    const data = fs.readFileSync(
        FILE_NAME,
        "utf8"
    );

    if (data.trim() === "") {
        return [];
    }

    return JSON.parse(data);
}


module.exports = {
    saveMatch,
    getAllMatches
};