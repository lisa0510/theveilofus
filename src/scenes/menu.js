import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("introBg", "/assets/blockout/baristaStation/MirrorView_BaristaStation_Blockout01.png");
    this.load.image("apronUp", "/assets/blockout/baristaStation/ApronON_BaristaStation_Blockout01.png");
    this.load.image("apronOff", "/assets/blockout/baristaStation/ApronOFF_BaristaStation_Blockout01.png");
    this.load.image("apron", "/assets/blockout/baristaStation/Apron_BaristaStation_Blockout01.png");
  }

  create() {
    const { width, height } = this.scale;
    const { centerX, centerY } = this.cameras.main;

    this.bg = this.add.image(centerX + 850, centerY, "introBg");
    this.bg.setDisplaySize(width * 1.1, height * 1.1);
    this.klaraApronOff = this.add.image(centerX * 1.6, centerY * 0.5, "apronOff");
    this.klaraApronOff.setScale(0.1);
    this.apron = this.add.image(centerX * 1.25, centerY * 0.92, "apron");
    this.apron.setScale(0.13);

    this.apron.setInteractive({ draggable: true });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

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
      this.playIntroReveal();
    });
  }


update() {
    //check distance between apron and klara
    if (this.apron && this.klaraApronOff) {
      const distance = Phaser.Math.Distance.Between(
        this.apron.x, this.apron.y, 
        this.klaraApronOff.x, this.klaraApronOff.y
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

    // scale up for playerfeedback
    this.tweens.add({
        targets: this.klaraApronOff,
        scale: 0.11,
        duration: 100,
        yoyo: true,
        ease: 'Quad.easeInOut'
    });

    console.log("Schürze angezogen!");
  }

  playIntroReveal() {
    this.startButton.disableInteractive();
    
    this.tweens.add({
      targets: [this.startButton, this.startText, this.title, this.settingsButton, this.settingsText],
      alpha: 0,
      duration: 1500,
      ease: "Sine.easeOut"
    });

    this.tweens.add({
      targets: [this.bg, this.klaraApronOff, this.apron],
      x: "-=850",
      duration: 3000,
      ease: "Sine.easeInOut"
    });
  }
}