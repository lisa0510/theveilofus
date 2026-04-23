import Phaser from "phaser";

export default class Fish extends Phaser.Scene {
  constructor() {
    super("Fish");
  }

  preload() {
    this.load.image("fish", "assets/fish.png"); // your fish sprite
    this.load.image("dot", "assets/dot.png");   // small circle for particles (optional)
  }

  create() {
    const { width, height } = this.scale;

    // 🎯 Target (example: 19%)
    this.targetPercent = 0.19;

    // 🐟 Fish
    this.fish = this.add.image(width / 2, height / 2, "fish");

    // 🎯 Debug text
    this.resultText = this.add.text(20, 20, "", {
      fontSize: "24px",
      color: "#e8d4d4"
    });

    // 🖱 Input
    this.input.on("pointerdown", (pointer) => {
      this.makeCut(pointer.x);
    });
  }

  // ✂️ CUT LOGIC
  makeCut(cutX) {
    const fish = this.fish;

    const fishLeft = fish.x - fish.displayWidth / 2;

    // clamp inside fish
    const clampedX = Phaser.Math.Clamp(
      cutX,
      fishLeft,
      fishLeft + fish.displayWidth
    );

    const localCut = clampedX - fishLeft;
    const percent = localCut / fish.displayWidth;

    // 🧠 evaluate
    this.evaluateCut(percent);

    // ✂️ visual slicing
    this.sliceFish(clampedX, localCut);
  }

  // 🧠 EVALUATION
  evaluateCut(playerPercent) {
    const error = Math.abs(playerPercent - this.targetPercent);

    let result = "";

    if (error < 0.03) {
      result = "Perfect!";
    } else if (error < 0.08) {
      result = "Okay...";
    } else {
      result = "Bad cut!";
    }

    this.resultText.setText(
      `Target: ${Math.round(this.targetPercent * 100)}%\n` +
      `You: ${Math.round(playerPercent * 100)}%\n` +
      result
    );
  }

  // 🔪 SLICE VISUAL
  sliceFish(cutX, localCut) {
    const fish = this.fish;

    const fishWidth = fish.displayWidth;
    const fishHeight = fish.displayHeight;

    // LEFT PIECE
    const leftPiece = this.add.image(fish.x, fish.y, "fish");
    leftPiece.setDisplaySize(fishWidth, fishHeight);

    leftPiece.setCrop(
      0,
      0,
      localCut,
      fishHeight
    );

    // RIGHT PIECE
    const rightPiece = this.add.image(fish.x, fish.y, "fish");
    rightPiece.setDisplaySize(fishWidth, fishHeight);

    rightPiece.setCrop(
      localCut,
      0,
      fishWidth - localCut,
      fishHeight
    );

    // Hide original fish
    fish.setVisible(false);

    // ✨ CUT LINE FLASH
    const line = this.add.rectangle(
      cutX,
      fish.y,
      4,
      fishHeight,
      0xff4444
    ).setDepth(10);

    this.tweens.add({
      targets: line,
      alpha: 0,
      duration: 200,
      onComplete: () => line.destroy()
    });

    // 💥 MOVE PIECES APART
    this.tweens.add({
      targets: leftPiece,
      x: fish.x - 50,
      angle: -8,
      duration: 300,
      ease: "Power2"
    });

    this.tweens.add({
      targets: rightPiece,
      x: fish.x + 50,
      angle: 8,
      duration: 300,
      ease: "Power2"
    });

    // 💦 PARTICLES (optional)
    if (this.textures.exists("dot")) {
      const particles = this.add.particles(0, 0, "dot", {
        x: cutX,
        y: fish.y,
        speed: { min: -120, max: 120 },
        scale: { start: 0.3, end: 0 },
        lifespan: 300,
        quantity: 12
      });

      this.time.delayedCall(300, () => particles.destroy());
    }
  }
}