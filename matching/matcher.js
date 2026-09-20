const { calculateScore } = require("./scorer");

const MATCH_THRESHOLD = 60;


function findPossibleMatch(lostItem, foundItem) {

    let result = calculateScore(
        lostItem,
        foundItem
    );

    if (result.score >= MATCH_THRESHOLD) {

        return {
            matchId: "M-" + Date.now(),
            lostItemId: lostItem.lostItemId,
            foundItemId: foundItem.foundItemId,
            score: result.score,
            reasons: result.reasons,
            status: "POSSIBLE"
        };

    }

    return null;
}


module.exports = {
    findPossibleMatch
};