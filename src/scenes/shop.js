import Phaser from "phaser";

import DialogueManager from "../systems/dialogueManager.js";
import BoxManager from "../systems/boxManager.js";
import gameState from "../systems/gamestate.js";

import { box1Data } from "../data/box1Dialogue.js";
import { box2Data } from "../data/box2Dialogue.js";

export default class Shop extends Phaser.Scene {
  constructor() {
    super("Shop");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish02/Hintergrund.png");
    this.load.image("shop_bg2", "assets/Fish02/Vorderhintergrund.png");
    this.load.image("cutting", "assets/Fish/Cuttingboard.png");
    this.load.image("customer", "assets/Fish02/TaucherBoxOffen.png");
    this.load.image("tisch", "assets/Fish/Tisch.png");
    this.load.image("knive", "assets/Fish/knive.png");
    this.load.image("fish", "assets/Fish02/Fisch.png");
    this.load.image("board", "assets/Fish02/Schnittbrett.png");
    this.load.image("parasite", "assets/Fish02/parasite.png");
    this.load.image("miniwal", "assets/Fish02/MiniWal.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "shop_bg").setDisplaySize(width, height);
    this.add.image(width / 2, height / 2, "shop_bg2").setDisplaySize(width, height);

    this.add.image(width / 2, height / 1, "tisch").setScale(1.2);
    this.add.image(width / 2, height / 1.1, "cutting").setScale(0.7);
    this.add.image(width / 1.5, height / 1.1, "knive").setScale(0.15);

    this.coworker = this.add.image(width / 2, height / 1.8, "customer").setScale(0.6);

    this.dialogueManager = new DialogueManager(this);
    this.boxManager = new BoxManager(this);

    this.totalFish = 4;
    this.currentFish = 0;
    this.cutResults = [];
    this.choiceButtons = [];

    this.cutLine = null;
    this.cutLineDirection = 1;
    this.cutLineSpeed = 12;
    this.canStopLine = false;
    this.cutInputReady = false;

    this.input.on("pointerdown", () => {
      if (!this.canStopLine) return;
      if (!this.cutInputReady) return;

      this.stopLineAndCut();
    });

    gameState.reset();
    this.boxManager.startBox("box1", box1Data);
  }

  update() {
    if (!this.cutLine || !this.fish) return;

    const bounds = this.fish.getBounds();

    this.cutLine.x += this.cutLineSpeed * this.cutLineDirection;

    if (this.cutLine.x >= bounds.right) {
      this.cutLine.x = bounds.right;
      this.cutLineDirection = -1;
    }

    if (this.cutLine.x <= bounds.left) {
      this.cutLine.x = bounds.left;
      this.cutLineDirection = 1;
    }
  }

  enableCoworkerInteraction() {
    if (!this.coworker) return;

    this.coworker.setInteractive({ useHandCursor: true });

    this.coworker.once("pointerdown", () => {
      this.coworker.disableInteractive();
      this.startCuttingPhase();
    });
  }

  startCuttingPhase() {
    const { width, height } = this.scale;

    this.overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    ).setDepth(100);

    this.boardImg = this.add.image(
      width / 2,
      height / 2,
      "board"
    )
      .setDepth(101)
      .setScale(0.7);

    this.spawnFish(false);
    this.startFishDialogue();
  }

  spawnFish(showLine = true) {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();

    this.canStopLine = false;
    this.cutInputReady = false;

    this.fish = this.add.image(
      width / 2,
      height / 2,
      "fish"
    ).setDepth(102);

    if (showLine) {
      this.createMovingCutLine();
    }
  }

  startFishDialogue() {
    const node = this.currentBox.fishDialogue[0];

    this.dialogueManager.startDialogue(
      [{ text: node.text }],
      () => {
        this.showChoices(node.choices, (choice) => {
          gameState.saveFishChoice(this.currentBoxId, choice.id);

          const startCutting = () => {
            this.createMovingCutLine();
            this.enableLineClick();
          };

          if (choice.nextText) {
            this.dialogueManager.startDialogue(
              [{ text: choice.nextText }],
              startCutting
            );
          } else {
            startCutting();
          }
        });
      }
    );
  }

  createMovingCutLine() {
    if (!this.fish) return;

    const bounds = this.fish.getBounds();

    this.cutLine = this.add.rectangle(
      bounds.left,
      this.fish.y,
      5,
      this.fish.displayHeight + 90,
      0xffffff,
      0.95
    ).setDepth(130);

    this.cutLineDirection = 1;
    this.cutLineSpeed = 12;
  }

 enableLineClick() {
  this.canStopLine = true;
  this.cutInputReady = false;

  this.time.delayedCall(150, () => {
    this.cutInputReady = true;
  });
}

  stopLineAndCut() {
    if (!this.canStopLine) return;
    if (!this.cutInputReady) return;
    if (!this.cutLine || !this.fish) return;

    this.canStopLine = false;
    this.cutInputReady = false;

    const bounds = this.fish.getBounds();

    const localX = Phaser.Math.Clamp(
      this.cutLine.x - bounds.left,
      0,
      this.fish.displayWidth
    );

    const percent = Math.round(
      (localX / this.fish.displayWidth) * 100
    );

    this.cutResults.push(percent);
    gameState.saveCut(this.currentBoxId, percent);

    this.cutLine.destroy();
    this.cutLine = null;

    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;

    const leftHalf = this.add.image(x, y, "fish")
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(0, 0, localX, h);

    const rightHalf = this.add.image(x, y, "fish")
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(localX, 0, w - localX, h);

    this.fish.destroy();

    const diff = Math.abs(percent - 50);
    const feedbackColor = diff <= 2 ? "#2ecc71" : "#ff4444";

    const percentText = this.add.text(
      x,
      y - 150,
      `${percent}%`,
      {
        fontSize: "60px",
        color: feedbackColor,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 6
      }
    )
      .setOrigin(0.5)
      .setDepth(300);

    this.tweens.add({
      targets: leftHalf,
      x: x - 250,
      alpha: 0,
      duration: 400
    });

    this.tweens.add({
      targets: rightHalf,
      x: x + 250,
      alpha: 0,
      duration: 400
    });

    this.time.delayedCall(600, () => {
      leftHalf.destroy();
      rightHalf.destroy();
      percentText.destroy();

      this.nextFish();
    });
  }

  nextFish() {
    this.currentFish++;

    if (this.currentFish < this.totalFish) {
      this.spawnFish(true);
      this.enableLineClick();
    } else {
      this.finishBox();
    }
  }

  showChoices(choices, callback, timeoutCallback = null, timeoutMs = null) {
    const { width, height } = this.scale;

    const spacing = 250;
    const baseY = height / 1.1;
    const totalWidth = (choices.length - 1) * spacing;
    const startX = width / 2 - totalWidth / 2;

    let choiceMade = false;
    let timeoutEvent = null;

    const clearChoices = () => {
      this.choiceButtons.forEach((button) => button.destroy());
      this.choiceButtons = [];

      if (timeoutEvent) {
        timeoutEvent.remove(false);
        timeoutEvent = null;
      }
    };

    if (timeoutCallback && timeoutMs) {
      timeoutEvent = this.time.delayedCall(timeoutMs, () => {
        if (choiceMade) return;

        choiceMade = true;
        clearChoices();
        timeoutCallback();
      });
    }

    choices.forEach((choice, index) => {
      const xPos = startX + index * spacing;

      const btn = this.add.text(xPos, baseY, choice.text, {
        fontSize: "20px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        padding: { x: 15, y: 10 },
        align: "center",
        wordWrap: { width: 200 }
      })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setDepth(600);

      btn.on("pointerdown", () => {
        if (choiceMade) return;

        choiceMade = true;
        clearChoices();
        callback(choice);
      });

      this.choiceButtons.push(btn);

      btn.setAlpha(0);

      this.tweens.add({
        targets: btn,
        alpha: 1,
        duration: 500,
        ease: "Power2"
      });
    });
  }

  finishBox() {
    if (this.overlay) this.overlay.destroy();
    if (this.boardImg) this.boardImg.destroy();
    if (this.cutLine) this.cutLine.destroy();

    this.canStopLine = false;
    this.cutInputReady = false;

    const perfect = gameState.isPerfectBox(this.currentBoxId);

    if (perfect) {
      this.dialogueManager.startDialogue(
        this.currentBox.successDialogue,
        () => {
          this.startNextStep();
        }
      );
    } else {
      this.startParasiteEncounter();
    }
  }

  startParasiteEncounter() {
    const { width, height } = this.scale;

    gameState.setParasiteInteraction(this.currentBoxId, true);

    this.parasite = this.add.image(
      width / 2,
      height / 2,
      "parasite"
    )
      .setDepth(400)
      .setScale(3.5);

    const parasiteIntro = this.currentBox.parasiteDialogue[0];
    const parasiteNode = this.currentBox.parasiteDialogue[1];

    this.dialogueManager.startDialogue(
      [{ text: parasiteIntro.text }],
      () => {
        this.dialogueManager.startDialogue(
          [{ text: parasiteNode.text }],
          () => {
            this.showChoices(
              parasiteNode.choices,

              (choice) => {
                gameState.saveParasiteChoice(this.currentBoxId, choice.id);

                if (choice.nextText) {
                  this.dialogueManager.startDialogue(
                    [{ text: choice.nextText }],
                    () => {
                      if (this.parasite) {
                        this.parasite.destroy();
                        this.parasite = null;
                      }

                      this.startNextStep();
                    }
                  );
                } else {
                  if (this.parasite) {
                    this.parasite.destroy();
                    this.parasite = null;
                  }

                  this.startNextStep();
                }
              },

              () => {
                gameState.saveParasiteChoice(this.currentBoxId, "ignored");

                if (this.parasite) {
                  this.parasite.destroy();
                  this.parasite = null;
                }

                if (this.coworker) {
                  this.coworker.destroy();
                  this.coworker = null;
                }

                this.coworker = this.add.image(
                  width * 0.8,
                  0,
                  "miniwal"
                )
                  .setScale(0.4)
                  .setDepth(50)
                  .setOrigin(1, 0);

                this.dialogueManager.startDialogue(
                  [parasiteNode.ignoreDialogue[0]],
                  () => {
                    this.startNextStep();
                  }
                );
              },

              4000
            );
          }
        );
      }
    );
  }

  startNextStep() {
    const { width, height } = this.scale;

    if (this.parasite) {
      this.parasite.destroy();
      this.parasite = null;
    }

    if (this.coworker) {
      this.coworker.destroy();
      this.coworker = null;
    }

    this.coworker = this.add.image(
      width / 2,
      height / 1.8,
      "customer"
    )
      .setScale(0.6)
      .setDepth(50);

    if (this.currentBoxId === "box1") {
      this.boxManager.startBox("box2", box2Data);
    } else if (this.currentBoxId === "box2") {
      this.startFinalPath();
    }
  }

  startFinalPath() {
  const ending = gameState.getEnding();

  this.scene.start("Ending", {
    ending: ending
  });
}
}