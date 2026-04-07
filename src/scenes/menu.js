import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("introBg", "/assets/MirrorView_BaristaStation_Blockout01.png");
    this.load.image("apronUp", "/assets/ApronON_BaristaStation_Blockout01.png");
    this.load.image("apronOff", "/assets/ApronOFF_BaristaStation_Blockout01.png");
    this.load.image("apron", "/assets/Apron_BaristaStation_Blockout01.png");
    this.load.audio("unc", "/assets/audio/unc_marin.mp3");
  }

  create() {
    const { width, height } = this.scale;
    const { centerX, centerY } = this.cameras.main;

    this.bg = this.add.image(centerX + 850, centerY, "introBg");
    this.bg.setDisplaySize(width * 1.1, height * 1.1);

    this.klaraApronOff = this.add.image(centerX * 1.7, centerY * 0.5, "apronOff");
    this.klaraApronOff.setScale(0.1);

    this.apron = this.add.image(centerX * 1.25, centerY * 0.92, "apron");
    this.apron.setScale(0.13);
    this.apron.setInteractive();

    this.title = this.add.text(centerX * 0.4, height * 0.3, "The Veil of Us", {
      fontSize: "50px",
      color: "#f5efe6",
      fontFamily: "cursive",
    }).setOrigin(0.5);

    this.startButton = this.add.rectangle(width * 0.2, height * 0.5, 240, 90, 0xffffff, 0.95);
    this.startButton.setStrokeStyle(2, 0x3b2a24);
    this.startButton.setInteractive({ useHandCursor: true });

    this.startText = this.add.text(width * 0.2, height * 0.5, "Start Game", {
      fontSize: "25px",
      color: "#000000",
      fontFamily: "cursive",
    }).setOrigin(0.5);

    this.settingsButton = this.add.rectangle(width * 0.2, height * 0.65, 240, 90, 0xffffff, 0.95);
    this.settingsButton.setStrokeStyle(2, 0x3b2a24);
    this.settingsButton.setInteractive({ useHandCursor: true });

    this.settingsText = this.add.text(width * 0.2, height * 0.65, "Settings", {
      fontSize: "25px",
      color: "#000000",
      fontFamily: "cursive",
    }).setOrigin(0.5);

    this.startButton.on("pointerdown", () => {
      //this.playIntroReveal();
      //this.time.delayedCall(2000, () => {
      //this.sound.play("unc", { volume: 1 });
      this.scene.start("Tutorial"); 
      //this.scene.start("day1_coffebar");
      //});
    });
  }

  update() {
    if (this.apron && this.klaraApronOff && this.dialogBox) {
      const distance = Phaser.Math.Distance.Between(
        this.apron.x,
        this.apron.y,
        this.klaraApronOff.x,
        this.klaraApronOff.y
      );

      if (distance < 150 && this.klaraApronOff.texture.key !== "apronUp") {
        this.wearApron();
      }
    }
  }

  wearApron() {
    this.klaraApronOff.setTexture("apronUp");
    this.apron.setVisible(false);
    this.apron.disableInteractive();

    // Feedback-Animation für Klara
    this.tweens.add({
      targets: this.klaraApronOff,
      scale: 0.11,
      duration: 100,
      yoyo: true,
      ease: "Quad.easeInOut"
    });

    // Dialogbox ausblenden
    if (this.dialogBox) {
      this.tweens.add({
        targets: [this.dialogBox, this.dialogText],
        alpha: 0,
        duration: 500
      });
    }
    
    this.time.delayedCall(1500, () => {
      this.scene.start("Tutorial"); 
    });
  }

  playIntroReveal() {
    this.startButton.disableInteractive();
    this.settingsButton.disableInteractive();

    this.tweens.add({
      targets: [
        this.startButton,
        this.startText,
        this.title,
        this.settingsButton,
        this.settingsText
      ],
      alpha: 0,
      duration: 1500,
      ease: "Sine.easeOut"
    });

    this.tweens.add({
      targets: [this.bg, this.klaraApronOff, this.apron],
      x: "-=850",
      duration: 3000,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.showApronDialogue();
      }
    });
  }

  showApronDialogue() {
    const { width, height } = this.scale;
    const boxX = width * 0.5;
    const boxY = height * 0.82;
    const boxWidth = width * 0.55;
    const boxHeight = 110;

    this.dialogBox = this.add.rectangle(
      boxX,
      boxY,
      boxWidth,
      boxHeight,
      0xf8f1e7,
      0.96
    );
    this.dialogBox.setStrokeStyle(2, 0x3b2a24);

    this.dialogText = this.add.text(
      boxX,
      boxY,
      "Zieh dir die Schürze an und zeig mir wie man den Kaffee zubereitet! Wir öffnen gleich, Klara!",
      {
        fontSize: "25px",
        color: "#2b1f1f",
        fontFamily: "cursive",
        align: "center",
        wordWrap: { width: boxWidth - 30 }
      }
    ).setOrigin(0.5);

    this.dialogBox.setAlpha(0);
    this.dialogText.setAlpha(0);

    this.tweens.add({
      targets: [this.dialogBox, this.dialogText],
      alpha: 1,
      duration: 500,
      ease: "Sine.easeOut"
    });

    this.input.setDraggable(this.apron);

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (gameObject === this.apron) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    });
  }
}