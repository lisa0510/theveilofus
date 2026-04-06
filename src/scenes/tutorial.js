import Phaser from "phaser";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("bg", "/assets/Backround_BaristaStation_Blockout01.png"); 
    this.load.image("center", "assets/Station_BaristaStation_Blockout01.png");     
    this.load.image("unc", "assets/Uncle_BaristaStation_Blockout01.png");
    this.load.audio("bgMusic", "assets/audio/cafe_ambience.mp3");    
    this.load.audio("unc1", "assets/audio/unc_Lisa1.mp3");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "bg")
      .setDisplaySize(width, height);

    this.add.image(width / 2, height / 2.5, "center")
      .setScale(0.25);

    this.add.image(width * 1.1, height / 2, "unc")
      .setScale(0.2);

    const box = this.add.rectangle(width / 2, height * 0.1, width * 0.6, 120, 0xf8f1e7)
      .setStrokeStyle(2, 0xffffff);

    const dialogueText = this.add.text(width / 2, height * 0.1,
      "Zeig mir wie mein den Kaffe wieder macht, Klara.",
      {
        fontSize: "25px",
        color: "#2b1f1f",
        fontFamily: "cursive",
        align: "center",
        wordWrap: { width: width * 0.75 }
      }
    ).setOrigin(0.5);

    this.time.delayedCall(500, () => {
      this.sound.play("unc1", { volume: 8 });
    });
  }
}