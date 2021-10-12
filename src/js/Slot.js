import Reel from "./Reel.js";
import Symbol from "./Symbol.js";

export default class Slot {
  constructor(domElement, config = {}) {
    this.config = { inverted: false };
    this.spinCount = 0;
    this.step = "start"; //start, input birthday, input, input email
    this.message = $("#error_message").parent();
    this.nameError = "Please enter your name.";

    Object.assign(this.config, config);

    Symbol.preload();

    this.currentSymbols = [
      ["question", "question", "question"],
      ["question", "question", "question"],
      ["question", "question", "question"],
      ["question", "question", "question"],
      ["question", "question", "question"],
    ];

    this.nextSymbols = [
      ["death_star", "death_star", "death_star"],
      ["death_star", "death_star", "death_star"],
      ["death_star", "death_star", "death_star"],
      ["death_star", "death_star", "death_star"],
      ["death_star", "death_star", "death_star"],
    ];

    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName("reel")).map(
      (reelContainer, idx) =>
        new Reel(reelContainer, idx, this.currentSymbols[idx])
    );

    this.spinButton = document.getElementById("spin");
    this.spinButtonBirthday = document.getElementById("spinBirthday");
    this.spinButtonName = document.getElementById("spinName");

    this.fieldBirthday = document.getElementById("fieldBirthday");
    this.fieldName = document.getElementById("fieldName");
    this.fieldEmail = document.getElementById("fieldEmail");

    this.spinButton.addEventListener("click", () => this.spin());
    this.spinButtonBirthday.addEventListener("click", () => this.spin());
    this.spinButtonName.addEventListener("click", () => this.spin());

    this.autoPlayCheckbox = document.getElementById("autoplay");

    if (this.config.inverted) {
      this.container.classList.add("inverted");
    }
  }

  set award(s) {
    this.config.award = s;
  }

  spin() {
    switch (this.step) {
      case "input name":
        var name = $("input[name=firstname]").val();
        var letters = /^[A-Za-z]+$/;
        if (name == "" || !name.match(letters)) {
          document.getElementById("name").classList.add("wrong-border");
          this.message.show();
          document.getElementById("error_message").innerHTML = this.nameError;
          this.spinButton.disabled = false;
          break;
        } else {
          this.message.hide();
          console.log(name);
          console.log(this.step);
          this.step = "input email";
        }

      default:
        this.onSpinStart();
        this.currentSymbols = this.nextSymbols;
        this.nextSymbols = [
          [
            Symbol.random(),
            this.config.award || Symbol.random(),
            Symbol.random(),
          ],
          [
            Symbol.random(),
            this.config.award || Symbol.random(),
            Symbol.random(),
          ],
          [Symbol.random(), "star", Symbol.random()],
        ];

        return Promise.all(
          this.reels.map((reel) => {
            if (reel.idx == this.spinCount) {
              reel.renderSymbols(this.nextSymbols[reel.idx]);
              return reel.spin();
            }
          })
        ).then(() => this.onSpinEnd());
    }
  }

  onSpinStart() {
    this.spinButton.disabled = true;
  }

  onSpinEnd() {
    // this.spinButton.disabled = false;
    this.spinButton.style.display = "none";
    this.spinCount++;
    //console.log(this.spinCount);

    switch (this.step) {
      case "start":
        this.fieldBirthday.style.display = "block";
        this.step = "input birthday";
        break;

      case "input birthday":
        var birthday = $("input[name=birthday]").val();
        console.log(birthday);
        this.fieldName.style.display = "block";
        this.fieldBirthday.style.display = "none";
        this.step = "input name";
        break;

      case "input email":
        this.fieldEmail.style.display = "block";
        this.fieldName.style.display = "none";
    }
  }
}
