import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("holz", "assets/Chapter01/Menü/Hintergrund_Menü_Chapter01.png");
    this.load.audio("kids", "assets/audio/kids.mp3");
  }

  create() {
    const { width, height } = this.scale;

    this.music = this.sound.add("kids", { loop: true, volume: 0.6 });
    this.music.play();

    this.cameras.main.fadeIn(800);
    this.input.setDefaultCursor("crosshair");

    // 🪵 Background
    this.add.image(width / 2, height / 2, "holz").setDisplaySize(width, height);

    // 📄 Canvas setup
    const canvasWidth = 600;
    const canvasHeight = 400;
    const canvasX = width / 2 - canvasWidth / 2;
    const canvasY = height / 2 - canvasHeight / 2;

    // Shadow
    this.add.rectangle(
      canvasX + canvasWidth / 2 + 5,
      canvasY + canvasHeight / 2 + 5,
      canvasWidth,
      canvasHeight,
      0x000000,
      0.2
    );

    // Paper
    this.add.rectangle(
      canvasX + canvasWidth / 2,
      canvasY + canvasHeight / 2,
      canvasWidth,
      canvasHeight,
      0xffffff
    );

    // 🎨 Drawing surface
    const rt = this.add
      .renderTexture(canvasX, canvasY, canvasWidth, canvasHeight)
      .setOrigin(0);

    const brush = this.make.graphics({ x: 0, y: 0, add: false });

    this.settings = {
      brushSize: 14,
      color: 0x3b2a24,
    };

    this.canDraw = true;

    // 🎨 WATERCOLOR DRAWING
    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown || !this.canDraw) return;

      const localX = pointer.x - canvasX;
      const localY = pointer.y - canvasY;

      // stay inside paper
      if (
        localX < 0 ||
        localX > canvasWidth ||
        localY < 0 ||
        localY > canvasHeight
      ) return;

      brush.clear();

      const steps = 8;

      for (let i = 0; i < steps; i++) {
        const offsetX = Phaser.Math.FloatBetween(-10, 10);
        const offsetY = Phaser.Math.FloatBetween(-10, 10);

        const radius = Phaser.Math.FloatBetween(
          this.settings.brushSize * 0.5,
          this.settings.brushSize * 1.5
        );

        // slight color variation (very important for watercolor feel)
        const colorVariation = Phaser.Display.Color.IntegerToColor(this.settings.color);
        colorVariation.red += Phaser.Math.Between(-10, 10);
        colorVariation.green += Phaser.Math.Between(-10, 10);
        colorVariation.blue += Phaser.Math.Between(-10, 10);

        const finalColor = Phaser.Display.Color.GetColor(
          Phaser.Math.Clamp(colorVariation.red, 0, 255),
          Phaser.Math.Clamp(colorVariation.green, 0, 255),
          Phaser.Math.Clamp(colorVariation.blue, 0, 255)
        );

        const alpha = Phaser.Math.FloatBetween(0.02, 0.08);

        brush.fillStyle(finalColor, alpha);
        brush.fillCircle(localX + offsetX, localY + offsetY, radius);
      }

      rt.draw(brush);
    });

    // 🎨 COLOR PALETTE
    const colors = [
      0x3b2a24,
      0xff6b6b,
      0x4dabf7,
      0x51cf66,
      0xffd43b,
      0xf783ac,
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

    // 🧽 CLEAR
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

    // ✅ DONE
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

        if (this.music && this.music.isPlaying) {
          this.music.stop();
        }

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
  }
}