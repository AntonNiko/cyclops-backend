/*
 Setup based on following tutorial: https://gamedevacademy.org/create-a-basic-multiplayer-game-in-phaser-3-with-socket-io-part-1/
 Basic platformer game based on: https://phaser.io/tutorials/making-your-first-phaser-3-game/part1
 */
let endScene = new EndScene();

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: SCENE_WIDTH,
    height: SCENE_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 300}
        }
    },
    scene: [
        Game,
        endScene
    ],
    pixelArt: true,
};

let index = new Phaser.Game(config);
