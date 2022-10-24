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
});


// CREATE GAME FIELD
class Puzzle{
    constructor(fieldSize){
        this.fieldSize = fieldSize;
        this.puzzlesCount = Math.pow(fieldSize, 2);
        this.puzzlesArray = [];
        this.puzzleOrder = [];
        this.moves = 0;

    }

    drawStartPuzzlesField(){
        main.innerHTML = '';
        let arr = [];
        for(let i = 0; i < this.puzzlesCount; i++){
            arr[i] = drawElement(main, "div", "puzzle__item");
            arr[i].textContent = i === 15 ? '': i + 1;
        }
    }

    drawPuzzlesField(){
        this.time = Date.now();
        main.innerHTML = '';
        this.puzzleOrder = this.CreateShuffledList(this.puzzlesCount);

        // test if puzzle has solving and suffle again if not
        while(this.hasSolving(this.puzzleOrder) == false){
            this.puzzleOrder = this.CreateShuffledList(this.puzzlesCount);
        }

        // generate field
        for(let i = 0; i < this.puzzlesCount; i++){
            this.puzzlesArray[i] = drawElement(main, "div", "puzzle__item");
            this.puzzlesArray[i].textContent = i === 15 ? '': i + 1;
            this.puzzlesArray[i].style.order = this.puzzleOrder[i] + 1;
        }
        this.puzzlesArray.forEach((item) => {
            item.addEventListener("click", (e) => {
                this.gameLogic(e.currentTarget);
                this.isSolved();
            });
        });
    }

    hasSolving(){
        let sum = 0;
        let testedArr = new Array(this.puzzlesCount);

        for(let i = 0; i < this.puzzlesCount; i++){
            testedArr[Number(this.puzzleOrder[i])] = i + 1;
        }

        for(let i = 0; i < this.puzzlesCount - 1; i++){
            if(testedArr[i] != 16){
                for(let j = i+1; j < this.puzzlesCount; j++) {
                    if(testedArr[i] > testedArr[j]){
                        sum++;
                    }
                }
            } else {
                sum += Math.ceil((i + 1) / this.fieldSize);
        }
    }
        return sum % 2 === 0 ? true : false;
    }

    isSolved(){
        for(let i = 0; i < this.puzzlesCount; i++){
            if(i !== Number(this.puzzlesArray[i].style.order - 1)){
                return false;
            }
        }
        main.innerHTML = 'CONGRATS!';
        main.innerHTML += `game finished in ${this.moves} moves`;
        const endTime = Date.now();
        this.time = endTime - this.time;
        console.log(this.time);
    }

    gameLogic(target){ // send e.currentTarget.style.order to target
        let emptyOrder = Number(this.puzzlesArray[this.puzzlesCount - 1].style.order);
        let targetOrder = Number(target.style.order);
        let targetRow = Math.ceil(targetOrder / this.fieldSize);
        let targetColumn = targetOrder % this.fieldSize || 4;
        let emptyRow = Math.ceil(emptyOrder / this.fieldSize);
        let emptyColumn = emptyOrder % this.fieldSize || 4;
        let option1 = (targetRow == emptyRow) && ((targetColumn == emptyColumn - 1) || (targetColumn == emptyColumn + 1));
        let option2 = (targetColumn == emptyColumn) && ((targetRow == emptyRow - 1) || (targetRow == emptyRow + 1));
        if(option1 || option2){
            this.sound("./assets/sound/sound-02.mp3");
            let t = target.style.order;
            target.style.order = emptyOrder;
            this.puzzlesArray[this.puzzlesCount - 1].style.order = t;
            this.moves++;
        } else {
            this.sound("./assets/sound/sound-03.mp3");
        }
    }

    sound(src){
        let sound = new Audio(src);
        sound.autoplay = false;
        sound.volume = 0.25;
        sound.loop = false;
        sound.play();
    }

    // create random list
    CreateShuffledList(itemsCount) {
    let randomArray = [];
    for (let i = 0; i < itemsCount; i++) {
        randomArray.push(i);
    }
    this.FisherYets(randomArray);
    return randomArray;
    }

    // fisher-yets algorithm to shuffle array
    FisherYets(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
    }
}

let puzzle = new Puzzle(4);
puzzle.drawStartPuzzlesField();

startButton.addEventListener("click", (e) => {
    puzzle.drawPuzzlesField();
    e.currentTarget.classList.remove("active");
    restartButton.classList.add("active");
});
restartButton.addEventListener("click", () => {
    puzzle.drawPuzzlesField()
});