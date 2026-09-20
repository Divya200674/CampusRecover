function textSimilarity(text1, text2) {
    text1 = text1.toLowerCase();
    text2 = text2.toLowerCase();

    let same = 0;

    let words1 = text1.split(" ");
    let words2 = text2.split(" ");

    for (let i = 0; i < words1.length; i++) {
        for (let j = 0; j < words2.length; j++) {
            if (words1[i] === words2[j]) {
                same++;
                break;
            }
        }
    }

    let total = Math.max(words1.length, words2.length);

    if (total === 0) {
        return 0;
    }

    return same / total;
}


function timeDifferenceMinutes(time1, time2) {
    let parts1 = time1.split(":");
    let parts2 = time2.split(":");

    let hour1 = parseInt(parts1[0]);
    let minute1 = parseInt(parts1[1]);

    let hour2 = parseInt(parts2[0]);
    let minute2 = parseInt(parts2[1]);

    let total1 = hour1 * 60 + minute1;
    let total2 = hour2 * 60 + minute2;

    return Math.abs(total1 - total2);
}


function calculateScore(lost, found) {

    let score = 0;
    let reasons = [];

    // Category - 25 points
    if (lost.category.toLowerCase() === found.category.toLowerCase()) {
        score += 25;
        reasons.push("Same category");
    }

    // Location - 25 points
    if (lost.location.toLowerCase() === found.location.toLowerCase()) {
        score += 25;
        reasons.push("Same location");
    }

    // Date - 15 points
    if (lost.date === found.date) {
        score += 15;
        reasons.push("Same date");
    }

    // Time - 10 points
    let timeDifference = timeDifferenceMinutes(
        lost.time,
        found.time
    );

    if (timeDifference <= 30) {
        score += 10;
        reasons.push(
            "Found within " + timeDifference + " minutes of reported loss"
        );
    }

    // Item name - 10 points
    let nameSimilarity = textSimilarity(
        lost.itemName,
        found.itemName
    );

    if (nameSimilarity >= 0.5) {
        score += 10;
        reasons.push("Similar item name");
    }

    // Description - 15 points
    let descriptionSimilarity = textSimilarity(
        lost.description,
        found.description
    );

    if (descriptionSimilarity >= 0.5) {
        score += 15;
        reasons.push("Similar description");
    }

    return {
        score: score,
        reasons: reasons
    };
}


module.exports = {
    calculateScore
};