import Phaser from "phaser";

export default class Test extends Phaser.Scene {
  constructor() {
    super("Test");
  }

  preload() {
    this.load.image("fish", "assets/Fish02/Fisch.png");
    this.load.image("bg", "assets/Fish02/Hintergrund.png");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "bg").setDisplaySize(width, height);

    this.swipeGraphics = this.add.graphics().setDepth(2000);
    this.canCut = true;

    this.spawnNewFish();

    this.input.on("pointerdown", (pointer) => {
      if (!this.canCut) return;
      this.startPoint = { x: pointer.x, y: pointer.y };
    });

    this.input.on("pointermove", (pointer) => {
      if (!this.canCut || !this.startPoint || !pointer.isDown) return;
      this.swipeGraphics.clear();
      this.swipeGraphics.lineStyle(5, 0xffffff, 1);
      this.swipeGraphics.lineBetween(this.startPoint.x, this.startPoint.y, pointer.x, pointer.y);
    });

    this.input.on("pointerup", (pointer) => {
      if (this.canCut && this.startPoint) {
        this.handleDiagonalSlice(this.startPoint, { x: pointer.x, y: pointer.y });
      }
      this.startPoint = null;
      this.swipeGraphics.clear();
    });
  }

  spawnNewFish() {
    const { width, height } = this.scale;
    
    // Zufälliger Massen-Bias (0.7 bis 1.6)
    // 1.0 = perfekt gleichmäßig, > 1.0 = Kopf schwerer, < 1.0 = Schwanz schwerer
    this.currentMassBias = Phaser.Math.FloatBetween(0.7, 1.6);
    
    this.fish = this.add.image(width / 2, height / 2, "fish").setScale(0.8);
    this.fish.setAlpha(0);

    // Optisches Feedback: Den Fisch leicht verzerren, damit der Spieler raten muss
    this.fish.flipX = Math.random() > 0.5;

    this.tweens.add({
      targets: this.fish,
      alpha: 1,
      duration: 300,
      onComplete: () => { this.canCut = true; }
    });
  }

  handleDiagonalSlice(start, end) {
    const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
    const bounds = this.fish.getBounds();
    const line = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);

    if (distance < 50 || !Phaser.Geom.Intersects.LineToRectangle(line, bounds)) return;

    this.canCut = false;
    const angle = Phaser.Math.Angle.Between(start.x, start.y, end.x, end.y);

    // --- BERECHNUNG DER MARIO PARTY LOGIK ---
    const cutX = (start.x + end.x) / 2;
    const fishLeft = this.fish.x - this.fish.displayWidth / 2;
    let relativeX = Phaser.Math.Clamp((cutX - fishLeft) / this.fish.displayWidth, 0, 1);

    // Falls der Fisch geflippt ist, Bias umkehren
    let bias = this.fish.flipX ? 1 / this.currentMassBias : this.currentMassBias;

    // Berechnung der Massenverteilung
    let massLeft = Math.pow(relativeX, bias);
    let leftPercent = Math.round(massLeft * 100);
    let rightPercent = 100 - leftPercent;

    this.showResult(leftPercent, rightPercent);

    // --- MASKIERUNG & ANIMATION ---
    const leftGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    const rightGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    this.drawMask(leftGraphics, start, end, true);
    this.drawMask(rightGraphics, start, end, false);

    const leftHalf = this.add.image(this.fish.x, this.fish.y, "fish").setScale(this.fish.scale);
    const rightHalf = this.add.image(this.fish.x, this.fish.y, "fish").setScale(this.fish.scale);
    leftHalf.setFlipX(this.fish.flipX);
    rightHalf.setFlipX(this.fish.flipX);

    leftHalf.setMask(leftGraphics.createGeometryMask());
    rightHalf.setMask(rightGraphics.createGeometryMask());

    this.fish.destroy();

    const nx = Math.cos(angle + Math.PI / 2) * 80;
    const ny = Math.sin(angle + Math.PI / 2) * 80;

    this.tweens.add({
      targets: leftHalf,
      x: leftHalf.x - nx, y: leftHalf.y - ny, alpha: 0, duration: 400, ease: 'Power2'
    });

    this.tweens.add({
      targets: rightHalf,
      x: rightHalf.x + nx, y: rightHalf.y + ny, alpha: 0, duration: 400, ease: 'Power2',
      onComplete: () => {
        leftHalf.destroy(); rightHalf.destroy();
        leftGraphics.destroy(); rightGraphics.destroy();
        this.time.delayedCall(1000, () => this.spawnNewFish());
      }
    });
  }

  showResult(left, right) {
    const { width, height } = this.scale;
    const style = { fontSize: '60px', fontStyle: 'bold', fill: '#fff', stroke: '#000', strokeThickness: 8 };
    
    const leftText = this.add.text(width * 0.25, height * 0.4, left, style).setOrigin(0.5).setDepth(3000);
    const rightText = this.add.text(width * 0.75, height * 0.4, right, style).setOrigin(0.5).setDepth(3000);
    const vsText = this.add.text(width * 0.5, height * 0.4, ":", style).setOrigin(0.5).setDepth(3000);

    // Perfekt-Bonus Effekt
    if (left === 50) {
        const perf = this.add.text(width / 2, height * 0.2, "PERFECT!", { fontSize: '80px', fill: '#ff0' })
            .setOrigin(0.5).setDepth(3000);
        this.tweens.add({ targets: perf, scale: 1.5, duration: 200, yoyo: true });
        this.time.delayedCall(1500, () => perf.destroy());
    }

    this.time.delayedCall(1500, () => {
      leftText.destroy();
      rightText.destroy();
      vsText.destroy();
    });
  }

  drawMask(graphics, start, end, isLeft) {
    const offset = 2000;
    const angle = Phaser.Math.Angle.Between(start.x, start.y, end.x, end.y);
    const dir = isLeft ? -1 : 1;
    const normalAngle = angle + (Math.PI / 2) * dir;

    graphics.fillStyle(0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(start.x, start.y);
    graphics.lineTo(end.x, end.y);
    graphics.lineTo(end.x + Math.cos(normalAngle) * offset, end.y + Math.sin(normalAngle) * offset);
    graphics.lineTo(start.x + Math.cos(normalAngle) * offset, start.y + Math.sin(normalAngle) * offset);
    graphics.closePath();
    graphics.fillPath();
  }
}