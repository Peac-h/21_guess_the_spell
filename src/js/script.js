import { spellBook } from "./data.js";

class Game {
  // DOM
  _spellContainerEl = document.getElementById("spellContainer");
  _hintEl = document.getElementById("hint");
  _wrongLettersEl = document.getElementById("wrongLetters");
  _leftAttemptsEl = document.getElementById("leftAttempts");
  _btnNewWord = document.querySelectorAll(".btn");
  _totalWinsEl = document.getElementById("totalWins");
  _totalLosesEl = document.getElementById("totalLoses");
  _message = document.querySelector(".message");
  _winningMsg = document.querySelector(".message--win");
  _losingMsg = document.querySelector(".message--lose");
  _correctSpell = document.getElementById("correctSpell");

  // Static
  _alphabet = Array.from(Array(26)).map((_, i) => i + 97);
  _validKeys = this._alphabet.map((x) => String.fromCharCode(x));

  // Manipulated
  spell = "";
  attempts = 0;
  wins = 0;
  loses = 0;
  incorrectLetters = [];
  correctLetters = [];

  constructor() {
    this._validKeys.push(" ");
    this._initializeGame();
  }

  _initializeGame() {
    this.wins = 0;
    this.loses = 0;
    this._totalWinsEl.textContent = this.wins;
    this._totalLosesEl.textContent = this.loses;

    this._newSpell();
    this._addEventListeners();
  }

  _addEventListeners() {
    document.addEventListener("keydown", (e) => this._checkTheLetter(e));

    this._btnNewWord.forEach((el) =>
      el.addEventListener("click", () => this._newSpell())
    );
  }

  _newSpell() {
    this.incorrectLetters = [];
    this.correctLetters = [];
    this.attempts = 5;
    this._leftAttemptsEl.textContent = this.attempts;
    this._wrongLettersEl.textContent = `let's see`;

    if (
      this._message.classList.contains("show") ||
      this._winningMsg.classList.contains("show") ||
      this._losingMsg.classList.contains("show")
    ) {
      this._message.classList.remove("show");
      this._winningMsg.classList.remove("show");
      this._losingMsg.classList.remove("show");
    }

    // selecting all span-s that should switch the bg color
    const allEls = [
      ...document.querySelectorAll(".active"),
      this._hintEl,
      this._totalWinsEl,
      this._totalLosesEl,
    ];
    // switching the bg color for 2 secs for a better UI
    this._timeoutToggleClass(allEls, "active", 2000);

    this._makeSpell();
  }

  _timeoutToggleClass(els, className, delay) {
    els.forEach((el) => el.classList.toggle(className));

    setTimeout(() => {
      els.forEach((el) => el.classList.toggle(className));
    }, delay);
  }

  _makeSpell() {
    const randomSpell = spellBook[Math.floor(Math.random() * spellBook.length)];
    const spellHint = randomSpell.effect;
    let spellHtml = "";
    this.spell = randomSpell.name.toLowerCase();

    for (let i = 1; i <= this.spell.length; i++)
      spellHtml += `<div class="letter"></div>`;

    this._spellContainerEl.innerHTML = spellHtml;
    this._hintEl.textContent = spellHint;
  }

  _checkTheLetter(e) {
    if (!this._validKeys.includes(e.key)) return;
    if (this.attempts === 0) return; // check
    if (this.correctLetters.length === this.spell.length) return; //check

    const enteredLetter = e.key;

    if (this.spell.includes(enteredLetter)) {
      this._displayCorrectLetter(enteredLetter);
    } else {
      this._handleIncorrectLetter(enteredLetter);
    }

    this._checkWinOrLose();
  }

  _displayCorrectLetter(enteredLetter) {
    if (this.correctLetters.includes(enteredLetter)) return;

    for (let i = 0; i < this.spell.length; i++) {
      if (this.spell[i] === enteredLetter) {
        const letterEl = this._spellContainerEl.querySelectorAll(".letter")[i];
        letterEl.textContent = enteredLetter.toUpperCase();

        this.correctLetters.push(enteredLetter);
        letterEl.classList.add("guessed");
      }
    }
  }

  _handleIncorrectLetter(enteredLetter) {
    if (this.incorrectLetters.includes(` ${enteredLetter}`)) return;

    if (enteredLetter === " ") {
      if (this.incorrectLetters.includes(" space")) return;
      this.incorrectLetters.push(" space");
    } else {
      if (this.attempts > 0) this.incorrectLetters.push(` ${enteredLetter}`);
    }

    this._wrongLettersEl.textContent = this.incorrectLetters.join(",");

    if (this.attempts > 0) this.attempts--;
    this._leftAttemptsEl.textContent = this.attempts;

    // selecting all span-s that should switch the bg color
    const allEls = [
      ...document.querySelectorAll(".left-attempts span"),
      ...document.querySelectorAll(".wrong-letters span"),
    ];
    // switching the bg color for a sec for a better UI
    this._timeoutToggleClass(allEls, "active", 1000);
  }

  _checkWinOrLose() {
    if (this.correctLetters.length === this.spell.length) {
      this._handleWin();
    } else if (this.attempts < 1) {
      this._handleLose();
    }
  }

  _handleWin() {
    this.wins++;
    this._totalWinsEl.textContent = this.wins;
    setTimeout(() => {
      this._message.classList.add("show");
      // check
      this._message.addEventListener("click", () =>
        this._message.classList.remove("show")
      );
      this._winningMsg.classList.add("show");
    }, 500);
  }

  _handleLose() {
    this.loses++;
    this._totalLosesEl.textContent = this.loses;
    this._message.classList.add("show");
    // check
    this._message.addEventListener("click", () =>
      this._message.classList.remove("show")
    );
    this._losingMsg.classList.add("show");
    this._correctSpell.textContent = this.spell.toUpperCase();
  }
}

const startGame = new Game();
