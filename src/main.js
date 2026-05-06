import Phaser from "phaser";
import "./style.css";
import Menu from "./scenes/menu.js";
import Shop from "./scenes/shop.js";
import Tutorial from "./scenes/tutorial.js";
import Intro from "./scenes/introtext.js";
import Ending from "./scenes/Ending.js";


const config = {
  type: Phaser.AUTO,
  parent: "app",
  scene: [Menu,Intro, Tutorial, Shop,Ending],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
    
  }
};

new Phaser.Game(config);