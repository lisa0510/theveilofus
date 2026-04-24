import Phaser from "phaser";
import customers from "../customers"; 

export default class Shop extends Phaser.Scene {
  constructor() {
    super("Shop");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish/Hintergrund.png");
    this.load.image("cutting", "assets/Fish/Cuttingboard.png");
    this.load.image("customer", "assets/Fish02/TaucherBoxOffen.png");
    this.load.image("tisch", "assets/Fish/Tisch.png");
    this.load.image("knive", "assets/Fish/knive.png");
    this.load.image("fish", "assets/fish.png");
    this.load.image("hoverfish", "assets/Fish/hoverfish.png");
  }

  create() {
    const { width, height } = this.scale;

    // 1. Hintergrund & Statische Objekte
    this.add.image(width / 2, height / 2, "shop_bg").setDisplaySize(width, height).setDepth(-10);
    this.add.image(width / 2, height / 1, "tisch").setScale(1.2).setDepth(-1);
    this.add.image(width / 2, height / 1.1, "cutting").setScale(0.7);
    this.add.image(width / 1.5, height / 1.1, "knive").setScale(0.15);

    // Hover Fish Initialisierung
    this.hoverFish = this.add.image(width / 2, height - 100, "hoverfish")
      .setScale(0.2)
      .setVisible(false)
      .setAlpha(0.3)
      .setDepth(2);

    // 2. Status-Variablen
    this.currentCustomerIndex = 0;
    this.activeCustomerSprite = null;
    this.activeCustomerNameTag = null;
    this.activeCustomer = null;
    this.currentFishIndexInternal = 0; // WICHTIG: Hier für alle Funktionen verfügbar

    this.orderText = this.add.text(width / 1.5, height / 2, "Wait", { 
        fontSize: "32px", 
        color: "#fff",
        fontStyle: "bold",
    }).setOrigin(0.5);

    this.spawnNextCustomer();
  }

  spawnNextCustomer() {
    const { width, height } = this.scale;

    if (this.currentCustomerIndex >= customers.length) {
        this.orderText.setText("Alle Kunden bedient.");
        return;
    }

    const data = customers[this.currentCustomerIndex];
    this.activeCustomer = data;

    this.activeCustomerSprite = this.add.image(width / 2, height / 1.7, "customer")
        .setScale(0.6)
        .setAlpha(0)
        .setInteractive({ useHandCursor: true })
        .setDepth(-2);

    this.activeCustomerNameTag = this.add.text(width / 2, height / 1.3, data.name, { 
        fontSize: "24px", 
        fill: "#fff",
        fontStyle: "bold",
        backgroundColor: "#00000088",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setAlpha(0);

    // Hover Events
    this.activeCustomerSprite.on("pointerover", () => {
        this.hoverFish.setVisible(true);
        this.tweens.add({
            targets: this.hoverFish,
            y: height - 115,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    });

    this.activeCustomerSprite.on("pointerout", () => {
        this.hoverFish.setVisible(false);
        this.tweens.killTweensOf(this.hoverFish);
    });

    // Fade In Animation
    this.tweens.add({
        targets: [this.activeCustomerSprite, this.activeCustomerNameTag],
        alpha: 1,
        duration: 500
    });

    this.orderText.setText(`Cut it ${data.order} cm`);

    this.activeCustomerSprite.on("pointerdown", () => {
        this.hoverFish.setVisible(false);
        this.tweens.killTweensOf(this.hoverFish);
        this.startCutting();
    });
  }

  startCutting() {
    const { width, height } = this.scale;
    this.targetCM = this.activeCustomer.order;
    this.orderText.setText(`${this.activeCustomer.name} möchte: ${this.targetCM} cm`);

    this.cuts = [];
    this.currentFishIndexInternal = 0; // Reset für neue Runde
    this.totalFish = 3;

    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);
    this.spawnFish();
  }

  spawnFish() {
    const { width, height } = this.scale;
    if (this.fish) this.fish.destroy();
    this.fish = this.add.image(width / 2, height / 2, "fish").setDepth(101);
    this.isDragging = false;
    this.cutLine = this.add.rectangle(0, 0, 4, this.fish.displayHeight, 0xff0000).setVisible(false).setDepth(102);

    this.time.delayedCall(200, () => {
        this.input.once("pointerdown", () => {
            this.isDragging = true;
            this.cutLine.setVisible(true);
            this.input.on("pointermove", this.updateCutLine, this);
            this.input.once("pointerup", (pointer) => { this.finishCut(pointer.x); });
        });
    });
  }

  updateCutLine(pointer) {
    if (!this.isDragging || !this.fish) return;
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const clampedX = Phaser.Math.Clamp(pointer.x, fishLeft, fishLeft + this.fish.displayWidth);
    this.cutLine.setPosition(clampedX, this.fish.y);
  }

  finishCut(cutX) {
    this.isDragging = false;
    this.input.off("pointermove", this.updateCutLine, this);
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const clampedX = Phaser.Math.Clamp(cutX, fishLeft, fishLeft + this.fish.displayWidth);
    const localCut = clampedX - fishLeft;
    const cm = Math.round((localCut / this.fish.displayWidth) * 100);
    this.cuts.push(cm);
    this.sliceFish(clampedX, localCut);

    const resultText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 180, `${cm} cm`, { 
        fontSize: "48px", color: "#ffff00", fontStyle: "bold"
    }).setOrigin(0.5).setDepth(200);

    this.time.delayedCall(800, () => {
        resultText.destroy();
        this.nextFish();
    });
  }

  sliceFish(cutX, localCut) {
    const { x, y, displayWidth: w, displayHeight: h } = this.fish;
    const left = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(0, 0, localCut, h).setDepth(102);
    const right = this.add.image(x, y, "fish").setDisplaySize(w, h).setCrop(localCut, 0, w - localCut, h).setDepth(102);
    this.fish.destroy();
    this.cutLine.setVisible(false);
    this.tweens.add({ targets: left, x: x - 80, angle: -15, duration: 400, ease: 'Power2' });
    this.tweens.add({ targets: right, x: x + 80, angle: 15, duration: 400, ease: 'Power2' });
    this.time.delayedCall(600, () => { left.destroy(); right.destroy(); });
  }

  nextFish() {
    this.currentFishIndexInternal++;
    if (this.currentFishIndexInternal >= this.totalFish) {
        this.finishCutting();
    } else {
        this.spawnFish();
    }
  }

  finishCutting() {
    const avg = this.cuts.reduce((a, b) => a + b, 0) / this.cuts.length;
    const diff = Math.abs(avg - this.targetCM);
    let feedback, feedbackColor;

    if (diff <= 3) { feedback = this.activeCustomer.reactions.perfect; feedbackColor = "#00ff00"; }
    else if (diff <= 12) { feedback = this.activeCustomer.reactions.okay; feedbackColor = "#ffff00"; }
    else { feedback = this.activeCustomer.reactions.bad; feedbackColor = "#ff0000"; this.cameras.main.shake(300, 0.01); }

    // --- OVERLAY ZUERST ENTFERNEN ---
    if (this.overlay) this.overlay.destroy();
    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();

    const finalResult = this.add.text(this.scale.width / 1.5, this.scale.height / 2,
        `${this.activeCustomer.name}:\n"${feedback}"`,
        { 
            fontSize: "32px", 
            color: feedbackColor, 
            backgroundColor: "#000000aa", 
            padding: { x: 20, y: 20 }, 
            align: "center", 
            wordWrap: { width: 600 } 
        }
    ).setOrigin(0.5).setDepth(200);

    this.time.delayedCall(3000, () => {
        finalResult.destroy();
        this.prepareNextCustomer(); // Aufruf der neuen Funktion
    });
  }

  prepareNextCustomer() {
    // Alten Kunden löschen
    if (this.activeCustomerSprite) this.activeCustomerSprite.destroy();
    if (this.activeCustomerNameTag) this.activeCustomerNameTag.destroy();

    // Index erhöhen und neuen Kunden spawnen
    this.currentCustomerIndex++;
    this.spawnNextCustomer();
  }
}