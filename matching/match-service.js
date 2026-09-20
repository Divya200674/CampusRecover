const { findMatch } = require("./matcher");


// ------------------------------------
// FIND ALL POSSIBLE MATCHES
// ------------------------------------

function findPossibleMatches(lostItem, foundItems) {

    let possibleMatches = [];

    for (let i = 0; i < foundItems.length; i++) {

        const match = findMatch(
            lostItem,
            foundItems[i]
        );

        if (match) {
            possibleMatches.push(match);
        }
    }


    // --------------------------------
    // SORT BY SCORE
    // HIGHEST SCORE FIRST
    // --------------------------------

    for (let i = 0; i < possibleMatches.length; i++) {

        for (let j = i + 1; j < possibleMatches.length; j++) {

            if (
                possibleMatches[j].score >
                possibleMatches[i].score
            ) {

                const temp = possibleMatches[i];

                possibleMatches[i] =
                    possibleMatches[j];

                possibleMatches[j] =
                    temp;
            }
        }
    }


    return possibleMatches;
}


module.exports = {
    findPossibleMatches
};