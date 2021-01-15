class Hex {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    }

    //Find return undefined quand il ne trouve pas la valeur
    getCoord() {
        let found;
        let coordX;
        let coordY;
        for (let i = 0; i < 10; i++) {
            found = ID_TAB[i].find(element => element === this.id);
            if (found !== undefined) {
                coordY = i;
                coordX = this.id - i * 16;
            }
        }
        return [coordX, coordY];
    }

    printHex() {
        let coord = this.getCoord(this.id);
        CTX.drawImage(HEXTILES_IMAGE, coord[0] * 32, coord[1] * 48, 32, 48, this.x, this.y, 32, 48);
    }

}

