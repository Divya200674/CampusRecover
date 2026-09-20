const { differenceInMinutes, parse } = require("date-fns");


// Compare two text values
function textSimilarity(text1, text2) {
    if (!text1 || !text2) {
        return 0;
    }

    text1 = text1.toLowerCase().trim();
    text2 = text2.toLowerCase().trim();

    if (text1 === text2) {
        return 1;
    }

    if (text1.includes(text2) || text2.includes(text1)) {
        return 0.8;
    }

    const words1 = text1.split(" ");
    const words2 = text2.split(" ");

    let commonWords = 0;

    for (let i = 0; i < words1.length; i++) {
        for (let j = 0; j < words2.length; j++) {
            if (words1[i] === words2[j]) {
                commonWords++;
                break;
            }
        }
    }

    const totalWords = Math.max(words1.length, words2.length);

    if (totalWords === 0) {
        return 0;
    }

    return commonWords / totalWords;
}


// Calculate time difference in minutes
function getTimeDifference(time1, time2) {
    const date1 = parse(time1, "HH:mm", new Date());
    const date2 = parse(time2, "HH:mm", new Date());

    return Math.abs(differenceInMinutes(date1, date2));
}


// Main scoring function
function calculateScore(lostItem, foundItem) {

    let score = 0;
    let reasons = [];

    // --------------------------------
    // 1. CATEGORY - 25 POINTS
    // --------------------------------

    if (
        lostItem.category &&
        foundItem.category &&
        lostItem.category.toLowerCase() === foundItem.category.toLowerCase()
    ) {
        score += 25;
        reasons.push("Same category");
    }


    // --------------------------------
    // 2. LOCATION - 25 POINTS
    // --------------------------------

    if (
        lostItem.location &&
        foundItem.location &&
        lostItem.location.toLowerCase() === foundItem.location.toLowerCase()
    ) {
        score += 25;
        reasons.push("Same location");
    }


    // --------------------------------
    // 3. DATE - 15 POINTS
    // --------------------------------

    if (
        lostItem.date &&
        foundItem.date &&
        lostItem.date === foundItem.date
    ) {
        score += 15;
        reasons.push("Same date");
    }


    // --------------------------------
    // 4. TIME - 10 POINTS
    // --------------------------------

    if (lostItem.time && foundItem.time) {

        const timeDifference = getTimeDifference(
            lostItem.time,
            foundItem.time
        );

        if (timeDifference <= 30) {

            score += 10;

            reasons.push(
                `Found within ${timeDifference} minutes of reported loss`
            );
        }
    }


    // --------------------------------
    // 5. ITEM NAME - 10 POINTS
    // --------------------------------

    const nameSimilarity = textSimilarity(
        lostItem.itemName,
        foundItem.itemName
    );

    if (nameSimilarity >= 0.5) {

        score += 10;

        reasons.push("Similar item name");
    }


    // --------------------------------
    // 6. DESCRIPTION - 15 POINTS
    // --------------------------------

    const descriptionSimilarity = textSimilarity(
        lostItem.description,
        foundItem.description
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