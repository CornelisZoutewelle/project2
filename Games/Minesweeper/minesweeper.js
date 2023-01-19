var veld = [];
var rows = 8;
var columns = 8;

var aantalMines = 5;
var locatieMines = [];

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function(){
    startGame();
}

// De function 'setMines' plaatst de mines op de tegels. //
function setMines(){
    //locatieMines.push("2-2");//
    //locatieMines.push("5-2");//
    //locatieMines.push("1-4");//
    //locatieMines.push("6-1");//
    //locatieMines.push("2-3");//

    // Hieronder volgt een 'random calculation' die er voor zorgen dat de mines elke keer ergens anders komen te liggen. //
    let minesLeft = aantalMines;
    while (minesLeft > 0){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!locatieMines.includes(id)){
            locatieMines.push(id);
            minesLeft -= 1;
        }
    }
}

// De function 'startGame' zorgt ervoor dat bij het laden van de pagina het speel veld wordt ingeladen.
function startGame(){
    document.getElementById("aantal-mines").innerText = aantalMines;
    document.getElementById("vlag-button").addEventListener("click", setVlag);
    document.getElementById("play-again").addEventListener("click", playAgain);
    setMines();

    for (let r = 0; r < rows; r++){
        let rows = [];
        for (let c = 0; c < columns; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("veld").append(tile);
            rows.push(tile);
        }
        veld.push(rows);
    }

    console.log(veld);
}

// De function 'setVlag' zorgt ervoor dat de knop om de vlag te plaatsen van aan naar uit gezet kan worden. (en andersom natuurlijk) //
function setVlag(){
    if(flagEnabled){
        flagEnabled = false;
        document.getElementById("vlag-button").style.backgroundColor = "lightgrey";
    }
    else{
        flagEnabled = true;
        document.getElementById("vlag-button").style.backgroundColor = "darkgrey";
    }
}

// De function 'clickTile' zorgt ervoor dat je de vlag daadwerkelijk kan plaatsen in een hokje. //
function clickTile(){
    // Deze 'if' statement zorgt ervoor dat je na dat alle vakken aan geklikt zijn je geen bommen meer af kan laten gaan.
    if (gameOver  || this.classList.contains("tile-clicked")){
        return;
    }

    let tile = this;
    if (flagEnabled){
        if (tile.innerText == ""){
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩"){
            tile.innerText = "";
        }
        return;
    }
    if (locatieMines.includes(tile.id)){
        alert("GAME OVER!");
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

// De function 'revealMines' zorgt ervoor dat als je hebt verloren je de mines te zien krijgt. //
function revealMines(){
    for (let r= 0; r < rows; r++){
        for (let c = 0; c < columns; c++){
            let tile = veld[r][c];
            if (locatieMines.includes(tile.id)){
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

// De function 'checkMine' kijkt als het waren of er een mine op de tegel ligt waar je hebt geklikt. //
// Door deze function verschijnen er ook nummers op het veld indien de tegel grenst aan een mine. //
// Deze function werkt ook samen met de function 'checkTile' hieronder. Als één van deze function weg valt, werkt het nummer systeem niet meer. //
function checkMine(r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }
    if (veld[r][c].classList.contains("tile-clicked")){
        return;
    }

    veld[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesGevonden = 0;
    // Bovenste drie tegels. //
    minesGevonden += checkTile(r-1, c-1); // Kijkt links bovenin. //
    minesGevonden += checkTile(r-1, c); // Kijkt bovenin. //
    minesGevonden += checkTile(r-1, c+1); // Kijkt rechts bovenin. //

    // Tegels links en recht van de aangewezen tegel. //
    minesGevonden += checkTile(r, c-1); // Kijkt links. //
    minesGevonden += checkTile(r, c+1); // Kijkt rechts. //

    // Drie tegels onder. //
    minesGevonden += checkTile(r+1, c-1); // Kijkt links onderin. //
    minesGevonden += checkTile(r+1, c); // Kijkt onderin. //
    minesGevonden += checkTile(r+1, c+1); // Kijkt rechts onderin. //

    if (minesGevonden > 0){
        veld[r][c].innerText = minesGevonden;
        veld[r][c].classList.add("x" + minesGevonden.toString());
    }
    else{
        // Bovenste drie tegels. //
        checkMine(r-1, c-1); // Kijkt links bovenin. //
        checkMine(r-1, c); // Kijkt bovenin. //
        checkMine(r-1, c+1); // Kijkt rechts bovenin. //

        // Tegels links en recht van de aangewezen tegel. //
        checkMine(r, c-1); // Kijkt links. //
        checkMine(r, c+1); // Kijkt rechts. //

        // Drie tegels onder. //
        checkMine(r+1, c-1); // Kijkt links onderin. //
        checkMine(r+1, c); // Kijkt onderin. //
        checkMine(r+1, c+1); // Kijkt rechts onderin. //
    }

    if (tilesClicked == rows * columns - aantalMines){
        document.getElementById("aantal-mines").innerText = "Cleared!";
        gameOver = true;
        revealMines();
    }

}

function checkTile(r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return 0;
    }
    if (locatieMines.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}

// De function 'playAgain' zorgt ervoor dat je het spel opnieuw kunt spelen. //
function playAgain(){
    window.location.reload(true);
}