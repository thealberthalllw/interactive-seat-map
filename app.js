const mapContainer = document.getElementById("mapContainer");
const lightbox = document.getElementById("lightbox");
const closeButton = document.getElementById("closeLightbox");

let selectedSeat = null;

// Load the SVG
fetch("svg/auditorium.svg")
  .then(response => response.text())
  .then(svg => {
    mapContainer.innerHTML = svg;
    initialiseSeats();
  })
  .catch(error => {
    mapContainer.innerHTML = "<p>Unable to load seating plan.</p>";
    console.error(error);
  });

function initialiseSeats() {

    // Match normal seats and wheelchair spaces
    const seatPattern = /^[A-Z]+\\d+(-Wheelchair)?$/;

    const allElements = mapContainer.querySelectorAll("[id]");

    allElements.forEach(element => {

        const id = element.id.trim();

        if (!seatPattern.test(id)) return;

        element.classList.add("seat");

        element.addEventListener("click", () => {
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

    let displayName = seatId;
    let photoName = seatId;

    // Special handling for wheelchair spaces
    if (seatId.endsWith("-Wheelchair")) {

        const number = seatId.replace("-Wheelchair", "");

        displayName = `Wheelchair Space ${number}`;
        photoName = number;

    }

    document.getElementById("seatTitle").textContent = displayName;
    document.getElementById("seatInfo").textContent = "Loading image...";

    const img = document.getElementById("seatPhoto");

    // Try JPG first
    img.src = `photos/${photoName}.jpg`;

    img.onerror = function () {

        img.onerror = null;
        img.src = "photos/image coming soon.png";

        document.getElementById("seatInfo").textContent =
            `No photo has been added yet for ${displayName}.`;

    };

    img.onload = function () {

        document.getElementById("seatInfo").textContent =
            `View from ${displayName}`;

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
