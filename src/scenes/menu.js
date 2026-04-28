import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background', 'assets/Fish02/UI/Fisch_Menü_UI.png');
        this.load.image('eye', 'assets/Fish02/UI/FischAuge_Menü_UI.png');
        this.load.image('headphones', 'assets/Fish02/UI/Kopfhörer_Symbol_UI.png'); 
    }

    create() {
        const { width, height } = this.scale;

        // --- Hintergrund ---
        let bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);

        // --- Augen Logik Initialisierung ---
        this.eyeCenterX = width / 2;
        this.eyeCenterY = height * 0.35;
        this.eye = this.add.image(this.eyeCenterX, this.eyeCenterY, 'eye');
        this.eye.setScale(0.4);
        this.maxEyeDistance = 40;

        // --- Hauptmenü UI (RIBA, Start, Credits) ---
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
        startButton.on('pointerdown', () => this.scene.start('Tutorial'));

        let creditsButton = this.add.text(width / 10, height / 1.7, 'Credits', { 
            fontSize: '50px', 
            fill: '#ffffff',
            fontFamily: 'Helvetica',
            backgroundColor: '#000000aa',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        creditsButton.on('pointerover', () => creditsButton.setStyle({ fill: '#ff0' }));
        creditsButton.on('pointerout', () => creditsButton.setStyle({ fill: '#fff' }));

        // --- Overlay Popup ---
        this.createPopup();
    }

    createPopup() {
        const { width, height } = this.scale;

        // 1. Full-Screen Background
        this.popupOverlay = this.add.rectangle(0, 0, width, height, 0x000000, 1)
            .setOrigin(0)
            .setInteractive()
            .setDepth(100);

        // 2. Container (X mittig, Y=0 für responsive Steuerung)
        this.popupContainer = this.add.container(width / 2, 0).setDepth(101);

        const topPadding = height * 0.2; 
        const spacing = height * 0.2; 

        // Zitat (Wellen-Effekt via Name)
        let headerText = this.add.text(0, topPadding, ' "Wenn das Wasser steigt, muss man versuchen darin zu überleben." ', {
            fontSize: `${Math.max(20, height * 0.04)}px`,
            fill: '#ffffff',
            fontFamily: 'Helvetica',
            fontStyle: 'italic',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        let popupImg = this.add.image(0, height / 2, 'headphones').setScale(0.2);

        let infoText = this.add.text(0, popupImg.y + spacing, 'Trage Kopfhörer für eine bessere Erfahrung.', {
            fontSize: `${Math.max(18, height * 0.03)}px`, 
            fill: '#bbbbbb', 
            align: 'center', 
            fontFamily: 'Helvetica'
        }).setOrigin(0.5);

        let hintText = this.add.text(0, height * 0.9, '[ Press any key or click to start ]', {
            fontSize: '22px', 
            fill: '#666666',
            fontFamily: 'Helvetica'
        }).setOrigin(0.5).setName('waveText');

        this.popupContainer.add([headerText, popupImg, infoText, hintText]);

        const closePopup = () => {
            if (this.popupContainer) this.popupContainer.destroy();
            if (this.popupOverlay) this.popupOverlay.destroy();
            this.input.keyboard.off('keydown');
            this.input.off('pointerdown');
        };

        this.time.delayedCall(200, () => {
            this.input.keyboard.on('keydown', closePopup);
            this.input.on('pointerdown', closePopup);
        });
    }

    update(time) {
        if (this.popupContainer && this.popupContainer.active) {
            this.popupContainer.iterate(child => {
                if (child.name === 'waveText') {
                    child.y += Math.sin(time * 0.002) * 0.25;
                    child.angle = Math.sin(time * 0.001) * 0.5;
                }
            });
        }
        if (this.popupOverlay && this.popupOverlay.active) return;

        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.Between(this.eyeCenterX, this.eyeCenterY, pointer.x, pointer.y);
        const dist = Phaser.Math.Distance.Between(this.eyeCenterX, this.eyeCenterY, pointer.x, pointer.y);
        
        const sensitivity = 2; 
        const constrainedDist = Math.min(dist * sensitivity, this.maxEyeDistance);
        
        this.eye.x = this.eyeCenterX + Math.cos(angle) * constrainedDist;
        this.eye.y = this.eyeCenterY + Math.sin(angle) * constrainedDist;
    }
}