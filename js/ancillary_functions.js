document.addEventListener("DOMContentLoaded", function () {
    // Get the popup container
    const popup = document.getElementById("popup-container");

    // Display the popup
    popup.style.display = "block";

    // Optionally, you can add a close button functionality
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.classList.add("popup-close");
    closeButton.addEventListener("click", function () {
        popup.style.display = "none";
    });
    popup.appendChild(closeButton);
});
