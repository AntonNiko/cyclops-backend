

class Player {

    /**
     * Initializes an instance of the Player class and immediately renders it on the provided scene at the
     * specified coordinates.
     *
     * @param scene: The scene used to add and modify sprites
     * @param sid: The sid from socket.IO associated with the player's identification
     * @param pos_x: The X coordinate at which the player should be rendered at
     * @param pos_y: The Y coordinate at which the player should be rendered at
     * @param color: The player's color, used to add the correct sprites
     */
    constructor(scene, sid, pos_x, pos_y, color) {
        this.scene = scene;
        this.sid = sid;
        this.player_data = null;
        this.movement_state = null;
        this.jumping_state = null;
        this.color = color;

        console.log("Creating new player w/ SID: "+sid+ "with color "+this.color);
        this.render(pos_x, pos_y);
    }

    /**
     * Renders the player object as a sprite with the provided X and Y coordinates.
     *
     * @param pos_x: The X coordinate at which the player should be rendered at
     * @param pos_y: The Y coordinate at which the player should be rendered at
     */
    render(pos_x, pos_y) {
        // Set respawn position as the render coordinates
        this.respawn_x = pos_x;
        this.respawn_y = pos_y;

        // Add sprite to the scene and configure physics parameters
        this.player_data = this.scene.physics.add.sprite(pos_x, pos_y, this.color).setScale(3);
        this.player_data.setBounce(0.1);
        this.player_data.setGravityY(400);
        this.player_data.setCollideWorldBounds(true);

        // Create player animations that are prepended by the color identifier
        this.scene.anims.create({
            key: this.color+'-run-left',
            frames: this.scene.anims.generateFrameNumbers(this.color+'-reverse', { start: 13, end: 19 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: this.color+'-run-right',
            frames: this.scene.anims.generateFrameNumbers(this.color, { start: 3, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: this.color+'-idle-left',
            frames: this.scene.anims.generateFrameNumbers(this.color+'-reverse', { start: 13, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: this.color+'-idle-right',
            frames: this.scene.anims.generateFrameNumbers(this.color, {start: 3, end: 3}),
            frameRate: 10,
            repeat: -1
        })

        this.scene.anims.create({
            key: this.color+'-jump',
            frames: this.scene.anims.generateFrameNumbers(this.color, { start: 9, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        // The player is initially in a standing, non jumping state. This is
        // the default state. The movement and jumping states are initialized.
        this.movement_state = new PlayerMovementIdleState(this.player_data, this.scene, 'right', this.respawn_x, this.respawn_y, this.color);
        this.jumping_state = new PlayerJumpingIdleState(this.player_data, this.scene, this.respawn_x, this.respawn_y);

        // This handles all the collisions based on platform type
        this.scene.plats.forEach(element => this.scene.physics.add.collider(this.player_data, element, function(player_data, element, jumping_state, scene) {
            if (element.getData('type') == 'boost'){
                if (element.body.touching.up == true ) {
                    element.anims.play('boosty', true);
                    jumping_state = new PlayerJumpingActiveState(player_data, scene, -700);
                    element.body.touching.up =  false;
                }

            } else if (element.getData('type') == 'broken') {
                if (element.getData('strength') == 0 ) {
                    element.destroy();
                } else if (element.getData('strength') == 80) {
                    element.setTexture('broken-platform', 1);
                    element.data.values.strength -= 1;

                } else if (element.getData('strength') == 60) {
                    element.setTexture('broken-platform', 2);
                    element.data.values.strength -= 1;

                } else if (element.getData('strength') == 40) {
                    element.setTexture('broken-platform', 3);
                    element.data.values.strength -= 1;

                } else if (element.getData('strength') == 20) {
                    element.setTexture('broken-platform', 4);
                    element.data.values.strength -= 1;

                } else {
                    element.data.values.strength -= 1;
                }
            }
        }));
    }
}
