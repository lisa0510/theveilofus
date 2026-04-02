import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("introBg", "/assets/blockout/baristaStation/MirrorView_BaristaStation_Blockout01.png");
  }

  create() {
    const { width, height } = this.scale;
    const { centerX, centerY } = this.cameras.main;

    // großes Hintergrundbild
    // absichtlich seitlich verschoben starten
    this.bg = this.add.image(centerX + 850, centerY, "introBg");
    this.bg.setDisplaySize(width * 1.1, height * 1.1);

    // optional dunkler Overlay für mehr Atmosphäre
    //this.overlay = this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.15);

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

    // Start Game Klick
    this.startButton.on("pointerdown", () => {
      this.playIntroReveal();
    });
  }

  playIntroReveal() {
    this.startButton.disableInteractive();
    this.settingsButton.disableInteractive();

    // Buttons ausblenden
    this.tweens.add({
      targets: [
        this.startButton,
        this.startText,
        this.settingsButton,
        this.settingsText,
        this.title
      ],
      alpha: 0,
      y: "-=20",
      duration: 800,
      ease: "Sine.easeOut"
    });

    // Hintergrund smooth in die Mitte bewegen Animation
    this.tweens.add({
      targets: this.bg,
      x: this.cameras.main.centerX,
      overlay: 0.85,
      duration: 2000,
      ease: "Sine.easeInOut"
    });

   
  }
}