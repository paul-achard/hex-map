class world {

    /**
     * Object constructor.
     *
     * @private
     * @constructor
     * @returns {Object}
     * @param {Object} params
     */
    constructor(params) {

        /**
         * Internal flags
         *
         * @private
         */
        this._dirty = false;
        this._container;
        this._draw_options = {};

         /**
         * Raw world data.
         *
         * @private
         * @type {Array}
         */
        this._data = [];
        this.width = typeof params.width !== 'undefined' ? params.width : 32;
        this.height = typeof params.height !== 'undefined' ? params.height : 32;
        this.erosion = typeof params.erosion !== 'undefined' ? params.erosion : 0.20;
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
     * Get the properties of the world.
     *
     * @public
     * @returns {Object}
     */
    props() {
        return {
            width: this.width,
            height: this.height,
            erosion: this.erosion,
            seeds: {
                elevation: this.seed_elevation,
                moisture: this.seed_moisture
            }
        };
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
     * Return the elevation data for the specified hex.
     *
     * @public
     * @param {Object} hex
     * @returns {Number}
     */
    get_hex_elevation(hex) {
        return this.get_hex(hex.x, hex.y).e;
    }

    /**
     * Return the specified hex raw data.
     *
     * @public
     * @param {Number} x
     * @param {Number} y
     * @returns {Object}
     */
    get_hex(x, y) {
        return this._data[y][x];
    }

    /**
     * Set the specified hex data.
     *
     * @public
     * @param {Object} hex
     * @param {String} key
     * @param {String|Number|Array|Object} value
     * @returns {Object}
     */
    set_hex(hex, key, value) {
        return this._data[hex.y][hex.x][key] = value;
    }

    /**
     * Get/set the world data array.
     *
     * @public
     * @param {Array} value
     * @returns {Array}
     */
    data(value) {
        if (typeof value !== 'undefined') {
            this._data = value;
        }
        return this._data;
    }

    /**
     * Export world data.
     * Just an alias for the data() method.
     *
     * @public
     * @alias data
     * @returns {String}
     */
    export() {
        return this.data();
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
                let e = (1.00 * noise1( 1 * nx,  1 * ny)
                    + 0.50 * noise1( 2 * nx,  2 * ny)
                    + 0.25 * noise1( 4 * nx,  4 * ny)
                    + 0.13 * noise1( 8 * nx,  8 * ny)
                    + 0.06 * noise1(16 * nx, 16 * ny)
                    + 0.03 * noise1(32 * nx, 32 * ny));
                e /= (1.00+0.50+0.25+0.13+0.06+0.03);
                e = Math.pow(e, this.erosion);
                this._data[y][x].e = e;
                let m = (1.00 * noise2( 1 * nx,  1 * ny)
                    + 0.75 * noise2( 2 * nx,  2 * ny)
                    + 0.33 * noise2( 4 * nx,  4 * ny)
                    + 0.33 * noise2( 8 * nx,  8 * ny)
                    + 0.33 * noise2(16 * nx, 16 * ny)
                    + 0.50 * noise2(32 * nx, 32 * ny));
                m /= (1.00+0.75+0.33+0.33+0.33+0.50);
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

    /**
     * Processing callback.
     *
     * @public
     * @param {Function} callback
     * @returns {Object|Boolean|Number}
     */
    process(callback) {
        callback.call(this);
        this.redraw();
        return this;
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
world.prototype.draw = function (container, options) {
    options.mode = 'canvas';
    if (typeof options.opacity === 'undefined') {
        options.opacity = 0.7;
    }
    if (typeof options.hex_size === 'undefined') {
        options.hex_size = 32;
    }
    if (typeof options.show_grid === 'undefined') {
        options.show_grid = true;
    }
    if (typeof options.assets_url === 'undefined') {
        options.assets_url = './';
    }
    this._container = container;
    this._draw_options = {
        mode: options.mode,
        opacity: options.opacity,
        hex_size: options.hex_size,
        show_grid: options.show_grid,
        assets_url: options.assets_url
    }
    let current_hex_x;
    let current_hex_y;
    let offset_column = false;
    for (let i = 0; i < this.width; ++i) {
        for (let j = 0; j < this.height; ++j) {
            if (!offset_column) {
                current_hex_x = i * 22;
                current_hex_y = j * 28;
            } else {
                current_hex_x = i * 22;
                current_hex_y = (j * 28) + (28 * 0.5);
            }
            let hex = new Hex(current_hex_x, current_hex_y);
            hex.set_hex_terrain(this._data,i ,j)
            hex.printHex()
        }
        offset_column = !offset_column;
    }
    this._dirty = false;
    return this;
}

/**
 * Redraw method.
 *
 * @public
 * @returns {world}
 */
world.prototype.redraw = function () {
    if (this._dirty === true) {
        this.draw(this._container, this._draw_options);
        if (this.on_redraw instanceof Function) {
            this.on_redraw.call(this);
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
