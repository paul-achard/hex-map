function initTabHex(){
    let tab = [];
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
                    tabLigne.push(i*16+j);
                }
            }
            else {
                tabLigne.push(i*16+j);
            }
        }
        tab.push(tabLigne);
    }
    return tab;
}
ID_TAB = initTabHex();
console.log(ID_TAB);
HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = '../img/hextiles.png';
CANVAS = document.getElementById('canvas-map')
CTX = CANVAS.getContext('2d');
CITY_ID_TAB = [97,98,99,100,101,102,103,104,105];