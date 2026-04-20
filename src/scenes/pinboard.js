import Phaser from "phaser";

export default class Pinboard extends Phaser.Scene {
  constructor() {
    super("Pinboard");
  }

  preload() {
    this.load.image('bg_pinboard', 'assets/Chapter01/Scene1/0_Progress_Scene1_Chapter01.png');
    this.load.image('acceptanceLetter', 'assets/Chapter01/Scene1/Brief_Pinboard_Scene1_Chapter01.png');
    this.load.image('bff', 'assets/Chapter01/Scene1/BFFs_Pinboard_Scene1_Chapter01.png');
    this.load.image('family', 'assets/Chapter01/Scene1/Familie_Pinboard_Scene1_Chapter01.png');
    this.load.image('pinboard', 'assets/Chapter01/Scene1/Pinboard_Scene1_Chapter01.png');
    this.load.image('trashCan', 'assets/Chapter01/Scene1/Abfall_Items_Scene1_Chapter01.png');

    this.load.image('doc', 'assets/Chapter01/Scene1/doc.png');
    this.load.image('stat', 'assets/Chapter01/Scene1/stat.png');
    this.load.image('certi', 'assets/Chapter01/Scene1/certi.png');
    this.load.image('cal', 'assets/Chapter01/Scene1/cal.png');
    this.load.image('game', 'assets/Chapter01/Scene1/game.png');

    this.load.audio('ripping', 'assets/audio/ripping.mp3');
    this.load.audio('lisaFreeup', 'assets/audio/test_lisa.mp3');
    this.load.audio('drawing', 'assets/audio/iusedto.mp3');
  }

  create() {
    const { width, height } = this.scale;

    this.sound.play('lisaFreeup', { volume: 1 });

    this.progress = {
      drawingDeleted: false,
      bffDeleted: false,
      letterPlaced: false,
      familyPlaced: false
    };

    const progressBarWidth = width * 0.6;
    const progressBarHeight = 24;
    const progressBarX = width / 2.25;
    const progressBarY = height * 0.97;

    this.progressBarBg = this.add.rectangle(progressBarX, progressBarY, progressBarWidth, progressBarHeight, 0x000000, 0.4)
      .setOrigin(0.5)
      .setDepth(100);

    this.progressBarFill = this.add.rectangle(progressBarX - progressBarWidth / 2 + 2, progressBarY, 0, progressBarHeight - 4, 0xffffff, 1)
      .setOrigin(0, 0.5)
      .setDepth(101);

    this.add.image(width / 2, height / 2, 'bg_pinboard').setDisplaySize(width, height).setDepth(-2);
    this.add.image(width / 2 - 100, height / 2 - 30, 'pinboard').setScale(0.5).setDepth(-1);
    this.add.image(width / 3.4 , height / 3.6, 'doc').setScale(0.4).setDepth(0);
    this.add.image(width / 1.7 , height / 3.6, 'stat').setScale(0.3).setDepth(0);
    this.add.image(width / 2 , height / 1.4, 'certi').setScale(0.7).setDepth(0);
    this.add.image(width / 1.5 , height / 1.4, 'cal').setScale(0.3).setDepth(0).setRotation(-0.1);
    this.add.image(width / 3.2 , height / 1.4, 'game').setScale(0.1).setDepth(0).setRotation(0.1);

    const trash = this.add.image(width / 1.1, height / 1.1, 'trashCan').setScale(0.15).setDepth(5);

    const zoneFillColor = 0xffffff;
    const zoneAlpha = 0.5;

    const letterZoneX = width / 3.5;
    const letterZoneY = height / 1.8;
    const letterZone = this.add.zone(letterZoneX, letterZoneY, 370, 280).setOrigin(0.5);
    const letterOverlay = this.add.rectangle(letterZoneX, letterZoneY, 370, 280, zoneFillColor, zoneAlpha)
      .setVisible(false).setDepth(0);

    const familyZoneX = width / 2.3;
    const familyZoneY = height / 2.2;
    const familyZone = this.add.zone(familyZoneX, familyZoneY, 220, 280).setOrigin(0.5);
    const familyOverlay = this.add.rectangle(familyZoneX, familyZoneY, 220, 280, zoneFillColor, zoneAlpha)
      .setVisible(false).setDepth(0);

    const imageData = [
      { key: 'userDrawing', x: width / 2.5, y: height / 2, scale: 0.4 }, 
      { key: 'acceptanceLetter', x: width / 1.1, y: height / 1.5, scale: 0.25 },
      { key: 'family', x: width / 1.1, y: height / 3.5, scale: 0.7 },
      { key: 'bff', x: width / 1.5, y: height / 3, scale: 0.15 },
    ];

    imageData.forEach((data) => {
      if (!this.textures.exists(data.key)) return;

      const container = this.add.container(data.x, data.y);
      let shadow;
      let img = this.add.image(0, 0, data.key).setScale(data.scale);

      if (data.key === 'userDrawing') {
        const paperWidth = 850 * data.scale; 
        const paperHeight = 550 * data.scale;
        shadow = this.add.rectangle(8, 8, paperWidth, paperHeight, 0x000000, 0.25);
        const paper = this.add.rectangle(0, 0, paperWidth, paperHeight, 0xffffff);
        container.add([shadow, paper, img]);
        container.setSize(paperWidth, paperHeight);
        
        let drawingSound = this.sound.add('drawing', { volume: 1.5 });
        container.on('pointerdown', () => {
          if (!drawingSound.isPlaying) {
            drawingSound.play();
          }
        });
      } else {
        shadow = this.add.image(6, 6, data.key).setScale(data.scale).setTint(0x000000).setAlpha(0.3);
        container.add([shadow, img]);
        container.setSize(img.displayWidth, img.displayHeight);
      }

      container.setInteractive({ draggable: true, useHandCursor: true });
      container.setAngle(Phaser.Math.Between(-4, 4));
      container.setDepth(10);

      container.on('drag', (pointer, dragX, dragY) => {
        container.setPosition(dragX, dragY);
        container.setDepth(50);
        if (shadow) shadow.setPosition(12, 12); 
      });

      container.on('dragstart', () => {
        container.setAngle(0);
        this.tweens.add({ targets: container, scale: 1.03, duration: 100 });
        if (data.key === 'acceptanceLetter') letterOverlay.setVisible(true);
        if (data.key === 'family') familyOverlay.setVisible(true);
      });

      container.on('dragend', () => {
        this.tweens.add({ targets: container, scale: 1, duration: 100 });
        container.setAngle(Phaser.Math.Between(-3, 3));
        container.setDepth(10);
        if (shadow) shadow.setPosition(data.key === 'userDrawing' ? 8 : 6, data.key === 'userDrawing' ? 8 : 6);
        
        letterOverlay.setVisible(false);
        familyOverlay.setVisible(false);

        const bounds = container.getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, trash.getBounds())) {
          if (data.key === 'userDrawing' || data.key === 'bff') {
            container.disableInteractive();
            this.sound.play('ripping', { volume: 0.5 });
            this.tweens.add({
              targets: container,
              x: trash.x,
              y: trash.y,
              scale: 0,
              alpha: 0,
              duration: 300,
              onComplete: () => {
                if (data.key === 'userDrawing') this.progress.drawingDeleted = true;
                if (data.key === 'bff') this.progress.bffDeleted = true;
                this.updateProgressBar();
                this.checkRiddle();
                container.destroy();
              }
            });
            return;
          }
        }

        const checkZone = (zone, progressKey, overlay) => {
          if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, zone.getBounds())) {
            container.setPosition(zone.x, zone.y);
            container.setAngle(0);
            container.disableInteractive();
            if (shadow) shadow.setVisible(false); 
            this.progress[progressKey] = true;
            if (overlay) overlay.destroy();
            this.updateProgressBar();
            this.checkRiddle();
          }
        };

        if (data.key === 'acceptanceLetter') checkZone(letterZone, 'letterPlaced', letterOverlay);
        if (data.key === 'family') checkZone(familyZone, 'familyPlaced', familyOverlay);
      });
    });
  }

  updateProgressBar() {
    const completed = Object.values(this.progress).filter(Boolean).length;
    const maxWidth = this.progressBarBg.width - 4;
    this.tweens.add({
        targets: this.progressBarFill,
        width: (maxWidth * completed) / 4,
        duration: 200
    });
  }

  checkRiddle() {
    if (Object.values(this.progress).every(val => val === true)) {
      this.time.delayedCall(1000, () => this.scene.start("Random"));
    }
  }
}