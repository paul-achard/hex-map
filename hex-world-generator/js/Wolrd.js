class world {

    constructor(params) {
        this._data = [];
        this.width = typeof params.width !== 'undefined' ? params.width : 32;
        this.height = typeof params.height !== 'undefined' ? params.height : 32;
        this.seed_moisture = this.seed();
        this.seed_elevation = this.seed();
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

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let nx = x / this.height - 0.5;
                let ny = y / this.width - 0.5;
                let e = (1.00 * noise1(nx, ny)
                    + 0.50 * noise1(2 * nx, 2 * ny)
                    + 0.25 * noise1(4 * nx, 4 * ny));
                e /= (1.00 + 0.50 + 0.25);
                // implémentation de la distance au centre pour faire une forme d'île
                let d = 2 * Math.max(Math.abs(nx), Math.abs(ny));
                e = (1 + e - d) / 2;
                this._data[y][x].e = e;
                let m = (1.00 * noise2(nx, ny)
                    + 0.50 * noise2(2 * nx, 2 * ny)
                    + 0.25 * noise2(4 * nx, 4 * ny));
                m /= (1 + 0.5 + 0.25);
                this._data[y][x].m = m;
            }
        }
        return this;
    }

    breadthFirstSearch(start, objective) {
        let cost_so_far = {};
        cost_so_far[start] = 0;
        let came_from = {};
        came_from[start] = null;
        let fringes = [[start]];
        for (let k = 0; fringes[k].length > 0; k++) {
            fringes[k + 1] = [];
            for (let hex of fringes[k]) {
                for (let dir = 0; dir < 6; dir++) {
                    let neighbor = cube_neighbor(hex, dir);
                    if (cost_so_far[neighbor] === undefined) {
                        cost_so_far[neighbor] = k + 1;
                        came_from[neighbor] = hex;
                        fringes[k + 1].push(neighbor);
                        if (neighbor.toString() === objective.toString()) {
                            return {cost_so_far, came_from};
                        }
                    }
                }
            }
        }
        return {cost_so_far, came_from};
    }

    drawRoads(dict) {
        // On cherche toutes les villes
        let cityTab = [];
        for (const id in dict) {
            if (CITY_ID_TAB.includes(dict[id].id)) {
                cityTab.push(dict[id]);
            }
        }
        cityTab.forEach(cityTile => {
            cityTab.forEach(cityTile2 => {
                if (cityTile !== cityTile2) {
                    let test = this.breadthFirstSearch(cityTile, cityTile2);
                    console.log(test);
                }

            })

        })
    }

    draw() {
        let dict = {};
        for (let i = 0; i < this.width; ++i) {
            for (let j = 0; j < this.height; ++j) {
                let offset_coord = {x: null, y: null};
                offset_coord.x = i - Math.floor(this.width / 2);
                offset_coord.y = j - Math.floor(this.height / 2);
                let hex = OffsetCoord.qoffsetToCube(OffsetCoord.EVEN, {row: offset_coord.x, col: offset_coord.y});
                hex.set_hex_terrain(this._data, i, j);
                dict["i:" + i + "j:" + j] = hex;
            }
        }

        for (let i = 0; i < this.height; i++) {
            let j = 0;
            while (j < this.width) {
                let hex = dict["i:" + i + "j:" + j];
                let coordCanvas = LAYOUT.hexToPixel(hex)
                hex.printHex(coordCanvas);
                j = j + 2;
            }
            j = 1;
            while (j < this.width) {
                let hex = dict["i:" + i + "j:" + j];
                let coordCanvas = LAYOUT.hexToPixel(hex)
                hex.printHex(coordCanvas);
                j = j + 2;
            }
        }
        this.drawRoads(dict);
        return this;
    }
}
