// =====================================================
// CampusRecover - Main JavaScript
// =====================================================


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("CampusRecover JavaScript loaded successfully!");


    // =================================================
    // CURRENT YEAR
    // =================================================

    const yearElements =
        document.querySelectorAll(".current-year");

    yearElements.forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });


    // =================================================
    // LOGOUT
    // =================================================

    const logoutButtons =
        document.querySelectorAll(".logout-btn");

    logoutButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const confirmLogout =
                confirm("Are you sure you want to logout?");

            if (confirmLogout) {

                window.location.href =
                    "login.html";

            }

        });

    });


    // =================================================
    // FOUND ITEM FORM
    // =================================================

    const foundItemForm =
        document.getElementById("foundItemForm");

    if (foundItemForm) {

        foundItemForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const itemName =
                    document.getElementById("itemName")
                        .value
                        .trim();

                const category =
                    document.getElementById("category")
                        .value;

                const description =
                    document.getElementById("description")
                        .value
                        .trim();

                const location =
                    document.getElementById("location")
                        .value;

                const dateFound =
                    document.getElementById("dateFound")
                        .value;

                const timeFound =
                    document.getElementById("timeFound")
                        .value;

                const additionalInfo =
                    document.getElementById("additionalInfo")
                        .value
                        .trim();

                const photoInput =
                    document.getElementById("itemPhoto");

                const photoFile =
                    photoInput
                        ? photoInput.files[0]
                        : null;


                // -----------------------------------------
                // VALIDATION
                // -----------------------------------------

                if (
                    itemName === "" ||
                    category === "" ||
                    description === "" ||
                    location === "" ||
                    dateFound === "" ||
                    timeFound === ""
                ) {

                    alert(
                        "Please fill in all required fields."
                    );

                    return;

                }


                if (
                    photoFile &&
                    !photoFile.type.startsWith("image/")
                ) {

                    alert(
                        "Please select a valid image file."
                    );

                    return;

                }


                // -----------------------------------------
                // IMAGE
                // -----------------------------------------

                if (photoFile) {

                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            saveFoundItem(

                                itemName,
                                category,
                                description,
                                location,
                                dateFound,
                                timeFound,
                                additionalInfo,
                                event.target.result

                            );

                        };


                    reader.onerror =
                        function () {

                            alert(
                                "Unable to read the selected image."
                            );

                        };


                    reader.readAsDataURL(photoFile);

                }

                else {

                    saveFoundItem(

                        itemName,
                        category,
                        description,
                        location,
                        dateFound,
                        timeFound,
                        additionalInfo,
                        ""

                    );

                }

            }
        );

    }



    // =================================================
    // LOST ITEM FORM
    // =================================================

    const lostItemForm =
        document.getElementById("lostItemForm");

    if (lostItemForm) {

        lostItemForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const itemName =
                    document.getElementById("itemName")
                        .value
                        .trim();

                const category =
                    document.getElementById("category")
                        .value;

                const description =
                    document.getElementById("description")
                        .value
                        .trim();

                const location =
                    document.getElementById("location")
                        .value;

                const lostDate =
                    document.getElementById("lostDate")
                        .value;

                const lostTime =
                    document.getElementById("lostTime")
                        .value;

                const additionalInfo =
                    document.getElementById("additionalInfo")
                        .value
                        .trim();

                const imageInput =
                    document.getElementById("itemImage");

                const imageFile =
                    imageInput
                        ? imageInput.files[0]
                        : null;


                // -----------------------------------------
                // VALIDATION
                // -----------------------------------------

                if (
                    itemName === "" ||
                    category === "" ||
                    description === "" ||
                    location === "" ||
                    lostDate === "" ||
                    lostTime === ""
                ) {

                    alert(
                        "Please fill in all required fields."
                    );

                    return;

                }


                if (
                    imageFile &&
                    !imageFile.type.startsWith("image/")
                ) {

                    alert(
                        "Please select a valid image file."
                    );

                    return;

                }


                // -----------------------------------------
                // IMAGE
                // -----------------------------------------

                if (imageFile) {

                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            saveLostItem(

                                itemName,
                                category,
                                description,
                                location,
                                lostDate,
                                lostTime,
                                additionalInfo,
                                event.target.result

                            );

                        };


                    reader.onerror =
                        function () {

                            alert(
                                "Unable to read the selected image."
                            );

                        };


                    reader.readAsDataURL(imageFile);

                }

                else {

                    saveLostItem(

                        itemName,
                        category,
                        description,
                        location,
                        lostDate,
                        lostTime,
                        additionalInfo,
                        ""

                    );

                }

            }
        );

    }



    // =================================================
    // DISPLAY FOUND ITEMS
    // =================================================

    displayFoundItems();



    // =================================================
    // DISPLAY LOST ITEMS
    // =================================================

    displayLostItems();



    // =================================================
    // SEARCH
    // =================================================

    setupFoundItemSearch();

    setupLostItemSearch();



    // =================================================
    // CLAIM PAGE
    // =================================================

    displayClaimItem();

    setupClaimForm();

});



// =====================================================
// SAVE FOUND ITEM
// =====================================================

function saveFoundItem(
    itemName,
    category,
    description,
    location,
    dateFound,
    timeFound,
    additionalInfo,
    photoData
) {

    const foundItem = {

        id: Date.now(),

        itemName: itemName,

        category: category,

        description: description,

        location: location,

        dateFound: dateFound,

        timeFound: timeFound,

        additionalInfo: additionalInfo,

        photo: photoData,

        status: "FOUND"

    };


    let foundItems =
        JSON.parse(
            localStorage.getItem("foundItems")
        ) || [];


    foundItems.push(foundItem);


    try {

        localStorage.setItem(
            "foundItems",
            JSON.stringify(foundItems)
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "The image may be too large. Please use a smaller image."
        );

        return;

    }


    alert(
        "Found item reported successfully!"
    );


    const form =
        document.getElementById("foundItemForm");


    if (form) {

        form.reset();

    }


    window.location.href =
        "found-items.html";

}



// =====================================================
// SAVE LOST ITEM
// =====================================================

function saveLostItem(
    itemName,
    category,
    description,
    location,
    lostDate,
    lostTime,
    additionalInfo,
    imageData
) {

    const lostItem = {

        id: Date.now(),

        itemName: itemName,

        category: category,

        description: description,

        location: location,

        lostDate: lostDate,

        lostTime: lostTime,

        additionalInfo: additionalInfo,

        photo: imageData,

        status: "LOST"

    };


    let lostItems =
        JSON.parse(
            localStorage.getItem("lostItems")
        ) || [];


    lostItems.push(lostItem);


    try {

        localStorage.setItem(
            "lostItems",
            JSON.stringify(lostItems)
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "The image may be too large. Please use a smaller image."
        );

        return;

    }


    console.log(
        "Lost Item Report:",
        lostItem
    );


    alert(
        "Lost item reported successfully!"
    );


    const form =
        document.getElementById("lostItemForm");


    if (form) {

        form.reset();

    }


    window.location.href =
        "lost-items.html";

}



// =====================================================
// DISPLAY FOUND ITEMS
// =====================================================

function displayFoundItems() {

    const grid =
        document.getElementById("foundItemsGrid");


    if (!grid) {

        return;

    }


    const foundItems =
        JSON.parse(
            localStorage.getItem("foundItems")
        ) || [];


    foundItems.forEach(function (item) {

        const card =
            createFoundItemCard(item);


        grid.insertAdjacentHTML(
            "beforeend",
            card
        );

    });

}



// =====================================================
// CREATE FOUND ITEM CARD
// =====================================================

function createFoundItemCard(item) {

    const categoryName =
        formatCategory(item.category);


    const locationName =
        formatLocation(item.location);


    let imageHTML =
        `<div class="placeholder-image">📦</div>`;


    if (item.photo) {

        imageHTML = `
            <img
                src="${item.photo}"
                alt="${escapeHTML(item.itemName)}"
                class="item-photo"
            >
        `;

    }


    return `

        <div
            class="item-card dynamic-item"
            data-category="${item.category}"
            data-name="${escapeHTML(
                item.itemName.toLowerCase()
            )}"
        >

            <div class="item-image">

                ${imageHTML}

            </div>


            <div class="item-content">

                <span class="item-status found">
                    FOUND
                </span>


                <h3>
                    ${escapeHTML(item.itemName)}
                </h3>


                <p>
                    <strong>Category:</strong>
                    ${categoryName}
                </p>


                <p>
                    <strong>Location:</strong>
                    ${locationName}
                </p>


                <p>
                    <strong>Date:</strong>
                    ${formatDate(item.dateFound)}
                </p>


                <p>
                    <strong>Time:</strong>
                    ${item.timeFound}
                </p>


                <a
                    href="item-details.html?id=${item.id}&type=found"
                    class="view-btn"
                >
                    View Details
                </a>

            </div>

        </div>

    `;

}



// =====================================================
// DISPLAY LOST ITEMS
// =====================================================

function displayLostItems() {

    const grid =
        document.getElementById("lostItemsGrid");


    if (!grid) {

        return;

    }


    const lostItems =
        JSON.parse(
            localStorage.getItem("lostItems")
        ) || [];


    lostItems.forEach(function (item) {

        const card =
            createLostItemCard(item);


        grid.insertAdjacentHTML(
            "beforeend",
            card
        );

    });

}



// =====================================================
// CREATE LOST ITEM CARD
// =====================================================

function createLostItemCard(item) {

    const categoryName =
        formatCategory(item.category);


    const locationName =
        formatLocation(item.location);


    let imageHTML =
        `<div class="placeholder-image">📦</div>`;


    if (item.photo) {

        imageHTML = `
            <img
                src="${item.photo}"
                alt="${escapeHTML(item.itemName)}"
                class="item-photo"
            >
        `;

    }


    return `

        <div
            class="item-card dynamic-item"
            data-category="${item.category}"
            data-name="${escapeHTML(
                item.itemName.toLowerCase()
            )}"
        >

            <div class="item-image">

                ${imageHTML}

            </div>


            <div class="item-content">

                <span class="item-status lost">
                    LOST
                </span>


                <h3>
                    ${escapeHTML(item.itemName)}
                </h3>


                <p>
                    <strong>Category:</strong>
                    ${categoryName}
                </p>


                <p>
                    <strong>Location:</strong>
                    ${locationName}
                </p>


                <p>
                    <strong>Date:</strong>
                    ${formatDate(item.lostDate)}
                </p>


                <p>
                    <strong>Time:</strong>
                    ${item.lostTime}
                </p>


                <a
                    href="item-details.html?id=${item.id}&type=lost"
                    class="view-btn"
                >
                    View Details
                </a>

            </div>

        </div>

    `;

}



// =====================================================
// FOUND ITEM SEARCH
// =====================================================

function setupFoundItemSearch() {

    const searchInput =
        document.getElementById("foundSearch");


    const categoryFilter =
        document.getElementById(
            "foundCategoryFilter"
        );


    if (
        !searchInput ||
        !categoryFilter
    ) {

        return;

    }


    searchInput.addEventListener(
        "input",
        filterFoundItems
    );


    categoryFilter.addEventListener(
        "change",
        filterFoundItems
    );

}



// =====================================================
// FILTER FOUND ITEMS
// =====================================================

function filterFoundItems() {

    const searchInput =
        document.getElementById("foundSearch");


    const categoryFilter =
        document.getElementById(
            "foundCategoryFilter"
        );


    const cards =
        document.querySelectorAll(
            "#foundItemsGrid .item-card"
        );


    if (
        !searchInput ||
        !categoryFilter
    ) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    let visibleCount = 0;


    cards.forEach(function (card) {

        const name =
            card
                .getAttribute("data-name")
                .toLowerCase();


        const category =
            card.getAttribute(
                "data-category"
            );


        const matchesSearch =
            name.includes(searchText);


        const matchesCategory =
            selectedCategory === "" ||
            category === selectedCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "";

            visibleCount++;

        }

        else {

            card.style.display = "none";

        }

    });


    const noResults =
        document.getElementById(
            "noFoundItems"
        );


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }

}



// =====================================================
// LOST ITEM SEARCH
// =====================================================

function setupLostItemSearch() {

    const searchInput =
        document.getElementById("lostSearch");


    const categoryFilter =
        document.getElementById(
            "lostCategoryFilter"
        );


    if (
        !searchInput ||
        !categoryFilter
    ) {

        return;

    }


    searchInput.addEventListener(
        "input",
        filterLostItems
    );


    categoryFilter.addEventListener(
        "change",
        filterLostItems
    );

}



// =====================================================
// FILTER LOST ITEMS
// =====================================================

function filterLostItems() {

    const searchInput =
        document.getElementById("lostSearch");


    const categoryFilter =
        document.getElementById(
            "lostCategoryFilter"
        );


    const cards =
        document.querySelectorAll(
            "#lostItemsGrid .item-card"
        );


    if (
        !searchInput ||
        !categoryFilter
    ) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    let visibleCount = 0;


    cards.forEach(function (card) {

        const name =
            card
                .getAttribute("data-name")
                .toLowerCase();


        const category =
            card.getAttribute(
                "data-category"
            );


        const matchesSearch =
            name.includes(searchText);


        const matchesCategory =
            selectedCategory === "" ||
            category === selectedCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.style.display = "";

            visibleCount++;

        }

        else {

            card.style.display = "none";

        }

    });


    const noResults =
        document.getElementById(
            "noLostItems"
        );


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
                ? "block"
                : "none";

    }

}



// =====================================================
// FORMAT CATEGORY
// =====================================================

function formatCategory(category) {

    const categoryNames = {

        "wallet": "Wallet",

        "mobile": "Mobile Phone",

        "laptop": "Laptop",

        "bag": "Bag",

        "books": "Books",

        "id-card": "ID Card",

        "water-bottle": "Water Bottle",

        "bottle": "Water Bottle",

        "electronics": "Electronics",

        "accessories": "Accessories",

        "clothing": "Clothing",

        "keys": "Keys",

        "other": "Other"

    };


    return (
        categoryNames[category] ||
        category
    );

}



// =====================================================
// FORMAT LOCATION
// =====================================================

function formatLocation(location) {

    const locations = {

        "library": "Library",

        "block-a": "Block A",

        "block-b": "Block B",

        "block-c": "Block C",

        "canteen": "Canteen",

        "lab": "Laboratory",

        "lab-1": "Lab 1",

        "lab-2": "Lab 2",

        "lab-3": "Lab 3",

        "playground": "Playground",

        "auditorium": "Auditorium",

        "parking": "Parking Area",

        "sports-ground": "Sports Ground",

        "other": "Other"

    };


    return (
        locations[location] ||
        location
    );

}



// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}



// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}



// =====================================================
// ITEM DETAILS PAGE
// =====================================================

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


    if (
        !itemId ||
        !itemType
    ) {

        detailsCard.innerHTML = `

            <div class="details-content">

                <h1>
                    Item Not Found
                </h1>

                <p>
                    The item details could not be loaded.
                </p>

                <div class="details-actions">

                    <a
                        href="lost-items.html"
                        class="secondary-action-btn"
                    >
                        Back to Lost Items
                    </a>

                </div>

            </div>

        `;

        return;

    }


    let items = [];


    if (itemType === "lost") {

        items =
            JSON.parse(
                localStorage.getItem(
                    "lostItems"
                )
            ) || [];

    }


    if (itemType === "found") {

        items =
            JSON.parse(
                localStorage.getItem(
                    "foundItems"
                )
            ) || [];

    }


    const item =
        items.find(function (currentItem) {

            return (
                String(currentItem.id) ===
                String(itemId)
            );

        });


    if (!item) {

        detailsCard.innerHTML = `

            <div class="details-content">

                <h1>
                    Item Not Found
                </h1>

                <p>
                    This item may have been removed
                    or is not available in this browser.
                </p>

                <div class="details-actions">

                    <a
                        href="${
                            itemType === "lost"
                                ? "lost-items.html"
                                : "found-items.html"
                        }"
                        class="secondary-action-btn"
                    >
                        Back to Items
                    </a>

                </div>

            </div>

        `;

        return;

    }


    const status =
        itemType === "lost"
            ? "LOST"
            : "FOUND";


    const statusClass =
        itemType === "lost"
            ? "lost"
            : "found";


    const category =
        formatCategory(
            item.category
        );


    const location =
        formatLocation(
            item.location
        );


    const date =
        itemType === "lost"
            ? formatDate(item.lostDate)
            : formatDate(item.dateFound);


    const time =
        itemType === "lost"
            ? item.lostTime
            : item.timeFound;


    let imageHTML =
        `<div class="details-image-placeholder">📦</div>`;


    if (item.photo) {

        imageHTML = `

            <img
                src="${item.photo}"
                alt="${escapeHTML(item.itemName)}"
                class="details-item-photo"
            >

        `;

    }


    detailsCard.innerHTML = `

        <div class="details-image">

            ${imageHTML}

        </div>


        <div class="details-content">

            <span class="item-status ${statusClass}">
                ${status}
            </span>


            <h1>
                ${escapeHTML(item.itemName)}
            </h1>


            <p class="details-description">
                ${escapeHTML(item.description)}
            </p>


            <div class="details-info">

                <div class="details-info-row">

                    <span class="details-label">
                        Category
                    </span>

                    <span>
                        ${category}
                    </span>

                </div>


                <div class="details-info-row">

                    <span class="details-label">
                        Location
                    </span>

                    <span>
                        ${location}
                    </span>

                </div>


                <div class="details-info-row">

                    <span class="details-label">
                        Date
                    </span>

                    <span>
                        ${date}
                    </span>

                </div>


                <div class="details-info-row">

                    <span class="details-label">
                        Approximate Time
                    </span>

                    <span>
                        ${time}
                    </span>

                </div>


                ${
                    item.additionalInfo
                        ? `

                    <div class="details-info-row">

                        <span class="details-label">
                            Additional Information
                        </span>

                        <span>
                            ${escapeHTML(
                                item.additionalInfo
                            )}
                        </span>

                    </div>

                    `
                        : ""
                }

            </div>



            <!-- POSSIBLE MATCH -->

            <div class="possible-match">

                <h2>
                    Possible Match
                </h2>


                <p>
                    This item may be matched with
                    another report based on the
                    available information.
                </p>


                <div class="match-score">

                    <span>
                        Possible Match Score
                    </span>

                    <strong>
                        Not calculated
                    </strong>

                </div>


                <small>

                    This is only a possible match.
                    Ownership must be verified
                    through the campus claim process.

                </small>

            </div>



            <!-- ACTIONS -->

            <div class="details-actions">

                <a
                    href="claim.html?id=${item.id}&type=${itemType}"
                    class="primary-action-btn"
                >
                    Claim This Item
                </a>


                <a
                    href="${
                        itemType === "lost"
                            ? "lost-items.html"
                            : "found-items.html"
                    }"
                    class="secondary-action-btn"
                >
                    Back to ${
                        itemType === "lost"
                            ? "Lost Items"
                            : "Found Items"
                    }
                </a>

            </div>

        </div>

    `;

}



// =====================================================
// CLAIM PAGE - DISPLAY ITEM
// =====================================================

function displayClaimItem() {

    const claimForm =
        document.getElementById(
            "claimForm"
        );


    // -----------------------------------------
    // If this is not the Claim page,
    // do nothing.
    // -----------------------------------------

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
        "Claim Item ID:",
        itemId
    );


    console.log(
        "Claim Item Type:",
        itemType
    );


    // -----------------------------------------
    // Validate URL
    // -----------------------------------------

    if (
        !itemId ||
        !itemType
    ) {

        document.getElementById(
            "claimItemName"
        ).textContent =
            "Invalid Claim";


        document.getElementById(
            "claimCategory"
        ).textContent =
            "-";


        document.getElementById(
            "claimLocation"
        ).textContent =
            "-";


        document.getElementById(
            "claimDate"
        ).textContent =
            "-";


        document.getElementById(
            "claimStatus"
        ).textContent =
            "INVALID";


        return;

    }


    // -----------------------------------------
    // Get correct items
    // -----------------------------------------

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


    // -----------------------------------------
    // Find item
    // -----------------------------------------

    const item =
        items.find(function (currentItem) {

            return (
                String(currentItem.id) ===
                String(itemId)
            );

        });


    // -----------------------------------------
    // Item not found
    // -----------------------------------------

    if (!item) {

        document.getElementById(
            "claimItemName"
        ).textContent =
            "Item Not Found";


        document.getElementById(
            "claimCategory"
        ).textContent =
            "-";


        document.getElementById(
            "claimLocation"
        ).textContent =
            "-";


        document.getElementById(
            "claimDate"
        ).textContent =
            "-";


        document.getElementById(
            "claimStatus"
        ).textContent =
            "UNAVAILABLE";


        return;

    }


    // -----------------------------------------
    // Display item information
    // -----------------------------------------

    document.getElementById(
        "claimItemName"
    ).textContent =
        item.itemName;


    document.getElementById(
        "claimCategory"
    ).textContent =
        formatCategory(
            item.category
        );


    document.getElementById(
        "claimLocation"
    ).textContent =
        formatLocation(
            item.location
        );


    if (itemType === "found") {

        document.getElementById(
            "claimDate"
        ).textContent =
            formatDate(
                item.dateFound
            );

    }

    else {

        document.getElementById(
            "claimDate"
        ).textContent =
            formatDate(
                item.lostDate
            );

    }


    document.getElementById(
        "claimStatus"
    ).textContent =
        itemType === "found"
            ? "FOUND"
            : "LOST";


    // -----------------------------------------
    // Cancel button
    // -----------------------------------------

    const cancelButton =
        document.getElementById(
            "cancelClaimBtn"
        );


    if (cancelButton) {

        cancelButton.href =
            itemType === "found"
                ? "found-items.html"
                : "lost-items.html";

    }

}



// =====================================================
// CLAIM FORM - SUBMIT
// =====================================================

function setupClaimForm() {

    const claimForm =
        document.getElementById(
            "claimForm"
        );


    // -----------------------------------------
    // If not Claim page, stop.
    // -----------------------------------------

    if (!claimForm) {

        return;

    }


    claimForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // -------------------------------------
            // Get URL information
            // -------------------------------------

            const params =
                new URLSearchParams(
                    window.location.search
                );


            const itemId =
                params.get("id");


            const itemType =
                params.get("type");


            if (
                !itemId ||
                !itemType
            ) {

                alert(
                    "Invalid claim information."
                );

                return;

            }


            // -------------------------------------
            // Get form values
            // -------------------------------------

            const claimReason =
                document.getElementById(
                    "claimReason"
                ).value.trim();


            const ownershipDetails =
                document.getElementById(
                    "ownershipDetails"
                ).value.trim();


            const contact =
                document.getElementById(
                    "contact"
                ).value.trim();


            const proofInput =
                document.getElementById(
                    "proof"
                );


            // -------------------------------------
            // Validate required fields
            // -------------------------------------

            if (
                claimReason === "" ||
                ownershipDetails === "" ||
                contact === ""
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;

            }


            // -------------------------------------
            // Get existing claims
            // -------------------------------------

            let claims =
                JSON.parse(
                    localStorage.getItem(
                        "claims"
                    )
                ) || [];


            // -------------------------------------
            // Create claim
            // -------------------------------------

            const newClaim = {

                id: Date.now(),

                itemId: itemId,

                itemType: itemType,

                claimReason: claimReason,

                ownershipDetails:
                    ownershipDetails,

                contact: contact,

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


            // -------------------------------------
            // Save claim
            // -------------------------------------

            claims.push(
                newClaim
            );


            localStorage.setItem(
                "claims",
                JSON.stringify(
                    claims
                )
            );


            console.log(
                "Claim submitted:",
                newClaim
            );


            // -------------------------------------
            // Success message
            // -------------------------------------

            alert(
                "Claim submitted successfully! Your claim is pending campus verification."
            );


            // -------------------------------------
            // Go to My Claims
            // -------------------------------------

            window.location.href =
                "my-claims.html";

        }
    );

}