const API_BASE_URL = "http://localhost:3000";


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    setCurrentYear();

    setupLogout();

    setupFoundForm();

    setupLostForm();

    displayFoundItems();

    displayLostItems();

    displayItemDetails();

    displayClaimItem();

    setupClaimForm();

    displayMyClaims();

});


/* =====================================================
   CURRENT YEAR
===================================================== */

function setCurrentYear() {

    document.querySelectorAll(".current-year").forEach(function (element) {

        element.textContent = new Date().getFullYear();

    });

}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    const logoutButtons = document.querySelectorAll(".logout-btn");

    logoutButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            localStorage.removeItem("currentUser");

            window.location.href = "login.html";

        });

    });

}


/* =====================================================
   REPORT LOST ITEM
===================================================== */

function setupLostForm() {

    const form = document.getElementById("lostItemForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = form.querySelector(".submit-report-btn");

        const originalText = submitButton
            ? submitButton.innerHTML
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = "⏳ Submitting...";
        }

        try {

            const itemNameElement = document.getElementById("itemName");
            const categoryElement = document.getElementById("category");
            const descriptionElement = document.getElementById("description");
            const locationElement = document.getElementById("location");
            const lostDateElement = document.getElementById("lostDate");
            const lostTimeElement = document.getElementById("lostTime");
            const additionalInfoElement = document.getElementById("additionalInfo");

            const itemName = itemNameElement
                ? itemNameElement.value.trim()
                : "";

            const category = categoryElement
                ? categoryElement.value
                : "";

            const description = descriptionElement
                ? descriptionElement.value.trim()
                : "";

            const location = locationElement
                ? locationElement.value
                : "";

            const lostDate = lostDateElement
                ? lostDateElement.value
                : "";

            const lostTime = lostTimeElement
                ? lostTimeElement.value
                : "";

            const additionalInfo = additionalInfoElement
                ? additionalInfoElement.value.trim()
                : "";

            let finalDescription = description;

            if (additionalInfo) {
                finalDescription = description + "\n" + additionalInfo;
            }

            const data = {
                itemName: itemName,
                category: category,
                description: finalDescription,
                location: location,
                date: lostDate,
                time: lostTime
            };

            console.log("Sending lost item:", data);

            const response = await fetch(
                API_BASE_URL + "/lost-items",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            console.log("Backend response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to report lost item."
                );
            }

            alert("✅ Lost item reported successfully!");

            form.reset();

            window.location.href = "my-reports.html";

        } catch (error) {

            console.error("Lost item error:", error);

            alert(
                "❌ Unable to submit the lost item.\n\n" +
                error.message
            );

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }

        }

    });

}


/* =====================================================
   REPORT FOUND ITEM
===================================================== */

function setupFoundForm() {

    const form = document.getElementById("foundItemForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = form.querySelector(".submit-report-btn");

        const originalText = submitButton
            ? submitButton.innerHTML
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = "⏳ Submitting...";
        }

        try {

            const itemNameElement = document.getElementById("itemName");
            const categoryElement = document.getElementById("category");
            const descriptionElement = document.getElementById("description");
            const locationElement = document.getElementById("location");
            const dateFoundElement = document.getElementById("dateFound");
            const timeFoundElement = document.getElementById("timeFound");
            const additionalInfoElement = document.getElementById("additionalInfo");

            const itemName = itemNameElement
                ? itemNameElement.value.trim()
                : "";

            const category = categoryElement
                ? categoryElement.value
                : "";

            const description = descriptionElement
                ? descriptionElement.value.trim()
                : "";

            const location = locationElement
                ? locationElement.value
                : "";

            const dateFound = dateFoundElement
                ? dateFoundElement.value
                : "";

            const timeFound = timeFoundElement
                ? timeFoundElement.value
                : "";

            const additionalInfo = additionalInfoElement
                ? additionalInfoElement.value.trim()
                : "";

            let finalDescription = description;

            if (additionalInfo) {
                finalDescription = description + "\n" + additionalInfo;
            }

            const data = {
                itemName: itemName,
                category: category,
                description: finalDescription,
                location: location,
                date: dateFound,
                time: timeFound
            };

            console.log("Sending found item:", data);

            const response = await fetch(
                API_BASE_URL + "/found-items",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            console.log("Backend response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to report found item."
                );
            }

            alert("✅ Found item reported successfully!");

            form.reset();

            window.location.href = "found-items.html";

        } catch (error) {

            console.error("Found item error:", error);

            alert(
                "❌ Unable to submit the found item.\n\n" +
                error.message
            );

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }

        }

    });

}


/* =====================================================
   DISPLAY LOST ITEMS
===================================================== */

async function displayLostItems() {

    const container = document.getElementById("lostItemsContainer");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            API_BASE_URL + "/lost-items"
        );

        if (!response.ok) {
            throw new Error("Unable to load lost items");
        }

        const result = await response.json();

        const items = Array.isArray(result)
            ? result
            : result.items || [];

        renderItems(container, items, "lost");

        setupItemFilters("lost", items);

    } catch (error) {

        console.error("Lost items error:", error);

        container.innerHTML =
            '<div class="empty-state">' +
                '<div class="empty-icon">⚠️</div>' +
                '<h3>Unable to load lost items</h3>' +
                '<p>Make sure the CampusRecover backend is running on http://localhost:3000</p>' +
            '</div>';

    }

}


/* =====================================================
   DISPLAY FOUND ITEMS
===================================================== */

async function displayFoundItems() {

    const container = document.getElementById("foundItemsContainer");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            API_BASE_URL + "/found-items"
        );

        if (!response.ok) {
            throw new Error("Unable to load found items");
        }

        const result = await response.json();

        const items = Array.isArray(result)
            ? result
            : result.items || [];

        renderItems(container, items, "found");

        setupItemFilters("found", items);

    } catch (error) {

        console.error("Found items error:", error);

        container.innerHTML =
            '<div class="empty-state">' +
                '<div class="empty-icon">⚠️</div>' +
                '<h3>Unable to load found items</h3>' +
                '<p>Make sure the CampusRecover backend is running.</p>' +
            '</div>';

    }

}


/* =====================================================
   RENDER ITEMS
===================================================== */

function renderItems(container, items, type) {

    if (!container) {
        return;
    }

    if (!items || items.length === 0) {

        let icon = "📦";
        let message = "No items have been reported yet.";
        let buttonText = "Report Item";
        let buttonLink = "report-lost.html";

        if (type === "lost") {
            icon = "🔍";
            message = "No students have reported lost items yet.";
            buttonText = "Report Lost Item";
            buttonLink = "report-lost.html";
        }

        if (type === "found") {
            icon = "📦";
            message = "No found items have been reported yet.";
            buttonText = "Report Found Item";
            buttonLink = "report-found.html";
        }

        container.innerHTML =
            '<div class="empty-state">' +
                '<div class="empty-icon">' + icon + '</div>' +
                '<h3>No ' + type + ' items found</h3>' +
                '<p>' + message + '</p>' +
                '<a href="' + buttonLink + '" class="empty-action-btn">' +
                    buttonText +
                '</a>' +
            '</div>';

        return;
    }

    let html = "";

    items.forEach(function (item) {
        html += createItemCard(item, type);
    });

    container.innerHTML = html;

}


/* =====================================================
   ITEM CARD
===================================================== */

function createItemCard(item, type) {

    const id =
        item.itemId ||
        item.id ||
        item._id ||
        "";

    const itemName =
        item.itemName ||
        item.name ||
        "Unnamed Item";

    const description =
        item.description ||
        "No description available.";

    const category =
        item.category ||
        "Other";

    const location =
        item.location ||
        "Unknown";

    const date =
        item.date ||
        item.lostDate ||
        item.dateLost ||
        item.dateFound ||
        item.foundDate ||
        "Unknown";

    const icon = getItemIcon(category);

    const badgeClass =
        type === "lost"
            ? "lost-badge"
            : "found-badge";

    const badgeText =
        type === "lost"
            ? "LOST"
            : "FOUND";

    return (
        '<div class="item-card">' +

            '<div class="item-card-top">' +

                '<div class="item-card-icon">' +
                    icon +
                '</div>' +

                '<span class="' + badgeClass + '">' +
                    badgeText +
                '</span>' +

            '</div>' +

            '<div class="item-card-content">' +

                '<h3>' +
                    escapeHTML(itemName) +
                '</h3>' +

                '<p class="item-description">' +
                    escapeHTML(description) +
                '</p>' +

                '<div class="item-details-list">' +

                    '<div class="item-detail-row">' +
                        '📂 ' +
                        '<strong>Category:</strong> ' +
                        escapeHTML(formatCategory(category)) +
                    '</div>' +

                    '<div class="item-detail-row">' +
                        '📍 ' +
                        '<strong>Location:</strong> ' +
                        escapeHTML(formatLocation(location)) +
                    '</div>' +

                    '<div class="item-detail-row">' +
                        '📅 ' +
                        '<strong>Date:</strong> ' +
                        escapeHTML(formatDate(date)) +
                    '</div>' +

                '</div>' +

                '<a href="item-details.html?id=' +
                    encodeURIComponent(id) +
                    '&type=' +
                    type +
                    '" class="view-details-btn">' +
                    'View Details →' +
                '</a>' +

            '</div>' +

        '</div>'
    );

}


/* =====================================================
   SEARCH + CATEGORY FILTER
===================================================== */

function setupItemFilters(type, originalItems) {

    const searchInput =
        document.getElementById(type + "Search");

    const categoryFilter =
        document.getElementById(type + "CategoryFilter");

    if (!searchInput && !categoryFilter) {
        return;
    }

    const applyFilters = function () {

        let filtered = [...originalItems];

        const search = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const category = categoryFilter
            ? categoryFilter.value.trim().toLowerCase()
            : "";

        if (search) {

            filtered = filtered.filter(function (item) {

                const text =
                    String(item.itemName || "") + " " +
                    String(item.name || "") + " " +
                    String(item.description || "") + " " +
                    String(item.location || "") + " " +
                    String(item.category || "");

                return text.toLowerCase().includes(search);

            });

        }

        if (category) {

            filtered = filtered.filter(function (item) {

                return String(item.category || "")
                    .toLowerCase()
                    .includes(category);

            });

        }

        const container =
            document.getElementById(
                type + "ItemsContainer"
            );

        if (container) {
            renderItems(container, filtered, type);
        }

    };

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFilters);
    }

}


/* =====================================================
   ITEM DETAILS
===================================================== */

async function displayItemDetails() {

    const container =
        document.getElementById("itemDetailsContainer");

    if (!container) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    const type =
        params.get("type") || "found";

    if (!id) {

        container.innerHTML =
            '<div class="empty-state">' +
                '<div class="empty-icon">⚠️</div>' +
                '<h3>Invalid Item</h3>' +
                '<p>No item ID was provided.</p>' +
            '</div>';

        return;
    }

    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/items/" +
                encodeURIComponent(id)
            );

        if (!response.ok) {
            throw new Error("Item not found");
        }

        const result = await response.json();

        const item =
            result.item || result;

        let claimButton = "";

        if (type === "found") {

            claimButton =
                '<a href="claim.html?id=' +
                encodeURIComponent(id) +
                '&type=found" class="claim-button">' +
                'Claim This Item' +
                '</a>';

        }

        const backPage =
            type === "lost"
                ? "lost-items.html"
                : "found-items.html";

        const badge =
            type === "lost"
                ? "🔍 LOST ITEM"
                : "📦 FOUND ITEM";

        container.innerHTML =
            '<div class="details-card">' +

                '<div class="details-badge">' +
                    badge +
                '</div>' +

                '<h1>' +
                    escapeHTML(item.itemName || "Unnamed Item") +
                '</h1>' +

                '<p class="details-description">' +
                    escapeHTML(item.description || "No description") +
                '</p>' +

                '<div class="details-grid">' +

                    '<div>' +
                        '<span>Category</span>' +
                        '<strong>' +
                            escapeHTML(
                                formatCategory(item.category)
                            ) +
                        '</strong>' +
                    '</div>' +

                    '<div>' +
                        '<span>Location</span>' +
                        '<strong>' +
                            escapeHTML(
                                formatLocation(item.location)
                            ) +
                        '</strong>' +
                    '</div>' +

                    '<div>' +
                        '<span>Date</span>' +
                        '<strong>' +
                            escapeHTML(
                                formatDate(item.date)
                            ) +
                        '</strong>' +
                    '</div>' +

                '</div>' +

                claimButton +

                '<a href="' +
                    backPage +
                    '" class="back-button">' +
                    '← Back' +
                '</a>' +

            '</div>';

    } catch (error) {

        console.error("Item details error:", error);

        container.innerHTML =
            '<div class="empty-state">' +
                '<div class="empty-icon">⚠️</div>' +
                '<h3>Item not found</h3>' +
                '<p>The requested item could not be loaded.</p>' +
            '</div>';

    }

}


/* =====================================================
   CLAIM ITEM
===================================================== */

async function displayClaimItem() {

    const container =
        document.getElementById("claimItemContainer");

    if (!container) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        container.innerHTML =
            "<p>Invalid claim.</p>";

        return;
    }

    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/items/" +
                encodeURIComponent(id)
            );

        if (!response.ok) {
            throw new Error("Unable to load item");
        }

        const result = await response.json();

        const item =
            result.item || result;

        container.innerHTML =
            '<div class="claim-item-preview">' +

                '<span class="found-badge">' +
                    'FOUND' +
                '</span>' +

                '<h2>' +
                    escapeHTML(
                        item.itemName ||
                        "Unnamed Item"
                    ) +
                '</h2>' +

                '<p>' +
                    escapeHTML(
                        item.description || ""
                    ) +
                '</p>' +

                '<div>' +
                    '📂 ' +
                    escapeHTML(
                        formatCategory(item.category)
                    ) +
                '</div>' +

                '<div>' +
                    '📍 ' +
                    escapeHTML(
                        formatLocation(item.location)
                    ) +
                '</div>' +

                '<div>' +
                    '📅 ' +
                    escapeHTML(
                        formatDate(item.date)
                    ) +
                '</div>' +

            '</div>';

    } catch (error) {

        console.error("Claim item error:", error);

        container.innerHTML =
            "<p>Unable to load item.</p>";

    }

}


/* =====================================================
   CLAIM FORM
===================================================== */

function setupClaimForm() {

    const form =
        document.getElementById("claimForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const params =
            new URLSearchParams(window.location.search);

        const itemId =
            params.get("id");

        const reasonElement =
            document.getElementById("claimReason");

        const reason =
            reasonElement
                ? reasonElement.value.trim()
                : "";

        if (!itemId) {

            alert("Invalid item.");

            return;
        }

        if (!reason) {

            alert(
                "Please provide a reason for your claim."
            );

            return;
        }

        try {

            const response =
                await fetch(
                    API_BASE_URL + "/claims",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            itemId: itemId,
                            reason: reason
                        })
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to submit claim"
                );

            }

            alert(
                "✅ Claim submitted successfully!"
            );

            window.location.href =
                "my-claims.html";

        } catch (error) {

            console.error(
                "Claim error:",
                error
            );

            alert(
                "❌ Unable to submit claim.\n\n" +
                error.message
            );

        }

    });

}


/* =====================================================
   MY CLAIMS
===================================================== */

async function displayMyClaims() {

    const container =
        document.getElementById("myClaimsContainer");

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                API_BASE_URL + "/claims"
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load claims"
            );

        }

        const result =
            await response.json();

        const claims =
            Array.isArray(result)
                ? result
                : result.claims || [];

        if (claims.length === 0) {

            container.innerHTML =
                '<div class="empty-state">' +

                    '<div class="empty-state-icon">' +
                        '🔐' +
                    '</div>' +

                    '<h3>No Claims Yet</h3>' +

                    '<p>' +
                        'You have not submitted any claims yet.' +
                    '</p>' +

                '</div>';

            return;
        }

        let html =
            '<div class="items-grid">';

        for (const claim of claims) {

            let item = null;

            try {

                const itemResponse =
                    await fetch(
                        API_BASE_URL +
                        "/items/" +
                        encodeURIComponent(
                            claim.itemId
                        )
                    );

                if (itemResponse.ok) {

                    const itemResult =
                        await itemResponse.json();

                    item =
                        itemResult.item ||
                        itemResult;

                }

            } catch (itemError) {

                console.error(
                    "Unable to load claim item:",
                    itemError
                );

            }

            const itemName =
                item && item.itemName
                    ? item.itemName
                    : "Unknown Item";

            const category =
                item && item.category
                    ? item.category
                    : "Other";

            const location =
                item && item.location
                    ? item.location
                    : "Unknown";

            const itemDate =
                item && item.date
                    ? item.date
                    : "Unknown";

            const reason =
                claim.reason ||
                "No reason provided";

            const status =
                claim.status ||
                "PENDING";

            const statusClass =
                status.toLowerCase();

            const createdAt =
                claim.createdAt
                    ? formatDateTime(claim.createdAt)
                    : "Unknown";

            html +=
                '<div class="item-card">' +

                    '<div class="item-card-top">' +

                        '<div class="item-card-icon">' +
                            getItemIcon(category) +
                        '</div>' +

                        '<span class="claim-status ' +
                            statusClass +
                        '">' +
                            escapeHTML(status) +
                        '</span>' +

                    '</div>' +

                    '<div class="item-card-content">' +

                        '<h3>' +
                            escapeHTML(itemName) +
                        '</h3>' +

                        '<div class="item-details-list">' +

                            '<div class="item-detail-row">' +
                                '📂 ' +
                                '<strong>Category:</strong> ' +
                                escapeHTML(
                                    formatCategory(category)
                                ) +
                            '</div>' +

                            '<div class="item-detail-row">' +
                                '📍 ' +
                                '<strong>Location:</strong> ' +
                                escapeHTML(
                                    formatLocation(location)
                                ) +
                            '</div>' +

                            '<div class="item-detail-row">' +
                                '📅 ' +
                                '<strong>Date:</strong> ' +
                                escapeHTML(
                                    formatDate(itemDate)
                                ) +
                            '</div>' +

                        '</div>' +

                        '<div class="claim-reason">' +

                            '<strong>Claim Reason:</strong>' +

                            '<p>' +
                                escapeHTML(reason) +
                            '</p>' +

                        '</div>' +

                        '<div class="claim-submitted">' +

                            '<strong>Submitted:</strong> ' +
                            escapeHTML(createdAt) +

                        '</div>' +

                    '</div>' +

                '</div>';

        }

        html += "</div>";

        container.innerHTML = html;

    } catch (error) {

        console.error(
            "My claims error:",
            error
        );

        container.innerHTML =
            '<div class="empty-state">' +

                '<div class="empty-state-icon">' +
                    '⚠️' +
                '</div>' +

                '<h3>Unable to load claims</h3>' +

                '<p>' +
                    'Make sure the CampusRecover backend is running on http://localhost:3000' +
                '</p>' +

            '</div>';

    }

}


/* =====================================================
   HELPERS
===================================================== */

function getItemIcon(category) {

    const value =
        String(category || "").toLowerCase();

    if (
        value.includes("mobile") ||
        value.includes("phone")
    ) {
        return "📱";
    }

    if (
        value.includes("laptop") ||
        value.includes("computer")
    ) {
        return "💻";
    }

    if (value.includes("wallet")) {
        return "👛";
    }

    if (value.includes("id")) {
        return "🪪";
    }

    if (value.includes("book")) {
        return "📚";
    }

    if (value.includes("bag")) {
        return "🎒";
    }

    if (value.includes("key")) {
        return "🔑";
    }

    if (value.includes("electronic")) {
        return "🎧";
    }

    return "📦";

}


function formatCategory(category) {

    if (!category) {
        return "Other";
    }

    return String(category)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });

}


function formatLocation(location) {

    if (!location) {
        return "Unknown";
    }

    return String(location)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });

}


function formatDate(date) {

    if (!date) {
        return "Unknown";
    }

    try {

        const parsed =
            new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return String(date);
        }

        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch (error) {

        return String(date);

    }

}


function formatDateTime(dateTime) {

    if (!dateTime) {
        return "Unknown";
    }

    try {

        const parsed =
            new Date(dateTime);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return String(dateTime);
        }

        return parsed.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    } catch (error) {

        return String(dateTime);

    }

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value === null || value === undefined
            ? ""
            : value);

    return div.innerHTML;

}