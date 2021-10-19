import Reel from "./Reel.js";
import Symbol from "./Symbol.js";

export default class Slot {
  constructor(domElement, config = {}, spinButton, winner) {
    this.config = { inverted: false };
    this.winner = winner;
    console.log(this.winner);
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

    this.spinButton = spinButton;

    this.spinButtonBirthday = $("#spinBirthday")[0];
    this.spinButtonName = $("#spinName")[0];

    this.fieldBirthday = $("#fieldBirthday")[0];
    this.fieldName = $("#fieldName")[0];
    this.fieldEmail = $("#fieldEmail")[0];

    this.spinButton.addEventListener("click", () => this.spin());
    this.spinButtonBirthday.addEventListener("click", () => this.spin());
    this.spinButtonName.addEventListener("click", () => this.spin());

    // this.autoPlayCheckbox = document.getElementById("autoplay");

    if (this.config.inverted) {
      this.container.classList.add("inverted");
    }
    // if (this.winner) {
    // 	$( "#spins-left").html(-this.spinCount + 3 + " Spins left");
    // }
  }

  set award(s) {
    this.config.award = s;
  }

  spin() {
    if (!this.winner) {
      switch (this.step) {
        case "input name":
          var name = $("input[name=firstname]").val();
          var letters = /^[A-Za-z]+$/;
          if (name == "" || !name.match(letters)) {
            $("#name")[0].classList.add("wrong-border");
            this.message.show();
            $("#error_message")[0].innerHTML = this.nameError;
            this.spinButton.disabled = false;
            break;
          } else {
            this.message.hide();
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
    } else {
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
        [
          Symbol.random(),
          this.config.award || Symbol.random(),
          Symbol.random(),
        ],
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
    this.spinButton.disabled = false;
    if (!this.winner) {
      this.spinButton.style.display = "none";
    }
    this.spinCount++;
    console.log(this.spinCount);

    switch (this.step) {
      case "start":
        this.fieldBirthday.style.display = "block";
        this.step = "input birthday";
        break;

      case "input birthday":
        var birthday = $("input[name=birthday]").val();
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
