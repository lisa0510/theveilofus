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
    this.load.image("tisch", "assets/Fish/Tisch.png");
    this.load.image("knive", "assets/Fish/knive.png");
    this.load.image("fish", "assets/Fish02/Fisch.png");
    this.load.image("board"), "assets/Fish02/Schnittbrett.png)";
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "shop_bg").setDisplaySize(width, height).setDepth(-10);
    this.add.image(width / 2, height / 2, "shop_bg2").setDisplaySize(width, height).setDepth(-5);
    this.add.image(width / 2, height / 1, "tisch").setScale(1.2).setDepth(-1);
    this.add.image(width / 2, height / 1.1, "cutting").setScale(0.7);
    this.add.image(width / 1.5, height / 1.1, "knive").setScale(0.15);
    this.coworker = this.add.image(width / 2, height / 1.8, "customer").setScale(0.6);

    this.dialogueIndex = 0;
    this.cuts = [];
    this.targetCM = 50;
    this.totalFish = 4;
    this.currentFish = 0;

    this.setupMainDialogue();
  }

  setupMainDialogue() {
    const { width, height } = this.scale;
    this.dialogues = [
      "Guten Morgen Dr. Hier ist der erste Test Spezimen für Sie zum schneiden.",
      "Wenn Sie diesen probe Fisch geschnitten haben, bringe ich Ihnen die Boxen für den heutigen Arbeitstag.",
      "Merken Sie, die Forschungsabteilung hat darum gebeten, das alle Spezimen heute bei ungefähr 50% durchgeschnitten werden müssen.",
      "Geben Sie ihr bestes!"
    ];

    this.dialogueText = this.add.text(width / 2, height / 1.3, "", {
      fontSize: "20px", color: "#ffffff", backgroundColor: "#000000aa",
      padding: { x: 20, y: 10 }, align: "center",
      wordWrap: { width: width * 0.5, useAdvancedWrap: true }
    }).setOrigin(0.5);

    this.continueBtn = this.add.text(width / 2, height / 1.2, "...", {
      fontSize: "20px", backgroundColor: "#333", color: "#fff", padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.continueBtn.on("pointerdown", () => this.nextDialogue());
    this.nextDialogue();
  }

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

 startTutorialCutting() {
    const { width, height } = this.scale;
    
    // Das schwarze Hintergrund-Overlay
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);
    
    // Das Board als Hintergrund für den Fisch (höhere Tiefe als Overlay, niedrigere als Fisch)
    this.boardImg = this.add.image(width / 2, height / 2, "board").setDepth(101);
    
    this.spawnFish();
    this.startFishDialogue();
  }

  startFishDialogue() {
    const { width, height } = this.scale;
    this.fishDialogues = [
      "Auf einen erfolgreichen Arbeitstag, Mensch!",
      "Vergiss nicht, auch der erfahrenste Fisch kann sich im Netzt verfangen.",
      "Dieser probiert, dann den selben Miss-schwimm einfach nicht nochmals zu machen.",
      "Ziehen Sie die Maus schnell vertikal durch den Fisch.",
    ];
    this.fishDialogueIndex = 0;

    this.fishText = this.add.text(width / 2, height / 1.3, "", {
      fontSize: "20px", color: "#ffffff", backgroundColor: "#000000aa",
      padding: { x: 20, y: 10 }, align: "center",
      wordWrap: { width: width * 0.5, useAdvancedWrap: true }
    }).setOrigin(0.5).setDepth(150);

    this.fishBtn = this.add.text(width / 2, height / 1.2, "...", {
      fontSize: "20px", backgroundColor: "#333", color: "#fff", padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(150);

    this.fishBtn.on("pointerdown", () => this.nextFishDialogue());
    this.nextFishDialogue();
  }

  nextFishDialogue() {
    if (this.fishDialogueIndex < this.fishDialogues.length) {
      this.fishText.setText(this.fishDialogues[this.fishDialogueIndex]);
      this.fishDialogueIndex++;
    } else {
      this.fishText.destroy();
      this.fishBtn.destroy();
      this.time.delayedCall(100, () => {
        this.activateCuttingLogic();
      });
    }
  }

  spawnFish() {
    const { width, height } = this.scale;
    if (this.fish) this.fish.destroy();
    this.fish = this.add.image(width / 2, height / 2, "fish").setDepth(101);
    this.swipeGraphics = this.add.graphics().setDepth(110);
  }

  activateCuttingLogic() {
    let startPoint = null;

    this.input.on('pointerdown', (pointer) => {
      startPoint = { x: pointer.x, y: pointer.y };
    });

    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown && startPoint) {
        this.swipeGraphics.clear();
        this.swipeGraphics.lineStyle(5, 0xffffff, 1);
        this.swipeGraphics.lineBetween(startPoint.x, startPoint.y, pointer.x, pointer.y);
        
        this.time.delayedCall(100, () => {
          this.swipeGraphics.clear();
        });
      }
    });

    this.input.on('pointerup', (pointer) => {
      if (startPoint) {
        this.handleSlice(startPoint, { x: pointer.x, y: pointer.y });
        startPoint = null;
        this.swipeGraphics.clear(); // Sofort weg beim Loslassen
      }
    });
  }

  handleSlice(start, end) {
    const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
    
    // 1. Prüfung: Lange genug?
    if (distance < 150) return;

    const bounds = this.fish.getBounds();
    const line = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);

    // 2. Prüfung: Fisch getroffen?
    if (!Phaser.Geom.Intersects.LineToRectangle(line, bounds)) return;

    // 3. Prüfung: Vertikal vs. Horizontal
    const angle = Phaser.Math.Angle.Between(start.x, start.y, end.x, end.y);
    const angleInDegrees = Math.abs(Phaser.Math.RadToDeg(angle));

    // Wir definieren: Ein gültiger Schnitt muss steil sein (zwischen 45° und 135°)
    // Wenn der Winkel nahe 0 oder 180 ist, ist er zu horizontal.
    const isHorizontal = (angleInDegrees < 60 || angleInDegrees > 130);

    if (isHorizontal) {
      this.showErrorMessage("Not a valid cut!");
      return;
    }

    // Wenn alles okay ist, Schnitt ausführen
    this.input.off('pointerdown');
    this.input.off('pointermove');
    this.input.off('pointerup');

    const cutX = (start.x + end.x) / 2;
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const localX = Phaser.Math.Clamp(cutX - fishLeft, 0, this.fish.displayWidth);
    const percent = Math.round((localX / this.fish.displayWidth) * 100);

    this.cuts.push(percent);
    this.animateSlice(localX, percent, angle);
  }
  showErrorMessage(message) {
    const { width, height } = this.scale;
    const errorText = this.add.text(width / 2, height / 2, message, {
      fontSize: "42px",
      color: "#ff0000",
      fontStyle: "bold",
      backgroundColor: "#000000aa",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(3000);

    this.tweens.add({
      targets: errorText,
      alpha: { from: 1, to: 0 },
      y: errorText.y - 50,
      duration: 1000,
      delay: 500,
      onComplete: () => errorText.destroy()
    });
  }

  animateSlice(localX, percent, angle) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;

    const leftHalf = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(0, 0, localX, h).setDepth(102);
    const rightHalf = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(localX, 0, w - localX, h).setDepth(102);

    this.fish.destroy();

    const diff = Math.abs(percent - 50);
    let feedback = diff <= 5 ? `Perfect! ${percent}%` : (diff <= 15 ? `Close! ${percent}%` : `Off! ${percent}%`);
    const feedbackText = this.add.text(x, y - 120, feedback, {
      fontSize: "40px", color: "#ffff00", fontStyle: "bold"
    }).setOrigin(0.5).setDepth(200);

    const slideDist = 250; 
    
    this.tweens.add({
      targets: leftHalf,
      x: x - slideDist,
      alpha: 0,
      duration: 350, 
      ease: 'Power2'
    });

    this.tweens.add({
      targets: rightHalf,
      x: x + slideDist,
      alpha: 0,
      duration: 350, 
      ease: 'Power2'
    });

    this.time.delayedCall(450, () => {
      feedbackText.destroy();
      leftHalf.destroy();
      rightHalf.destroy();
      this.nextFish();
    });
  }

  nextFish() {
    this.currentFish++;
    if (this.currentFish < this.totalFish) {
      this.spawnFish();
      this.activateCuttingLogic();
    } else {
      this.finishTutorial();
    }
  }

  finishTutorial() {
    if (this.overlay) this.overlay.destroy();
    if (this.boardImg) this.boardImg.destroy();
    this.input.removeAllListeners();

    const average = this.cuts.reduce((a, b) => a + b, 0) / this.cuts.length;
    const diff = Math.abs(average - this.targetCM);

    let endLines = diff <= 10 
      ? ["Perfekt vielen Dank, lassen Sie mich diese weiterleiten."]
      : ["Übung macht den Meister.", "Versuchen Sie es beim nächsten Mal besser."];

    let idx = 0;
    const endText = this.add.text(this.scale.width / 2, this.scale.height / 1.3, endLines[0], {
      fontSize: "20px", color: "#ffffff", backgroundColor: "#000000aa",
      padding: { x: 20, y: 10 }, align: "center",
      wordWrap: { width: this.scale.width * 0.5, useAdvancedWrap: true }
    }).setOrigin(0.5).setDepth(200);

    const endBtn = this.add.text(this.scale.width / 2, this.scale.height / 1.2, "...", {
      fontSize: "20px", backgroundColor: "#333", color: "#fff", padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(200);

    endBtn.on("pointerdown", () => {
      idx++;
      if (idx < endLines.length) endText.setText(endLines[idx]);
      else this.scene.start("Shop");
    });
  }
}