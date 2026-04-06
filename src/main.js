import Phaser from "phaser";
import "./style.css";

import Menu from "./scenes/menu.js";
import CoffeeBar from "./scenes/coffebar.js";
import Customer from "./scenes/customerdialogue.js";
import Tutorial from "./scenes/tutorial.js";
import Day1_coffebar from "./scenes/day1_coffebar.js";


const config = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "x000000",
  scene: [Menu, Customer, CoffeeBar,Tutorial,Day1_coffebar],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
    
  }
};

new Phaser.Game(config);