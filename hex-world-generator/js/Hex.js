class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        if (Math.random() < 0.05) {
            this.cityName = this.getCityName();
        } else {
            this.cityName = null;
        }
        this.id = null;
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

    set_hex_terrain(noiseData, i, j) {
        let elevation = noiseData[i][j].e;
        let moisture = noiseData[i][j].m;
        if (elevation <= 0.1) {
            // Ocean
            this.id = 72;
        } else if (elevation > 0.1 && elevation <= 0.2) {
            // Mer
            this.id = 68;
        } else if (elevation > 0.2 && elevation <= 0.5) {
            if (moisture <= 0.20) {
                // Desert
                if (this.cityName != null) {
                    this.id = 103;
                } else {
                    this.id = 63;
                }
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Plaine desertique
                this.id = 17;
            } else if (moisture > 0.4 && moisture <= 0.6) {
                // Plaine
                if (this.cityName != null) {
                    // Ville dans plaine
                    this.id = 97;
                } else {
                    this.id = 1;
                }
            } else if (moisture > 0.6 && moisture <= 0.8) {
                // Lac
                this.id = 13;
            } else {
                // neige
                if (this.cityName != null) {
                    this.id = 100;
                } else {
                    this.id = 53;
                }
            }
        } else if (elevation > 0.5 && elevation <= 0.7) {
            if (moisture <= 0.20) {
                // Rocher Desertique
                if (this.cityName != null) {
                    this.id = 104;
                } else {
                    this.id = 64;
                }
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Rocher desertique mais un peu moins desertique ta vu
                if (this.cityName != null) {
                    this.id = 99;
                } else {
                    this.id = 41;
                }
            } else if (moisture > 0.4 && moisture <= 0.6) {
                // Plaine rocheuse
                this.id = 8;
            } else if (moisture > 0.6 && moisture <= 0.8) {
                // Foret
                if (this.cityName != null) {
                    this.id = 98;
                } else {
                    this.id = 5;
                }
            } else {
                // neige rocher
                if (this.cityName != null) {
                    this.id = 101;
                } else {
                    this.id = 56;
                }
            }
        } else {
            if (moisture <= 0.20) {
                // Montagne Desertique
                this.id = 66;
            } else if (moisture > 0.2 && moisture <= 0.4) {
                // Foret profonde
                this.id = 23;
            } else if (moisture > 0.4 && moisture <= 0.6) {
                // Montagne un peu moins montagne
                this.id = 93;
            } else if (moisture > 0.6 && moisture <= 0.8) {
                // Montagne
                this.id = 92;
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

    printHex() {
        let coord = this.getCoord(this.id);
        CTX.drawImage(HEXTILES_IMAGE, coord[0] * 32, coord[1] * 48, 32, 48, this.x, this.y, 32, 48);
        if (CITY_ID_TAB.includes(this.id)) {
            CTX.font = "20px Arial";
            CTX.fillText(this.cityName, this.x, this.y);
        }
    }

    getCityName() {
        let a = ['Lon', 'Birmin', 'Glas', 'Edin', 'Liver', 'Man', 'Brigh', 'Ox', 'Middles', 'Cam', 'Lin', 'Ply', 'Ex', 'Nor', 'Stir', 'Shef', 'Sout', 'West', 'Canter', 'Car', 'Brack', 'Wimble', 'Rother', 'Farn', 'Yar', 'Swin', 'Notting', 'Stoke', 'Atter', 'Castle', 'Oaken', 'Bel', 'Wil', 'Ash', 'Berk', 'Grind', 'Horn', 'Barn', 'Clap', 'Auchen', 'Barr', 'Maid', 'Dun'];
        let b = ['don', 'gham', 'gow', 'burgh', 'pool', 'chester', 'ton', 'ford', 'brough', 'bridge', 'coln', 'mouth', 'ter', 'port', 'wich', 'ling', 'field', 'hampton', 'minster', 'bury', 'diff', 'nell', 'head', 'dale', 'ley', 'stoke', 'water', 'mills', 'town', 'ham', 'well', 'by', 'thorne', 'worth', 'brook', 'mont', 'heath', 'ville', 'bourne', 'shire', 'cairn', 'stone', 'hill'];
        let res = a.splice(Math.floor(Math.random() * a.length), 1)[0];
        res += b[Math.floor(Math.random() * b.length)];
        if (Math.random() < 0.075) {
            res += '-';
            if (Math.random() < 0.5) res += 'up'
            res += 'on-' + a[Math.floor(Math.random() * a.length)];
        }
        return res;

    }
}

