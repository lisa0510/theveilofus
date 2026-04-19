import Phaser from "phaser";

export default class Pinboard extends Phaser.Scene {
  constructor() {
    super("Pinboard");
  }

  preload() {
    // Assets laden
    this.load.image('bg_pinboard', 'assets/Chapter01/Scene1/0_Progress_Scene1_Chapter01.png');
    this.load.image('acceptanceLetter', 'assets/Chapter01/Scene1/Brief_Items_Scene1_Chapter01.png');
    this.load.image('bff', 'assets/Chapter01/Scene1/BFFs_Pinboard_Scene1_Chapter01.png');
    this.load.image('family', 'assets/Chapter01/Scene1/Familie_Items_Scene1_Chapter01.png');
    this.load.image('pinboard', 'assets/Chapter01/Scene1/Pinboard_Scene1_Chapter01_74.png');
    this.load.image('trashCan', 'assets/Chapter01/Scene1/Abfall_Items_Scene1_Chapter01.png');
    
    // Audio
    this.load.audio('ripping', 'assets/audio/ripping.mp3');
    this.load.audio('lisaFreeup', 'assets/audio/test_lisa.mp3');
    this.load.audio('drawing', 'assets/audio/iusedto.mp3');
  }

  create() {
    const { width, height } = this.scale;

    // Start-Sound abspielen
    this.sound.play('lisaFreeup', { volume: 5 });

    // 🎯 Progress state
    this.progress = {
      drawingDeleted: false,
      bffDeleted: false,
      letterPlaced: false,
      familyPlaced: false
    };

    // 📊 Progress bar setup
    const progressBarWidth = width * 0.6;
    const progressBarHeight = 24;
    const progressBarX = width / 2.25;
    const progressBarY = height * 0.97;

    this.progressBarBg = this.add.rectangle(progressBarX, progressBarY, progressBarWidth, progressBarHeight, 0x000000, 0.4)
      .setOrigin(0.5)
      .setDepth(1);

    this.progressBarFill = this.add.rectangle(progressBarX - progressBarWidth / 2 + 2, progressBarY, 0, progressBarHeight - 4, 0x000000, 0.9)
      .setOrigin(0, 0.5)
      .setDepth(2);

    this.progressBarText = this.add.text(progressBarX, progressBarY, 'Progress: 0/4', {
      fontSize: '18px',
      color: '#000000'
    })
      .setOrigin(0.5)
      .setDepth(3);

    // 🪵 Background
    const background = this.add.image(width / 2, height / 2, 'bg_pinboard');
    background.setDisplaySize(width, height);
    background.setDepth(-1);

    // 🧷 Pinboard
    this.add.image(width / 2 - 100, height / 2 - 30, 'pinboard')
      .setScale(0.29)
      .setDepth(0);

    // 🗑 Trash
    const trash = this.add.image(width / 1.1, height / 1.1, 'trashCan')
      .setScale(0.1)
      .setDepth(5);

    // 🎯 Target zones (hidden)
    const letterZone = this.add.zone(width / 1.7, height / 2, 220, 280).setOrigin(0.5);
    const familyZone = this.add.zone(width / 3, height / 2, 220, 280).setOrigin(0.5);

    const letterZoneHighlight = this.add.rectangle(letterZone.x, letterZone.y, letterZone.width, letterZone.height, 0x00ff00, 0)
      .setDepth(1);
    const familyZoneHighlight = this.add.rectangle(familyZone.x, familyZone.y, familyZone.width, familyZone.height, 0x0000ff, 0)
      .setDepth(1);

    // 📦 Images setup
    const imageData = [
      { key: 'userDrawing', x: width / 2.5, y: height / 2, scale: 1 },
      { key: 'acceptanceLetter', x: width / 1.1, y: height / 1.5, scale: 0.4 },
      { key: 'family', x: width / 1.1, y: height / 3.5, scale: 0.25 },
      { key: 'bff', x: width / 1.5, y: height / 3, scale: 0.15 },
    ];

    const padding = 15;

    imageData.forEach((data) => {
      if (!this.textures.exists(data.key)) return;

      const texture = this.textures.get(data.key).getSourceImage();
      const displayWidth = texture.width * data.scale;
      const displayHeight = texture.height * data.scale;

      const container = this.add.container(data.x, data.y);

      const bg = this.add.rectangle(0, 0, displayWidth + padding, displayHeight + padding, 0xffffff);
      const img = this.add.image(0, 0, data.key).setScale(data.scale);

      container.add([bg, img]);
      container.setSize(bg.width, bg.height);
      container.setInteractive({ draggable: true, useHandCursor: true });
      container.setAngle(Phaser.Math.Between(-5, 5));
      container.setDepth(10);

      // --- NEU: Click Sound für userDrawing ---
      if (data.key === 'userDrawing') {
        container.on('pointerdown', () => {
          this.sound.play('drawing', { volume: 5 });
        });
      }

      // 🖱 DRAG LOGIC
      container.on('drag', (pointer, dragX, dragY) => {
        container.setPosition(dragX, dragY);
        container.setDepth(50);

        const bounds = container.getBounds();

        // Highlight-Logic für Zonen
        if (data.key === 'acceptanceLetter') {
          letterZoneHighlight.setFillStyle(0x00ff00,
            Phaser.Geom.Intersects.RectangleToRectangle(bounds, letterZoneHighlight.getBounds()) ? 0.2 : 0);
        } else if (data.key === 'family') {
          familyZoneHighlight.setFillStyle(0x0000ff,
            Phaser.Geom.Intersects.RectangleToRectangle(bounds, familyZoneHighlight.getBounds()) ? 0.2 : 0);
        }
      });

      container.on('dragstart', () => {
        container.setAngle(0);
      });

      container.on('dragend', () => {
        container.setAngle(Phaser.Math.Between(-3, 3));
        container.setDepth(10);

        const bounds = container.getBounds();

        // 🗑 TRASH LOGIC (Drawing & BFF)
        if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, trash.getBounds())) {
          if (data.key === 'userDrawing' || data.key === 'bff') {
            
            if (data.key === 'userDrawing') this.progress.drawingDeleted = true;
            if (data.key === 'bff') this.progress.bffDeleted = true;

            this.sound.play('ripping', { volume: 0.3 });
            this.updateProgressBar();
            
            this.tweens.add({
              targets: container,
              scale: 0,
              alpha: 0,
              duration: 300,
              onComplete: () => {
                container.destroy();
                this.checkRiddle();
              }
            });
            return;
          }
        }

        // 📄 LETTER ZONE
        if (data.key === 'acceptanceLetter' && Phaser.Geom.Intersects.RectangleToRectangle(bounds, letterZone.getBounds())) {
          container.setPosition(letterZone.x, letterZone.y);
          container.setAngle(0);
          container.disableInteractive();
          this.progress.letterPlaced = true;
          this.updateProgressBar();
          this.checkRiddle();
        }

        // 👨‍👩‍👧 FAMILY ZONE
        if (data.key === 'family' && Phaser.Geom.Intersects.RectangleToRectangle(bounds, familyZone.getBounds())) {
          container.setPosition(familyZone.x, familyZone.y);
          container.setAngle(0);
          container.disableInteractive();
          this.progress.familyPlaced = true;
          this.updateProgressBar();
          this.checkRiddle();
        }
        
        // Highlights zurücksetzen
        letterZoneHighlight.setFillStyle(0x00ff00, 0);
        familyZoneHighlight.setFillStyle(0x0000ff, 0);
      });
    });
  }

  updateProgressBar() {
    const completed = Object.values(this.progress).filter(Boolean).length;
    const stepCount = 4;
    const maxWidth = this.progressBarBg.width - 4;
    const filledWidth = (maxWidth * completed) / stepCount;

    this.progressBarFill.width = filledWidth;
    this.progressBarText.setText(`Progress: ${completed}/${stepCount}`);
  }

  checkRiddle() {
    const allDone = Object.values(this.progress).every(val => val === true);
    if (allDone) {
      this.time.delayedCall(800, () => {
        this.scene.start("Random");
      });
    }
  }
}