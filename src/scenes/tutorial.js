import Phaser from "phaser";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  preload() {
    this.load.image("bg", "/assets/blockout/baristaStation/Backround_BaristaStation_Blockout01.png"); 
    this.load.image("center", "assets/blockout/baristaStation/CoffeeTable_test.png");     
    this.load.image("uncle", "assets/blockout/baristaStation/Uncle_BaristaStation_Blockout01.png"); 
    this.load.image("grinder", "assets/blockout/baristaStation/PowerMaker_BaristaStation_Blockout01.png");
    this.load.image("coffemachine", "assets/blockout/baristaStation/CoffeeMachine_BaristaStation_Blockout01.png");
    this.load.image("tray", "assets/blockout/baristaStation/Tablet_BaristaStation_Blockout01.png");
    this.load.image("holder", "assets/blockout/baristaStation/ThingHolder_BaristaStation_Blockout01.png");
    this.load.image("cup", "assets/blockout/baristaStation/CoffeeEmpty_BaristaStation_Blockout01.png");
    this.load.image("cupFull", "assets/blockout/baristaStation/CoffeeFull_BaristaStation_Blockout01.png");
    this.load.image("filterträgerleer", "assets/blockout/baristaStation/ThingEmpty_BaristaStation_Blockout01.png");
    this.load.image("filterträgervoll", "assets/blockout/baristaStation/ThingFull_BaristaStation_Blockout01.png");
    this.load.audio("unc1", "assets/audio/unc_Lisa1.mp3");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "bg")
      .setDisplaySize(width, height);

    this.add.image(width / 2.3, height / 1.22, "center")
      .setScale(0.21);

    this.add.image(width * 0.85, height / 1.4, "uncle")
      .setScale(0.2);
    
    this.add.image(width / 2.4, height / 1.7, "grinder")
      .setScale(0.2);

    this.add.image(width / 2.4, height / 1.7, "coffemachine")
      .setScale(0.2);
    
    this.add.image(width / 2.3, height / 1.7, "tray")
      .setScale(0.2);

    this.add.image(width / 2.5, height / 1.7, "holder")
      .setScale(0.2);

    const cup = this.add.image(width / 2, height / 1.2, "cup")
      .setScale(0.05)
      .setInteractive({ cursor: 'pointer' });

    const cupFull = this.add.image(width / 1.8, height / 1.5, "cupFull")
      .setScale(0.05)
      .setInteractive({ cursor: 'pointer' });

    const filterLeer = this.add.image(width / 3, height / 1.5, "filterträgerleer")
      .setScale(0.05)
      .setInteractive({ cursor: 'pointer' });

    const filterVoll = this.add.image(width / 2.5, height / 1.5, "filterträgervoll")
      .setScale(0.04)
      .setInteractive({ cursor: 'pointer' });

     
    this.input.setDraggable([cup, cupFull, filterLeer, filterVoll]);
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    this.input.on("dragstart", (pointer, gameObject) => {
    this.children.bringToTop(gameObject);
    });

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
      this.sound.play("unc1", { volume: 1 });
    });
  }
}