import Phaser from "phaser";
import DialogueManager from "../systems/dialogueManager.js";
import BoxManager from "../systems/boxManager.js";
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

    this.add.image(width / 2, height / 2, "shop_bg").setDisplaySize(width, height).setDepth(-10);
    this.add.image(width / 2, height / 2, "shop_bg2").setDisplaySize(width, height).setDepth(-5);
    this.add.image(width / 2, height / 1, "tisch").setScale(1.2).setDepth(-1);
    this.add.image(width / 2, height / 1.1, "cutting").setScale(0.7);
    this.add.image(width / 1.5, height / 1.1, "knive").setScale(0.15);

    this.coworker = this.add.image(width / 2, height / 1.8, "customer").setScale(0.6);

    this.dialogueManager = new DialogueManager(this);
    this.boxManager = new BoxManager(this);

    this.targetPercent = 50;
    this.totalFish = 4;
    this.currentFish = 0;
    this.cutResults = [];

    this.playerChoices = {
      whaleInteraction: [],
      fishChoices: []
    };

    this.startBox1();
  }

  startBox1() {
    this.boxManager.startBox(box1Data);
  }

  startCuttingPhase() {
    const { width, height } = this.scale;

    // Overlay und Brett anzeigen
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);
    this.boardImg = this.add.image(width / 2, height / 2, "board").setDepth(101).setScale(0.7);

    this.spawnFish(false); 

    this.dialogueManager.startDialogue(box1Data.fishIntro, () => {
      // Erst wenn der Dialog fertig ist, wird die Logik aktiviert
      this.activateCuttingLogic();
    });
  }

  spawnFish(activateLogic = true) {
    const { width, height } = this.scale;
    if (this.fish) this.fish.destroy();

    this.fish = this.add.image(width / 2, height / 2, "fish").setDepth(102);
    this.swipeGraphics = this.add.graphics().setDepth(110);

    if (activateLogic) {
      this.activateCuttingLogic();
    }
  }

  activateCuttingLogic() {
    let startPoint = null;

    this.input.once("pointerdown", (pointer) => {
      startPoint = { x: pointer.x, y: pointer.y };

      this.input.on("pointermove", (movePointer) => {
        if (movePointer.isDown && startPoint) {
          this.swipeGraphics.clear();
          this.swipeGraphics.lineStyle(5, 0xffffff, 1);
          this.swipeGraphics.lineBetween(startPoint.x, startPoint.y, movePointer.x, movePointer.y);
        }
      });

      this.input.once("pointerup", (pointerUp) => {
        this.swipeGraphics.clear();
        this.input.off("pointermove");
        this.handleSlice(startPoint, { x: pointerUp.x, y: pointerUp.y });
        startPoint = null;
      });
    });
  }

  handleSlice(start, end) {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    if (dx > dy * 0.3) {
      this.showInvalidFeedback("Invalid Cut! Cut vertically.");
      this.activateCuttingLogic();
      return;
    }

    const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
    if (distance < 80) {
      this.activateCuttingLogic();
      return;
    }

    const bounds = this.fish.getBounds();
    const line = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);

    if (!Phaser.Geom.Intersects.LineToRectangle(line, bounds)) {
      this.activateCuttingLogic();
      return;
    }

    const cutX = (start.x + end.x) / 2;
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const localX = Phaser.Math.Clamp(cutX - fishLeft, 0, this.fish.displayWidth);
    const percent = Math.round((localX / this.fish.displayWidth) * 100);

    this.cutResults.push(percent);
    this.animateSlice(localX, percent);
  }

  showInvalidFeedback(message) {
    const { width, height } = this.scale;
    if (this.errorText) this.errorText.destroy();

    this.errorText = this.add.text(width / 2, height / 2 - 150, message, {
      fontSize: "30px", color: "#ff0000", fontStyle: "bold", backgroundColor: "#000000aa", padding: { x: 15, y: 10 }
    }).setOrigin(0.5).setDepth(300);

    this.tweens.add({
      targets: this.errorText, alpha: 0, y: "-=30", duration: 1000,
      onComplete: () => { if (this.errorText) this.errorText.destroy(); }
    });
  }

  animateSlice(localX, percent) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;

    const leftHalf = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(0, 0, localX, h).setDepth(102);
    const rightHalf = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(localX, 0, w - localX, h).setDepth(102);

    this.fish.destroy();

    const diff = Math.abs(percent - 50);
    let feedback = diff === 0 ? "Perfect!" : diff <= 10 ? "Close!" : "Bad Cut!";

    const feedbackText = this.add.text(x, y - 120, `${feedback} ${percent}%`, {
      fontSize: "35px", color: "#ffff00"
    }).setOrigin(0.5).setDepth(200);

    this.tweens.add({ targets: leftHalf, x: x - 250, alpha: 0, duration: 400 });
    this.tweens.add({ targets: rightHalf, x: x + 250, alpha: 0, duration: 400 });

    this.time.delayedCall(500, () => {
      leftHalf.destroy();
      rightHalf.destroy();
      feedbackText.destroy();
      this.nextFish();
    });
  }

  nextFish() {
    this.currentFish++;
    if (this.currentFish < this.totalFish) {
      this.spawnFish(true); // Ab dem zweiten Fisch direkt die Logik aktivieren
    } else {
      this.finishBox();
    }
  }

  finishBox() {
    this.overlay.destroy();
    this.boardImg.destroy();
    const perfect = this.cutResults.every(cut => cut === 50);

    if (perfect) {
      this.dialogueManager.startDialogue(
        [{ text: "Oh good." }, { text: "Box 2 wartet bereits." }],
        () => { this.startBox2(); }
      );
    } else {
      this.startWhaleScene();
    }
  }

  startWhaleScene() {
    const { width, height } = this.scale;
    this.whale = this.add.image(width / 2, height / 2, "whale").setDepth(400);
    this.dialogueManager.startDialogue(
      box1Data.whaleDialogue,
      () => {
        this.whale.destroy();
        this.startBox2();
      }
    );
  }

  startBox2() {
    console.log("BOX 2");
  }
}