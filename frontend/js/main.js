const API_BASE_URL = "http://localhost:3000";


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    setCurrentYear();

    setupLogout();

    setupFoundForm();

    setupLostForm();

    displayFoundItems();

    displayLostItems();

    displayItemDetails();

    displayClaimItem();

    setupClaimForm();

});


/* =====================================================
   CURRENT YEAR
===================================================== */

function setCurrentYear() {

    document
        .querySelectorAll(".current-year")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });

}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    const logoutButtons =
        document.querySelectorAll(".logout-btn");


    logoutButtons.forEach(button => {

        button.addEventListener("click", () => {

            localStorage.removeItem("currentUser");

            window.location.href =
                "login.html";

        });

    });

}


/* =====================================================
   REPORT LOST ITEM
===================================================== */

function setupLostForm() {

    const form =
        document.getElementById("lostItemForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", async event => {

        event.preventDefault();


        const submitButton =
            form.querySelector(
                ".submit-report-btn"
            );


        const originalText =
            submitButton
                ? submitButton.innerHTML
                : "";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML =
                "⏳ Submitting...";

        }


        const itemName =
            document
                .getElementById("itemName")
                .value
                .trim();


        const category =
            document
                .getElementById("category")
                .value;


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const location =
            document
                .getElementById("location")
                .value;


        const lostDate =
            document
                .getElementById("lostDate")
                .value;


        const lostTime =
            document
                .getElementById("lostTime")
                .value;


        const additionalInfoElement =
            document.getElementById(
                "additionalInfo"
            );


        const additionalInfo =
            additionalInfoElement
                ? additionalInfoElement.value.trim()
                : "";


        const data = {

            itemName,

            category,

            description,

            location,

            lostDate,

            lostTime,

            additionalInfo

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
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json()
                    .catch(() => ({}));


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to report lost item."
                );

            }


            alert(
                "✅ Lost item reported successfully!"
            );


            form.reset();


            window.location.href =
                "my-reports.html";


        } catch (error) {

            console.error(
                "Lost item error:",
                error
            );


            alert(
                "❌ Unable to submit the lost item.\n\n" +
                "Please make sure the backend is running."
            );


            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.innerHTML =
                    originalText;

            }

        }

    });

}


/* =====================================================
   REPORT FOUND ITEM
===================================================== */

function setupFoundForm() {

    const form =
        document.getElementById(
            "foundItemForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const data = {

                itemName:
                    document
                        .getElementById(
                            "itemName"
                        )
                        .value
                        .trim(),

                category:
                    document
                        .getElementById(
                            "category"
                        )
                        .value,

                description:
                    document
                        .getElementById(
                            "description"
                        )
                        .value
                        .trim(),

                location:
                    document
                        .getElementById(
                            "location"
                        )
                        .value,

                dateFound:
                    document
                        .getElementById(
                            "dateFound"
                        )
                        .value,

                timeFound:
                    document
                        .getElementById(
                            "timeFound"
                        )
                        .value,

                additionalInfo:
                    document
                        .getElementById(
                            "additionalInfo"
                        )
                        ?.value
                        .trim() || ""

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
                                JSON.stringify(data)

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to report found item"
                    );

                }


                alert(
                    "✅ Found item reported successfully!"
                );


                form.reset();


                window.location.href =
                    "found-items.html";


            } catch (error) {

                console.error(error);


                alert(
                    "❌ Unable to submit found item.\n\n" +
                    "Please make sure the backend is running."
                );

            }

        }
    );

}


/* =====================================================
   DISPLAY LOST ITEMS
===================================================== */

async function displayLostItems() {

    const container =
        document.getElementById(
            "lostItemsContainer"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/lost-items`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load lost items"
            );

        }


        const items =
            await response.json();


        renderItems(
            container,
            items,
            "lost"
        );


        setupItemFilters(
            "lost",
            items
        );


    } catch (error) {

        console.error(
            "Lost items error:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load lost items
                </h3>

                <p>
                    Make sure the CampusRecover
                    backend is running on
                    http://localhost:3000
                </p>

            </div>

        `;

    }

}


/* =====================================================
   DISPLAY FOUND ITEMS
===================================================== */

async function displayFoundItems() {

    const container =
        document.getElementById(
            "foundItemsContainer"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/found-items`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load found items"
            );

        }


        const items =
            await response.json();


        renderItems(
            container,
            items,
            "found"
        );


        setupItemFilters(
            "found",
            items
        );


    } catch (error) {

        console.error(
            "Found items error:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load found items
                </h3>

                <p>
                    Make sure the CampusRecover
                    backend is running.
                </p>

            </div>

        `;

    }

}


/* =====================================================
   RENDER ITEMS
===================================================== */

function renderItems(
    container,
    items,
    type
) {

    if (
        !items ||
        items.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ${
                        type === "lost"
                            ? "🔍"
                            : "📦"
                    }
                </div>

                <h3>
                    No ${type} items found
                </h3>

                <p>
                    ${
                        type === "lost"
                            ? "No students have reported lost items yet."
                            : "No found items have been reported yet."
                    }
                </p>

                <a
                    href="${
                        type === "lost"
                            ? "report-lost.html"
                            : "report-found.html"
                    }"
                    class="empty-action-btn"
                >
                    ${
                        type === "lost"
                            ? "Report Lost Item"
                            : "Report Found Item"
                    }
                </a>

            </div>

        `;

        return;

    }


    container.innerHTML =
        items.map(
            item =>
                createItemCard(
                    item,
                    type
                )
        ).join("");

}


/* =====================================================
   ITEM CARD
===================================================== */

function createItemCard(
    item,
    type
) {

    const id =
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
        type === "lost"
            ? (
                item.lostDate ||
                item.dateLost ||
                "Unknown"
            )
            : (
                item.dateFound ||
                item.foundDate ||
                "Unknown"
            );


    const icon =
        getItemIcon(category);


    return `

        <div class="item-card">

            <div class="item-card-top">

                <div class="item-card-icon">
                    ${icon}
                </div>

                <span
                    class="${
                        type === "lost"
                            ? "lost-badge"
                            : "found-badge"
                    }"
                >
                    ${
                        type === "lost"
                            ? "LOST"
                            : "FOUND"
                    }
                </span>

            </div>


            <div class="item-card-content">

                <h3>
                    ${escapeHTML(itemName)}
                </h3>


                <p class="item-description">

                    ${escapeHTML(description)}

                </p>


                <div class="item-details-list">

                    <div class="item-detail-row">

                        📂

                        <strong>
                            Category:
                        </strong>

                        ${escapeHTML(
                            formatCategory(category)
                        )}

                    </div>


                    <div class="item-detail-row">

                        📍

                        <strong>
                            Location:
                        </strong>

                        ${escapeHTML(
                            formatLocation(location)
                        )}

                    </div>


                    <div class="item-detail-row">

                        📅

                        <strong>
                            Date:
                        </strong>

                        ${escapeHTML(
                            formatDate(date)
                        )}

                    </div>

                </div>


                <a
                    href="item-details.html?id=${encodeURIComponent(id)}&type=${type}"
                    class="view-details-btn"
                >
                    View Details →
                </a>

            </div>

        </div>

    `;

}


/* =====================================================
   SEARCH + CATEGORY FILTER
===================================================== */

function setupItemFilters(
    type,
    originalItems
) {

    const searchInput =
        document.getElementById(
            `${type}Search`
        );


    const categoryFilter =
        document.getElementById(
            `${type}CategoryFilter`
        );


    if (
        !searchInput &&
        !categoryFilter
    ) {
        return;
    }


    const applyFilters = () => {

        let filtered =
            [...originalItems];


        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const category =
            categoryFilter
                ? categoryFilter.value
                    .trim()
                    .toLowerCase()
                : "";


        if (search) {

            filtered =
                filtered.filter(item => {

                    const text = `

                        ${
                            item.itemName ||
                            item.name ||
                            ""
                        }

                        ${
                            item.description ||
                            ""
                        }

                        ${
                            item.location ||
                            ""
                        }

                        ${
                            item.category ||
                            ""
                        }

                    `.toLowerCase();


                    return text.includes(
                        search
                    );

                });

        }


        if (category) {

            filtered =
                filtered.filter(item =>

                    String(
                        item.category || ""
                    )
                    .toLowerCase()
                    .includes(category)

                );

        }


        const container =
            document.getElementById(
                `${type}ItemsContainer`
            );


        renderItems(
            container,
            filtered,
            type
        );

    };


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );

    }

}


/* =====================================================
   ITEM DETAILS
===================================================== */

async function displayItemDetails() {

    const container =
        document.getElementById(
            "itemDetailsContainer"
        );


    if (!container) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    const type =
        params.get("type") ||
        "found";


    if (!id) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Invalid Item
                </h3>

                <p>
                    No item ID was provided.
                </p>

            </div>

        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/items/${encodeURIComponent(id)}`
            );


        if (!response.ok) {

            throw new Error(
                "Item not found"
            );

        }


        const item =
            await response.json();


        container.innerHTML = `

            <div class="details-card">

                <div class="details-badge">

                    ${
                        type === "lost"
                            ? "🔍 LOST ITEM"
                            : "📦 FOUND ITEM"
                    }

                </div>


                <h1>
                    ${escapeHTML(
                        item.itemName ||
                        "Unnamed Item"
                    )}
                </h1>


                <p class="details-description">

                    ${escapeHTML(
                        item.description ||
                        "No description"
                    )}

                </p>


                <div class="details-grid">

                    <div>
                        <span>Category</span>
                        <strong>
                            ${escapeHTML(
                                formatCategory(
                                    item.category
                                )
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>Location</span>
                        <strong>
                            ${escapeHTML(
                                formatLocation(
                                    item.location
                                )
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>Date</span>
                        <strong>
                            ${escapeHTML(
                                formatDate(
                                    type === "lost"
                                        ? item.lostDate
                                        : item.dateFound
                                )
                            )}
                        </strong>
                    </div>

                </div>


                ${
                    type === "found"
                        ? `
                            <a
                                href="claim.html?id=${encodeURIComponent(id)}&type=found"
                                class="claim-button"
                            >
                                Claim This Item
                            </a>
                        `
                        : ""
                }


                <a
                    href="${
                        type === "lost"
                            ? "lost-items.html"
                            : "found-items.html"
                    }"
                    class="back-button"
                >
                    ← Back
                </a>

            </div>

        `;


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Item not found
                </h3>

                <p>
                    The requested item could not be loaded.
                </p>

            </div>

        `;

    }

}


/* =====================================================
   CLAIM ITEM
===================================================== */

async function displayClaimItem() {

    const container =
        document.getElementById(
            "claimItemContainer"
        );


    if (!container) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (!id) {

        container.innerHTML =
            "<p>Invalid claim.</p>";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/items/${encodeURIComponent(id)}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load item"
            );

        }


        const item =
            await response.json();


        container.innerHTML = `

            <div class="claim-item-preview">

                <span class="found-badge">
                    FOUND
                </span>

                <h2>
                    ${escapeHTML(
                        item.itemName ||
                        "Unnamed Item"
                    )}
                </h2>

                <p>
                    ${escapeHTML(
                        item.description ||
                        ""
                    )}
                </p>

                <div>
                    📂
                    ${escapeHTML(
                        formatCategory(
                            item.category
                        )
                    )}
                </div>

                <div>
                    📍
                    ${escapeHTML(
                        formatLocation(
                            item.location
                        )
                    )}
                </div>

                <div>
                    📅
                    ${escapeHTML(
                        formatDate(
                            item.dateFound
                        )
                    )}
                </div>

            </div>

        `;

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Unable to load item.</p>";

    }

}


/* =====================================================
   CLAIM FORM
===================================================== */

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
        async event => {

            event.preventDefault();


            const params =
                new URLSearchParams(
                    window.location.search
                );


            const itemId =
                params.get("id");


            const reason =
                document
                    .getElementById(
                        "claimReason"
                    )
                    ?.value
                    .trim() || "";


            if (!itemId) {

                alert(
                    "Invalid item."
                );

                return;

            }


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
                                JSON.stringify({
                                    itemId,
                                    reason
                                })

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to submit claim"
                    );

                }


                alert(
                    "✅ Claim submitted successfully!"
                );


                window.location.href =
                    "my-claims.html";


            } catch (error) {

                console.error(error);

                alert(
                    "❌ Unable to submit claim."
                );

            }

        }
    );

}


/* =====================================================
   HELPERS
===================================================== */

function getItemIcon(category) {

    const value =
        String(
            category || ""
        ).toLowerCase();


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


    if (
        value.includes("wallet")
    ) {
        return "👛";
    }


    if (
        value.includes("id")
    ) {
        return "🪪";
    }


    if (
        value.includes("book")
    ) {
        return "📚";
    }


    if (
        value.includes("bag")
    ) {
        return "🎒";
    }


    if (
        value.includes("key")
    ) {
        return "🔑";
    }


    if (
        value.includes("electronic")
    ) {
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
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );

}


function formatLocation(location) {

    if (!location) {
        return "Unknown";
    }


    return String(location)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );

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

    } catch {

        return String(date);

    }

}


function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value ?? ""
        );


    return div.innerHTML;

}