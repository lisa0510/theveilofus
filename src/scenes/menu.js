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
    const canvasWidth = 850;
    const canvasHeight = 550;
    this.canDraw = true;

    const canvasContainer = this.add.container(width / 2, height / 2);

    const shadow = this.add.rectangle(8, 8, canvasWidth, canvasHeight, 0x000000, 0.2);
    const paper = this.add.rectangle(0, 0, canvasWidth, canvasHeight, 0xffffff);

    const rt = this.add.renderTexture(0, 0, canvasWidth, canvasHeight)
  .setOrigin(0.5);

    canvasContainer.add([shadow, paper, rt]);
    canvasContainer.setAngle(-2.5);

    const brush = this.make.graphics({ x: 0, y: 0, add: false });

    this.settings = {
      brushSize: 14,
      color: 0x3b2a24,
    };
    // ✏️ DRAWING (FINAL FIX FOR ROTATED CANVAS)
this.input.on("pointermove", (pointer) => {
  if (!pointer.isDown || !this.canDraw) return;

  const localPoint = canvasContainer.getLocalPoint(pointer.x, pointer.y);

const drawX = localPoint.x + canvasWidth / 2;
const drawY = localPoint.y + canvasHeight / 2;

  // 3. Strict boundary check: Only draw if inside the 0 to Width/Height range
  if (drawX < 0 || drawX > canvasWidth || drawY < 0 || drawY > canvasHeight) return;

  // 4. Clear the brush graphics before drawing the new "dab" of paint
  brush.clear();

  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const offsetX = Phaser.Math.FloatBetween(-10, 10);
    const offsetY = Phaser.Math.FloatBetween(-10, 10);
    const radius = Phaser.Math.FloatBetween(
      this.settings.brushSize * 0.5,
      this.settings.brushSize * 1.5
    );

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
    
    // We draw the circle at the calculated local coordinates
    brush.fillCircle(drawX + offsetX, drawY + offsetY, radius);
  }

  // 5. Draw the brush to the RenderTexture
  // We do NOT pass drawX, drawY here because the brush already has the coordinates inside it
  rt.draw(brush);
});

    // 🎨 COLORS
    const colors = [0x3b2a24, 0xff6b6b, 0x4dabf7, 0x51cf66, 0xffd43b, 0xf783ac];

    const baseX = width - 120;
    const paletteY = height / 4;

    const currentColorPreview = this.add
      .rectangle(baseX, paletteY - 60, 40, 40, this.settings.color)
      .setStrokeStyle(2, 0x000000);

    colors.forEach((color, index) => {
      const swatch = this.add
        .rectangle(baseX, paletteY + index * 45, 30, 30, color)
        .setStrokeStyle(2, 0x000000)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.settings.color = color;
          currentColorPreview.fillColor = color;
        });

      swatch.on("pointerover", () => swatch.setScale(1.2));
      swatch.on("pointerout", () => swatch.setScale(1));
    });

    // ✅ DONE BUTTON
    const startBtn = this.add
      .text(width - 100, height - 50, "Done", {
        fontSize: "25px",
        fontFamily: "cursive",
        backgroundColor: "#ffffff",
        color: "#2b1f1f",
        padding: { x: 14, y: 8 },
      })
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.input.setDefaultCursor("default");
        this.canDraw = false;

        if (this.music && this.music.isPlaying) {
          this.music.stop();
        }

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0)
          .setDepth(90);

        this.tweens.add({
          targets: overlay,
          fillAlpha: 0.8,
          duration: 500
        });

        rt.snapshot((image) => {
          if (this.textures.exists("userDrawing")) {
            this.textures.remove("userDrawing");
          }

          this.textures.addImage("userDrawing", image);

          const transitionText = this.add.text(
            width / 2,
            height / 2,
            "placeholder for chapter 1 animation",
            {
              fontSize: "22px",
              fontFamily: "cursive",
              color: "#ffffff",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: { x: 12, y: 8 },
              align: "center"
            }
          )
            .setOrigin(0.5)
            .setDepth(100)
            .setAlpha(0);

          this.tweens.add({
            targets: transitionText,
            alpha: 1,
            duration: 500,
          });

          this.time.delayedCall(2000, () => {
            this.cameras.main.fadeOut(800);
            this.cameras.main.once("camerafadeoutcomplete", () => {
              this.scene.start("Pinboard");
            });
          });
        });
      });
  }
}