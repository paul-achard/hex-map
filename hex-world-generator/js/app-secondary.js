document.addEventListener("DOMContentLoaded", function (event) {
    let width = 16;
    let height = 16;
    let hex_size = 28;
    let seed_elevation;
    let seed_moisture;
    seed_elevation = '';
    seed_moisture = '';
    if (width > 0 && hex_size > 0 && height > 0) {
        let new_world = new world({
            width: 50,
            height: 50,
            seed_moisture: seed_moisture !== '' ? seed_moisture : null,
            seed_elevation: seed_elevation !== '' ? seed_elevation : null
        }).draw('.worldmap');
    } else {
        alert('Incorrect parameters!');
    }
    return false;
});
