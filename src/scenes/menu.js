class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background', 'assets/underwater.png');
    }

    create() {
        this.add.image(400, 300, 'background');
        let startButton = this.add.text(400, 300, 'Start Game', { fontSize: '32px', fill: '#fff' });
        startButton.setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('Fish');
        });
    }
}