import { Start } from './scenes/Start.js';
import { StartMenu } from './scenes/StartMenu.js';
import { GameOver } from './scenes/GameOver.js';    

const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            // configura a gravidade do jogo
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
        Start,
        StartMenu,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            