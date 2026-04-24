export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background', 'assets/test.png');
    }

    create() {
        const { width, height } = this.scale;

        // 1. Background (Full Screen)
        let bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);

        // 2. The Game Name (Center of screen)
        let titleText = this.add.text(width / 2, height / 2, 'SUBMERGED', {
            fontSize: '55px',
            fill: '#fff',
            fontFamily: 'cursive',
        });
        titleText.setOrigin(0.5);

        // 3. Start Game Button (Positioned lower than the title)
        let startButton = this.add.text(width / 2, height / 1.3, 'START GAME', { 
            fontSize: '32px', 
            fill: '#ffffff',
            fontFamily: 'cursive',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 10 }
        });

        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });

        // Visual Feedback (Hover effects)
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff0' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#fff' }));

        // Scene Transition
        startButton.on('pointerdown', () => {
            this.scene.start('Shop');
        });
    }
}