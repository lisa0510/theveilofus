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
    this.feedbackBubbles = [];

    gameState.reset();

    this.boxManager.startBox("box1", box1Data);
  }

  enableCoworkerInteraction() {
    this.coworker.setInteractive({ useHandCursor: true });

    this.coworker.once("pointerdown", () => {
      this.coworker.disableInteractive();
      this.startCuttingPhase();
    });
  }

  startCuttingPhase() {
    const { width, height } = this.scale;

    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);

    this.boardImg = this.add.image(width / 2, height / 2, "board")
      .setDepth(101)
      .setScale(0.7);

    this.spawnFish(false);
    this.startFishDialogue();
  }

  startFishDialogue() {
    const node = this.currentBox.fishDialogue[0];

    this.dialogueManager.startDialogue([{ text: node.text }], () => {
      this.showChoices(node.choices, (choice) => {
        gameState.saveFishChoice(this.currentBoxId, choice.id);

        if (choice.nextText) {
          this.dialogueManager.startDialogue([{ text: choice.nextText }], () => {
            this.activateCuttingLogic();
          });
        } else {
          this.activateCuttingLogic();
        }
      });
    });
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

  spawnFish(activateLogic = true) {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();
    if (this.swipeGraphics) this.swipeGraphics.destroy();

    this.fish = this.add.image(width / 2, height / 2, "fish").setDepth(102);
    this.swipeGraphics = this.add.graphics().setDepth(110);

    if (activateLogic) {
      this.activateCuttingLogic();
    }
  }

  activateCuttingLogic() {
    let startPoint = null;

    this.input.once("pointerdown", (pointer, gameObjects) => {
      if (gameObjects.length > 0) {
        this.activateCuttingLogic();
        return;
      }

      startPoint = {
        x: pointer.x,
        y: pointer.y
      };

      const drawSwipe = (movePointer) => {
        if (movePointer.isDown && startPoint) {
          this.swipeGraphics.clear();
          this.swipeGraphics.lineStyle(5, 0xffffff, 1);
          this.swipeGraphics.lineBetween(
            startPoint.x,
            startPoint.y,
            movePointer.x,
            movePointer.y
          );
        }
      };

      this.input.on("pointermove", drawSwipe);

      this.input.once("pointerup", (pointerUp) => {
        this.swipeGraphics.clear();
        this.input.off("pointermove", drawSwipe);

        this.handleSlice(startPoint, {
          x: pointerUp.x,
          y: pointerUp.y
        });
      });
    });
  }

  handleSlice(start, end) {
    const bounds = this.fish.getBounds();

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);

    if (distance < 120) {
      this.showCutError("Zu kurz!");
      this.activateCuttingLogic();
      return;
    }

    const verticalEnough = Math.abs(dy) > Math.abs(dx) * 2;

    if (!verticalEnough) {
      this.showCutError("Nur vertikal schneiden!");
      this.activateCuttingLogic();
      return;
    }

    const line = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);
    const hitFish = Phaser.Geom.Intersects.LineToRectangle(line, bounds);

    if (!hitFish) {
      this.showCutError("Daneben!");
      this.activateCuttingLogic();
      return;
    }

    const cutX = (start.x + end.x) / 2;
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;

    const localX = Phaser.Math.Clamp(cutX - fishLeft, 0, this.fish.displayWidth);
    const percent = Math.round((localX / this.fish.displayWidth) * 100);

    this.cutResults.push(percent);
    gameState.saveCut(this.currentBoxId, percent);

    this.animateSlice(localX, percent);
  }

  showCutError(message = "") {
    const { width, height } = this.scale;

    const errorText = this.add.text(width / 2, height * 0.25, message, {
      fontSize: "30px",
      color: "#ff4444",
      fontStyle: "bold"
    })
      .setOrigin(0.5)
      .setDepth(800);

    errorText.setAlpha(0);

    this.tweens.add({
      targets: errorText,
      alpha: 1,
      duration: 150,
      yoyo: true,
      hold: 500,
      onComplete: () => {
        errorText.destroy();
      }
    });
  }

  animateSlice(localX, percent) {
    const {
      x,
      y,
      displayWidth: w,
      displayHeight: h
    } = this.fish;

    const leftHalf = this.add.image(x, y, "fish")
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(0, 0, localX, h);

    const rightHalf = this.add.image(x, y, "fish")
      .setDepth(103)
      .setDisplaySize(w, h)
      .setCrop(localX, 0, w - localX, h);

    this.fish.destroy();

    this.createFeedbackBubble(percent);

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

    this.time.delayedCall(500, () => {
      leftHalf.destroy();
      rightHalf.destroy();

      this.nextFish();
    });
  }

  createFeedbackBubble(percent) {
    const { width, height } = this.scale;

    let label = "Schlecht";
    let color = 0x8b1a1a;

    if (percent === 50) {
      label = "Perfect";
      color = 0x2ecc71;
    } else if (percent >= 45 && percent <= 55) {
      label = "OK";
      color = 0xf1c40f;
    }

    const bubbleRadius = 120;
    const bubbleSize = bubbleRadius * 2;

    const x = width * 0.32 + this.feedbackBubbles.length * 140;
    const y = height * 0.48;

    const bubble = this.add.container(x, y).setDepth(700);

    const circle = this.add.circle(0, 0, bubbleRadius, color, 0.85);

    const text = this.add.text(0, 0, label, {
      fontSize: "26px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5);

    bubble.add([circle, text]);
    bubble.setSize(bubbleSize, bubbleSize);

    bubble.setInteractive(
      new Phaser.Geom.Circle(bubbleRadius, bubbleRadius, bubbleRadius),
      Phaser.Geom.Circle.Contains
    );

    this.input.setDraggable(bubble);

    bubble.on("drag", (pointer, dragX, dragY) => {
      bubble.x = dragX;
      bubble.y = dragY;
    });

    bubble.setScale(0);

    this.tweens.add({
      targets: bubble,
      scale: 1,
      duration: 300,
      ease: "Back.Out",
      onComplete: () => {
        this.tweens.add({
          targets: bubble,
          y: bubble.y - Phaser.Math.Between(30, 340),
          duration: Phaser.Math.Between(4000, 7000),
          ease: "Sine.Out"
        });

        this.tweens.add({
          targets: bubble,
          x: bubble.x + Phaser.Math.Between(-50, 70),
          duration: Phaser.Math.Between(1200, 2000),
          ease: "Sine.InOut",
          yoyo: true,
          repeat: -1
        });

        this.tweens.add({
          targets: bubble,
          scale: 1.05,
          duration: 1200,
          ease: "Sine.InOut",
          yoyo: true,
          repeat: -1
        });
      }
    });

    this.feedbackBubbles.push(bubble);
  }

  clearFeedbackBubbles() {
    this.feedbackBubbles.forEach((bubble) => {
      bubble.destroy();
    });

    this.feedbackBubbles = [];
  }

  nextFish() {
    this.currentFish++;

    if (this.currentFish < this.totalFish) {
      this.spawnFish(true);
    } else {
      this.finishBox();
    }
  }

  finishBox() {
    if (this.overlay) this.overlay.destroy();
    if (this.boardImg) this.boardImg.destroy();
    if (this.swipeGraphics) this.swipeGraphics.destroy();

    this.clearFeedbackBubbles();

    const perfect = gameState.isPerfectBox(this.currentBoxId);

    console.log("Box:", this.currentBoxId);
    console.log("Box Results:", gameState.boxResults[this.currentBoxId]);
    console.log("Perfect:", perfect);

    if (perfect) {
      this.dialogueManager.startDialogue(this.currentBox.successDialogue, () => {
        this.startNextStep();
      });
    } else {
      this.startParasiteEncounter();
    }
  }

  startParasiteEncounter() {
    const { width, height } = this.scale;

    gameState.setParasiteInteraction(this.currentBoxId, true);

    this.parasite = this.add.image(width / 2, height / 2, "parasite")
      .setDepth(400)
      .setScale(3.5);

    const parasiteIntro = this.currentBox.parasiteDialogue[0];
    const parasiteNode = this.currentBox.parasiteDialogue[1];

    this.dialogueManager.startDialogue([{ text: parasiteIntro.text }], () => {
      this.dialogueManager.startDialogue([{ text: parasiteNode.text }], () => {
        this.showChoices(
          parasiteNode.choices,

          (choice) => {
            gameState.saveParasiteChoice(this.currentBoxId, choice.id);

            if (choice.nextText) {
              this.dialogueManager.startDialogue([{ text: choice.nextText }], () => {
                if (this.parasite) {
                  this.parasite.destroy();
                  this.parasite = null;
                }

                this.startNextStep();
              });
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

            this.coworker = this.add.image(width * 0.8, 0, "miniwal")
              .setScale(0.4)
              .setDepth(50);

            this.dialogueManager.startDialogue([parasiteNode.ignoreDialogue[0]], () => {
              this.startNextStep();
            });
          },

          4000
        );
      });
    });
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

    this.coworker = this.add.image(width / 2, height / 1.8, "customer")
      .setScale(0.6)
      .setDepth(50);

    if (this.currentBoxId === "box1") {
      this.boxManager.startBox("box2", box2Data);
      return;
    }

    if (this.currentBoxId === "box2") {
      this.startFinalPath();
      return;
    }
  }

 startFinalPath() {
  const ending = gameState.getEnding();
  const stats = gameState.getEndingStats();

  const finalDialogue = box2Data.finalDialogues[ending];

  console.log("ENDING:", ending);
  console.log("STATS:", stats);

  this.dialogueManager.startDialogue(finalDialogue, () => {
    console.log("FINAL PATH FINISHED");
  });
}
}