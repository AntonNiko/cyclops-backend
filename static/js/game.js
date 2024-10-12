/* 
    Extracted gameplay using javascript classes using different scenes.
    This is the main scene for the game. The following tutorial was used as a framework to
    develop the functionality of the game:
    https://learn.yorkcs.com/build-a-space-shooter-with-phaser-3/
*/

const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 600;

/*
 * Define the location of platforms throughout the game for the player. In the future, positions should be defined
 * by the server to ensure a consistent definition.
 */
const PLATFORMS = [
    {'type': 'natural', 'left_x':270, 'right_x':450, 'y':584},
    {'type': 'natural', 'left_x':680, 'right_x':760, 'y':450},
    {'type': 'natural', 'left_x':200, 'right_x':580, 'y':330},
    {'type': 'natural', 'left_x':420, 'right_x':480, 'y':190},
    {'type': 'natural', 'left_x':680, 'right_x':760, 'y':50},
    {'type': 'natural', 'left_x':350, 'right_x':400, 'y':-50},
    {'type': 'natural', 'left_x':680, 'right_x':760, 'y':-200},
    {'type': 'natural', 'left_x':740, 'right_x':760, 'y':-350},
    {'type': 'natural', 'left_x':380, 'right_x':550, 'y':-400},
    {'type': 'natural', 'left_x':600, 'right_x':650, 'y':-650},
    {'type': 'natural', 'left_x':0, 'right_x':150, 'y':-700},
    {'type': 'natural', 'left_x':400, 'right_x':480, 'y':-900},
    {'type': 'boost', 'x':100, 'y':30},
    {'type': 'boost', 'x':250, 'y':-350},
    {'type': 'boost', 'x':450, 'y':-550},
    {'type': 'boost', 'x':70, 'y':-800},
    {'type': 'broken', 'x':150, 'y':-200, 'strength': 40},
    {'type': 'broken', 'x':400, 'y':-250, 'strength': 40},
    {'type': 'broken', 'x':750, 'y':-500, 'strength': 40},
    {'type': 'broken', 'x':300, 'y':-800, 'strength': 20}
];

/**
 * Represents the main scene of the game that the player interacts with during gameplay. The socket.io functionality
 * is defined here, along with objects and player characters.
 */
class Game extends Phaser.Scene {

    constructor() {
        super({
            key: "Game"
        });

        // Flag that is changed to signify the current player has reached the end flag and ensure only a single
        // end game event is sent.
        this.game_ended = false;
    }

    preload() {

        // Load sprite for green dino (right direction)
        this.load.spritesheet('green', '/assets/dino-green.png', {
            frameWidth: 24, 
            frameHeight:24 
        })

        // Load sprite for green dino (left direction)
        this.load.spritesheet('green-reverse', '/assets/dino-green-reverse.png', {
            frameWidth: 24,
            frameHeight:24
        })

        // Load sprite for blue dino (right direction)
        this.load.spritesheet('blue', '/assets/dino-blue.png', {
            frameWidth: 24,
            frameHeight:24
        })

        // Load sprite for blue dino (left direction)
        this.load.spritesheet('blue-reverse', '/assets/dino-blue-reverse.png', {
            frameWidth: 24,
            frameHeight:24
        })

        // Load sprite for red dino (right direction)
        this.load.spritesheet('red', '/assets/dino-red.png', {
            frameWidth: 24,
            frameHeight:24
        })

        // Load sprite for red dino (left direction)
        this.load.spritesheet('red-reverse', '/assets/dino-red-reverse.png', {
            frameWidth: 24,
            frameHeight:24
        })

        // Load sprite for yellow dino (right direction)
        this.load.spritesheet('yellow', '/assets/dino-yellow.png', {
            frameWidth: 24,
            frameHeight:24
        })

        // Load sprite for yellow dino (left direction)
        this.load.spritesheet('yellow-reverse', '/assets/dino-yellow-reverse.png', {
            frameWidth: 24,
            frameHeight:24
        })

        // Load sprite for the broken platform that decays as player stands on them
        this.load.spritesheet('broken-platform', '/assets/broken.png', {
            frameWidth: 32,
            frameHeight: 16
        });

        // Load sprite for the boost platform that propels the player up the map
        this.load.spritesheet('boost-platform', '/assets/mushroom.png', {
            frameWidth: 16,
            frameHeight: 22
        });

        // Load other sprites such as the natural platform, flag, sky and mountain background used at respawn point.
        this.load.image('ground', '/assets/nature-row.png');
        this.load.image('ground-center', '/assets/nature-center.png');
        this.load.image('ground-left', '/assets/nature-left.png');
        this.load.image('ground-right', '/assets/nature-right.png');
        this.load.image('longTile', '/assets/nature-rectangle.png');
        this.load.image('mountain-background', '/assets/mountain.png');
        this.load.image('sky', '/assets/sky.png');
        this.load.image('flag', '/assets/flag.png');

        this.cameras.main.setBackgroundColor('#169ac5')
    }

    create() {
        this.player = null;
        this.otherPlayers = {};
        this.plats = [];

        /* Initialize global assets */
        let bg = this.add.image(0, 200, 'sky').setScale(2);

        /* Initialize top portion of background block */
        let base_top = this.add.image(390, 450, 'mountain-background');
        base_top.setScale(3);

        let base_bottom = this.add.image(390, 600, 'mountain-background');
        base_bottom.setScale(3);

        let base_boundary = this.add.image(390, 750, 'mountain-background');
        base_boundary.setScale(3);

        /* Render all the platforms as specified by the argument */
        this.platform_manager = new PlatformManager(this, PLATFORMS);
        this.plats = this.platform_manager.getPlatforms();

        /* Render the flag used to detect end of game */
        this.flag = this.physics.add.staticImage(445, -975,'flag').setScale(2.5);

        /* Setup Socket.IO and event bindings w/ callbacks */
        this.setupSocketIoCallbacks();

        /* Initialize cursor so that game captures user input */
        this.cursors = this.input.keyboard.createCursorKeys();

        /* Initialize W,A,S,D keys as additional user input to be captured by game */
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        /* Initialize camera at respawn point */
        this.cameras.main.centerOn(bg.displayWidth, bg.displayHeight);
    }

    update() {
        /*
         * Call the update method from the current player to fetch any input changes
         * that need to be relayed to the server
         *
         * IMPORTANT: Do not call update() on any of the "other" players, since
         * we only want to receive input from current player.
         */
        if (this.player != null) {
            this.player.update();
        }
    }

    setupSocketIoCallbacks() {
        /*
         * Declare reference to the Game class so socket.IO callbacks can
         * reference it.
         */
        let self = this;

        /*
         * Setup socket.io event bindings w/ callbacks
         */
        this.socket = io();

        /**
         * Event that indicates the server has acknowledged the client's connection and provides information on
         * the player's position.
         */
        this.socket.on('connect_ack', function(data) {
            if (self.player == null) {
                console.log(data);
                self.player = new PlayerCurrent(self, data["sid"], data["pos_x"], data["pos_y"], data["color"]);

                // Add collision check between objects and platforms
                //self.platform_manager.addCollider(self.player, PLATFORMS, self.platforms)
            } else {
                console.log("Error: Trying to create a new player; player with SID already exists")
            }
        });

        /**
         * Event that transmits the most recent position and velocity of all connected players. The information includes
         * velocity and position information. (e.g. movement and jumping states)
         */
        this.socket.on('players_info', function (data) {
            // This callback function updates the states of every other player
            Object.keys(data).forEach(function (id){

                    // Update player information
                    if (id != self.player.sid) {
                        // If there is no other player object with the same ID, initialize a new Player object
                        if (!(id in self.otherPlayers)) {
                            self.otherPlayers[id] = new PlayerOther(self, id, data[id]['movement']['pos_x'], data[id]['movement']['pos_y'], data[id]['movement']['color']);
                        }

                        self.otherPlayers[id].setState(data[id]);
                    }
            });
        });

        /**
         * Event that notifies the client to remove a player from the map, effectively destroying the srite from the
         * scene.
         */
        this.socket.on('remove_player', function (data) {
            /**
             * Remove the player with the specified SID from the game.
             */

            if (!(data['sid'] in self.otherPlayers)) {
                console.log('Error, trying to delete nonexistent player.');
                return;
            }

            // Delete player from canvas as well as from the otherPlayers dictionary
            self.otherPlayers[data['sid']].player_data.destroy();
            delete self.otherPlayers[data['sid']];

            console.log('Deleted player w/ SID: ', data['sid']);
        });

        /**
         * Event that signifies that a player has reached the flag and the current game is finished. Triggers the
         * end game scene to be launched.
         */
        this.socket.on('end_game_trigger', function (data) {
            self.game_ended = true;

            // Fetch appropriate color
            let color;
            if (data['sid'] != self.player.sid) {
                color = self.otherPlayers[data['sid']].color;
            } else {
                color = self.player.color;
            }

            self.scene.launch('EndScene', {'color': color, 'socket': self.socket});
        });

        /**
         * Event that signifies that a new game shall be started with all currently connected players. Destroys the
         * end game scene and respawns all players at the specified positions.
         */
        this.socket.on('restart_game', function (data) {

            // Reset current player's position
            self.player.player_data.x = data['x'];
            self.player.player_data.y = data['y'];

            // Reset other players' positions
            for (let sid in self.otherPlayers) {
                self.otherPlayers[sid].player_data.x = data['x'];
                self.otherPlayers[sid].player_data.y = data['y'];
            }

            // After restart process complete, resume scene updates
            self.scene.stop('EndScene');

            // Clear the game ended flag so player can reach game end again
            self.game_ended = false;
        });
    }

    /**
     * gameOver() which is invoked by a prespecified condition, thus sending a socket.IO message 'end_game' to notify
     * the server that the current player has won the game.
     */
    gameOver(){
        if (!this.game_ended) {
            this.socket.emit('end_game', {});
        }
    }
}