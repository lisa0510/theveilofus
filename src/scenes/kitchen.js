export default class Kitchen extends Phaser.Scene {
  constructor() {
    super('Kitchen');
  }

  create() {
    const { width, height } = this.scale;

    // Großer roter Text, genau in der Mitte zentriert
    this.add.text(width / 2, height / 2, 'KITCHEN', {
      fontSize: '84px', // Schön groß
      color: '#ff0000', // Reines Rot
      fontStyle: 'bold',
      fontFamily: 'Arial' // Oder deine bevorzugte Schriftart
    }).setOrigin(0.5); // Setzt den Ankerpunkt in die Mitte des Textes
  }
}