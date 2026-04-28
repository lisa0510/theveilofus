import Phaser from "phaser";
import dialogues from "../data/dialogues_tutorial.js";

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
    this.load.image("board", "assets/Fish02/Schnittbrett.png");
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
    this.bubbles = []; 
    this.targetCM = 50;
    this.totalFish = 4;
    this.currentFish = 0;

    this.setupMainDialogue();
  }

  setupMainDialogue() {
    const { width, height } = this.scale;
    this.currentDialogues = dialogues.tutorial.intro;
    this.dialogueText = this.add.text(width / 2, height / 1.3, "", {
      fontSize: "22px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 20, y: 15 }, align: "center", wordWrap: { width: width * 0.6 }
    }).setOrigin(0.5).setDepth(200);
    this.input.on("pointerdown", this.handleProgressDialogue, this);
    this.displayNextLine();
  }

  handleProgressDialogue() { this.displayNextLine(); }

  displayNextLine() {
    if (this.dialogueIndex < this.currentDialogues.length) {
      this.dialogueText.setText(this.currentDialogues[this.dialogueIndex].text);
      this.dialogueIndex++;
    } else {
      this.input.off("pointerdown", this.handleProgressDialogue, this);
      this.dialogueText.destroy();
      this.startTutorialCutting();
    }
  }

  startTutorialCutting() {
    const { width, height } = this.scale;
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);
    this.boardImg = this.add.image(width / 2, height / 2, "board").setDepth(101).setScale(0.7);
    this.spawnFish();
    this.startFishDialogue();
  }

  startFishDialogue() {
    const { width, height } = this.scale;
    this.fishDialogues = dialogues.tutorial.fishIntro;
    this.fishDialogueIndex = 0;
    this.fishText = this.add.text(width / 2, height / 1.3, "", {
      fontSize: "20px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 20, y: 10 }, align: "center", wordWrap: { width: width * 0.5 }
    }).setOrigin(0.5).setDepth(150);
    this.input.on("pointerdown", this.handleProgressFishDialogue, this);
    this.displayNextFishLine();
  }

  handleProgressFishDialogue() { this.displayNextFishLine(); }

  displayNextFishLine() {
    if (this.fishDialogueIndex < this.fishDialogues.length) {
      this.fishText.setText(this.fishDialogues[this.fishDialogueIndex].text);
      this.fishDialogueIndex++;
    } else {
      this.input.off("pointerdown", this.handleProgressFishDialogue, this);
      this.fishText.destroy();
      this.time.delayedCall(100, () => { this.activateCuttingLogic(); });
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
    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (gameObjects.length > 0) return;
      startPoint = { x: pointer.x, y: pointer.y };
    });
    this.input.on("pointermove", (pointer) => {
      if (pointer.isDown && startPoint) {
        this.swipeGraphics.clear();
        this.swipeGraphics.lineStyle(5, 0xffffff, 1);
        this.swipeGraphics.lineBetween(startPoint.x, startPoint.y, pointer.x, pointer.y);
      }
    });
    this.input.on("pointerup", (pointer) => {
      if (startPoint) {
        this.handleSlice(startPoint, { x: pointer.x, y: pointer.y });
        startPoint = null;
        this.swipeGraphics.clear();
      }
    });
  }

  handleSlice(start, end) {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    if (dx > dy * 0.3) { this.showInvalidFeedback("Invalid Cut! Cut vertically."); return; }
    const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
    if (distance < 80) return;
    const bounds = this.fish.getBounds();
    const line = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);
    if (!Phaser.Geom.Intersects.LineToRectangle(line, bounds)) return;

    this.input.removeAllListeners();
    const cutX = (start.x + end.x) / 2;
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const localX = Phaser.Math.Clamp(cutX - fishLeft, 0, this.fish.displayWidth);
    const percent = Math.round((localX / this.fish.displayWidth) * 100);

    this.cuts.push(percent);
    this.animateSlice(localX, percent);
  }

  animateSlice(localX, percent) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;
    const leftHalf = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(0, 0, localX, h).setDepth(102);
    const rightHalf = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(localX, 0, w - localX, h).setDepth(102);
    this.fish.destroy();

    const diff = Math.abs(percent - 50);
    let rating = "";
    let bubbleColor = 0x33FBFF; // Standard Cyan (für Perfect & OK)

    if (diff <= 10) {
        rating = diff <= 2 ? "PERFECT" : "OK";
        bubbleColor = 0x33FBFF; 
    } else {
        rating = "BAD";
        bubbleColor = 0xFF9999; // Wasser-Rot
    }

    this.createDraggableBubble(x, y - 50, rating, bubbleColor);

    this.tweens.add({ targets: leftHalf, x: x - 250, alpha: 0, duration: 350 });
    this.tweens.add({ targets: rightHalf, x: x + 250, alpha: 0, duration: 350 });

    this.time.delayedCall(450, () => {
      leftHalf.destroy();
      rightHalf.destroy();
      this.nextFish();
    });
  }

  createDraggableBubble(x, y, label, color) {
    const container = this.add.container(x, y).setDepth(150);
    const radius = 90;

    const bg = this.add.graphics();
    bg.fillStyle(color, 0.7); 
    bg.fillCircle(0, 0, radius);
    bg.lineStyle(3, 0xffffff, 0.8);
    bg.strokeCircle(0, 0, radius);

    // Weißer Glanz-Effekt für den Bubble-Look
    bg.fillStyle(0xffffff, 0.3);
    bg.fillEllipse(-30, -30, 20, 15);

    const txt = this.add.text(0, 0, label, {
      fontSize: "24px", color: "#000000", fontStyle: "bold", fontFamily: "Helvetica"
    }).setOrigin(0.5);

    container.add([bg, txt]);

    // Klick-Bereich auf vollen Radius (90) setzen
    bg.setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains);
    this.input.setDraggable(bg);

    bg.on('dragstart', (pointer) => {
        container.setScale(1.1);
        bg.dragOffsetX = container.x - pointer.x;
        bg.dragOffsetY = container.y - pointer.y;
    });

    bg.on('drag', (pointer) => {
        container.x = pointer.x + bg.dragOffsetX;
        container.y = pointer.y + bg.dragOffsetY;
    });

    bg.on('dragend', () => { container.setScale(1.0); });

    this.bubbles.push(container);
  }

  showInvalidFeedback(message) {
    const { width, height } = this.scale;
    if (this.errorText) this.errorText.destroy();
    this.errorText = this.add.text(width / 2, height / 2 - 150, message, {
      fontSize: "28px", color: "#ff0000", fontStyle: "bold", backgroundColor: "#000000aa", padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setDepth(300);
    this.tweens.add({
      targets: this.errorText, alpha: 0, y: "-=30", duration: 1000,
      onComplete: () => { if (this.errorText) this.errorText.destroy(); }
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
    this.bubbles.forEach(b => b.destroy());

    const averagePercent = this.cuts.reduce((a, b) => a + b, 0) / this.cuts.length;
    const diff = Math.abs(averagePercent - this.targetCM);

    let finalMessage = dialogues.tutorial.feedback[diff <= 2 ? 'perfect' : diff <= 15 ? 'okay' : 'bad'];

    this.add.text(this.scale.width / 2, this.scale.height / 1.3, finalMessage, {
      fontSize: "20px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 20, y: 15 }, align: "center", wordWrap: { width: this.scale.width * 0.7 }
    }).setOrigin(0.5).setDepth(200);

    this.input.on("pointerdown", () => { this.scene.start("Shop"); });
  }
}