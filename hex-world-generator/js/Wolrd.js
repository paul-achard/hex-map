class world {

    constructor(params) {
        this._data = [];
        this.width = typeof params.width !== 'undefined' ? params.width : 32;
        this.height = typeof params.height !== 'undefined' ? params.height : 32;
        this.seed_moisture = typeof params.seed_moisture !== 'undefined'
        && params.seed_moisture !== null ? params.seed_moisture : this.seed();
        this.seed_elevation = typeof params.seed_elevation !== 'undefined'
        && params.seed_elevation !== null ? params.seed_elevation : this.seed();
        this._data = typeof params.data !== 'undefined' ? params.data : [];
        if (this._data.length === 0) {
            this._create_array();
            this._generate();
        }
        return this;
    }

    /**
     * Get a random number to seed the generator.
     *
     * @public
     * @returns {Number}
     */
    seed() {
        return Math.random() * (2147483646 - 1) + 1;
    }

    /**
     * Create the raw multidimensional array.
     *
     * @private
     * @returns {world}
     */
    _create_array() {
        this._data = new Array(this.width);
        for (let i = 0; i < this.width; i += 1) {
            this._data[i] = new Array(this.height);
        }
        for (let i = 0; i < this.width; i += 1) {
            for (let j = 0; j < this.height; j += 1) {
                this._data[i][j] = {
                    e: 0,
                    m: 0
                };
            }
        }
        return this;
    }

    /**
     * Generate the elevation and moisture maps.
     *
     * @private
     * @returns {world}
     */
    _generate() {
        let rng1 = PM_PRNG.create(this.seed_elevation);
        let rng2 = PM_PRNG.create(this.seed_moisture);
        let gen1 = new SimplexNoise(rng1.nextDouble.bind(rng1));
        let gen2 = new SimplexNoise(rng2.nextDouble.bind(rng2));

        function noise1(nx, ny) {
            return gen1.noise2D(nx, ny) / 2 + 0.5;
        }

        function noise2(nx, ny) {
            return gen2.noise2D(nx, ny) / 2 + 0.5;
        }

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                let nx = x / this.height - 0.5;
                let ny = y / this.width - 0.5;
                let e = (1.00 * noise1(nx, ny)
                    + 0.50 * noise1(2 * nx, 2 * ny)
                    + 0.25 * noise1(4 * nx, 4 * ny));
                e /= (1.00 + 0.50 + 0.25);
                // implémentation de la distance au centre pour faire une forme d'île
                let d = 2 * Math.max(Math.abs(nx), Math.abs(ny));
                e = (1 + e - d ) / 2;
                console.log(e);
                this._data[y][x].e = e;
                let m = (1.00 * noise2(nx, ny)
                    + 0.50 * noise2(2 * nx, 2 * ny)
                    + 0.25 * noise2(4 * nx, 4 * ny));
                m /= (1+ 0.5 + 0.25);
                this._data[y][x].m = m;
            }
        }
        return this;
    }

    /**
     * Adjust a point.
     *
     * @private
     * @param {Object} source
     * @param {Number} dx
     * @param {Number} dy
     * @returns {Number}
     */
    _to_point(source, dx, dy) {
        return Math.round(dx + source.x) + ',' + Math.round(dy + source.y);
    }
}

/**
 * Draw method.
 *
 * @public
 * @param {String} container
 * @param {Object} options
 * @returns {world}
 */
world.prototype.draw = function (container) {
    this._container = container;
    let current_hex_x;
    let current_hex_y;
    let offset_column = false;
    let tabHex = [];
    for (let i = 0; i < this.width; ++i) {
        let tabLigne = [];
        for (let j = 0; j < this.height; ++j) {
            if (!offset_column) {
                current_hex_x = i * 24;
                current_hex_y = j * 28;
            } else {
                current_hex_x = i * 24;
                current_hex_y = (j * 28) + (28 * 0.5);
            }
            let hex = new Hex(current_hex_x, current_hex_y);
            hex.set_hex_terrain(this._data, i, j);
            tabLigne.push(hex);
            //hex.printHex();
        }
        tabHex.push(tabLigne);
        offset_column = !offset_column;
    }
    console.log(tabHex);
    for (let i=0; i<this.height; i++){
        let j = 0;
        while (j < 50){
            tabHex[j][i].printHex();
            j = j+2;
        }
        j = 1;
        while (j < 50){
            tabHex[j][i].printHex();
            j = j+2;
        }
    }
    return this;
}

/**
 * Draw on a specifix hex.
 *
 * @public
 * @param {Number} i
 * @param {Number} j
 * @param {Number} x
 * @param {Number} y
 * @param {String} element
 * @param {String} element_category
 * @param {Number} opacity
 * @returns {Boolean}
 */
world.prototype.draw_on_hex = function (i, j, x, y, element, element_category, opacity) {
    opacity = typeof opacity !== 'undefined' ? opacity : this._draw_options.opacity;
    let scale = this._draw_options.hex_size / 24;
    let canvas = $('.canvas-map').get(0);
    let ctx = canvas.getContext('2d');
    let imageObject = new Image();
    let image_size = this._draw_options.hex_size * 36 / 24;
    let off_x = 6;
    let off_y = 2;
    if (this._draw_options.hex_size < 16) {
        off_x = 3;
        off_y = 1;
    }
    imageObject.onload = function () {
        ctx.globalAlpha = opacity;
        ctx.drawImage(imageObject, x + off_x, y + off_y, image_size, image_size);
        ctx.globalAlpha = 1;
    }
    imageObject.src = this._draw_options.assets_url + element_category + '/' + element + '.png';

    return true;
}
