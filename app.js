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
        displayName = `<svg class="wheelchair-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-2 3h2l.8 4H17v2h-3.1l1.1 5.2A4.5 4.5 0 1 1 9 14h2a2.5 2.5 0 1 0 2.5 2.5l-1.2-5.5H9V9h3l-.5-3z"/>
            </svg>
            Wheelchair Space ${seatId}
`;
        infoText = `View from Wheelchair Space ${seatId}. <b>Please note: this is a space for a wheelchair to park, and the user to remain in the wheelchair.</b>`;
    }

    document.getElementById("seatTitle").innerHTML = displayName;
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
    if(e.target === lightbox){
        lightbox.classList.remove("show");
    }
};

// ESC key
document.addEventListener("keydown", e => {

    if(e.key === "Escape"){
        lightbox.classList.remove("show");
    }

});
