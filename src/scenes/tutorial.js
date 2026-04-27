import Phaser from "phaser";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish02/Hintergrund.png");
    this.load.image("shop_bg2", "assets/Fish02/Vorderhintergrund.png");
    this.load.image("cutting", "assets/Fish/Cuttingboard.png");
    this.load.image("customer", "assets/Fish02/TaucherBoxOffen.png");
    this.load.image("customer_done", "assets/Fish02/TaucherBoxZu.png");
    this.load.image("tisch", "assets/Fish/Tisch.png");
    this.load.image("knive", "assets/Fish/knive.png");
    this.load.image("fish", "assets/Fish02/Fisch.png");
    this.load.image("hoverfish", "assets/Fish/hoverfish.png");
  }

  create() {
    const { width, height } = this.scale;

    // --- Background & Environment ---
    this.add.image(width / 2, height / 2, "shop_bg")
      .setDisplaySize(width, height)
      .setDepth(-10);

    this.add.image(width / 2, height / 2, "shop_bg2")
      .setDisplaySize(width, height)
      .setDepth(-5);

    this.add.image(width / 2, height / 1, "tisch")
      .setScale(1.2)
      .setDepth(-1);

    this.add.image(width / 2, height / 1.1, "cutting")
      .setScale(0.7);

    this.add.image(width / 1.5, height / 1.1, "knive")
      .setScale(0.15);

    this.coworker = this.add.image(width / 2, height / 1.8, "customer")
      .setScale(0.6);

    // --- Dialogue System Setup ---
    this.dialogueIndex = 0;
    this.dialogues = [
      "Guten Morgen Dr. Hier ist der erste Test Spezimen für Sie zum schneiden.",
      "Wenn Sie diesen probe Fisch geschnitten haben, bringe ich Ihnen die Boxen für den heutigen Arbeitstag.",
      "Merken Sie, die Forschungsabteilung hat darum gebeten, das alle Spezimen heute bei ungefähr 50% durchgeschnitten werden müssen.",
      "Geben Sie ihr bestes!"
    ];

    this.dialogueText = this.add.text(
      width / 2,
      height / 1.3,
      "",
      {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 10 },
        align: "center",
        wordWrap: { width: width * 0.5, useAdvancedWrap: true }
      }
    ).setOrigin(0.5);

    this.continueBtn = this.add.text(
      width / 2,
      height / 1.2,
      "...",
      {
        fontSize: "20px",
        backgroundColor: "#333",
        color: "#fff",
        padding: { x: 20, y: 10 }
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.continueBtn.on("pointerdown", () => {
      this.nextDialogue();
    });

    this.nextDialogue();
  }

  // =========================
  // Main Dialogue System
  // =========================

  nextDialogue() {
    if (this.dialogueIndex < this.dialogues.length) {
      this.dialogueText.setText(this.dialogues[this.dialogueIndex]);
      this.dialogueIndex++;
    } else {
      this.dialogueText.destroy();
      this.continueBtn.destroy();
      this.startTutorialCutting();
    }
  }

  // =========================
  // Cutting Phase Setup
  // =========================

  startTutorialCutting() {
    const { width, height } = this.scale;

    this.targetCM = 50;
    this.totalFish = 4;
    this.currentFish = 0;
    this.cuts = [];

    // Dark overlay for focus
    this.overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    ).setDepth(100);

    // 1. Spawn the fish (it will be visible but not yet interactable)
    this.spawnFish();

    // 2. Start the overlay dialogue
    this.startFishDialogue();
  }

  startFishDialogue() {
    const { width, height } = this.scale;

    this.fishDialogues = [
      "Auf einen erfolgreichen Arbeitstag, Mensch!",
      "Vergiss nicht, auch der erfahrenste Fisch kann sich im Netzt verfangen.",
      "Dieser probiert, dann den selben Miss-schwimm einfach nicht nochmals zu machen."
    ];

    this.fishDialogueIndex = 0;

    this.fishDialogueText = this.add.text(
      width / 2,
      height / 1.3,
      "",
      {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 10 },
        align: "center",
        wordWrap: { width: width * 0.5, useAdvancedWrap: true }
      }
    )
      .setOrigin(0.5)
      .setDepth(150);

    this.fishContinueBtn = this.add.text(
      width / 2,
      height / 1.2,
      "...",
      {
        fontSize: "20px",
        backgroundColor: "#333",
        color: "#fff",
        padding: { x: 20, y: 10 }
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(150);

    this.fishContinueBtn.on("pointerdown", () => {
      this.nextFishDialogue();
    });

    this.nextFishDialogue();
  }

  nextFishDialogue() {
    if (this.fishDialogueIndex < this.fishDialogues.length) {
      this.fishDialogueText.setText(this.fishDialogues[this.fishDialogueIndex]);
      this.fishDialogueIndex++;
    } else {
      this.fishDialogueText.destroy();
      this.fishContinueBtn.destroy();

      // Start the actual interaction after dialogue is finished
      this.activateCutting();
    }
  }

  // =========================
  // Core Gameplay Logic
  // =========================

  spawnFish() {
    const { width, height } = this.scale;

    if (this.fish) this.fish.destroy();

    this.fish = this.add.image(width / 2, height / 2, "fish")
      .setDepth(101);

    this.cutLine = this.add.rectangle(
      0,
      0,
      4,
      this.fish.displayHeight,
      0xff0000
    )
      .setVisible(false)
      .setDepth(102);
  }

  activateCutting() {
    // Small delay to prevent accidental click from the "Continue" button
    this.time.delayedCall(200, () => {
      this.input.once("pointerdown", (pointer) => {
        this.isDragging = true;
        this.cutLine.setVisible(true);
        this.updateCutLine(pointer);

        this.input.on("pointermove", this.updateCutLine, this);

        this.input.once("pointerup", (pointerUp) => {
          this.finishCut(pointerUp.x);
        });
      });
    });
  }

  updateCutLine(pointer) {
    if (!this.fish || !this.cutLine) return;

    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const clampedX = Phaser.Math.Clamp(
      pointer.x,
      fishLeft,
      fishLeft + this.fish.displayWidth
    );

    this.cutLine.setPosition(clampedX, this.fish.y);
  }

  finishCut(cutX) {
    this.input.off("pointermove", this.updateCutLine, this);

    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const clampedX = Phaser.Math.Clamp(
      cutX,
      fishLeft,
      fishLeft + this.fish.displayWidth
    );

    const localCut = clampedX - fishLeft;
    const percent = Math.round((localCut / this.fish.displayWidth) * 100);

    this.cuts.push(percent);
    this.sliceFish(clampedX, localCut);

    const resultText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 180,
      `${percent}%`,
      {
        fontSize: "48px",
        color: "#ffff00",
        fontStyle: "bold"
      }
    )
      .setOrigin(0.5)
      .setDepth(200);

    this.time.delayedCall(800, () => {
      resultText.destroy();
      this.nextFish();
    });
  }

  sliceFish(cutX, localCut) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;

    const left = this.add.image(x, y, "fish")
      .setDisplaySize(w, h)
      .setCrop(0, 0, localCut, h)
      .setDepth(102);

    const right = this.add.image(x, y, "fish")
      .setDisplaySize(w, h)
      .setCrop(localCut, 0, w - localCut, h)
      .setDepth(102);

    this.fish.destroy();
    this.cutLine.setVisible(false);

    this.tweens.add({
      targets: left,
      x: x - 80,
      angle: -15,
      duration: 400
    });

    this.tweens.add({
      targets: right,
      x: x + 80,
      angle: 15,
      duration: 400
    });

    this.time.delayedCall(600, () => {
      left.destroy();
      right.destroy();
    });
  }

  nextFish() {
    this.currentFish++;

    if (this.currentFish >= this.totalFish) {
      this.finishTutorial();
    } else {
      this.spawnFish();
      this.activateCutting(); // Subsequent fish don't need the dialogue
    }
  }

  // =========================
  // End of Scene
  // =========================

  finishTutorial() {
    this.overlay.destroy();

    const average = this.cuts.reduce((a, b) => a + b, 0) / this.cuts.length;
    const diff = Math.abs(average - this.targetCM);

    let endLines = [];
    if (diff <= 10) {
      endLines = [
        "Perfekt vielen Dank, lassen Sie mich diese zu den anderen Wissenschaftlern weiterleiten.",
        "Da bin ich wieder Doktor, hier ist die erste Box von drei, für Sie."
      ];
    } else {
      endLines = [
        "Übung macht den Meister",
        "Versuchen Sie es beim nächsten Mal besser."
      ];
    }

    let index = 0;
    this.dialogueText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 1.3,
      endLines[0],
      {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 10 },
        align: "center",
        wordWrap: { width: this.scale.width * 0.5, useAdvancedWrap: true }
      }
    ).setOrigin(0.5).setDepth(200);

    this.continueBtn = this.add.text(
      this.scale.width / 2,
      this.scale.height / 1.2,
      "...",
      {
        fontSize: "20px",
        backgroundColor: "#333",
        color: "#fff",
        padding: { x: 20, y: 10 }
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(200);

    this.continueBtn.on("pointerdown", () => {
      index++;
      if (index < endLines.length) {
        this.dialogueText.setText(endLines[index]);
      } else {
        this.scene.start("Shop");
      }
    });
  }
}