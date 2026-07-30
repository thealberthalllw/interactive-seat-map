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
  });

function initialiseSeats() {

    const ignore = [
        "stage",
        "background",
        "auditorium"
    ];

    const allElements = mapContainer.querySelectorAll("[id]");

    allElements.forEach(element => {

        const id = element.id.trim();

        if (!id) return;

        if (ignore.includes(id.toLowerCase())) return;

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

    document.getElementById("seatTitle").textContent = seatId;
    document.getElementById("seatInfo").textContent = "Loading image...";

    const img = document.getElementById("seatPhoto");

    img.src = `photos/${seatId}.jpg`;

    img.onerror = function(){

        img.src = "photos/image-coming-soon.png";

        document.getElementById("seatInfo").textContent =
            `No photo has been added yet for ${seatId}.`;

    }

    img.onload = function(){

        document.getElementById("seatInfo").textContent =
            `View from seat ${seatId}`;

    }

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
