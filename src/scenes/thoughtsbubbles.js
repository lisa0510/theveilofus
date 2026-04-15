export default class ThoughtBubbles extends Phaser.Scene {
  constructor() {
    super("ThoughtBubbles");
  }

  create() {
    this.input.mouse.disableContextMenu();

    const instructionText = this.add.text(this.scale.width / 2, this.scale.height / 2, "Right click to think", {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setDepth(100);

    const positiveThoughts = ["I think you are good enough", "Keep going!", "I like your work", "I am proud of you", "Amazing!", "I am very amazed by your work", "yay du bish so cool llul!"];
    const toxicThoughts = ["USELESS KID", "YOU CAN DO BETTER THAN THIS", "MORE MORE MORE", "IS THIS ALL YOU CAN DO?", "FAILED TO MEET EXPECTATIONS", "TRY HARDER!"];

    this.input.on('pointerdown', (pointer) => {
      if (pointer.button === 2) {
        if (instructionText) instructionText.destroy();

        const isToxic = Math.random() < 0.3;
        const margin = 120;
        const randomX = Phaser.Math.Between(margin, this.scale.width - margin);
        const randomY = Phaser.Math.Between(margin, this.scale.height - margin);
        
        const msg = isToxic 
          ? Phaser.Utils.Array.GetRandom(toxicThoughts) 
          : Phaser.Utils.Array.GetRandom(positiveThoughts);
          
        this.createThoughtBubble(randomX, randomY, msg, isToxic);
      }
    });

    this.time.delayedCall(2000, () => {
      this.showSleepButton();
    });
  }

  showSleepButton() {
    const btn = this.add.text(this.scale.width / 2, this.scale.height / 2, "Go to sleep", {
      fontSize: '28px',
      color: '#000000',
      backgroundColor: '#c2fcff',
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .setDepth(1) // Niedrige Depth: hinter den Bubbles
    .setAlpha(0);

    this.tweens.add({
      targets: btn,
      alpha: 1,
      duration: 1000
    });
    btn.on('pointerdown', () => this.scene.start("Random"));
  }

  createThoughtBubble(x, y, message, isToxic) {
    const container = this.add.container(x, y);
    container.setDepth(10);

    const bWidth = isToxic ? 220 : 150;
    const bHeight = isToxic ? 140 : 100;
    
    const bgColor = isToxic ? 0x220000 : 0xffffff;
    const strokeColor = isToxic ? 0xff0000 : 0x000000;
    const textColor = isToxic ? '#ff0000' : '#000000';

    const bubble = this.add.graphics();
    bubble.fillStyle(bgColor, 1);
    bubble.lineStyle(isToxic ? 5 : 3, strokeColor, 1);
    bubble.fillRoundedRect(-bWidth / 2, -bHeight / 2, bWidth, bHeight, 30);
    bubble.strokeRoundedRect(-bWidth / 2, -bHeight / 2, bWidth, bHeight, 30);

    const circle1 = this.add.circle(-bWidth / 3, bHeight / 2 + 5, isToxic ? 18 : 12, bgColor).setStrokeStyle(3, strokeColor);
    const circle2 = this.add.circle(-bWidth / 2, bHeight / 2 + 20, isToxic ? 12 : 8, bgColor).setStrokeStyle(3, strokeColor);

    const text = this.add.text(0, 0, message, {
      fontSize: isToxic ? '26px' : '20px',
      color: textColor,
      align: 'center',
      fontStyle: 'bold',
      wordWrap: { width: bWidth - 20 }
    }).setOrigin(0.5);

    container.add([circle2, circle1, bubble, text]);
    container.setSize(bWidth, bHeight);
    container.setInteractive({ draggable: true, useHandCursor: true });

    container.on('drag', (pointer, dragX, dragY) => {
      container.setDepth(20); 
      
      if (isToxic) {
        //wiederstand je keliner die Zahl, desto schwerer zu ziehen
        const resistance = 0.01; 
        const dx = (dragX - container.x) * resistance;
        const dy = (dragY - container.y) * resistance;
        
        // Bewege den Container mit extremem Widerstand + heftigem Jitter
        container.x += dx + (Math.random() * 6 - 3);
        container.y += dy + (Math.random() * 6 - 3);

      } else {
        container.setPosition(dragX, dragY);
      }
    });

    container.on('dragend', () => {
        container.setDepth(10); // Zurück auf Standard-Bubble-Depth
    });

    container.setScale(0);
    this.tweens.add({
      targets: container,
      scale: 1,
      duration: isToxic ? 600 : 300,
      ease: isToxic ? 'Bounce.easeOut' : 'Back.easeOut'
    });
  }
}