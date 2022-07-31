'use strict';

const textToType = [
    'Click on the area below to start the game.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tristique quam in nibh iaculis, vitae pulvinar quam consectetur. Sed fermentum efficitur commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce turpis felis, dapibus sit amet mattis eget, malesuada ac diam. Praesent ut sem nec leo fermentum mollis. Aliquam blandit dignissim nisl. Proin leo lectus, vestibulum sed velit ac, finibus placerat eros. Suspendisse lacinia, massa et venenatis tincidunt, neque nisi consectetur lacus, nec tempus dolor lectus in lectus. Donec bibendum aliquam leo, vel aliquam nunc luctus at.',
    'A journey of a thousand miles starts with a single step.',
    `Two roads diverged in a yellow wood,
    And sorry I could not travel both
    And be one traveler, long I stood
    And looked down one as far as I could
    To where it bent in the undergrowth;
    
    Then took the other, as just as fair,
    And having perhaps the better claim,
    Because it was grassy and wanted wear;
    Though as for that the passing there
    Had worn them really about the same,
    
    And both that morning equally lay
    In leaves no step had trodden black.
    Oh, I kept the first for another day!
    Yet knowing how way leads on to way,
    I doubted if I should ever come back.
    
    I shall be telling this with a sigh
    Somewhere ages and ages hence:
    Two roads diverged in a wood, and
    I took the one less traveled by,
    And that has made all the difference.`,
    "Raindrops the size of bullets thundered on the castle windows for days on end; the lake rose, the flower beds turned into muddy streams, and Hagrid's pumpkins swelled to the size of garden sheds. Oliver Wood's enthusiasm for regular training sessions, however, was not dampened, which was why Harry was to be found, late one stormy Saturday afternoon a few days before Halloween, returning to Gryffindor Tower, drenched to the skin and splattered with mud.",
];

const times = {
    FIVE_SECONDS: 5 * 1000,
    ONE_MINUTE: 1 * 60 * 1000,
    FIVE_MINUTES: 5 * 60 * 1000,
};

const diffChoices = {
    SENTENCE: 'sentence',
    PARAGRAPH: 'paragraph',
    POEM: 'poem',
    LOREM_IPSUM: 'lorem-ipsum',
};

const selectedTime = times.ONE_MINUTE;
let currentTime = selectedTime;   // This countsdown from selected duration

const textInput = document.getElementById('text-input');
textInput.addEventListener('click', startGame);

const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', resetGame);

const difficultySlt = document.getElementById('difficulty');
difficultySlt.addEventListener('input', selectDifficulty);

const infoFlex = document.getElementById('info-flex');
const textCard = document.querySelector('.text-card');
const textContainer = document.querySelector('.text-container');

const timeCard = document.querySelector('#time .info');
const errorCard = document.querySelector('#errors .info');
const accuracyCard = document.querySelector('#accuracy .info');

// CPM Node
const charsNode = document.createElement("div");
charsNode.setAttribute('id', 'cpm');
charsNode.setAttribute('class', "info-card info-bg shadow");

const charsTitle = document.createElement('h2');
charsTitle.setAttribute('class', "info-title");
charsTitle.innerText = "CPM";
charsNode.appendChild(charsTitle);

const charsInfo = document.createElement('div');
charsInfo.setAttribute('class', "info");
charsNode.appendChild(charsInfo);

// WPM Node
const wordsNode = document.createElement("div");
wordsNode.setAttribute('id', 'wpm');
wordsNode.setAttribute('class', "info-card info-bg shadow");

const wordsTitle = document.createElement('h2');
wordsTitle.setAttribute('class', "info-title");
wordsTitle.innerText = "WPM";
wordsNode.appendChild(wordsTitle);

const wordsInfo = document.createElement('div');
wordsInfo.setAttribute('class', "info");
wordsNode.appendChild(wordsInfo);

let intervalRef;
let text = textToType[2];
let words = 0;
let characters = 0;

function selectDifficulty(event) {
    const choice = event.target.value;
    textContainer.classList.remove('flex-row');

    switch(choice) {
        case diffChoices.SENTENCE:
            text = textToType[2];
            break;

        case diffChoices.POEM:
            text = textToType[3];
            textContainer.classList.add('flex-row');
            break;

        case diffChoices.PARAGRAPH:
            text = textToType[4]
            break;

        case diffChoices.LOREM_IPSUM:
            text = textToType[1];
            break;

        default:
            text = textToType[0];
    }
}

function startGame(event) {
    if (currentTime <= 0 || intervalRef)
        return;

    textCard.innerText = text;

    textInput.style.height = textCard.scrollHeight + 'px';
    textInput.style.width = textCard.scrollWidth + 'px';

    textInput.addEventListener('input', playGame);
    intervalRef = setInterval(countdownToZero, 1000);

    resetBtn.classList.remove('invisible');
}

function playGame(event) {
    const character = event.data;
    const value = event.target.value;
    const textLength = value.length;
    let textValue = textCard.innerText;
    let errors = 0;  
    let accuracy = 100;

    if (!value) {
        errors = 0;
    }

    if (!character)
        return;

    let htmlText = textValue.substring(0, textLength);

    const trimmedHTMLText = htmlText.trim();
    words = trimmedHTMLText.split(' ').length;
    characters = trimmedHTMLText.split('').length;

    htmlText = htmlText.split('');

    htmlText = htmlText.map((char, index) => {
        if (char.toLowerCase() !== value[index].toLowerCase()) {
            errors += 1;
            return `<span class='wrong'>${char}</span>`;
        }

        return `<span class='correct'>${char}</span>`;
    });

    accuracy = Math.round(((textLength - errors) / textValue.length) * 100);

    htmlText = htmlText.join("");
    textValue = htmlText + textValue.substring(textLength);

    textCard.innerHTML = textValue;
    errorCard.innerText = errors;
    accuracyCard.innerText = accuracy;
}

function countdownToZero() {
    currentTime -= 1000;
    let timeDisplay = Math.floor(currentTime / 1000);
    timeCard.innerText = timeDisplay;

    if (currentTime <= 0) {
        clearInterval(intervalRef);
        intervalRef = null;
        finishGame();
    }
}

function finishGame() {
    textCard.innerText = "Click on Reset to start a New Game";
    textInput.disabled = true;

    infoFlex.insertBefore(charsNode, infoFlex.firstChild);
    infoFlex.insertBefore(wordsNode, infoFlex.firstChild);

    const charsCard = document.querySelector("#cpm .info");
    charsCard.innerText = characters;

    const wordsCard = document.querySelector("#wpm .info");
    wordsCard.innerText = words;
}

function resetGame() {
    currentTime = selectedTime;
    textCard.innerText = textToType[0];
    errorCard.innerText = '0';
    accuracyCard.innerText = '100';
    timeCard.innerText = Math.floor(selectedTime / 1000);
    textInput.value = '';
    
    textInput.disabled = false;

    clearInterval(intervalRef);
    intervalRef = null;

    resetBtn.classList.add('invisible');
    infoFlex.removeChild(charsNode);
    infoFlex.removeChild(wordsNode);
}
