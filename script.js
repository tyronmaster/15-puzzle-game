// create element with classlist and append it to parent
function drawElement(elementParent, elementType, elementClasslist){
    let elementName = document.createElement(elementType);

    elementClasslist = elementClasslist.split(" ");
    for(let i = 0; i < elementClasslist.length; i++){
        // console.log(elementClasslist[i]);
        elementName.classList.add(`${elementClasslist[i]}`);
    }

    // console.log(elementParent);
    try {
        const parent = document.querySelector(elementParent) || document.querySelector(`.${elementParent}`);
        parent.append(elementName);
    } catch {
        elementParent.append(elementName);
    }

    // console.log(parent);
    // console.log(elementParent);

    return elementName;
}

wrapper = drawElement("body", "div", "wrapper active");
header = drawElement("wrapper", "header", "header");
title = drawElement("header", "div", "puzzle__title active");
title.innerHTML = `<h1 class="puzzle__header">15 Puzzle Game</h1>
                    <span class="tooltip">press background to PLAY sound</span>`;

controls = drawElement("header", "div", "puzzle__controls");
startButton = drawElement(controls, "div", "button button__start");
startButton.textContent = "start";
restartButton = drawElement(controls, "div", "button button__restart");
restartButton.textContent = "restart";

main = drawElement(wrapper, "main", "puzzle__container");

footer = drawElement("wrapper", "footer", "footer container");
footer.innerHTML = `<a class="github__link" href="https://github.com/tyronmaster?tab=repositories">github</a>
                    <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <a class="rsschool__link" href="https://rs.school/">rs.school 2022 ©</a>`;


// SOUND SECTION
var sound = new Audio("./assets/sound/sound-01.mp3");

function startSound(sound) {
    sound.play();
    sound.volume = 0.25;
    sound.loop = true;
};

wrapper.addEventListener("click", () => {
    startSound(sound);
    title.innerHTML = `<h1 class="puzzle__header">15 Puzzle Game</h1>
    <span class="tooltip">press title to MUTE / UNMUTE sound</span>`;
    // wrapper.removeEventListener("click", );
});

title.addEventListener("click", () => {
    if(sound.muted){
        sound.muted = false;
        // title.innerHTML = `<h1 class="puzzle__header">15 Puzzle Game</h1>
        //             <span class="tooltip">press title to MUTE sound</span>`;

    } else {
        sound.muted = true;
        // title.innerHTML = `<h1 class="puzzle__header">15 Puzzle Game</h1>
        //             <span class="tooltip">press title to UNMUTE sound</span>`;
    }
});


// CREATE GAME FIELD

// create random list
function CreateShuffledList(itemsCount) {
    let randomArray = [];
    for (let i = 0; i < itemsCount; i++) {
        randomArray.push(i);
    }
    FisherYets(randomArray);
    return randomArray;
}

// fisher-yets algorithm to shuffle array
function FisherYets(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
}


// draw puzzles
let fieldSize = 4;
let puzzlesCount = Math.pow(fieldSize, 2);
let puzzlesArray = [];
let puzzleOrder = [];
let emptyPuzzle = puzzlesCount - 1;

function drawPuzzlesField(puzzlesCount){
    main.innerHTML = '';
    puzzleOrder = CreateShuffledList(puzzlesCount);

    for(let i = 0; i < puzzlesCount; i++){
        puzzlesArray[i] = drawElement(main, "div", "puzzle__item");
        puzzlesArray[i].textContent = i === 15 ? '': i + 1;
        puzzlesArray[i].style.order = puzzleOrder[i];

        if(i === 15) {
            emptyPuzzle = puzzleOrder[i];
        }
    }
    return emptyPuzzle;
}

window.onload = drawPuzzlesField(puzzlesCount);
restartButton.addEventListener("click", () => {
    drawPuzzlesField(puzzlesCount);
    // console.log(drawPuzzlesField(puzzlesCount));
})
// console.log(CreateShuffledList(16));