

class PlayerOther extends Player {

    /**
     * Initializes an instance of the PLayerOther class by initializing its parent class. This class
     * is responsible for rendering and updating the other players connected and rendered in the scene
     * that are not the current player.
     *
     * @param scene
     * @param sid
     * @param pos_x
     * @param pos_y
     * @param color
     */
    constructor(scene, sid, pos_x, pos_y, color) {
        super(scene, sid, pos_x, pos_y, color);
    }

    /**
     * Called to update the state of the other player in the scene. Intended to be called
     * as a result of receiving update events from the server on the state of other players
     * in the game.
     *
     * @param data: The data used to set the other player's state in the scene
     */
    setState(data) {
        /**
         * This method is only called when the player is an "other" player on someone else's
         * screen.
         */

        // If the player has not been rendered yet, render them.
        if (this.player_data == null) {
            this.render(data["movement"]["pos_x"], data["movement"]["pos_y"]);
        }

        // Set the movement state only if different from current state
        if (data['movement']['state'] != this.movement_state.state_name) {
            switch (data['movement']['state']) {
                case 'idle':
                    this.player_data.x = data['movement']['pos_x'];
                    this.player_data.y = data['movement']['pos_y'];

                    // When other player stops, keep track of orientation to set left/right direction properly.
                    if (this.movement_state.state_name == 'moving_left') {
                        this.movement_state = new PlayerMovementIdleState(this.player_data, this.scene, 'left', data['movement']['pos_x'], data['movement']['pos_y'], this.color);
                    } else {
                        this.movement_state = new PlayerMovementIdleState(this.player_data, this.scene, 'right', data['movement']['pos_x'], data['movement']['pos_y'], this.color);
                    }

                    break;
                case 'moving_left':
                    this.player_data.x = data['movement']['pos_x'];
                    this.player_data.y = data['movement']['pos_y'];
                    this.movement_state = new PlayerMovementMovingLeftState(this.player_data, this.scene, data['movement']['velocity_x'], data['movement']['pos_x'], data['movement']['pos_y'], this.color);
                    break;
                case 'moving_right':
                    this.player_data.x = data['movement']['pos_x'];
                    this.player_data.y = data['movement']['pos_y'];
                    this.movement_state = new PlayerMovementMovingRightState(this.player_data, this.scene, data['movement']['velocity_x'], data['movement']['pos_x'], data['movement']['pos_y'], this.color);
                    break;
                default:
                    break;
            }
        }

        // Set the jumping state only if different from current state
        if (data['jumping']['state'] != this.jumping_state.state_name) {
            switch (data['jumping']['state']) {
                case 'idle':
                    this.player_data.x = data['movement']['pos_x'];
                    this.player_data.y = data['movement']['pos_y'];
                    this.jumping_state = new PlayerJumpingIdleState(this.player_data, this.scene);
                    break;
                case 'active':
                    this.player_data.x = data['movement']['pos_x'];
                    this.player_data.y = data['movement']['pos_y'];
                    this.jumping_state = new PlayerJumpingActiveState(this.player_data, this.scene, data['jumping']['velocity_y']);
                    break;
                default:
                    break;
            }
        }
    }
}
