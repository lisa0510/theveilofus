export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const graphics = this.add.graphics();
    const rt = this.add.renderTexture(0, 0, 800, 600);
    
    // Wir speichern den Zustand in einem Objekt, damit er überall erreichbar ist
    this.settings = {
      brushSize: 4,
      color: 0xffffff,
      currentBrush: 'marker'
    };

    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;

      // Je nach Modus zeichnen
      if (this.settings.currentBrush === 'marker') {
        graphics.lineStyle(this.settings.brushSize, this.settings.color);
        graphics.lineBetween(
          pointer.prevPosition.x,
          pointer.prevPosition.y,
          pointer.x,
          pointer.y
        );
      } else if (this.settings.currentBrush === 'pencil') {
        // Hinweis: 'pencil_dot' muss in der PreloadScene geladen sein
        rt.draw('pencil_dot', pointer.x, pointer.y, 0.8, this.settings.color);
      } else if (this.settings.currentBrush === 'watercolor') {
        // Hinweis: 'brush_blob' muss in der PreloadScene geladen sein
        rt.draw('brush_blob', pointer.x, pointer.y, 0.1, this.settings.color);
      } else if (this.settings.currentBrush === 'spray') {
        // Neue Pinselvariante: verstreute Farbspritzer
        for (let i = 0; i < 12; i++) {
          const offsetX = Phaser.Math.Between(-18, 18);
          const offsetY = Phaser.Math.Between(-18, 18);
          const radius = Phaser.Math.Between(1, 4);
          graphics.fillStyle(this.settings.color, 0.8);
          graphics.fillCircle(pointer.x + offsetX, pointer.y + offsetY, radius);
        }
      }
    });

    // --- UI FUNKTION FÜR DIE BUTTONS ---
    const buttons = [];

    const createBrushBtn = (x, y, label, type) => {
      const btn = this.add.text(x, y, label, {
        fontSize: '18px',
        backgroundColor: '#000',
        padding: { x: 10, y: 5 }
      })
      .setInteractive()
      .on('pointerdown', () => {
        // 1. Alle Buttons auf Schwarz zurücksetzen
        buttons.forEach(b => b.setBackgroundColor('#000'));
        // 2. Aktuellen Pinsel ändern
        this.settings.currentBrush = type;
        // 3. Diesen Button hervorheben
        btn.setBackgroundColor('#555');
      });

      buttons.push(btn);
      return btn;
    };

    // Buttons erstellen
    createBrushBtn(20, 70, '🖊 Marker', 'marker').setBackgroundColor('#555'); // Start-Aktiv
    createBrushBtn(20, 110, '✏ Pencil', 'pencil');
    createBrushBtn(20, 150, '🎨 Watercolor', 'watercolor');
    createBrushBtn(20, 190, '💨 Spray', 'spray');

    // --- STANDARD BUTTONS ---

    // Clear button
    this.add.text(20, 20, 'Clear Board', {
      fontSize: '20px',
      backgroundColor: '#900',
      padding: { x: 8, y: 4 }
    })
    .setInteractive()
    .on('pointerdown', () => {
      graphics.clear();
      rt.clear();
    });

    // Next button
    this.add.text(650, 20, 'Next →', {
      fontSize: '20px',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    })
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('KitchenScene');
    });
  }
}