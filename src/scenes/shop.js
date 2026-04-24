import Phaser from "phaser";

export default class Shop extends Phaser.Scene {
  constructor() {
    super("Shop");
  }

  preload() {
    this.load.image("shop_bg", "assets/Fish/Hintergrund.png");
    this.load.image("cutting", "assets/Fish/Cuttingboard.png");
    this.load.image("customer", "assets/Fish/TaucherWarten.png");
    this.load.image("tisch", "assets/Fish/Tisch.png");
    this.load.image("knive", "assets/Fish/knive.png");
    this.load.image("fish", "assets/fish.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "shop_bg")
      .setDisplaySize(width, height).setDepth(-2);

    this.add.image(width / 2, height / 1, "tisch")
      .setScale(1.2).setDepth(-1);

    this.add.image(width / 2, height / 1.1, "cutting")
      .setScale(0.7);

    let customer = this.add.image(width / 3, height / 1.8, "customer")
      .setScale(0.8)
      .setInteractive({ useHandCursor: true });

    this.add.image(width / 1.5, height / 1.1, "knive")
      .setScale(0.15);

    this.targetCM = 54;

    this.orderText = this.add.text(width / 2, height / 2,
      `Cut it: ${this.targetCM} cm`,
      { fontSize: "28px", color: "#fff" }
    ).setOrigin(0.5);

    customer.on("pointerdown", () => {
      this.startCutting();
    });
  }

  // =========================
  // 🎬 START CUTTING
  // =========================

  startCutting() {
    const { width, height } = this.scale;

    this.cuts = [];
    this.currentFishIndex = 0;
    this.totalFish = 3;

    this.overlay = this.add.rectangle(
      width / 2, height / 2,
      width, height,
      0x000000, 0.6
    ).setDepth(100);

    this.spawnFish();
  }

  spawnFish() {
  const { width, height } = this.scale;

  if (this.fish) this.fish.destroy();

  this.fish = this.add.image(width / 2, height / 2, "fish")
    .setDepth(101);

  this.isDragging = false;

  this.cutLine = this.add.rectangle(0, 0, 3, this.fish.displayHeight, 0xff4444)
    .setVisible(false)
    .setDepth(102);

  // 🔥 IMPORTANT: wait before enabling input
  this.time.delayedCall(200, () => {

    this.input.once("pointerdown", () => {
      this.isDragging = true;
      this.cutLine.setVisible(true);

      this.input.on("pointermove", this.updateCutLine, this);

      this.input.once("pointerup", (pointer) => {
        this.finishCut(pointer.x);
      });
    });

  });
}

  // =========================
  // 🔴 LIVE CUT LINE
  // =========================

  updateCutLine(pointer) {
    if (!this.isDragging) return;

    const fish = this.fish;
    const fishLeft = fish.x - fish.displayWidth / 2;

    const clampedX = Phaser.Math.Clamp(
      pointer.x,
      fishLeft,
      fishLeft + fish.displayWidth
    );

    this.cutLine.setPosition(clampedX, fish.y);
  }

  // =========================
  // ✂️ FINISH CUT
  // =========================

  finishCut(cutX) {
    this.isDragging = false;

    this.input.off("pointermove", this.updateCutLine, this);

    const fish = this.fish;
    const fishLeft = fish.x - fish.displayWidth / 2;

    const clampedX = Phaser.Math.Clamp(
      cutX,
      fishLeft,
      fishLeft + fish.displayWidth
    );

    const localCut = clampedX - fishLeft;
    const percent = localCut / fish.displayWidth;
    const cm = Math.round(percent * 100);

    this.cuts.push(cm);

    this.sliceFish(clampedX, localCut);

    // show result briefly
    const resultText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 150,
      `${cm}%`,
      { fontSize: "32px", color: "#fff" }
    ).setOrigin(0.5).setDepth(200);

    this.time.delayedCall(800, () => {
      resultText.destroy();
      this.nextFish();
    });
  }


  sliceFish(cutX, localCut) {
    const fish = this.fish;

    const w = fish.displayWidth;
    const h = fish.displayHeight;

    const left = this.add.image(fish.x, fish.y, "fish")
      .setDisplaySize(w, h)
      .setCrop(0, 0, localCut, h)
      .setDepth(102);

    const right = this.add.image(fish.x, fish.y, "fish")
      .setDisplaySize(w, h)
      .setCrop(localCut, 0, w - localCut, h)
      .setDepth(102);

    fish.destroy();

    this.tweens.add({
      targets: left,
      x: fish.x - 60,
      angle: -8,
      duration: 300
    });

    this.tweens.add({
      targets: right,
      x: fish.x + 60,
      angle: 8,
      duration: 300
    });

        this.cutLine.destroy();
        this.time.delayedCall(600, () => {
    left.destroy();
    right.destroy();
    });
  }

 
  nextFish() {
    this.currentFishIndex++;

    if (this.currentFishIndex >= this.totalFish) {
      this.finishCutting();
    } else {
      this.spawnFish();
    }
  }


  finishCutting() {
    
    const avg = this.cuts.reduce((a, b) => a + b, 0) / this.cuts.length;

    const diff = Math.abs(avg - this.targetCM);

    let text;

    if (diff <= 2) text = "Perfect!";
    else if (diff <= 10) text = "Okay...";
    else text = "Bad cut!";

    const result = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      text,
      { fontSize: "36px", color: "#fff", backgroundColor: "#000" }
    ).setOrigin(0.5).setDepth(200);

    this.time.delayedCall(500, () => {
      result.destroy();
      this.closeOverlay();
    });
  }

  closeOverlay() {
    this.overlay.destroy();
    if (this.fish) this.fish.destroy();
  }
}