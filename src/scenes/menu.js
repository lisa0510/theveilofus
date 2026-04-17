import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("holz", "assets/holz.png");
    this.load.image("pinsel", "assets/pinsel.jpg");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.fadeIn(800);
    this.input.setDefaultCursor("crosshair");

    // 🪵 Background
    this.add.image(width / 2, height / 2, "holz").setDisplaySize(width, height);

    // 📄 Canvas setup
    const canvasWidth = 600;
    const canvasHeight = 400;
    const canvasX = width / 2 - canvasWidth / 2;
    const canvasY = height / 2 - canvasHeight / 2;

    // Shadow (nice effect)
    this.add.rectangle(
      canvasX + canvasWidth / 2 + 5,
      canvasY + canvasHeight / 2 + 5,
      canvasWidth,
      canvasHeight,
      0x000000,
      0.2
    );

    // White paper
    this.add.rectangle(
      canvasX + canvasWidth / 2,
      canvasY + canvasHeight / 2,
      canvasWidth,
      canvasHeight,
      0xffffff
    );

    // 🧠 RenderTexture (drawing surface)
    const rt = this.add
      .renderTexture(canvasX, canvasY, canvasWidth, canvasHeight)
      .setOrigin(0);

    // 🔥 IMPORTANT: invisible brush (no duplicate rendering)
    const brush = this.make.graphics({ x: 0, y: 0, add: false });

    this.settings = {
      brushSize: 8,
      color: 0x3b2a24,
      currentBrush: "marker",
    };

    this.canDraw = false;

    this.lastPos = null;

    // ✏️ DRAWING
    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown) return;
      if (!this.canDraw) return;

      const localX = pointer.x - canvasX;
      const localY = pointer.y - canvasY;

      // stay inside canvas
      if (
        localX < 0 ||
        localX > canvasWidth ||
        localY < 0 ||
        localY > canvasHeight
      ) {
        this.lastPos = null;
        return;
      }

      brush.clear();

      // MARKER (soft + slight wobble)
      if (this.settings.currentBrush === "marker") {
        if (this.lastPos) {
          const wobble = 1.5;

          brush.lineStyle(this.settings.brushSize, this.settings.color, 0.6);
          brush.lineBetween(
            this.lastPos.x + Phaser.Math.FloatBetween(-wobble, wobble),
            this.lastPos.y + Phaser.Math.FloatBetween(-wobble, wobble),
            localX + Phaser.Math.FloatBetween(-wobble, wobble),
            localY + Phaser.Math.FloatBetween(-wobble, wobble)
          );
        }
        this.lastPos = { x: localX, y: localY };

        // PENCIL
      } else if (this.settings.currentBrush === "pencil") {
        brush.fillStyle(this.settings.color, 1);
        brush.fillCircle(localX, localY, 1);
      }

      rt.draw(brush);
    });

    this.input.on("pointerup", () => {
      this.lastPos = null;
    });

    // 🎨 COLOR PALETTE
    const colors = [
      0x3b2a24,
      0xff0000,
      0x00aaff,
      0x00cc66,
      0xffff00,
      0xff66cc,
    ];

    const baseX = width - 280;
    const paletteY = height / 2;

    const currentColorPreview = this.add
      .rectangle(baseX, paletteY + 60, 40, 40, this.settings.color)
      .setStrokeStyle(2, 0x000000);

    colors.forEach((color, index) => {
      const swatch = this.add
        .rectangle(baseX + index * 45, paletteY, 30, 30, color)
        .setStrokeStyle(2, 0x000000)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.settings.color = color;
          currentColorPreview.fillColor = color;
        });

      swatch.on("pointerover", () => swatch.setScale(1.2));
      swatch.on("pointerout", () => swatch.setScale(1));
    });

    // 🧽 CLEAR BUTTON
    const clearBtn = this.add
      .text(30, 50, "Wipe Table", {
        fontSize: "25px",
        fontFamily: "cursive",
        backgroundColor: "#ce9b80",
        color: "#2b1f1f",
        padding: { x: 10, y: 5 },
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        rt.clear();
      });

    clearBtn.on("pointerover", () => clearBtn.setScale(1.05));
    clearBtn.on("pointerout", () => clearBtn.setScale(1));

    // 💬 NOTICE
    const notice = this.add
      .text(width / 2, height - 40, "Klara, möchtest du nicht etwas zeichnen?", {
        fontSize: "20px",
        color: "#3b2a24",
      })
      .setOrigin(0.5);

    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: notice,
        alpha: 0,
        duration: 500,
        onComplete: () => notice.destroy(),
      });
    });

    // ✅ DONE BUTTON
    const startBtn = this.add
      .text(width - 180, height - 80, "Done", {
        fontSize: "25px",
        fontFamily: "cursive",
        backgroundColor: "#ffffff",
        color: "#2b1f1f",
        padding: { x: 14, y: 8 },
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.input.setDefaultCursor("default");

        rt.snapshot((image) => {
          if (this.textures.exists("userDrawing")) {
            this.textures.remove("userDrawing");
          }

          this.textures.addImage("userDrawing", image);

          this.cameras.main.fadeOut(500);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Pinboard");
          });
        });
      });

    startBtn.on("pointerover", () => startBtn.setScale(1.05));
    startBtn.on("pointerout", () => startBtn.setScale(1));

    // Add pinsel image on the left side
    const pinselImg = this.add.image(80, height / 2, 'pinsel').setScale(0.5).setInteractive({ useHandCursor: true });
    pinselImg.on('pointerdown', () => {
      this.canDraw = true;
    });
  }
}