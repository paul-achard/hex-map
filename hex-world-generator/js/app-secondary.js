document.addEventListener("DOMContentLoaded", function (event) {
    $('.world-width').val(32);
    $('.world-height').val(32);
    $('.world-erosion').val(0.54);
    $('.elevation-seed').val('');
    $('.moisture-seed').val('');
    $('body').on('click', '.generate', function () {
        let width = 16;
        let height = 16;
        let hex_size = 32;
        let erosion = 0.5;
        let opacity = 0.5;
        let map_name = "Test";
        let map_author = "Paul";
        let map_description = "Test";
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
            let data = new_world.export();
            let props = new_world.props();
            let map_data = {
                "info": {
                    "version": "1.4",
                    "name": map_name,
                    "description": map_description,
                    "author": map_author,
                    "props": {
                        "erosion": props.erosion,
                        "elevation": props.seeds.elevation,
                        "moisture": props.seeds.moisture
                    }
                }, "data": data
            }
            $('.output-world').val(' ').val(JSON.stringify(map_data)).show();
            $('.terrain-opacity').trigger('change');
            $('.tab-container').show();
            $('.current-elevation-seed').val(props.seeds.elevation);
            $('.current-moisture-seed').val(props.seeds.moisture);
        } else {
            alert('Incorrect parameters!');
        }
        return false;
    });
   });