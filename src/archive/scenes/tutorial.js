import Phaser from "phaser";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("bg", "/assets/blockout/baristaStation/Backround_BaristaStation_Blockout01.png"); 
    this.load.image("uncle", "assets/blockout/baristaStation/Uncle_BaristaStation_Blockout01.png"); 
    this.load.image("coffeebar", "assets/blockout/baristaStation/Station_BaristaStation_Blockout01.png");
    this.load.audio("unc1", "assets/audio/unc_Lisa1.mp3");
  }

 create() {
    const { width, height } = this.scale;

    // Hintergrund
    this.add.image(width / 2, height / 2, "bg").setDisplaySize(width, height);

    // Uncle
    this.add.image(width * 0.85, height / 1.4, "uncle").setScale(0.2);
    
    // Kaffeebar (Interaktiv gemacht)
    const bar = this.add.image(width / 2.8, height / 1.8, "coffeebar")
      .setScale(0.17)
      .setInteractive({ useHandCursor: true });

    bar.on("pointerdown", () => {
    // 1. UI ausblenden
    this.tweens.add({
        targets: [box, dialogueText],
        alpha: 0,
        duration: 300
    });
    const targetX = bar.x;
    const targetY = bar.y;

    this.cameras.main.pan(targetX, targetY, 1000, 'Power2');
    this.cameras.main.zoomTo(2, 1500, 'Quad.easeOut', false, (camera, progress) => {
        if (progress === 1) {
            this.scene.start("CoffeeBar");
        }
    });
});

    // Dialog Box
    const box = this.add.rectangle(width / 2, height * 0.9, width * 0.6, 120, 0xf8f1e7, 0.7)
      .setStrokeStyle(2, 0xffffff);

    const dialogueText = this.add.text(width / 2, height * 0.9,
      "Zeig mir wie man den Kaffe wieder macht, Klara.",
      {
        fontSize: "25px",
        color: "#2b1f1f",
        fontFamily: "cursive",
        align: "center",
        wordWrap: { width: width * 0.5 } // Etwas schmaler als die Box
      }
    ).setOrigin(0.5);

    this.time.delayedCall(500, () => {
      if (this.cache.audio.exists("unc1")) this.sound.play("unc1", { volume: 1 });
    });
  }}