from .player import Player


class Game:
    PLAYER_START_POS_X = 250
    PLAYER_START_POS_Y = 500

    active = False
    available_colors = ['green', 'blue', 'red', 'yellow']
    players = {}

    def __init__(self):
        """
        Initializes an instance of the game class, doesn't declare any variables.
        """
        pass

    def start_game(self):
        """
        Starts the game by setting the active flag to true.
        """

        if not self.active:
            self.active = True
            print("Started new game!")
        else:
            print("Error: Game has already started.")

    def add_player(self, sid):
        """
        Adds a player with the specified SID to the game only if it does not yet exist.

        :param sid: The SID of the player to be added
        """

        if sid not in self.players:
            self.players[sid] = Player(
                pos_x=self.PLAYER_START_POS_X,
                pos_y=self.PLAYER_START_POS_Y,
                velocity_x=0,
                velocity_y=0,
                color=self.available_colors.pop() if len(self.available_colors) > 0 else 'green'
            )

    def get_players(self):
        """
        Returns player info in a dictionary format. If sid is not None,
        returns player info for all players who do not possess the specified SID

        :return: A dictionary of player info, with SID as keys
        """

        result = {}
        for sid in self.players:
            result[sid] = self.players[sid].get_full_info()
        return result

    def remove_player(self, sid):
        """
        Removes the player with the specified SID from the game. If the player does not exist, then
        notify the invoker.

        :param sid: The SID of the connected player to be removed
        """
        try:
            # Push the newly available color back into list
            self.available_colors.append(self.players[sid].color)

            del self.players[sid]
            print("Removed player with following SID: ", sid)
        except KeyError:
            print("No active players with following SID can be removed: ", sid)

    def end_game(self):
        """
        Ends the current game by setting the active flag to false.
        """

        if self.active:
            self.active = False
            print("Stopped game as no active players found.")
        else:
            print("Error: Game has already finished.")

    def restart_game(self):
        """
        Restart the game with all currently active players. The restart behavior currently
        involves resetting all active players to the respawn X & Y positions.

        :return:
        """

        for sid in self.players:
            self.players[sid].set_position(self.PLAYER_START_POS_X, self.PLAYER_START_POS_Y)

    def set_player_position(self, sid, pos_x, pos_y):
        """
        Set the position of the player w/ SID sid, does not affect velocity
        whatsoever.
        """

        if sid not in self.players:
            print("Error, no players w/ SID ", sid, " exist in this game.")
            return

        self.players[sid].set_position(pos_x, pos_y)

    def set_player_velocity_x(self, sid, velocity_x):
        """
        Set the player's x velocity, nothing else.
        """

        if sid not in self.players:
            print("Error, no players w/ SID ", sid, " exist in this game.")
            return

        self.players[sid].set_velocity_x(velocity_x)

    def set_player_velocity_y(self, sid, velocity_y):
        """
        Set the player's y velocity, nothing else.
        """

        if sid not in self.players:
            print("Error, no players w/ SID ", sid, " exist in this game.")
            return

        self.players[sid].set_velocity_y(velocity_y)
