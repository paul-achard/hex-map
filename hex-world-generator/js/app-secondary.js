document.addEventListener("DOMContentLoaded", function (event) {
    $('.world-width').val(32);
    $('.world-height').val(32);
    $('.world-erosion').val(0.54);
    $('.elevation-seed').val('');
    $('.moisture-seed').val('');
    let clicked = false;
    let clickY, clickX;
    $('body').on('click', '.generate', function () {
        let width = 32;
        let height = 32;
        let hex_size = 24;
        let erosion = 0.3;
        let draw_mode = "canvas";
        let show_grid = true;
        let show_terrain = true;
        let opacity = 0.7;
        let map_name = "Test";
        let map_author = "Paul";
        let map_description = "Test";
        let seed_elevation;
        let seed_moisture;
        seed_elevation = '';
        seed_moisture = '';
        if (width > 0 && hex_size > 0 && height > 0 ) {
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
                show_terrain: show_terrain,
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
    $('.generate').trigger('click');
    $('ul.tabs li').click(function () {
        let tab_id = $(this).attr('data-tab');
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });
});