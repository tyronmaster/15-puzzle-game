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
startButton = drawElement(controls, "div", "button button__start active");
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
sound.autoplay = false;
sound.volume = 0.25;
sound.loop = true;

function startSound() {
    sound.play();
    title.innerHTML = `<h1 class="puzzle__header">15 Puzzle Game</h1>
    <span class="tooltip">press title to MUTE / UNMUTE sound</span>`;
    wrapper.removeEventListener("click", startSound);
};

wrapper.addEventListener("click", startSound);

title.addEventListener("click", () => {
    if(sound.paused){
        sound.play();
        title.innerHTML = `<h1 class="puzzle__header">15 Puzzle Game</h1>
        <span class="tooltip">press title to turn sound OFF</span>`;

    } else {
        sound.pause();
        title.innerHTML = `<h1 class="puzzle__header">15 Puzzle Game</h1>
        <span class="tooltip">press title to turn sound ON</span>`;
    }
})


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

    // test if puzzle has solving and suffle again if not
    while(hasSolving(puzzleOrder) === false){
        puzzleOrder = CreateShuffledList(puzzlesCount);
    }

    // generate field
    for(let i = 0; i < puzzlesCount; i++){
        puzzlesArray[i] = drawElement(main, "div", "puzzle__item");
        puzzlesArray[i].addEventListener("click", (e) => {
            console.log(e.currentTarget);
            gameLogic(fieldSize, puzzleOrder, emptyPuzzle, e.currentTarget.style.order);
        })
        puzzlesArray[i].textContent = i === 15 ? '': i + 1;
        puzzlesArray[i].style.order = puzzleOrder[i] + 1;

        if(i === 15) {
            emptyPuzzle = puzzleOrder[i] + 1;
        }
    }
    return emptyPuzzle;
}

function hasSolving(puzzleArray){
    let sum = 0;
    let testedArr = [...puzzleArray];
    for(let i = 0; i < puzzleArray.length; i++){
        testedArr[Number(puzzleArray[i])] = i + 1;
        // console.log(testedArr[i]);
    }
    // console.log(testedArr);

    for(let i = 0; i < testedArr.length; i++){
        if(testedArr[i] != 16){
            for(let j = i; j < testedArr.length; j++) {
                if(testedArr[i] < testedArr[j]){
                    sum++;
                }
            }
        } else {
            sum += Math.ceil((i + 1) / fieldSize);
    // console.log(Math.ceil((i + 1) / fieldSize));

        }
    }
    // console.log(sum)
    return sum % 2 === 0 ? true : false;
}

function drawStartPuzzlesField(puzzlesCount){
    main.innerHTML = '';
    for(let i = 0; i < puzzlesCount; i++){
        puzzlesArray[i] = drawElement(main, "div", "puzzle__item");
        puzzlesArray[i].textContent = i === 15 ? '': i + 1;
    }
}

function gameLogic(size, order, empty, target){ // send e.currentTarget.style.order to target
    let targetRow = Math.ceil(target / size);
    let targetColumn = target % size;
    let emptyRow = Math.ceil(empty / size);
    let emptyColumn = empty % size;
    console.log("target:", targetRow, " ", targetColumn);
    console.log("empty:", emptyRow, " ", emptyColumn);
}

window.onload = drawStartPuzzlesField(puzzlesCount);
startButton.addEventListener("click", (e) => {
    drawPuzzlesField(puzzlesCount);
    e.currentTarget.classList.remove("active");
    restartButton.classList.add("active");
});
restartButton.addEventListener("click", () => {
    emptyPuzzle = drawPuzzlesField(puzzlesCount);

    console.log(puzzleOrder);

    console.log(emptyPuzzle);
    // console.log(drawPuzzlesField(puzzlesCount));
});
// console.log(puzzlesArray);
// console.log(puzzleOrder);
// console.log(hasSolving(puzzleOrder));
// console.log(emptyPuzzle);