const mapContainer = document.getElementById("mapContainer");
const lightbox = document.getElementById("lightbox");
const closeButton = document.getElementById("closeLightbox");

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
    // IDs like A1, B12, AA3 etc.
    const seatPattern = /^[A-Z]+\d+$/;
    const allElements = mapContainer.querySelectorAll("[id]");

    allElements.forEach(element => {
        if (!seatPattern.test(element.id)) return;

        element.classList.add("seat");
        element.addEventListener("click", () => {
            selectSeat(element);
        });
    });
}

function selectSeat(seat){

    if(selectedSeat){
        selectedSeat.classList.remove("selected");
    }

    selectedSeat = seat;

    seat.classList.add("selected");

    const seatId = seat.id;

    // Friendly display name
    let displayName = `Seat ${seatId}`;
    let infoText = `View from Seat ${seatId}`;

    if (wheelchairSpaces[seatId]) {
        displayName = `Wheelchair Space ${seatId} ♿`;
        infoText = `View from Wheelchair Space ${seatId} ♿. <span style="font-weight:bold;">Please note: This is a space for a Wheelchair to park, and for the user to remain in their wheelchair.</span>`;
    }

    document.getElementById("seatTitle").textContent = displayName;
    document.getElementById("seatInfo").textContent = "Loading image...";

    const img = document.getElementById("seatPhoto");

    img.src = `photos/${seatId}.jpg`;

    img.onerror = function () {
        // Prevent the placeholder from triggering onload
        img.onload = null;

        img.src = "photos/image-coming-soon.jpg";

        document.getElementById("seatInfo").textContent =
            `No photo has been added yet for ${displayName}.`;
    };

    img.onload = function () {
        document.getElementById("seatInfo").textContent = infoText;
    };

    lightbox.classList.add("show");
}

// Close button
closeButton.onclick = () => {
    lightbox.classList.remove("show");
};

// Click outside image
lightbox.onclick = (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove("show");
    }
};

// ESC key
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        lightbox.classList.remove("show");
    }
});
