import Phaser from "phaser";
import "./style.css";
import Menu from "./scenes/menu.js";
import Fish from "./scenes/fish.js";


const config = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "x000000",
  scene: [Menu,Fish],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
    
  }
};

new Phaser.Game(config);