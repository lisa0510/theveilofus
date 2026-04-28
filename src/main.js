import Phaser from "phaser";
import "./style.css";
import Menu from "./scenes/menu.js";
import Shop from "./scenes/shop.js";
import Tutorial from "./scenes/tutorial.js";


const config = {
  type: Phaser.AUTO,
  parent: "app",
  scene: [Shop,Menu,Tutorial],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
    
  }
};

new Phaser.Game(config);