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
        return Hex.directions[direction];
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
    getRandomHex(tab){
        let index= Math.floor(Math.random() * Math.floor(tab.length));
        return tab[index];
    }

    set_hex_terrain(noiseData, i, j) {

        let elevation = noiseData[i][j].e;
        let moisture = noiseData[i][j].m;

        let tabDesert =[61,62,67];
        let tabDesertMontagne = [65,66];
        let tabPlaineDesertique = [16,17,18,24,26];
        let tabPlaine = [1,2,7];
        let tabPlaineRocheuse = [8,9,10,11];
        let tabLac = [12,13,19];
        let tabNeige = [48,49,51,52,54,55,56,57];
        let tabNeigeRocher = [56,57,82];
        let tabRocherDesertiqueMoins = [32,33,34,35,36,37,38,39,40,41];
        let tabForet = [3,4,5,6];
        let tabForetProfonde = [23,25];
        let tabMontagneBasse = [93,94,50];
        let tabRocherDesertique = [63,64];

        if (elevation <= 0.35) {
            // Ocean
            this.id = 72;
        } else if (elevation > 0.35 && elevation <= 0.4) {
            // Mer
            this.id = 68;
        } else if (elevation > 0.4 && elevation <= 0.5) {
            if (moisture <= 0.20) {
                // Desert
                if (this.cityName != null) {
                    this.id = 103;
                } else {
                    this.id = this.getRandomHex(tabDesert) ;//63
                }
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Plaine desertique
                this.id = this.getRandomHex(tabPlaineDesertique);//17
            } else if (moisture > 0.4 && moisture <= 0.6) {
                // Plaine
                if (this.cityName != null) {
                    // Ville dans plaine
                    this.id = 97;
                } else {
                    this.id = this.getRandomHex(tabPlaine);
                }
            } else if (moisture > 0.6 && moisture <= 0.8) {
                // Lac
                this.id = this.getRandomHex(tabLac);//19
            } else {
                // neige
                if (this.cityName != null) {
                    this.id = 100;
                } else {
                    this.id = this.getRandomHex(tabNeige);//53
                }
            }
        } else if (elevation > 0.5 && elevation <= 0.7) {
            if (moisture <= 0.20) {
                // Rocher Desertique
                if (this.cityName != null) {
                    this.id = 104;
                } else {
                    this.id = this.getRandomHex(tabRocherDesertique);
                }
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Rocher desertique mais un peu moins desertique ta vu
                if (this.cityName != null) {
                    this.id = 103;
                } else {
                    this.id = this.getRandomHex(tabRocherDesertiqueMoins); //41
                }
            } else if (moisture > 0.4 && moisture <= 0.6) {
                // Plaine rocheuse
                this.id = this.getRandomHex(tabPlaineRocheuse); //8
            } else if (moisture > 0.6 && moisture <= 0.8) {
                // Foret
                if (this.cityName != null) {
                    this.id = 97;
                } else {
                    this.id = this.getRandomHex(tabForet); //5
                }
            } else {
                // neige rocher
                if (this.cityName != null) {
                    this.id = 101;
                } else {
                    this.id = this.getRandomHex(tabNeigeRocher); //56
                }
            }
        } else {
            if (moisture <= 0.20) {
                // Montagne Desertique
                this.id = this.getRandomHex(tabDesertMontagne); //66
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Foret profonde
                this.id = this.getRandomHex(tabForetProfonde);//23
            } else if (moisture > 0.4 && moisture <= 0.8) {
                // Montagne un peu moins montagne
                this.id = this.getRandomHex(tabMontagneBasse); //93
            }else {
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
            CTX.fillText(this.cityName, coordCanvas.x, coordCanvas.y);
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

