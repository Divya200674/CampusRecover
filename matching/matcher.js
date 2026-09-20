const { calculateScore } = require("./scorer");


// Minimum score required to create a possible match
const MATCH_THRESHOLD = 60;


// Compare one lost item with one found item
function findMatch(lostItem, foundItem) {

    const result = calculateScore(
        lostItem,
        foundItem
    );


    // If score is below threshold,
    // do not create a match
    if (result.score < MATCH_THRESHOLD) {
        return null;
    }


    // Create possible match
    const match = {

        matchId:
            "M-" +
            lostItem.lostItemId +
            "-" +
            foundItem.foundItemId,

        lostItemId: lostItem.lostItemId,

        foundItemId: foundItem.foundItemId,

        score: result.score,

        reasons: result.reasons,

        status: "POSSIBLE"
    };


    return match;
}


module.exports = {
    findMatch,
    MATCH_THRESHOLD
};