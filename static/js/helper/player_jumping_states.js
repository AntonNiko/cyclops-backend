const player_jumping_states = {
    IDLE: 'idle',
    ACTIVE: 'active'
}

/* The player's initial jumping velocity during jumping state */
const PLAYER_Y_VELOCITY = 500;

class PlayerJumpingIdleState {

    /**
     *
     * @param player_data: The player's information such as position & velocity
     * @param scene: The scene used to update the sprite for state changes
     * @param pos_x: The player's current X coordinate position
     * @param pos_y: The player's current Y coordinate position
     */
    constructor(player_data, scene, pos_x, pos_y) {
        this.player_data = player_data;
        this.state_name = player_jumping_states.IDLE;
        this.velocity_y = 0;
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        console.log("idle");
    }

    /**
     * Update method that when called evaluates the player's state to determine if a change in state should be triggered.
     *
     * @param scene: The scene to detect conditions that change state
     * @returns {null}
     */
    update(scene) {
        let state = null;

        if (this.player_data.body.touching.down && scene.cursors.space.isDown) {
            state = new PlayerJumpingActiveState(this.player_data, scene, -PLAYER_Y_VELOCITY, this.player_data.x, this.player_data.y);
        }

        return state;
    }
}

class PlayerJumpingActiveState {
    /**
     *
     * @param player_data: The player's information such as position & velocity
     * @param scene: The scene used to update the sprite for state changes
     * @param velocity_y: The Y velocity at which the player should be set at
     * @param pos_x: The player's current X coordinate position
     * @param pos_y: The player's current Y coordinate position
     */
    constructor(player_data, scene, velocity_y, pos_x, pos_y) {
        this.player_data = player_data;
        this.state_name = player_jumping_states.ACTIVE;
        this.velocity_y = velocity_y;
        this.pos_x = pos_x;
        this.pos_y = pos_y;

        this.player_data.setVelocityY(this.velocity_y);
    }

    /**
     * Update method that when called evaluates the player's state to determine if a change in state should be triggered.
     *
     * @param scene: The scene to detect conditions that change state
     * @returns {null}
     */
    update(scene) {
        let state = null;

        // Update the jumping state to idle once the player is back on the ground
        if (this.player_data.body.touching.down) {
            state = new PlayerJumpingIdleState(this.player_data, scene, this.player_data.x, this.player_data.y);
        }

        return state;
    }
}
