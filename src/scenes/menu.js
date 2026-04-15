import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.fadeIn(800);
    this.input.setDefaultCursor("crosshair");

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4e6c8);

    this.add.text(width / 2, 80, "The Veil Of Us", {
      fontSize: "48px",
      fontFamily: "cursive",
      color: "#3b2a24"
    }).setOrigin(0.5);

    // RenderTexture 
    const rt = this.add.renderTexture(0, 0, width, height).setOrigin(0);
    const brush = this.add.graphics();

    this.settings = {
      brushSize: 8,
      color: 0x3b2a24,
      currentBrush: "marker"
    };

    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown) return;

      brush.clear();
      if (this.settings.currentBrush === "marker") {
        brush.lineStyle(this.settings.brushSize, this.settings.color, 0.8);
        brush.lineBetween(
          pointer.prevPosition.x,
          pointer.prevPosition.y,
          pointer.x,
          pointer.y
        );

      } else if (this.settings.currentBrush === "pencil") {
        brush.fillStyle(this.settings.color, 1);
        brush.fillCircle(pointer.x, pointer.y, 1);

      } else if (this.settings.currentBrush === "watercolor") {
        for (let i = 0; i < 6; i++) {
          const x = pointer.x + Phaser.Math.FloatBetween(-10, 10);
          const y = pointer.y + Phaser.Math.FloatBetween(-10, 10);
          const radius = Phaser.Math.FloatBetween(5, 20);
          const alpha = Phaser.Math.FloatBetween(0.02, 0.05);

          brush.fillStyle(this.settings.color, alpha);
          brush.fillCircle(x, y, radius);
        }

      } else if (this.settings.currentBrush === "spray") {
        for (let i = 0; i < 10; i++) {
          const offsetX = Phaser.Math.Between(-15, 15);
          const offsetY = Phaser.Math.Between(-15, 15);
          brush.fillStyle(this.settings.color, 0.6);
          brush.fillCircle(pointer.x + offsetX, pointer.y + offsetY, 2);
        }
      }

      rt.draw(brush);
    });

    // 🧩 UI
    const buttons = [];

    const createBrushBtn = (x, y, label, type) => {
      const btn = this.add.text(x, y, label, {
        fontSize: "20px",
        fontFamily: "cursive",
        backgroundColor: "#e6d3b3",
        color: "#3b2a24",
        padding: { x: 12, y: 6 }
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        buttons.forEach(b => b.setBackgroundColor("#e6d3b3"));
        this.settings.currentBrush = type;
        btn.setBackgroundColor("#d8b892");
      });

      btn.on("pointerover", () => btn.setScale(1.05));
      btn.on("pointerout", () => btn.setScale(1));

      buttons.push(btn);
      return btn;
    };

    createBrushBtn(30, 120, "Marker", "marker");
    createBrushBtn(30, 170, "Pencil", "pencil");
    createBrushBtn(30, 220, "Watercolor", "watercolor");
    createBrushBtn(30, 270, "Spray", "spray");

    const clearBtn = this.add.text(30, 50, "Wipe Table", {
      fontSize: "25px",
      fontFamily: "cursive",
      backgroundColor: "#ce9b80ff",
      color: "#2b1f1f",
      padding: { x: 10, y: 5 }
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      rt.clear();
    });

    clearBtn.on("pointerover", () => clearBtn.setScale(1.05));
    clearBtn.on("pointerout", () => clearBtn.setScale(1));

    const notice = this.add.text(width / 2, height - 40, 'Klara, möchtest du nicht etwas zeichnen?', {
      fontSize: '20px',
      color: '#3b2a24'
    }).setOrigin(0.5);

    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: notice,
        alpha: 0,
        duration: 500,
        onComplete: () => notice.destroy()
      });
    });

    const startBtn = this.add.text(width - 180, height - 80, "Done", {
      fontSize: "25px",
      fontFamily: "cursive",
      backgroundColor: "#ce9b80ff",
      color: "#2b1f1f",
      padding: { x: 14, y: 8 }
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      // Sofort das Fadenkreuz entfernen, damit es nicht im Bild ist
      this.input.setDefaultCursor("default");
      
      // Snapshot vom RenderTexture machen
      rt.snapshot((image) => {
        // WICHTIG: Wir nutzen den globalen texture manager
        if (this.textures.exists('userDrawing')) {
          this.textures.remove('userDrawing');
        }
        
        this.textures.addImage('userDrawing', image);
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start("Pinboard");
        });
      });
    });

    startBtn.on("pointerover", () => startBtn.setScale(1.05));
    startBtn.on("pointerout", () => startBtn.setScale(1));
  }
}