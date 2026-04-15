export default class Pinboard extends Phaser.Scene {
  constructor() {
    super("Pinboard");
  }

  create() {
     const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0xf4e6c8);
    if (this.textures.exists('userDrawing')) {
      this.add.image(width / 2, height / 2, 'userDrawing')
          .setScale(0.5)
          .setAlpha(0);
          
     
      this.tweens.add({
        targets: this.children.list[this.children.list.length - 1],
        alpha: 1,
        duration: 800
      });
    } else {
      console.warn("Zeichnung wurde nicht gefunden!");
    }
  }
}