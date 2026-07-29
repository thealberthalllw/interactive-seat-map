const svgContainer = document.getElementById("svgContainer");

const maps = {
    stalls: "svg/stalls.svg",
    circle: "svg/circle.svg"
};

loadMap("stalls");

document.querySelectorAll(".tab").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        loadMap(button.dataset.map);

    });

});

function loadMap(map) {

    fetch(maps[map])
        .then(response => response.text())
        .then(svg => {

            svgContainer.innerHTML = svg;

            prepareSeats();

        });

}

function prepareSeats() {

    const seats = svgContainer.querySelectorAll("path, circle, ellipse");

    seats.forEach((seat, index) => {

        seat.classList.add("seat");

        if (!seat.id) {
            seat.id = "Seat " + (index + 1);
        }

        seat.addEventListener("click", () => {

            document.querySelectorAll(".selected").forEach(s =>
                s.classList.remove("selected")
            );

            seat.classList.add("selected");

            document.getElementById("seatTitle").textContent = seat.id;

            document.getElementById("seatInfo").textContent =
                "Photo coming soon.";

            document.getElementById("seatPhoto").src =
                "https://placehold.co/600x400?text=" +
                encodeURIComponent(seat.id);

        });

    });

}
