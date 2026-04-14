import Phaser from "phaser";

export default class CoffeeBar extends Phaser.Scene {
  constructor() {
    super("CoffeeBar");
  }

  preload() {
    this.load.image("desk", "assets/blockout/baristaStation/CoffeeTable_test.png");
    this.load.image("grinder", "assets/blockout/baristaStation/PowerMaker_BaristaStation_Blockout01.png");
    this.load.image("coffemachine", "assets/blockout/baristaStation/CoffeeMachine_BaristaStation_Blockout01.png");
    this.load.image("tray", "assets/blockout/baristaStation/Tablet_BaristaStation_Blockout01.png");
    this.load.image("holder", "assets/blockout/baristaStation/ThingHolder_BaristaStation_Blockout01.png");
    this.load.image("cup", "assets/blockout/baristaStation/CoffeeEmpty_BaristaStation_Blockout01.png");
    this.load.image("cupFull", "assets/blockout/baristaStation/CoffeeFull_BaristaStation_Blockout01.png");
    this.load.image("filterträgerleer", "assets/blockout/baristaStation/ThingEmpty_BaristaStation_Blockout01.png");
    this.load.image("filterträgervoll", "assets/blockout/baristaStation/ThingFull_BaristaStation_Blockout01.png");

  }

  create() {
    const { width, height } = this.scale;

    this.startButton = this.add.rectangle(width * 0.1, height * 0.1, width * 0.15, height * 0.06, 0xeb4034, 0.95);
    this.startButton.setStrokeStyle(2, 0x3b2a24).setInteractive({ useHandCursor: true });

    this.startText = this.add.text(width * 0.1, height * 0.1, "Go to shop", {
      fontSize: `${Math.floor(width * 0.015)}px`,
      color: "#ffffff",
      fontFamily: "cursive",
    }).setOrigin(0.5);

    this.startButton.on("pointerdown", () => {
      this.scene.start("day1_coffebar");
    });

    this.add.image(width / 2, height / 1.3, "desk").setScale(0.25);
    this.add.image(width / 2.4, height / 1.7, "grinder").setScale(0.2);
    this.add.image(width / 2.4, height / 1.7, "coffemachine").setScale(0.2);
    this.add.image(width / 1.8, height * 0.5, "tray").setScale(0.2);
    this.add.image(width / 2.5, height / 1.7, "holder").setScale(0.2);

    // Draggable Objekte
    const cup = this.add.image(width / 2, height / 1.1, "cup").setScale(0.05).setInteractive({ cursor: 'pointer' });
    const cupFull = this.add.image(width / 1.8, height / 1.5, "cupFull").setScale(0.05).setInteractive({ cursor: 'pointer' });
    const filterLeer = this.add.image(width / 3, height / 1.5, "filterträgerleer").setScale(0.05).setInteractive({ cursor: 'pointer' });
    const filterVoll = this.add.image(width / 2.5, height / 1.5, "filterträgervoll").setScale(0.04).setInteractive({ cursor: 'pointer' });

    // Drag-Logik
    this.input.setDraggable([cup, cupFull, filterLeer, filterVoll]);
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }}