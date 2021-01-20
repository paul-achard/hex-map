class Hex {
    constructor(q, r, s) {
        this.q = q;
        this.r = r;
        this.s = s;
        if (Math.round(q + r + s) !== 0) {
            throw "q + r + s must be 0";
        }
        if (Math.random() < 0.01) {
            this.cityName = this.getCityName();
        } else {
            this.cityName = null;
        }
        this.id = null;
    }

    toString() {
        return "q:" + this.q + "r:" + this.r + "s:" + this.s;
    }

    add(b) {
        return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
    }

    subtract(b) {
        return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
    }

    scale(k) {
        return new Hex(this.q * k, this.r * k, this.s * k);
    }

    rotateLeft() {
        return new Hex(-this.s, -this.q, -this.r);
    }

    rotateRight() {
        return new Hex(-this.r, -this.s, -this.q);
    }

    static direction(direction) {
        var directions = [
            new Hex(+1, -1, 0), new Hex(+1, 0, -1), new Hex(0, +1, -1),
            new Hex(-1, +1, 0), new Hex(-1, 0, +1), new Hex(0, -1, +1),
        ]
        return directions[direction];
    }

    neighbor(direction) {
        return this.add(Hex.direction(direction));
    }

    diagonalNeighbor(direction) {
        return this.add(Hex.diagonals[direction]);
    }

    len() {
        return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
    }

    distance(b) {
        return this.subtract(b).len();
    }

    round() {
        var qi = Math.round(this.q);
        var ri = Math.round(this.r);
        var si = Math.round(this.s);
        var q_diff = Math.abs(qi - this.q);
        var r_diff = Math.abs(ri - this.r);
        var s_diff = Math.abs(si - this.s);
        if (q_diff > r_diff && q_diff > s_diff) {
            qi = -ri - si;
        } else if (r_diff > s_diff) {
            ri = -qi - si;
        } else {
            si = -qi - ri;
        }
        return new Hex(qi, ri, si);
    }

    lerp(b, t) {
        return new Hex(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
    }

    linedraw(b) {
        var N = this.distance(b);
        var a_nudge = new Hex(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
        var b_nudge = new Hex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
        var results = [];
        var step = 1.0 / Math.max(N, 1);
        for (var i = 0; i <= N; i++) {
            results.push(a_nudge.lerp(b_nudge, step * i).round());
        }
        return results;
    }

    //Find return undefined quand il ne trouve pas la valeur
    getCoord() {
        let found;
        let coordX;
        let coordY;
        for (let i = 0; i < 10; i++) {
            found = ID_TAB[i].findIndex(element => element === this.id);
            if (found !== -1) {
                coordY = i;
                coordX = found;
            }
        }
        return [coordX, coordY];
    }

    getRandomHex(tab) {
        let index = Math.floor(Math.random() * Math.floor(tab.length));
        return tab[index];
    }

    set_hex_terrain(noiseData, i, j) {

        let elevation = noiseData[i][j].e;
        let moisture = noiseData[i][j].m;

        if (elevation <= 0.35) {
            // Ocean
            this.id = 72;
        } else if (elevation > 0.35 && elevation <= 0.4) {
            // Mer
            this.id = 68;
        } else if (elevation > 0.4 && elevation <= 0.5) {
            if (moisture <= 0.20) {
                // Plage
                if (this.cityName != null) {
                    this.id = 103;
                } else {
                    this.id = this.getRandomHex(PLAGE_ID_TAB);//63
                }
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Plaine desertique
                this.id = this.getRandomHex(PLAINE_DESERTIQUE_ID_TAB);//17
            } else if (moisture > 0.4 && moisture <= 0.6) {
                // Plaine
                if (this.cityName != null) {
                    // Ville dans plaine
                    this.id = 97;
                } else {
                    this.id = this.getRandomHex(PLAINE_ID_TAB);
                }
            } else if (moisture > 0.6 && moisture <= 0.8) {
                // Lac
                this.id = this.getRandomHex(LAC_ID_TAB);//19
            } else {
                // neige
                if (this.cityName != null) {
                    this.id = 100;
                } else {
                    this.id = this.getRandomHex(NEIGE_ID_TAB);//53
                }
            }
        } else if (elevation > 0.5 && elevation <= 0.7) {
            if (moisture <= 0.20) {
                // Rocher Desertique
                if (this.cityName != null) {
                    this.id = 104;
                } else {
                    this.id = this.getRandomHex(ROCHER_DESERTIQUE_ID_TAB);
                }
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Rocher desertique mais un peu moins desertique ta vu
                if (this.cityName != null) {
                    this.id = 103;
                } else {
                    this.id = this.getRandomHex(ROCHER_DESERTIQUE_MOINS_ID_TAB); //41
                }
            } else if (moisture > 0.4 && moisture <= 0.6) {
                // Plaine rocheuse
                this.id = this.getRandomHex(PLAINE_ROCHEUSE_ID_TAB); //8
            } else if (moisture > 0.6 && moisture <= 0.8) {
                // Foret
                if (this.cityName != null) {
                    this.id = 97;
                } else {
                    this.id = this.getRandomHex(FORET_ID_TAB); //5
                }
            } else {
                // neige rocher
                if (this.cityName != null) {
                    this.id = 101;
                } else {
                    this.id = this.getRandomHex(NEIGE_ROCHER_ID_TAB); //56
                }
            }
        } else {
            if (moisture <= 0.20) {
                // Montagne Desertique
                this.id = this.getRandomHex(HILL_DESERT_ID_TAB); //66
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Foret profonde
                this.id = this.getRandomHex(FORET_PROFONDE_ID_TAB);//23
            } else if (moisture > 0.4 && moisture <= 0.8) {
                // Montagne un peu moins montagne
                this.id = this.getRandomHex(MONTAGNE_BASSE_ID_TAB); //93
            } else {
                // Montagne neige
                if (this.cityName != null) {
                    this.id = 102;
                } else {
                    this.id = 82;
                }
            }
        }
    }

    printHex(coordCanvas) {
        let coordHexTile = this.getCoord(this.id);
        CTX.drawImage(HEXTILES_IMAGE, coordHexTile[0] * 32, coordHexTile[1] * 48, 32, 48, coordCanvas.x, coordCanvas.y, 32, 48);
        if (CITY_ID_TAB.includes(this.id)) {
            CTX.font = "20px Arial";
            CTX.fillStyle = "white";
            CTX.fillText(this.cityName, coordCanvas.x + 16, coordCanvas.y);
        }
    }

    getCityName() {
        let a = ['Lon', 'Birmin', 'Glas', 'Edin', 'Liver', 'Man', 'Brigh', 'Ox', 'Middles', 'Cam', 'Lin', 'Ply', 'Ex', 'Nor', 'Stir', 'Shef', 'Sout', 'West', 'Canter', 'Car', 'Brack', 'Wimble', 'Rother', 'Farn', 'Yar', 'Swin', 'Notting', 'Stoke', 'Atter', 'Castle', 'Oaken', 'Bel', 'Wil', 'Ash', 'Berk', 'Grind', 'Horn', 'Barn', 'Clap', 'Auchen', 'Barr', 'Maid', 'Dun'];
        let b = ['don', 'gham', 'gow', 'burgh', 'pool', 'chester', 'ton', 'ford', 'brough', 'bridge', 'coln', 'mouth', 'ter', 'port', 'wich', 'ling', 'field', 'hampton', 'minster', 'bury', 'diff', 'nell', 'head', 'dale', 'ley', 'stoke', 'water', 'mills', 'town', 'ham', 'well', 'by', 'thorne', 'worth', 'brook', 'mont', 'heath', 'ville', 'bourne', 'shire', 'cairn', 'stone', 'hill'];
        let res = a.splice(Math.floor(Math.random() * a.length), 1)[0];
        res += b[Math.floor(Math.random() * b.length)];
        return res;

    }
}