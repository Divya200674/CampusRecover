// ============================================================
// CAMPUSRECOVER - MAIN JAVASCRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // Common functions
    setCurrentYear();
    setupLogout();

    // Report forms
    setupFoundForm();
    setupLostForm();

    // Listing pages
    displayFoundItems();
    displayLostItems();

    // Details and claim pages
    displayItemDetails();
    displayClaimItem();
    setupClaimForm();
});


// ============================================================
// CURRENT YEAR
// ============================================================

function setCurrentYear() {

    const yearElements =
        document.querySelectorAll(".current-year");

    yearElements.forEach(element => {
        element.textContent =
            new Date().getFullYear();
    });
}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    const logoutLinks =
        document.querySelectorAll(".logout-btn");

    logoutLinks.forEach(link => {

        link.addEventListener("click", function () {

            localStorage.removeItem("currentUser");

        });

    });
}


// ============================================================
// REPORT FOUND ITEM
// ============================================================

function setupFoundForm() {

    const form =
        document.getElementById("foundItemForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const itemName =
            document.getElementById("itemName")?.value.trim();

        const category =
            document.getElementById("category")?.value;

        const description =
            document.getElementById("description")?.value.trim();

        const location =
            document.getElementById("location")?.value.trim();

        const dateFound =
            document.getElementById("dateFound")?.value;

        const timeFound =
            document.getElementById("timeFound")?.value;

        const additionalInfo =
            document.getElementById("additionalInfo")?.value.trim();


        if (
            !itemName ||
            !category ||
            !description ||
            !location ||
            !dateFound
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;
        }


        const newItem = {

            id: Date.now(),

            itemName: itemName,

            category: category,

            description: description,

            location: location,

            dateFound: dateFound,

            timeFound: timeFound,

            additionalInfo: additionalInfo,

            status: "FOUND",

            createdAt:
                new Date().toISOString()
        };


        let foundItems =
            JSON.parse(
                localStorage.getItem("foundItems")
            ) || [];


        foundItems.push(newItem);


        localStorage.setItem(
            "foundItems",
            JSON.stringify(foundItems)
        );


        alert(
            "Found item reported successfully!"
        );


        window.location.href =
            "found-items.html";
    });
}


// ============================================================
// REPORT LOST ITEM
// ============================================================

function setupLostForm() {

    const form =
        document.getElementById("lostItemForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const itemName =
            document.getElementById("itemName")?.value.trim();

        const category =
            document.getElementById("category")?.value;

        const description =
            document.getElementById("description")?.value.trim();

        const location =
            document.getElementById("location")?.value.trim();

        const lostDate =
            document.getElementById("lostDate")?.value;

        const lostTime =
            document.getElementById("lostTime")?.value;

        const additionalInfo =
            document.getElementById("additionalInfo")?.value.trim();


        if (
            !itemName ||
            !category ||
            !description ||
            !location ||
            !lostDate
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;
        }


        const newItem = {

            id: Date.now(),

            itemName: itemName,

            category: category,

            description: description,

            location: location,

            lostDate: lostDate,

            lostTime: lostTime,

            additionalInfo: additionalInfo,

            status: "LOST",

            createdAt:
                new Date().toISOString()
        };


        let lostItems =
            JSON.parse(
                localStorage.getItem("lostItems")
            ) || [];


        lostItems.push(newItem);


        localStorage.setItem(
            "lostItems",
            JSON.stringify(lostItems)
        );


        alert(
            "Lost item reported successfully!"
        );


        window.location.href =
            "lost-items.html";
    });
}


// ============================================================
// DISPLAY FOUND ITEMS
// ============================================================

function displayFoundItems() {

    const grid =
        document.getElementById("foundItemsGrid");

    if (!grid) {
        return;
    }


    const searchInput =
        document.getElementById("foundSearch");

    const categoryFilter =
        document.getElementById(
            "foundCategoryFilter"
        );

    const noResults =
        document.getElementById("noFoundItems");


    let foundItems =
        JSON.parse(
            localStorage.getItem("foundItems")
        ) || [];


    function renderItems() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedCategory =
            categoryFilter
                ? categoryFilter.value
                : "";


        const filteredItems =
            foundItems.filter(item => {

                const itemName =
                    String(item.itemName || "")
                        .toLowerCase();

                const description =
                    String(item.description || "")
                        .toLowerCase();

                const location =
                    String(item.location || "")
                        .toLowerCase();


                const matchesSearch =
                    itemName.includes(searchText) ||
                    description.includes(searchText) ||
                    location.includes(searchText);


                const matchesCategory =
                    !selectedCategory ||
                    item.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );
            });


        grid.innerHTML = "";


        if (filteredItems.length === 0) {

            if (noResults) {
                noResults.style.display =
                    "block";
            }

            return;
        }


        if (noResults) {
            noResults.style.display =
                "none";
        }


        filteredItems.forEach(item => {

            const card =
                document.createElement("div");


            card.className =
                "item-card";


            card.innerHTML = `

                <div class="item-card-top">

                    ${getItemIcon(item.category)}

                </div>


                <div class="item-card-content">

                    <span class="found-badge">
                        FOUND
                    </span>


                    <h3>
                        ${escapeHTML(
                            item.itemName
                        )}
                    </h3>


                    <p class="item-description">

                        ${escapeHTML(
                            item.description
                        )}

                    </p>


                    <div class="item-details-list">


                        <div class="item-detail-row">

                            📂

                            <strong>
                                Category:
                            </strong>

                            ${formatCategory(
                                item.category
                            )}

                        </div>


                        <div class="item-detail-row">

                            📍

                            <strong>
                                Location:
                            </strong>

                            ${escapeHTML(
                                item.location
                            )}

                        </div>


                        <div class="item-detail-row">

                            📅

                            <strong>
                                Date:
                            </strong>

                            ${formatDate(
                                item.dateFound
                            )}

                        </div>


                    </div>


                    <a
                        href="item-details.html?id=${encodeURIComponent(
                            item.id
                        )}&type=found"
                        class="view-details-btn"
                    >
                        View Details →
                    </a>


                </div>
            `;


            grid.appendChild(card);

        });

    }


    renderItems();


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderItems
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderItems
        );

    }

}


// ============================================================
// DISPLAY LOST ITEMS
// ============================================================

function displayLostItems() {

    const grid =
        document.getElementById("lostItemsGrid");

    if (!grid) {
        return;
    }


    const searchInput =
        document.getElementById("lostSearch");

    const categoryFilter =
        document.getElementById(
            "lostCategoryFilter"
        );

    const noResults =
        document.getElementById(
            "noLostItems"
        );


    let lostItems =
        JSON.parse(
            localStorage.getItem("lostItems")
        ) || [];


    function renderItems() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedCategory =
            categoryFilter
                ? categoryFilter.value
                : "";


        const filteredItems =
            lostItems.filter(item => {

                const itemName =
                    String(item.itemName || "")
                        .toLowerCase();

                const description =
                    String(item.description || "")
                        .toLowerCase();

                const location =
                    String(item.location || "")
                        .toLowerCase();


                const matchesSearch =
                    itemName.includes(searchText) ||
                    description.includes(searchText) ||
                    location.includes(searchText);


                const matchesCategory =
                    !selectedCategory ||
                    item.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );
            });


        grid.innerHTML = "";


        if (filteredItems.length === 0) {

            if (noResults) {
                noResults.style.display =
                    "block";
            }

            return;
        }


        if (noResults) {
            noResults.style.display =
                "none";
        }


        filteredItems.forEach(item => {

            const card =
                document.createElement("div");


            card.className =
                "item-card";


            card.innerHTML = `

                <div class="item-card-top">

                    ${getItemIcon(item.category)}

                </div>


                <div class="item-card-content">

                    <span class="lost-badge">
                        LOST
                    </span>


                    <h3>
                        ${escapeHTML(
                            item.itemName
                        )}
                    </h3>


                    <p class="item-description">

                        ${escapeHTML(
                            item.description
                        )}

                    </p>


                    <div class="item-details-list">


                        <div class="item-detail-row">

                            📂

                            <strong>
                                Category:
                            </strong>

                            ${formatCategory(
                                item.category
                            )}

                        </div>


                        <div class="item-detail-row">

                            📍

                            <strong>
                                Location:
                            </strong>

                            ${escapeHTML(
                                item.location
                            )}

                        </div>


                        <div class="item-detail-row">

                            📅

                            <strong>
                                Date:
                            </strong>

                            ${formatDate(
                                item.lostDate
                            )}

                        </div>


                    </div>


                    <a
                        href="item-details.html?id=${encodeURIComponent(
                            item.id
                        )}&type=lost"
                        class="view-details-btn"
                    >
                        View Details →
                    </a>


                </div>
            `;


            grid.appendChild(card);

        });

    }


    renderItems();


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderItems
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderItems
        );

    }

}


// ============================================================
// ITEM DETAILS PAGE
// ============================================================

function displayItemDetails() {

    const detailsCard =
        document.getElementById(
            "itemDetailsCard"
        );


    if (!detailsCard) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const itemId =
        params.get("id");


    const itemType =
        params.get("type");


    console.log(
        "Item Details ID:",
        itemId
    );


    console.log(
        "Item Details Type:",
        itemType
    );


    // --------------------------------------------------------
    // INVALID URL
    // --------------------------------------------------------

    if (!itemId || !itemType) {

        detailsCard.innerHTML = `

            <div class="empty-state">

                <div style="font-size:55px;">
                    🔎
                </div>

                <h2>
                    Item Not Found
                </h2>

                <p>
                    The item information is missing
                    or the link is invalid.
                </p>

                <a
                    href="found-items.html"
                    class="primary-action-btn"
                >
                    Back to Found Items
                </a>

            </div>
        `;

        return;
    }


    // --------------------------------------------------------
    // GET ITEMS
    // --------------------------------------------------------

    let items = [];


    if (itemType === "found") {

        items =
            JSON.parse(
                localStorage.getItem(
                    "foundItems"
                )
            ) || [];

    }


    else if (itemType === "lost") {

        items =
            JSON.parse(
                localStorage.getItem(
                    "lostItems"
                )
            ) || [];

    }


    // --------------------------------------------------------
    // FIND ITEM
    // --------------------------------------------------------

    const item =
        items.find(
            currentItem =>
                String(
                    currentItem.id
                ) === String(itemId)
        );


    // --------------------------------------------------------
    // ITEM NOT FOUND
    // --------------------------------------------------------

    if (!item) {

        detailsCard.innerHTML = `

            <div class="empty-state">

                <div style="font-size:55px;">
                    📦
                </div>

                <h2>
                    Item Not Found
                </h2>

                <p>
                    This item could not be found
                    in your saved reports.
                </p>

                <a
                    href="${
                        itemType === "lost"
                            ? "lost-items.html"
                            : "found-items.html"
                    }"
                    class="primary-action-btn"
                >
                    Back to Items
                </a>

            </div>

        `;

        return;
    }


    // --------------------------------------------------------
    // ITEM DATA
    // --------------------------------------------------------

    const date =
        itemType === "found"
            ? item.dateFound
            : item.lostDate;


    const time =
        itemType === "found"
            ? item.timeFound
            : item.lostTime;


    const status =
        itemType === "found"
            ? "FOUND"
            : "LOST";


    const backPage =
        itemType === "found"
            ? "found-items.html"
            : "lost-items.html";


    // --------------------------------------------------------
    // DISPLAY DETAILS
    // --------------------------------------------------------

    detailsCard.innerHTML = `

        <div class="details-header">

            <div class="details-icon">

                ${getItemIcon(
                    item.category
                )}

            </div>


            <div>

                <span class="section-label">

                    ${status}

                </span>


                <h1>

                    ${escapeHTML(
                        item.itemName
                    )}

                </h1>


                <p>

                    ${escapeHTML(
                        item.description
                    )}

                </p>

            </div>

        </div>


        <div class="details-grid">


            <div class="detail-box">

                <span class="detail-label">
                    Category
                </span>

                <span class="detail-value">

                    ${formatCategory(
                        item.category
                    )}

                </span>

            </div>


            <div class="detail-box">

                <span class="detail-label">
                    Location
                </span>

                <span class="detail-value">

                    📍
                    ${escapeHTML(
                        item.location
                    )}

                </span>

            </div>


            <div class="detail-box">

                <span class="detail-label">

                    ${
                        itemType === "found"
                            ? "Date Found"
                            : "Date Lost"
                    }

                </span>

                <span class="detail-value">

                    ${formatDate(date)}

                </span>

            </div>


            <div class="detail-box">

                <span class="detail-label">
                    Approximate Time
                </span>

                <span class="detail-value">

                    ${
                        time
                            ? escapeHTML(time)
                            : "Not specified"
                    }

                </span>

            </div>


        </div>


        ${
            item.additionalInfo
                ? `

                    <div class="additional-info">

                        <h3>
                            Additional Information
                        </h3>

                        <p>

                            ${escapeHTML(
                                item.additionalInfo
                            )}

                        </p>

                    </div>

                `
                : ""
        }


        ${
            itemType === "found"
                ? `

                    <div class="possible-match-box">

                        <div class="match-icon">
                            🔐
                        </div>

                        <div>

                            <span class="section-label">
                                POSSIBLE MATCH
                            </span>

                            <h3>
                                Think this item is yours?
                            </h3>

                            <p>
                                Submit private ownership
                                evidence for campus
                                verification.
                            </p>

                        </div>

                    </div>

                `
                : ""
        }


        <div class="details-actions">


            ${
                itemType === "found"
                    ? `

                        <a
                            href="claim.html?id=${encodeURIComponent(
                                item.id
                            )}&type=found"
                            class="primary-action-btn"
                        >
                            🔐 Claim This Item
                        </a>

                    `
                    : ""
            }


            <a
                href="${backPage}"
                class="secondary-action-btn"
            >
                ← Back to Items
            </a>


        </div>

    `;
}


// ============================================================
// CLAIM PAGE
// ============================================================

function displayClaimItem() {

    const claimForm =
        document.getElementById(
            "claimForm"
        );


    if (!claimForm) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const itemId =
        params.get("id");


    const itemType =
        params.get("type");


    console.log(
        "========== CLAIM PAGE =========="
    );


    console.log(
        "Claim Item ID:",
        itemId
    );


    console.log(
        "Claim Item Type:",
        itemType
    );


    console.log(
        "Current URL:",
        window.location.href
    );


    const claimItemName =
        document.getElementById(
            "claimItemName"
        );


    const claimCategory =
        document.getElementById(
            "claimCategory"
        );


    const claimLocation =
        document.getElementById(
            "claimLocation"
        );


    const claimDate =
        document.getElementById(
            "claimDate"
        );


    const claimStatus =
        document.getElementById(
            "claimStatus"
        );


    // --------------------------------------------------------
    // INVALID URL
    // --------------------------------------------------------

    if (!itemId || !itemType) {

        if (claimItemName) {
            claimItemName.textContent =
                "Invalid Claim";
        }


        if (claimCategory) {
            claimCategory.textContent =
                "-";
        }


        if (claimLocation) {
            claimLocation.textContent =
                "-";
        }


        if (claimDate) {
            claimDate.textContent =
                "-";
        }


        if (claimStatus) {
            claimStatus.textContent =
                "INVALID";
        }


        console.error(
            "Claim page opened without item ID or item type."
        );


        return;
    }


    // --------------------------------------------------------
    // GET DATA
    // --------------------------------------------------------

    let items = [];


    if (itemType === "found") {

        items =
            JSON.parse(
                localStorage.getItem(
                    "foundItems"
                )
            ) || [];

    }


    else if (itemType === "lost") {

        items =
            JSON.parse(
                localStorage.getItem(
                    "lostItems"
                )
            ) || [];

    }


    else {

        if (claimItemName) {
            claimItemName.textContent =
                "Invalid Claim";
        }


        if (claimStatus) {
            claimStatus.textContent =
                "INVALID";
        }


        return;
    }


    // --------------------------------------------------------
    // FIND ITEM
    // --------------------------------------------------------

    const item =
        items.find(
            currentItem =>
                String(
                    currentItem.id
                ) === String(itemId)
        );


    // --------------------------------------------------------
    // ITEM NOT FOUND
    // --------------------------------------------------------

    if (!item) {

        if (claimItemName) {
            claimItemName.textContent =
                "Item Not Found";
        }


        if (claimCategory) {
            claimCategory.textContent =
                "-";
        }


        if (claimLocation) {
            claimLocation.textContent =
                "-";
        }


        if (claimDate) {
            claimDate.textContent =
                "-";
        }


        if (claimStatus) {
            claimStatus.textContent =
                "NOT FOUND";
        }


        console.error(
            "Item does not exist in localStorage:",
            itemId
        );


        return;
    }


    // --------------------------------------------------------
    // DISPLAY ITEM
    // --------------------------------------------------------

    if (claimItemName) {

        claimItemName.textContent =
            item.itemName;

    }


    if (claimCategory) {

        claimCategory.textContent =
            formatCategory(
                item.category
            );

    }


    if (claimLocation) {

        claimLocation.textContent =
            item.location;

    }


    if (claimDate) {

        const date =
            itemType === "found"
                ? item.dateFound
                : item.lostDate;


        claimDate.textContent =
            formatDate(date);

    }


    if (claimStatus) {

        claimStatus.textContent =
            itemType === "found"
                ? "FOUND"
                : "LOST";

    }


    // Store information on form

    claimForm.dataset.itemId =
        itemId;


    claimForm.dataset.itemType =
        itemType;


    console.log(
        "Claim item successfully loaded:",
        item
    );
}


// ============================================================
// CLAIM FORM
// ============================================================

function setupClaimForm() {

    const form =
        document.getElementById(
            "claimForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ------------------------------------------------
            // GET URL PARAMETERS
            // ------------------------------------------------

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const itemId =
                params.get("id");


            const itemType =
                params.get("type");


            // ------------------------------------------------
            // VALIDATE
            // ------------------------------------------------

            if (!itemId || !itemType) {

                alert(
                    "Invalid claim. Please open the claim page from an item."
                );

                return;
            }


            // ------------------------------------------------
            // FORM VALUES
            // ------------------------------------------------

            const claimReason =
                document
                    .getElementById(
                        "claimReason"
                    )
                    ?.value
                    .trim();


            const ownershipDetails =
                document
                    .getElementById(
                        "ownershipDetails"
                    )
                    ?.value
                    .trim();


            const contact =
                document
                    .getElementById(
                        "contact"
                    )
                    ?.value
                    .trim();


            const proofInput =
                document.getElementById(
                    "proof"
                );


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (
                !claimReason ||
                !ownershipDetails ||
                !contact
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            // ------------------------------------------------
            // CREATE CLAIM
            // ------------------------------------------------

            const newClaim = {

                id: Date.now(),

                itemId: itemId,

                itemType: itemType,

                claimReason:
                    claimReason,

                ownershipDetails:
                    ownershipDetails,

                contact:
                    contact,

                proofFileName:
                    proofInput &&
                    proofInput.files.length > 0
                        ? proofInput.files[0].name
                        : "",

                status:
                    "CLAIM_PENDING",

                submittedAt:
                    new Date().toISOString()

            };


            // ------------------------------------------------
            // SAVE CLAIM
            // ------------------------------------------------

            let claims =
                JSON.parse(
                    localStorage.getItem(
                        "claims"
                    )
                ) || [];


            claims.push(newClaim);


            localStorage.setItem(
                "claims",
                JSON.stringify(claims)
            );


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            alert(
                "Claim submitted successfully! Your claim is pending campus verification."
            );


            window.location.href =
                "my-claims.html";

        }
    );
}


// ============================================================
// ITEM ICON
// ============================================================

function getItemIcon(category) {

    if (!category) {
        return "📦";
    }


    const value =
        category
            .toLowerCase();


    if (
        value.includes("wallet") ||
        value.includes("purse")
    ) {

        return "👛";

    }


    if (
        value.includes("electronics") ||
        value.includes("electronic") ||
        value.includes("laptop")
    ) {

        return "💻";

    }


    if (
        value.includes("phone") ||
        value.includes("mobile")
    ) {

        return "📱";

    }


    if (
        value.includes("book") ||
        value.includes("document")
    ) {

        return "📚";

    }


    if (
        value.includes("clothing") ||
        value.includes("dress") ||
        value.includes("shirt")
    ) {

        return "👕";

    }


    if (
        value.includes("accessor") ||
        value.includes("watch")
    ) {

        return "⌚";

    }


    if (
        value.includes("bottle")
    ) {

        return "🧴";

    }


    if (
        value.includes("bag") ||
        value.includes("backpack")
    ) {

        return "🎒";

    }


    if (
        value.includes("key")
    ) {

        return "🔑";

    }


    if (
        value.includes("id") ||
        value.includes("card")
    ) {

        return "🪪";

    }


    return "📦";
}


// ============================================================
// FORMAT CATEGORY
// ============================================================

function formatCategory(category) {

    if (!category) {
        return "-";
    }


    return String(category)
        .replace(/[-_]/g, " ")
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );
}


// ============================================================
// FORMAT LOCATION
// ============================================================

function formatLocation(location) {

    if (!location) {
        return "-";
    }


    return String(location);
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}