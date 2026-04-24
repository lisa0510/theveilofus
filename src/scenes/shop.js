import Phaser from "phaser";
import customers from "../customers";

export default class Shop extends Phaser.Scene {
  constructor() {
    super("Shop");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish02/Hintergrund.png");
    this.load.image("shop_bg2", "assets/Fish02/Vorderhintergrund.png");
    this.load.image("cutting", "assets/Fish/Cuttingboard.png");
    this.load.image("customer", "assets/Fish02/TaucherBoxOffen.png");
    this.load.image("customer_done", "assets/Fish02/TaucherBoxZu.png");
    this.load.image("tisch", "assets/Fish/Tisch.png");
    this.load.image("knive", "assets/Fish/knive.png");
    this.load.image("fish", "assets/fish.png");
    this.load.image("hoverfish", "assets/Fish/hoverfish.png");
    this.load.image("whale", "assets/Fish/GedankeNormal.png"); 
    this.load.image("whale_choice1", "assets/Fish02/GrosserWal.png"); 
    this.load.image("whale_choice2", "assets/Fish02/GrosserWal.png");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "shop_bg").setDisplaySize(width, height).setDepth(-10);
    this.add.image(width / 2, height / 2, "shop_bg2").setDisplaySize(width, height).setDepth(-5);
    this.add.image(width / 2, height / 1, "tisch").setScale(1.2).setDepth(-1);
    this.add.image(width / 2, height / 1.1, "cutting").setScale(0.7);
    this.add.image(width / 1.5, height / 1.1, "knive").setScale(0.15);

    this.hoverFish = this.add.image(width / 2, height - 100, "hoverfish").setScale(0.2).setVisible(false).setAlpha(0.3).setDepth(2);

    this.currentCustomerIndex = 0;
    this.activeCustomerSprite = null;
    this.activeCustomerNameTag = null;
    this.activeCustomer = null;
    this.currentFishIndexInternal = 0;

    this.orderText = this.add.text(width / 1.4, height / 2, "", { fontSize: "30px", color: "#fff" }).setOrigin(0.5);

    this.spawnNextCustomer();
  }

  spawnNextCustomer() {
    const { width, height } = this.scale;
    if (this.currentCustomerIndex >= customers.length) {
      this.orderText.setText("Feierabend!").setBackgroundColor("transparent");
      return;
    }

    const data = customers[this.currentCustomerIndex];
    this.activeCustomer = data;

    this.activeCustomerSprite = this.add.image(width / 2, height / 1.7, "customer").setScale(0.6).setAlpha(0).setInteractive({ useHandCursor: true }).setDepth(-2);
    this.activeCustomerNameTag = this.add.text(width / 2, height / 1.3, data.name, { fontSize: "24px", fill: "#fff", fontStyle: "bold", backgroundColor: "#00000088", padding: { x: 10, y: 5 } }).setOrigin(0.5).setAlpha(0);

    this.activeCustomerSprite.on("pointerover", () => {
      this.hoverFish.setVisible(true);
      this.tweens.add({ targets: this.hoverFish, y: height - 115, duration: 300, yoyo: true, repeat: -1 });
    });

    this.activeCustomerSprite.on("pointerout", () => {
      this.hoverFish.setVisible(false);
      this.tweens.killTweensOf(this.hoverFish);
    });

    this.tweens.add({ targets: [this.activeCustomerSprite, this.activeCustomerNameTag], alpha: 1, duration: 500 });
    this.orderText.setText(`Cut it ${data.order} cm`).setColor("#ffffff").setBackgroundColor("transparent");

    this.activeCustomerSprite.on("pointerdown", () => {
      this.hoverFish.setVisible(false);
      this.tweens.killTweensOf(this.hoverFish);
      this.activeCustomerSprite.setTexture("customer_done");
      this.startCutting();
    });
  }

  startCutting() {
    const { width, height } = this.scale;
    this.cuts = [];
    this.currentFishIndexInternal = 0;
    this.totalFish = 3;
    this.targetCM = this.activeCustomer.order;
    this.orderText.setText(`${this.activeCustomer.name} möchte: ${this.targetCM} cm`);
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100).setInteractive();
    this.spawnFish();
  }

  spawnFish() {
    const { width, height } = this.scale;
    if (this.fish) this.fish.destroy();
    this.fish = this.add.image(width / 2, height / 2, "fish").setDepth(101);
    this.isDragging = false;
    this.cutLine = this.add.rectangle(0, 0, 4, this.fish.displayHeight, 0xff0000).setVisible(false).setDepth(102);

    this.time.delayedCall(200, () => {
      this.input.once("pointerdown", (pointer) => {
        this.isDragging = true;
        this.cutLine.setVisible(true);
        this.updateCutLine(pointer);
        this.input.on("pointermove", this.updateCutLine, this);
        this.input.once("pointerup", (p) => { this.finishCut(p.x); });
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
    if (!this.fish || !this.fish.active) return;
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    const clampedX = Phaser.Math.Clamp(cutX, fishLeft, fishLeft + this.fish.displayWidth);
    const localCut = clampedX - fishLeft;
    const cm = Math.round((localCut / this.fish.displayWidth) * 100);
    this.cuts.push(cm);
    this.sliceFish(clampedX, localCut);

    const resultText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 180, `${cm} cm`, { fontSize: "48px", color: "#ffff00", fontStyle: "bold" }).setOrigin(0.5).setDepth(200);
    this.time.delayedCall(800, () => {
      if (resultText) resultText.destroy();
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
    if (this.currentFishIndexInternal >= this.totalFish) this.finishCutting();
    else this.spawnFish();
  }

  finishCutting() {
    const avg = this.cuts.reduce((a, b) => a + b, 0) / this.cuts.length;
    const diff = Math.abs(avg - this.targetCM);
    let feedback, feedbackColor;

    if (diff <= 3) { feedback = this.activeCustomer.reactions.perfect; feedbackColor = "#00ff00"; }
    else if (diff <= 12) { feedback = this.activeCustomer.reactions.okay; feedbackColor = "#ffff00"; }
    else { feedback = this.activeCustomer.reactions.bad; feedbackColor = "#ff0000"; this.cameras.main.shake(300, 0.01); }

    this.cleanupCuttingUI();
    this.orderText.setText(`${this.activeCustomer.name}:\n"${feedback}"`).setColor(feedbackColor).setFontSize('30px');

    if (diff > 12) {
      this.time.delayedCall(1500, () => this.showWhaleEncounter());
    } else {
      this.time.delayedCall(3000, () => this.prepareNextCustomer());
    }
  }

  showWhaleEncounter() {
    const { width, height } = this.scale;
    this.whaleContainer = this.add.container(0, 0).setDepth(8);
    this.whaleSprite = this.add.image(width / 1.7, height / 3, "whale").setScale(0.2);
    
    this.whaleUIElements = [];

    const whaleText = this.add.text(width / 2, height / 2 - 120, "You are useless\nHow bad can someone be?", {
      fontSize: "30px", fill: "#fff", backgroundColor: "#000000aa", padding: 10, align: "center"
    }).setOrigin(0.5);

    const choice1 = this.add.text(width / 3, height / 2 , "I know I didnt do a good job", { fontSize: "20px", fill: "#fff", backgroundColor: "#333", padding: 5 })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleWhaleChoice("whale_choice1"));

    const choice2 = this.add.text(width / 1.7 , height / 2, "But I tried my best!", { fontSize: "20px", fill: "#fff", backgroundColor: "#333", padding: 5 })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.handleWhaleChoice("whale_choice2"));

    this.whaleUIElements.push(whaleText, choice1, choice2);
    this.whaleContainer.add([this.whaleSprite, ...this.whaleUIElements]);

    // Automatisches Schließen nach 5s, falls der User GAR NICHTS macht
    this.whaleTimer = this.time.delayedCall(5000, () => this.closeWhale());
  }

  handleWhaleChoice(newTexture) {
  const { width, height } = this.scale;

  if (this.whaleTimer) this.whaleTimer.remove();
  this.whaleSprite.setTexture(newTexture);
  this.whaleContainer.remove(this.whaleSprite);
  this.whaleSprite.setOrigin(0.5);
  this.whaleSprite.setPosition(width / 1.3, height / 4.5).setScale(0.6).setDepth(-6).setAlpha(1).setVisible(true);
  this.whaleUIElements.forEach(el => el.destroy());

  this.input.once("pointerdown", () => {
    this.closeWhale();
  });
}

  closeWhale() {
    if (this.whaleTimer) this.whaleTimer.remove();
    if (this.whaleContainer) this.whaleContainer.destroy();
    this.prepareNextCustomer();
  }

  cleanupCuttingUI() {
    if (this.overlay) this.overlay.destroy();
    if (this.fish) this.fish.destroy();
    if (this.cutLine) this.cutLine.destroy();
  }

  prepareNextCustomer() {
    if (this.activeCustomerSprite) this.activeCustomerSprite.destroy();
    if (this.activeCustomerNameTag) this.activeCustomerNameTag.destroy();
    this.currentCustomerIndex++;
    this.spawnNextCustomer();
  }
}