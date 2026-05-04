import Phaser from "phaser";
import dialogues from "../data/dialogues_tutorial.js";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish03/TalkingScreen.png");
    this.load.image("customer", "assets/Fish02/TaucherBoxOffen.png");
    this.load.image("fish", "assets/Fish02/Fisch.png");
    this.load.image("board", "assets/Fish02/Schnittbrett.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "shop_bg")
      .setDisplaySize(width, height)
      .setDepth(-10);

    this.coworker = this.add.image(
      width / 2,
      height / 1.8,
      "customer"
    ).setScale(0.4);

    this.dialogueIndex = 0;
    this.cuts = [];
    this.targetCM = 50;
    this.totalFish = 4;
    this.currentFish = 0;

    this.cutLine = null;
    this.cutLineDirection = 1;
    this.cutLineSpeed = 4;

    this.setupMainDialogue();
  }

  setupMainDialogue() {
    const { width, height } = this.scale;

    this.currentDialogues = dialogues.tutorial.intro;

    this.dialogueText = this.add.text(
      width / 2,
      height / 1.3,
      "",
      {
        fontSize: "25px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 40, y: 25 },
        align: "center",
        wordWrap: { width: width * 0.6 }
      }
    )
      .setOrigin(0.5)
      .setDepth(200);

    this.input.on("pointerdown", this.handleProgressDialogue, this);
    this.displayNextLine();
  }

  handleProgressDialogue() {
    this.displayNextLine();
  }

  displayNextLine() {
    if (this.dialogueIndex < this.currentDialogues.length) {
      this.dialogueText.setText(
        this.currentDialogues[this.dialogueIndex].text
      );

      this.dialogueIndex++;
    } else {
      this.input.off("pointerdown", this.handleProgressDialogue, this);
      this.dialogueText.destroy();
      this.startTutorialCutting();
    }
  }

  startTutorialCutting() {
  const { width, height } = this.scale;

  this.overlay = this.add.rectangle(
    width / 2,
    height / 2,
    width,
    height,
    0x000000,
    0.8
  ).setDepth(100);

  this.boardImg = this.add.image(
    width / 2,
    height / 2,
    "board"
  )
    .setDepth(101)
    .setScale(0.7);

  this.spawnFish();

  this.time.delayedCall(150, () => {
    this.enableLineClick();
  });
}

  spawnFish() {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();

    this.fish = this.add.image(
      width / 2,
      height / 2,
      "fish"
    ).setDepth(102);

    this.createMovingCutLine();
  }

  createMovingCutLine() {
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
    this.cutLineSpeed = 10;
    this.canStopLine = false;
  }

  enableLineClick() {
    this.canStopLine = true;

    this.input.once("pointerdown", () => {
      this.stopLineAndCut();
    });
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

  stopLineAndCut() {
    if (!this.canStopLine) return;
    if (!this.cutLine || !this.fish) return;

    this.canStopLine = false;

    const bounds = this.fish.getBounds();

    const localX = Phaser.Math.Clamp(
      this.cutLine.x - bounds.left,
      0,
      this.fish.displayWidth
    );

    const percent = Math.round(
      (localX / this.fish.displayWidth) * 100
    );

    this.cuts.push(percent);

    this.cutLine.destroy();
    this.cutLine = null;

    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
  const {
    x,
    y,
    displayWidth: w,
    displayHeight: h
  } = this.fish;

  const leftHalf = this.add.image(x, y, "fish")
    .setDisplaySize(w, h)
    .setCrop(0, 0, localX, h)
    .setDepth(103);

  const rightHalf = this.add.image(x, y, "fish")
    .setDisplaySize(w, h)
    .setCrop(localX, 0, w - localX, h)
    .setDepth(103);

  this.fish.destroy();

  const diff = Math.abs(percent - 50);

  let feedbackColor = "#ff4444";

  if (diff <= 2) {
    feedbackColor = "#2ecc71";
  }

  const percentText = this.add.text(
    x,
    y - 250,
    `${percent}%`,
    {
      fontSize: "50px",
      color: feedbackColor,
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 5
    }
  )
    .setOrigin(0.5)
    .setDepth(300);

  this.tweens.add({
    targets: leftHalf,
    x: x - 250,
    alpha: 0,
    duration: 350
  });

  this.tweens.add({
    targets: rightHalf,
    x: x + 250,
    alpha: 0,
    duration: 350
  });

  this.time.delayedCall(700, () => {
    leftHalf.destroy();
    rightHalf.destroy();
    percentText.destroy();

    this.nextFish();
  });
}

  nextFish() {
    this.currentFish++;

    if (this.currentFish < this.totalFish) {
      this.spawnFish();

      this.time.delayedCall(150, () => {
        this.enableLineClick();
      });
    } else {
      this.finishTutorial();
    }
  }

  finishTutorial() {
    if (this.overlay) this.overlay.destroy();
    if (this.boardImg) this.boardImg.destroy();
    if (this.cutLine) this.cutLine.destroy();

    const averagePercent =
      this.cuts.reduce((a, b) => a + b, 0) / this.cuts.length;

    const diff = Math.abs(averagePercent - this.targetCM);

    const finalMessage =
      dialogues.tutorial.feedback[
        diff <= 2 ? "perfect" : diff <= 15 ? "okay" : "bad"
      ];

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 1.3,
      finalMessage,
      {
        fontSize: "25px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 40, y: 25 },
        align: "center",
        wordWrap: { width: this.scale.width * 0.6 }
      }
    )
      .setOrigin(0.5)
      .setDepth(200);

    this.input.once("pointerdown", () => {
      this.scene.start("Shop");
    });
  }
  
}