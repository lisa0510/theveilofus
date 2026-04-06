import Phaser from "phaser";

export default class day1_coffebar extends Phaser.Scene {
  constructor() {
    super("day1_coffebar");
  }

  preload() {
    this.load.image("counter", "/assets/Blockout/ServiceView/Counter_ServiceView_Blockout01.png"); 
    this.load.image("kasse", "/assets/Blockout/ServiceView/Cash_ServiceView_Blockout01.png"); 
    this.load.image("radio", "/assets/Blockout/ServiceView/Radio_ServiceView_Blockout01.png"); 
    this.load.image("unc", "/assets/Blockout/ServiceView/Uncle_ServiceView_Blockout01.png"); 
    this.load.audio("radio", "/assets/audio/radio.mp3");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "counter")
      .setScale(0.3);

    this.add.image(width / 2.8, height / 1.8, "kasse")
      .setScale(0.17);

    const radioImg = this.add.image(width / 1, height / 2, "radio")
      .setScale(0.25)
      .setInteractive({ cursor: 'pointer' });

    const radioSound = this.sound.add("radio", { volume: 0.5 });
    const uncImg = this.add.image(width * 0.5, height / 3, "unc")
      .setScale(0.2);

    radioImg.on('pointerdown', () => {
      if (!radioSound.isPlaying) {
        radioSound.play();
        uncImg.setVisible(false);
        box.setVisible(false);
        dialogueText.setVisible(false);
      } else {
        radioSound.stop();
      }
    });

    const box = this.add.rectangle(width / 2, height * 0.9, width * 0.5, 120, 0xf8f1e7,0.5)
      .setStrokeStyle(1, 0xffffff);

    const dialogueText = this.add.text(width / 2, height * 0.9,
      "Schalte das Radio ein, Klara. Es ist Zeit, den Laden zu öffnen!",
      {
        fontSize: "25px",
        color: "#2b1f1f",
        fontFamily: "cursive",
        align: "center",
        wordWrap: { width: width * 0.25 }
      }
    ).setOrigin(0.5);

  }
}