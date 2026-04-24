export default class Shop extends Phaser.Scene {
    constructor() {
        super('Shop');
    }

    preload() {
        this.load.image('shop_bg', 'assets/Fish/Hintergrund.png');
        this.load.image('cutting', 'assets/Fish/Cuttingboard.png');
        this.load.image('customer', 'assets/Fish/TaucherWarten.png');
        this.load.image('tisch', 'assets/Fish/Tisch.png');
        this.load.image('knive', 'assets/Fish/knive.png');
        this.load.image('bag', 'assets/Fish/bagopen.png');
        this.load.image('box', 'assets/Fish/box.png');
    }

    create() {
        const { width, height } = this.scale;

        let bg = this.add.image(width / 2, height / 2, 'shop_bg').setDepth(-2);
        bg.setDisplaySize(width, height);

        let cutting = this.add.image(width / 4, height / 1.1, 'cutting').setScale(0.7);
        let customer = this.add.image(width / 4, height / 1.8, 'customer').setScale(0.8);
        let tisch = this.add.image(width / 2, height / 1, 'tisch').setScale(1.2).setDepth(-1);
        let knive = this.add.image(width / 2.5, height / 1.1, 'knive').setScale(0.2);
        let bag = this.add.image(width / 1.3, height / 1.2, 'bag').setScale(0.2);
        let box = this.add.image(width / 4, height / 1.3, 'box').setScale(0.5);

    }
}