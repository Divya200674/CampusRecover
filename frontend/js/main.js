// ============================================================
// CAMPUSRECOVER - MAIN JAVASCRIPT
// ============================================================


// ============================================================
// BACKEND API
// ============================================================

const API_BASE_URL = "http://localhost:3000";


// ============================================================
// PAGE INITIALIZATION
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


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const itemName =
                document
                    .getElementById("itemName")
                    ?.value
                    .trim();


            const category =
                document
                    .getElementById("category")
                    ?.value;


            const description =
                document
                    .getElementById("description")
                    ?.value
                    .trim();


            const location =
                document
                    .getElementById("location")
                    ?.value
                    .trim();


            const dateFound =
                document
                    .getElementById("dateFound")
                    ?.value;


            const timeFound =
                document
                    .getElementById("timeFound")
                    ?.value;


            const additionalInfo =
                document
                    .getElementById("additionalInfo")
                    ?.value
                    .trim();


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

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


            // ------------------------------------------------
            // DATA FOR BACKEND
            // ------------------------------------------------

            const itemData = {

                itemName: itemName,

                category: category,

                description: additionalInfo
                    ? `${description} Additional information: ${additionalInfo}`
                    : description,

                location: location,

                date: dateFound,

                time: timeFound || ""

            };


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/found-items`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(itemData)
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Backend error:",
                        result
                    );

                    alert(
                        result.message ||
                        "Failed to report found item."
                    );

                    return;
                }


                console.log(
                    "Found item saved:",
                    result
                );


                alert(
                    "Found item reported successfully!"
                );


                window.location.href =
                    "found-items.html";


            } catch (error) {

                console.error(
                    "Error connecting to backend:",
                    error
                );


                alert(
                    "Could not connect to the backend. Please make sure the backend server is running on port 3000."
                );

            }

        }
    );

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


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const itemName =
                document
                    .getElementById("itemName")
                    ?.value
                    .trim();


            const category =
                document
                    .getElementById("category")
                    ?.value;


            const description =
                document
                    .getElementById("description")
                    ?.value
                    .trim();


            const location =
                document
                    .getElementById("location")
                    ?.value
                    .trim();


            const lostDate =
                document
                    .getElementById("lostDate")
                    ?.value;


            const lostTime =
                document
                    .getElementById("lostTime")
                    ?.value;


            const additionalInfo =
                document
                    .getElementById("additionalInfo")
                    ?.value
                    .trim();


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

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


            // ------------------------------------------------
            // DATA FOR BACKEND
            // ------------------------------------------------

            const itemData = {

                itemName: itemName,

                category: category,

                description: additionalInfo
                    ? `${description} Additional information: ${additionalInfo}`
                    : description,

                location: location,

                date: lostDate,

                time: lostTime || ""

            };


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/lost-items`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(itemData)
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Backend error:",
                        result
                    );

                    alert(
                        result.message ||
                        "Failed to report lost item."
                    );

                    return;
                }


                console.log(
                    "Lost item saved:",
                    result
                );


                alert(
                    "Lost item reported successfully!"
                );


                window.location.href =
                    "lost-items.html";


            } catch (error) {

                console.error(
                    "Error connecting to backend:",
                    error
                );


                alert(
                    "Could not connect to the backend. Please make sure the backend server is running on port 3000."
                );

            }

        }
    );

}


// ============================================================
// DISPLAY FOUND ITEMS
// ============================================================

async function displayFoundItems() {

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


    let foundItems = [];


    // --------------------------------------------------------
    // GET DATA FROM BACKEND
    // --------------------------------------------------------

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/found-items`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load found items."
            );

        }


        foundItems =
            result.items ||
            result.data ||
            result ||
            [];


        if (!Array.isArray(foundItems)) {
            foundItems = [];
        }


        foundItems =
            foundItems.map(
                normalizeItem
            );


    } catch (error) {

        console.error(
            "Failed to load found items:",
            error
        );


        grid.innerHTML = `

            <div class="empty-state">

                <div style="font-size:55px;">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Items
                </h2>

                <p>
                    Please make sure the CampusRecover
                    backend is running.
                </p>

            </div>

        `;

        return;
    }


    // --------------------------------------------------------
    // RENDER ITEMS
    // --------------------------------------------------------

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
                    String(
                        item.itemName || ""
                    )
                    .toLowerCase();


                const description =
                    String(
                        item.description || ""
                    )
                    .toLowerCase();


                const location =
                    String(
                        item.location || ""
                    )
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

                    ${getItemIcon(
                        item.category
                    )}

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

async function displayLostItems() {

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


    let lostItems = [];


    // --------------------------------------------------------
    // GET DATA FROM BACKEND
    // --------------------------------------------------------

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/lost-items`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load lost items."
            );

        }


        lostItems =
            result.items ||
            result.data ||
            result ||
            [];


        if (!Array.isArray(lostItems)) {
            lostItems = [];
        }


        lostItems =
            lostItems.map(
                normalizeItem
            );


    } catch (error) {

        console.error(
            "Failed to load lost items:",
            error
        );


        grid.innerHTML = `

            <div class="empty-state">

                <div style="font-size:55px;">
                    ⚠️
                </div>

                <h2>
                    Unable to Load Items
                </h2>

                <p>
                    Please make sure the CampusRecover
                    backend is running.
                </p>

            </div>

        `;

        return;
    }


    // --------------------------------------------------------
    // RENDER ITEMS
    // --------------------------------------------------------

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
                    String(
                        item.itemName || ""
                    )
                    .toLowerCase();


                const description =
                    String(
                        item.description || ""
                    )
                    .toLowerCase();


                const location =
                    String(
                        item.location || ""
                    )
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

                    ${getItemIcon(
                        item.category
                    )}

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

async function displayItemDetails() {

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
    // GET ITEM FROM BACKEND
    // --------------------------------------------------------

    let item;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/items/${encodeURIComponent(
                    itemId
                )}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Item not found."
            );

        }


        item =
            result.item ||
            result.data ||
            result;


        item =
            normalizeItem(item);


    } catch (error) {

        console.error(
            "Failed to load item:",
            error
        );


        detailsCard.innerHTML = `

            <div class="empty-state">

                <div style="font-size:55px;">
                    📦
                </div>

                <h2>
                    Item Not Found
                </h2>

                <p>
                    This item could not be loaded
                    from the backend.
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


    if (!item || !item.id) {

        detailsCard.innerHTML = `

            <div class="empty-state">

                <div style="font-size:55px;">
                    📦
                </div>

                <h2>
                    Item Not Found
                </h2>

                <p>
                    This item could not be found.
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
        item.status ||
        (
            itemType === "found"
                ? "FOUND"
                : "LOST"
        );


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

                    ${escapeHTML(status)}

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

async function displayClaimItem() {

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


        return;
    }


    // --------------------------------------------------------
    // GET ITEM FROM BACKEND
    // --------------------------------------------------------

    let item;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/items/${encodeURIComponent(
                    itemId
                )}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Item not found."
            );

        }


        item =
            result.item ||
            result.data ||
            result;


        item =
            normalizeItem(item);


    } catch (error) {

        console.error(
            "Failed to load claim item:",
            error
        );


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

        claimDate.textContent =
            formatDate(
                item.dateFound ||
                item.lostDate
            );

    }


    if (claimStatus) {

        claimStatus.textContent =
            item.status ||
            "FOUND";

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
        async function (event) {

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
            // BACKEND CLAIM DATA
            // ------------------------------------------------
            //
            // Current backend API accepts:
            //
            // {
            //     itemId: "...",
            //     reason: "..."
            // }
            //
            // So we combine the claim information
            // into the reason field.
            //
            // Contact/proof are not currently stored by
            // the backend because they are not in the
            // current API contract.
            // ------------------------------------------------

            const reason =

                `Claim reason: ${claimReason}\n\n` +

                `Ownership details: ${ownershipDetails}\n\n` +

                `Contact: ${contact}`;


            const claimData = {

                itemId: itemId,

                reason: reason

            };


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/claims`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    claimData
                                )
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Claim backend error:",
                        result
                    );


                    alert(
                        result.message ||
                        "Failed to submit claim."
                    );


                    return;
                }


                console.log(
                    "Claim saved:",
                    result
                );


                alert(
                    "Claim submitted successfully! Your claim is pending campus verification."
                );


                window.location.href =
                    "my-claims.html";


            } catch (error) {

                console.error(
                    "Claim connection error:",
                    error
                );


                alert(
                    "Could not connect to the backend. Please make sure the backend server is running."
                );

            }

        }
    );

}


// ============================================================
// NORMALIZE BACKEND ITEM
// ============================================================

function normalizeItem(item) {

    if (!item) {
        return null;
    }


    return {

        // Backend uses itemId
        // Frontend uses id
        id:
            item.itemId ??
            item.id,


        itemId:
            item.itemId ??
            item.id,


        itemName:
            item.itemName || "",


        category:
            item.category || "",


        description:
            item.description || "",


        location:
            item.location || "",


        // Backend uses date
        // Frontend previously used dateFound/lostDate

        dateFound:
            item.dateFound ??
            item.date ??
            "",


        lostDate:
            item.lostDate ??
            item.date ??
            "",


        timeFound:
            item.timeFound ??
            item.time ??
            "",


        lostTime:
            item.lostTime ??
            item.time ??
            "",


        status:
            item.status || "",


        createdAt:
            item.createdAt || ""

    };

}


// ============================================================
// ITEM ICON
// ============================================================

function getItemIcon(category) {

    if (!category) {
        return "📦";
    }


    const value =
        category.toLowerCase();


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
        .replace(
            /[-_]/g,
            " "
        )
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