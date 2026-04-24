export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background', 'assets/test.png');
    }

    create() {
        const { width, height } = this.scale;

        let bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);
        let titleText = this.add.text(width / 10, height / 10, 'RIBA', {
            fontSize: '50px',
            fill: '#fff',
            fontFamily: 'cursive',
        });
        titleText.setOrigin(0.5);

        let startButton = this.add.text(width / 10, height / 2, 'START GAME', { 
            fontSize: '32px', 
            fill: '#ffffff',
            fontFamily: 'cursive',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 10 }
        });

        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });

        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff0' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#fff' }));

        startButton.on('pointerdown', () => {
            this.scene.start('Shop');
        });

        let creditsButton = this.add.text(width / 10, height / 1.7, 'Credits', { 
            fontSize: '32px', 
            fill: '#ffffff',
            fontFamily: 'cursive',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 10 }
        });

        creditsButton.setOrigin(0.5);
        creditsButton.setInteractive({ useHandCursor: true });

        creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#ff0' }));
        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#fff' }));
    }
}