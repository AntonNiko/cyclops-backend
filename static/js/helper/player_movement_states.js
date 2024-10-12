const player_movement_states = {
    IDLE: 'idle',
    MOVING_LEFT: 'moving_left',
    MOVING_RIGHT: 'moving_right'
}

/* The player's horizontal velocity for the movement states */
const PLAYER_X_VELOCITY = 400;

/*
 * NOTE: Animations for movement are prepended by color, so it is necessary to invoke these states with the appropriate
 * color so that the correct sprite can be rendered.
 */

class PlayerMovementIdleState {

    /**
     *
     * @param player_data: The player's information such as position & velocity
     * @param scene: The scene used to update the sprite for state changes
     * @param direction: The direction in which the player should initially be oriented in
     * @param pos_x: The player's current X coordinate position
     * @param pos_y: The player's current Y coordinate position
     * @param color: The player's sprite color which determines the sprite to be called for animation
     */
    constructor(player_data, scene, direction='right', pos_x, pos_y, color) {
        this.player_data = player_data;
        this.state_name = player_movement_states.IDLE;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = color;

        this.velocity_x = 0;
        this.player_data.setVelocityX(this.velocity_x);

        if (direction == 'left') {
            this.player_data.anims.play(this.color+'-idle-left', true);
        } else {
            this.player_data.anims.play(this.color+'-idle-right', true);
        }

    }

    /**
     * Update method that when called evaluates the player's state to determine if a change in state should be triggered.
     *
     * @param scene: The scene to detect conditions that change state
     * @returns {null}
     */
    update(scene) {
        let state = null;

        if (scene.cursors.left.isDown || scene.keyA.isDown) {
            state = new PlayerMovementMovingLeftState(this.player_data, scene, -PLAYER_X_VELOCITY, this.player_data.x, this.player_data.y, this.color);
        } else if (scene.cursors.right.isDown || scene.keyD.isDown) {
            state = new PlayerMovementMovingRightState(this.player_data, scene, PLAYER_X_VELOCITY, this.player_data.x, this.player_data.y, this.color);
        }

        return state;
    }
}

class PlayerMovementMovingLeftState {

    /**
     *
     * @param player_data: The player's information such as position & velocity
     * @param scene: The scene used to update the sprite for state changes
     * @param velocity_x: The velocity at which the player should be set at (must be negative)
     * @param pos_x: The player's current X coordinate position
     * @param pos_y: The player's current Y coordinate position
     * @param color: The player's sprite color which determines the sprite to be called for animation
     */
    constructor(player_data, scene, velocity_x, pos_x, pos_y, color) {
        if (velocity_x > 0) {
            throw new Error("Velocity X value must be negative to reflect player moving left");
        }

        this.player_data = player_data;
        this.state_name = player_movement_states.MOVING_LEFT;
        this.velocity_x = velocity_x;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = color;

        this.player_data.setVelocityX(this.velocity_x);

        if (this.player_data.body.touching.down) {
            this.player_data.anims.play(this.color+'-run-left', true);
        } else {
            this.player_data.anims.play(this.color+'-run-left', false);
        }
    }

    /**
     * Update method that when called evaluates the player's state to determine if a change in state should be triggered.
     *
     * @param scene: The scene to detect conditions that change state
     * @returns {null}
     */
    update(scene) {
        let state = null;

        if(!(scene.cursors.left.isDown || scene.keyA.isDown) && !(scene.cursors.right.isDown || scene.keyD.isDown)) {
            state = new PlayerMovementIdleState(this.player_data, scene, 'left', this.player_data.x, this.player_data.y, this.color);
        } else if (scene.cursors.right.isDown || scene.keyD.isDown){
            state = new PlayerMovementMovingRightState(this.player_data, scene, PLAYER_X_VELOCITY, this.player_data.x, this.player_data.y, this.color);
        }

        return state;
    }
}

class PlayerMovementMovingRightState {

    /**
     *
     * @param player_data: The player's information such as position & velocity
     * @param scene: The scene used to update the sprite for state changes
     * @param velocity_x: The velocity at which the player should be set at (must be positive)
     * @param pos_x: The player's current X coordinate position
     * @param pos_y: The player's current Y coordinate position
     * @param color: The player's sprite color which determines the sprite to be called for animation
     */
    constructor(player_data, scene, velocity_x, pos_x, pos_y, color) {
        if (velocity_x < 0) {
            throw new Error("Velocity X value must be positive to reflect player moving left");
        }

        this.player_data = player_data;
        this.state_name = player_movement_states.MOVING_RIGHT;
        this.velocity_x = velocity_x;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = color;

        this.player_data.setVelocityX(this.velocity_x);

        if (this.player_data.body.touching.down) {
            this.player_data.anims.play(this.color+'-run-right', true);
        } else {
            this.player_data.anims.play(this.color+'-run-right', false);
        }
    }

    /**
     * Update method that when called evaluates the player's state to determine if a change in state should be triggered.
     *
     * @param scene: The scene to detect conditions that change state
     * @returns {null}
     */
    update(scene) {
        let state = null;

        if(!(scene.cursors.left.isDown || scene.keyA.isDown) && !(scene.cursors.right.isDown || scene.keyD.isDown)) {
            state = new PlayerMovementIdleState(this.player_data, scene, 'right', this.player_data.x, this.player_data.y, this.color);
        } else if (scene.cursors.left.isDown || scene.keyA.isDown){
            state = new PlayerMovementMovingLeftState(this.player_data, scene, -PLAYER_X_VELOCITY, this.player_data.x, this.player_data.y, this.color);
        }

        return state;
    }
}