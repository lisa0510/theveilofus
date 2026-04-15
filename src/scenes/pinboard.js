export default class Pinboard extends Phaser.Scene {
  constructor() {
    super("Pinboard");
  }

  preload() {
    this.load.image('photo1', 'assets/exam.png');
    this.load.image('photo2', 'assets/friends.jpg');
    this.load.image('photo3', 'assets/momdad.jpg');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0xf4e6c8);

    const borderThickness = 30;
    const borderColor = 0x3b2a24;
    const frame = this.add.graphics();
    frame.lineStyle(borderThickness, borderColor, 1);
    frame.strokeRect(borderThickness / 2, borderThickness / 2, width - borderThickness, height - borderThickness);
    frame.setDepth(10);

    const imageData = [
      { key: 'userDrawing', x: width * 0.3, y: height * 0.3, scale: 0.4 },
      { key: 'photo1', x: width * 0.7, y: height * 0.3, scale: 0.5 },
      { key: 'photo2', x: width * 0.3, y: height * 0.7, scale: 0.6 },
      { key: 'photo3', x: width * 0.7, y: height * 0.7, scale: 0.7 }
    ];

    const padding = 15;

    imageData.forEach((data) => {
      if (this.textures.exists(data.key)) {
        const texture = this.textures.get(data.key).getSourceImage();
        const displayWidth = texture.width * data.scale;
        const displayHeight = texture.height * data.scale;

        const container = this.add.container(data.x, data.y);
        
        const shadow = this.add.rectangle(4, 4, displayWidth + padding, displayHeight + padding, 0x000000, 0.15);
        const bg = this.add.rectangle(0, 0, displayWidth + padding, displayHeight + padding, 0xffffff);
        const img = this.add.image(0, 0, data.key).setScale(data.scale);

        container.add([shadow, bg, img]);
        container.setSize(bg.width, bg.height);
        container.setInteractive({ draggable: true, useHandCursor: true });
        container.setAngle(Math.random() * 10 - 5);

        container.on('drag', (pointer, dragX, dragY) => {
          container.setPosition(dragX, dragY);
        });

        container.on('dragstart', () => {
          container.setAngle(0);
          this.children.bringToTop(container);
          this.children.bringToTop(frame);
        });

        container.on('dragend', () => {
          container.setAngle(Math.random() * 6 - 3);
        });
      }
    });
  }
}