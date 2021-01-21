function initTabHex(){
    let tab = [];
    let indice = 0;
    for (let i=0; i<10; i++){
        let tabLigne = [];
        for (let j=0; j<16; j++){
            if (i===3){
                if (j>11){
                    j = 16;
                }
            }
            if (i===4){
                if (j>5){
                    j = 16;
                }
            }
            if (i===5){
                if (j>12){
                    j = 16;
                }
            }
            if (i===6){
                if (j>13){
                    j = 16;
                }
            }
            if (i===7){
                if (j>9){
                    j = 16;
                }
            }
            if (i===8){
                if (j>12){
                    j = 16;
                }
            }
            if (i===9){
                if (j>3){
                    j = 16;
                }
                else {
                    tabLigne.push(indice);
                    indice ++;
                }
            }
            else {
                tabLigne.push(indice);
                indice ++;
            }
        }
        tab.push(tabLigne);
    }
    return tab;
}
ID_TAB = initTabHex();
HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = '../img/hextiles.png';
RIVER_PATTERN = new Image();
RIVER_PATTERN.src = '../img/river.png';
CANVAS = document.getElementById('canvas-map')
CTX = CANVAS.getContext('2d');
CTX.textAlign = "center";
CITY_ID_TAB = [97,98,99,100,101,102,103,104,105];
PLAGE_ID_TAB = [61, 62];
HILL_DESERT_ID_TAB = [65, 66];
PLAINE_DESERTIQUE_ID_TAB = [16, 17, 18, 24, 26];
PLAINE_ID_TAB = [1, 2, 7];
PLAINE_ROCHEUSE_ID_TAB = [8, 9, 10, 11];
LAC_ID_TAB = [12, 68, 19];
NEIGE_ID_TAB = [48, 49, 51, 52, 54, 55, 56, 57];
NEIGE_ROCHER_ID_TAB = [56, 57, 82];
ROCHER_DESERTIQUE_MOINS_ID_TAB = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
FORET_ID_TAB = [3, 4, 5, 6];
FORET_PROFONDE_ID_TAB = [23, 25];
MONTAGNE_BASSE_ID_TAB = [93, 94, 82];
ROCHER_DESERTIQUE_ID_TAB = [63, 64, 67];
LAYOUT = new Layout(Layout.flat, new Point(16, 16), new Point(CANVAS.width / 2, CANVAS.height / 2));