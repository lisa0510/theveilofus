import Phaser from "phaser";
import "./style.css";

import Menu from "./scenes/menu.js";
import CoffeeBar from "./scenes/coffebar.js";
import Customer from "./scenes/customerdialogue.js";


const config = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "x000000",
  scene: [Menu, Customer, CoffeeBar],
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight
  }
};

new Phaser.Game(config);