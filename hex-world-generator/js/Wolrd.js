class world {

    constructor(params) {
        this._data = [];
        this.dict = {};
        this.width = typeof params.width !== 'undefined' ? params.width : 31;
        this.height = typeof params.height !== 'undefined' ? params.height : 31;
        this.seed_moisture = this.seed();
        this.seed_elevation = this.seed();
        this.createArray();
        this.generate();
        return this;
    }

    /**
     *
     * @returns {number}
     */
    seed() {
        return Math.random() * (2147483646 - 1) + 1;
    }

    /**
     * Créer le tableau a deux dimensions qui contiendra le bruit
     * @returns {world}
     */
    createArray() {
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
     * Genere un tableau contenant l'élévation et la moisture
     * @returns {world}
     */
    generate() {
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
                // on remplit notre tableau avec les données d'élévation
                this._data[y][x].e = e;
                let m = (1.00 * noise2(nx, ny)
                    + 0.50 * noise2(2 * nx, 2 * ny)
                    + 0.25 * noise2(4 * nx, 4 * ny));
                m /= (1 + 0.5 + 0.25);
                // on remplit notre tableau avec les données de moisture
                this._data[y][x].m = m;
            }
        }
        return this;
    }


    /**
     * Implémentation du path finding
     * @param start : Hex de début de chemin
     * @param objective : Hex sur lequel le chemin doit arriver
     * @returns {{cost_so_far: {}, came_from: {}}}
     */
    pathSearch(start, objective) {
        let frontier = new PriorityQueue();
        frontier.enqueue(start, 0);
        let cost_so_far = {};
        cost_so_far[start] = 0;
        let came_from = {};
        came_from[start] = start;

        while (!frontier.isEmpty()) {
           let current = frontier.dequeue().element;
                if (current.toString() === objective.toString()) {
                    return {cost_so_far, came_from};
                }
                for (let dir = 0; dir < 6; dir++) {
                    let neighbor = current.neighbor(dir);
                    let id = current.toString();
                    let hexObject = this.dict[id];
                    let cost = 100;
                    if (hexObject !== undefined) {
                        cost = hexObject.cost;
                    }
                    let newCost = cost_so_far[current] + cost;
                    if (cost_so_far[neighbor] === undefined || newCost < cost_so_far[neighbor]) {
                        cost_so_far[neighbor] = newCost;
                        frontier.enqueue(neighbor, newCost);
                        came_from[neighbor] = current;
                    }
                }

        }
    }

    drawRoads() {
        // On cherche toutes les villes
        let cityTab = [];
        for (const id in this.dict) {
            if (CITY_ID_TAB.includes(this.dict[id].id)) {
                cityTab.push(this.dict[id]);
            }
        }
        console.log(cityTab);
        let roadsDrawn = [];
        let isDrawn;
        // On cherche le chemin le plus rapide entre chaque ville
        cityTab.forEach(cityTile => {
            cityTab.forEach(cityTile2 => {
                // on vérifie que la route ne soit pas déja déssinée
                // si aucune route n'a été faite
                if (roadsDrawn.length === 0) {
                    isDrawn = false;
                } else {
                    isDrawn = false;
                    roadsDrawn.forEach(id => {
                        if (id.includes(cityTile.toString()) && id.includes(cityTile2.toString())) {
                            isDrawn = true;
                        }
                    })
                }
                if (cityTile !== cityTile2 && !isDrawn) {
                    let breadthFirstSearch = this.pathSearch(cityTile, cityTile2);
                    let current = cityTile2;
                    let path = [];
                    while (current !== cityTile) {
                        path.push(current);
                        current = breadthFirstSearch.came_from[current];
                    }
                    path.push(cityTile);

                    // On dessine la route
                    CTX.beginPath();
                    CTX.setLineDash([5, 15]);
                    for (let i = 0; i < (path.length - 1); i++) {
                        let coord = LAYOUT.hexToPixel(path[i]);
                        // on utilise moveTo uniquement lors de la première itération
                        if (i === 0) {
                            CTX.moveTo(coord.x + 16, coord.y + 24);
                        } else {
                            CTX.lineTo(coord.x + 16, coord.y + 24)
                        }
                        let nextI = i + 1;
                        let coordNext = LAYOUT.hexToPixel(path[nextI]);
                        // si avant derniere
                        if (i === path.length - 2) {
                            console.log(coordNext.y)
                            CTX.lineTo(coordNext.x + 16, coordNext.y + 24);
                        } else {
                            CTX.lineTo(coordNext.x + 16, coordNext.y + 24);
                        }
                        CTX.stroke();
                    }
                    // on sauvegarde la route que l'on vient de faire
                    let roadId = cityTile.toString() + " to " + cityTile2.toString();
                    roadsDrawn.push(roadId);
                }
            })
        })

    }

    draw() {
        for (let i = 0; i < this.height; ++i) {
            // check si pair ou impair
            let j = 0;
            while (j < this.width) {
                let offset_coord = {x: null, y: null};
                offset_coord.x = i - Math.floor(this.width / 2);
                offset_coord.y = j - Math.floor(this.height / 2);
                let hex = OffsetCoord.qoffsetToCube(OffsetCoord.EVEN, {row: offset_coord.x, col: offset_coord.y});
                hex.setHexTerrain(this._data[i][j].e, this._data[i][j].m);
                let coordCanvas = LAYOUT.hexToPixel(hex)
                hex.printHex(coordCanvas)
                this.dict[hex.toString()] = hex;
                j = j + 2;
            }
            j = 1;
            while (j < this.width) {
                let offset_coord = {x: null, y: null};
                offset_coord.x = i - Math.floor(this.width / 2);
                offset_coord.y = j - Math.floor(this.height / 2);
                let hex = OffsetCoord.qoffsetToCube(OffsetCoord.EVEN, {row: offset_coord.x, col: offset_coord.y});
                hex.setHexTerrain(this._data[i][j].e, this._data[i][j].m);
                let coordCanvas = LAYOUT.hexToPixel(hex)
                hex.printHex(coordCanvas)
                this.dict[hex.toString()] = hex;
                j = j + 2;
            }
        }
        this.drawRoads();
        return this;
    }
}
