const mapContainer = document.getElementById("mapContainer");
const lightbox = document.getElementById("lightbox");
const closeButton = document.getElementById("closeLightbox");
const tooltip = document.getElementById("tooltip");

const wheelchairSpaces = {
    "C191": "Wheelchair Space",
    "E191": "Wheelchair Space",
    "G191": "Wheelchair Space",
    "I191": "Wheelchair Space"
};

let selectedSeat = null;

// Load the SVG
fetch("svg/auditorium.svg")
    .then(response => response.text())
    .then(svg => {
        mapContainer.innerHTML = svg;
        initialiseSeats();
    });

function initialiseSeats() {

    // Matches A1, B12, AA7 etc.
    const seatPattern = /^[A-Z]+\d+$/;

    const allElements = mapContainer.querySelectorAll("[id]");

    allElements.forEach(element => {

        if (!seatPattern.test(element.id)) return;

        element.classList.add("seat");

        // Tooltip
        element.addEventListener("mouseenter", () => {

            tooltip.innerHTML = wheelchairSpaces[element.id]
                ? `♿ Wheelchair Space ${element.id}<br><small>Click to view</small>`
                : `Seat ${element.id}<br><small>Click to view</small>`;

            tooltip.style.display = "block";

        });

        element.addEventListener("mousemove", (e) => {

            tooltip.style.left = (e.pageX + 15) + "px";
            tooltip.style.top = (e.pageY + 15) + "px";

        });

        element.addEventListener("mouseleave", () => {

            tooltip.style.display = "none";

        });

        // Click
        element.addEventListener("click", () => {

            tooltip.style.display = "none";
            selectSeat(element);

        });

    });

}

function selectSeat(seat) {

    if (selectedSeat) {
        selectedSeat.classList.remove("selected");
    }

    selectedSeat = seat;
    seat.classList.add("selected");

    const seatId = seat.id;

    let displayName = `Seat ${seatId}`;
    let infoText = `View from Seat ${seatId}`;

    if (wheelchairSpaces[seatId]) {

        displayName = `♿ Wheelchair Space ${seatId}`;

        infoText = `
            View from Wheelchair Space ${seatId}.<br><br>
            <strong>Please note:</strong>
            This is a designated wheelchair space where the customer remains in
            their wheelchair throughout the performance.
        `;

    }

    document.getElementById("seatTitle").textContent = displayName;

    const seatInfo = document.getElementById("seatInfo");
    seatInfo.innerHTML = "Loading image...";

    const img = document.getElementById("seatPhoto");

    img.onload = null;
    img.onerror = null;

    img.src = `photos/${seatId}.jpg`;

    img.onload = function () {

        seatInfo.innerHTML = infoText;

    };

    img.onerror = function () {

        img.onload = null;

        img.src = "photos/image-coming-soon.jpg";

        seatInfo.innerHTML = `No photo has been added yet for <strong>${displayName}</strong>.`;

    };

    lightbox.classList.add("show");

}

// Close button
closeButton.onclick = closeLightbox;

// Click outside
lightbox.onclick = function (e) {

    if (e.target === lightbox) {
        closeLightbox();
    }

};

// ESC key
document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {
        closeLightbox();
    }

});

function closeLightbox() {

    lightbox.classList.remove("show");

}
