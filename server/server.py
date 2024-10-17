import socketio
from gevent import pywsgi
from game import Game

# Server timeout and ping interval in seconds. Timeout should be larger than interval
# to account for multiple ping intervals.
SERVER_PING_TIMEOUT = 5.0
SERVER_PING_INTERVAL = 2.0


class Server(socketio.Namespace):
    game = Game()

    def on_connect(self, sid, environ):
        print("Client connected w/ SID", sid)

        if not self.game.active:
            self.game.start_game()

        # Add player to game
        self.game.add_player(sid)

        self.emit('connect_ack', {
            'sid': sid,
            'pos_x': self.game.players[sid].pos_x,
            'pos_y': self.game.players[sid].pos_y,
            'color': self.game.players[sid].color
        })

        self.emit('players_info', self.game.get_players())

    def on_disconnect(self, sid):
        print(sid, "Disconnected")

        # Remove player from game
        self.game.remove_player(sid)

        # If no players remaining, end the game
        if len(self.game.get_players()) == 0:
            self.game.end_game()
            return

        # Update players of removed player
        self.emit('remove_player', {'sid': sid})

    def on_player_movement(self, sid, data):
        # Debugging statements
        if data['state'] == 'idle':
            print(sid, " is idle at x:", data['pos_x'], " y:", data['pos_y'])
        elif data['state'] == 'moving_left' or data['state'] == 'moving_right':
            print(sid, "is moving at x velocity", data['velocity_x'])

        self.game.set_player_position(sid, data['pos_x'], data['pos_y'])
        self.game.set_player_velocity_x(sid, data['velocity_x'])

        # We want to emit to everyone player information
        self.emit('players_info', self.game.get_players())

    def on_player_jump(self, sid, data):
        # Debugging statements
        if data['state'] == 'idle':
            print(sid, " is not jumping")
        elif data['state'] == 'active':
            print(sid, " is jumping at y velocity: ", data['velocity_y'])

        self.game.set_player_position(sid, data['pos_x'], data['pos_y'])
        self.game.set_player_velocity_y(sid, data['velocity_y'])

        # We want to emit to everyone player information
        print(self.game.get_players())
        self.emit('players_info', self.game.get_players())

    def on_end_game(self, sid, data):
        print(sid, " won the game!")

        # Emit end game message to all connected clients
        self.emit('end_game_trigger', {'sid': sid})

    def on_restart_game(self, sid, data):
        print("Restart game")

        self.game.restart_game()

        # Send restart game event to all connected clients with reset positions
        self.emit('restart_game', {'x':self.game.PLAYER_START_POS_X, 'y':self.game.PLAYER_START_POS_Y})


if __name__ == '__main__':
    sio = socketio.Server(
        async_mode='gevent',
        ping_timeout=SERVER_PING_TIMEOUT,
        ping_interval=SERVER_PING_INTERVAL,
        cors_allowed_origins="*"
    )
    sio.register_namespace(Server('/'))
    app = socketio.WSGIApp(sio)

    # Listen of port 8080 for testing
    pywsgi.WSGIServer(('', 8090), app).serve_forever()

