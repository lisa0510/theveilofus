import Phaser from "phaser";
import "./style.css";

import Menu from "./scenes/menu.js";
import Pinboard from "./scenes/pinboard.js";
import ThoughtsBubbles from "./scenes/thoughtsbubbles.js";
import Random from "./scenes/random.js";


const config = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "x000000",
  scene: [ThoughtsBubbles, Menu, Pinboard, Random],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
    
  }
};

new Phaser.Game(config);