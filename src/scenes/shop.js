import Phaser from "phaser";
import DialogueManager from "../systems/DialogueManager.js";
import BoxManager from "../systems/BoxManager.js";
import { box1Data } from "../data/box1Dialogue.js";

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
    this.load.image("whale", "assets/Fish02/GrosserWal.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "shop_bg")
      .setDisplaySize(width, height);

    this.add.image(width / 2, height / 2, "shop_bg2")
      .setDisplaySize(width, height);

    this.add.image(width / 2, height / 1, "tisch")
      .setScale(1.2);

    this.add.image(width / 2, height / 1.1, "cutting")
      .setScale(0.7);

    this.add.image(width / 1.5, height / 1.1, "knive")
      .setScale(0.15);

    this.coworker = this.add.image(
      width / 2,
      height / 1.8,
      "customer"
    ).setScale(0.6);

    this.dialogueManager = new DialogueManager(this);
    this.boxManager = new BoxManager(this);

    this.totalFish = 4;
    this.currentFish = 0;
    this.cutResults = [];
    this.choiceButtons = [];

    this.gameState = {
      fishChoices: [],
      whaleChoices: [],
      boxResults: [],
      perfectBoxes: 0
    };

    this.boxManager.startBox(box1Data);
  }

  enableCoworkerInteraction() {
    this.coworker.setInteractive({ useHandCursor: true });

    this.coworker.once("pointerdown", () => {
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
    ).setDepth(101).setScale(0.7);

    this.spawnFish(false);

    this.startFishDialogue();
  }

  startFishDialogue() {
  const node = this.currentBox.fishDialogue[0];

  // 1. Start the dialogue text
  this.dialogueManager.startDialogue([{ text: node.text }]);

  // 2. Immediately show choices (don't wait for the dialogue to finish)
  this.showChoices(node.choices, (choice) => {
    this.gameState.fishChoices.push(choice.id);

    // 3. When a choice is clicked, show the reaction text
    this.dialogueManager.startDialogue(
      [{ text: choice.nextText }],
      () => {
        // Only after the reaction is read/done, start the cutting
        this.activateCuttingLogic();
      }
    );
  });
}

showChoices(choices, callback) {
  const { width, height } = this.scale;

  // Configuration for spacing
  const spacing = 250; // Distance between the centers of the buttons
  const baseY = height / 1.1; // Adjusted to be near the bottom dialogue area

  choices.forEach((choice, index) => {
    // Calculate X: 
    // If index 0: width/2 - spacing/2
    // If index 1: width/2 + spacing/2
    const totalWidth = (choices.length - 1) * spacing;
    const startX = (width / 2) - (totalWidth / 2);
    const xPos = startX + (index * spacing);

    const btn = this.add.text(
      xPos,
      baseY, 
      choice.text,
      {
        fontSize: "20px",
        backgroundColor: "#1a1a1a",
        color: "#ffffff",
        padding: { x: 15, y: 10 },
        align: "center",
        wordWrap: { width: 200 }
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(600);

    btn.on("pointerdown", () => {
      this.choiceButtons.forEach((b) => b.destroy());
      this.choiceButtons = [];
      callback(choice);
    });

    this.choiceButtons.push(btn);

    btn.setAlpha(0); // Start invisible
    this.tweens.add({
      targets: btn,
      alpha: 1,
      duration: 10000, // Half a second fade-in
      ease: 'Power2'
    });
  });
}

  spawnFish(activateLogic = true) {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();

    this.fish = this.add.image(
      width / 2,
      height / 2,
      "fish"
    ).setDepth(102);

    this.swipeGraphics = this.add.graphics().setDepth(110);

    if (activateLogic) {
      this.activateCuttingLogic();
    }
  }

  activateCuttingLogic() {
    let startPoint = null;

    this.input.once("pointerdown", (pointer) => {
      startPoint = {
        x: pointer.x,
        y: pointer.y
      };

      this.input.on("pointermove", (movePointer) => {
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
      });

      this.input.once("pointerup", (pointerUp) => {
        this.swipeGraphics.clear();
        this.input.off("pointermove");

        this.handleSlice(
          startPoint,
          {
            x: pointerUp.x,
            y: pointerUp.y
          }
        );
      });
    });
  }

  handleSlice(start, end) {
    const bounds = this.fish.getBounds();
    const line = new Phaser.Geom.Line(
      start.x,
      start.y,
      end.x,
      end.y
    );

    if (!Phaser.Geom.Intersects.LineToRectangle(line, bounds)) {
      this.activateCuttingLogic();
      return;
    }

    const cutX = (start.x + end.x) / 2;
    const fishLeft =
      this.fish.x - this.fish.displayWidth / 2;

    const localX = Phaser.Math.Clamp(
      cutX - fishLeft,
      0,
      this.fish.displayWidth
    );

    const percent = Math.round(
      (localX / this.fish.displayWidth) * 100
    );

    this.cutResults.push(percent);

    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
    const { x, y, displayWidth: w, displayHeight: h } =
      this.fish;

    const leftHalf = this.add.image(x, y, "fish")
      .setDisplaySize(w, h)
      .setCrop(0, 0, localX, h);

    const rightHalf = this.add.image(x, y, "fish")
      .setDisplaySize(w, h)
      .setCrop(localX, 0, w - localX, h);

    this.fish.destroy();

    const feedback = this.add.text(
      x,
      y - 120,
      `${percent}%`,
      {
        fontSize: "35px",
        color: "#ffff00"
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

    this.time.delayedCall(500, () => {
      leftHalf.destroy();
      rightHalf.destroy();
      feedback.destroy();

      this.nextFish();
    });
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
    this.overlay.destroy();
    this.boardImg.destroy();

    const perfect = this.cutResults.every(
      (cut) => cut === 50
    );

    if (perfect) {
      this.gameState.perfectBoxes++;

      this.dialogueManager.startDialogue(
        this.currentBox.successDialogue,
        () => {
          this.startBox2();
        }
      );
    } else {
      this.startWhaleEncounter();
    }
  }

  startWhaleEncounter() {
    const { width, height } = this.scale;

    this.whale = this.add.image(
      width / 2,
      height / 2,
      "whale"
    ).setDepth(400);

    const whaleNode =
      this.currentBox.whaleDialogue[1];

    this.dialogueManager.startDialogue(
      [{ text: whaleNode.text }],
      () => {
        this.showChoices(
          whaleNode.choices,
          (choice) => {
            this.gameState.whaleChoices.push(
              choice.id
            );

            this.dialogueManager.startDialogue(
              [{ text: choice.nextText }],
              () => {
                this.whale.destroy();
                this.startBox2();
              }
            );
          }
        );
      }
    );
  }

  startBox2() {
    console.log("BOX 2 START");
  }
}