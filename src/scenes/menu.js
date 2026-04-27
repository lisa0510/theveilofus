export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background', 'assets/Fish02/UI/Fisch_Menü_UI.png');
        this.load.image('eye', 'assets/Fish02/UI/FischAuge_Menü_UI.png');
    }

    create() {
        const { width, height } = this.scale;

        let bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);

        this.eyeCenterX = width / 2;
        this.eyeCenterY = height * 0.35;
        this.eye = this.add.image(this.eyeCenterX, this.eyeCenterY, 'eye');
        this.eye.setScale(0.4);
        this.maxEyeDistance = 40;

        let titleText = this.add.text(width / 10, height / 10, 'RIBA', {
            fontSize: '150px',
            fill: '#fff',
            fontFamily: 'Helvetica',
        }).setOrigin(0.5);

        let startButton = this.add.text(width / 10, height / 2, 'START', { 
            fontSize: '50px', 
            fill: '#ffffff',
            fontFamily: 'Helvetica',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff0' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#fff' }));
        startButton.on('pointerdown', () => this.scene.start('Shop'));

        let creditsButton = this.add.text(width / 10, height / 1.7, 'Credits', { 
            fontSize: '50px', 
            fill: '#ffffff',
            fontFamily: 'Helvetica',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#ff0' }));
        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#fff' }));
    }

    update() {
    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(this.eyeCenterX, this.eyeCenterY, pointer.x, pointer.y);
    const dist = Phaser.Math.Distance.Between(this.eyeCenterX, this.eyeCenterY, pointer.x, pointer.y);
    const sensitivity = 2; 
    const constrainedDist = Math.min(dist * sensitivity, this.maxEyeDistance);
    const targetX = this.eyeCenterX + Math.cos(angle) * constrainedDist;
    const targetY = this.eyeCenterY + Math.sin(angle) * constrainedDist;

    this.eye.x = targetX;
    this.eye.y = targetY;
}
}