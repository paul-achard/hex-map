document.addEventListener("DOMContentLoaded", function (event) {
    let width = 16;
    let height = 16;
    let hex_size = 32;
    let erosion = 1;
    let opacity = 1;
    let seed_elevation;
    let seed_moisture;
    seed_elevation = '';
    seed_moisture = '';
    if (width > 0 && hex_size > 0 && height > 0) {
        let new_world = new world({
            width: 32,
            height: 32,
            erosion: erosion,
            seed_moisture: seed_moisture !== '' ? seed_moisture : null,
            seed_elevation: seed_elevation !== '' ? seed_elevation : null
        }).draw('.worldmap', {
            mode: 'canvas',
            opacity: opacity,
            hex_size: hex_size,
            show_grid: show_grid,
            assets_url: "../img/",
        });
    } else {
        alert('Incorrect parameters!');
    }
    return false;
});
