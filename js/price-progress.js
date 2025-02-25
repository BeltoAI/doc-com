document.addEventListener("DOMContentLoaded", function () {
    const progressBar = document.getElementById("progress-bar");
    const dragHandle = document.getElementById("drag-handle");
    const priceValue = document.getElementById("price-value");
    const progressBarOuter = document.querySelector(".progres-bar-outer");
    const listItems = document.querySelectorAll(".pkg-list li");

    let isDragging = false;

    dragHandle.addEventListener("mousedown", function (e) {
        isDragging = true;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        let newWidth = e.clientX - progressBarOuter.offsetLeft;
        newWidth = Math.max(0, Math.min(newWidth, progressBarOuter.clientWidth));
        let percentage = newWidth / progressBarOuter.clientWidth;
        let price = (percentage * 25).toFixed(2);

        progressBar.style.width = `${percentage * 100}%`;
        priceValue.textContent = price;

        updateListItemColors(percentage);
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    function updateListItemColors(percentage) {
        listItems.forEach((item, index) => {
            let threshold = (index) / (listItems.length - 1);
            if (percentage > threshold || index === 0 || percentage === 1) {
                item.style.color = "#fff";
            } else {
                item.style.color = "#fa6e6e";
            }
        });
    }

    listItems[0].style.color = "#fff";
    updateListItemColors(0);
});