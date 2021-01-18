document.addEventListener("DOMContentLoaded", function () {
    let width = 16;
    let height = 16;
    let hex_size = 28;
    if (width > 0 && hex_size > 0 && height > 0) {
        let new_world = new world({
            width: 30,
            height: 30,
        }).draw();
    } else {
        alert('Incorrect parameters!');
    }
    return false;
});
