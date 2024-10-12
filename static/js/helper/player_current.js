

class PlayerCurrent extends Player {

    /**
     * Initializes an instance of the PlayerCurrent class by first initializing its parent class, and
     * (including rendering), and then setups the camera to follow the player around the scene.
     *
     * @param scene: The scene used to add and modify sprites
     * @param sid: The sid from socket.IO associated with the player's identification
     * @param pos_x: The X coordinate at which the player should be rendered at
     * @param pos_y: The Y coordinate at which the player should be rendered at
     * @param color: The player's color, used to add the correct sprites
     */
    constructor(scene, sid, pos_x, pos_y, color) {
        super(scene, sid, pos_x, pos_y, color);

        this.scene.physics.world.setBoundsCollision(true,true,false,false);
        this.scene.cameras.main.startFollow(this.player_data,false,0,0.6,-150,100);
        this.scene.cameras.main.setDeadzone(50,150);

        this.scene.physics.add.overlap(this.player_data, this.scene.flag, this.scene.gameOver, null, this.scene);
    }

    /**
     * Update method that when called evaluates the player's state on the scene, and if a new state is created,
     * a socket.IO event is sent to the server to notify them of the appropriate changes.
     */
    update() {
        // Respawn the player at preset respawn coordinates.
        this.updatePlayerRespawn();

        /**
         * Update the current player's state by updating the movement and jumping states
         * respectively.
         */
        let new_movement_state = this.movement_state.update(this.scene);
        let new_jumping_state = this.jumping_state.update(this.scene);

        // If a change in player state is detected, then send appropriate event
        // message to server.
        if (new_movement_state != null) {
            this.movement_state = new_movement_state;

            switch (this.movement_state.state_name) {
                case player_movement_states.IDLE:

                    this.scene.socket.emit('player_movement', {
                        'state': player_movement_states.IDLE,
                        'pos_x': this.movement_state.pos_x,
                        'pos_y': this.movement_state.pos_y,
                        'velocity_x': this.movement_state.velocity_x
                    });
                    break;
                case player_movement_states.MOVING_LEFT:
                    this.scene.socket.emit('player_movement', {
                        'state': player_movement_states.MOVING_LEFT,
                        'pos_x': this.movement_state.pos_x,
                        'pos_y': this.movement_state.pos_y,
                        'velocity_x': this.movement_state.velocity_x
                    });
                    break;
                case player_movement_states.MOVING_RIGHT:
                     this.scene.socket.emit('player_movement', {
                        'state': player_movement_states.MOVING_RIGHT,
                        'pos_x': this.movement_state.pos_x,
                        'pos_y': this.movement_state.pos_y,
                        'velocity_x': this.movement_state.velocity_x
                    });
                    break;
                default:
                    break;
            }
        }

        if (new_jumping_state != null) {
            this.jumping_state = new_jumping_state;

            switch (this.jumping_state.state_name) {
                case player_jumping_states.IDLE:
                    console.log("x:"+this.player_data.x+" y:"+this.player_data.y);

                    this.scene.socket.emit('player_jump', {
                        'state': player_jumping_states.IDLE,
                        'velocity_y': this.jumping_state.velocity_y,
                        'pos_x': this.jumping_state.pos_x,
                        'pos_y': this.jumping_state.pos_y
                    });
                    break;
                case player_jumping_states.ACTIVE:
                    console.log("x:"+this.player_data.x+" y:"+this.player_data.y);

                    this.scene.socket.emit('player_jump', {
                        'state': player_jumping_states.ACTIVE,
                        'velocity_y': this.jumping_state.velocity_y,
                        'pos_x': this.jumping_state.pos_x,
                        'pos_y': this.jumping_state.pos_y
                    });
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Respawns the player's position if they fall below the scene's lowest playable height.
     */
    updatePlayerRespawn() {
        if (this.player_data.y >= 720) {
            this.player_data.x = this.respawn_x;
            this.player_data.y = this.respawn_y;
        }
    }
}