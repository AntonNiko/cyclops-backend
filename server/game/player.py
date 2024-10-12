

class Player:

    def __init__(self, pos_x, pos_y, velocity_x, velocity_y, color=None):
        """
        Initializes a new player together with position and velocity data.
        :param pos_x:
        :param pos_y:
        :param velocity_x:
        :param velocity_y:
        """

        self.pos_x = pos_x
        self.pos_y = pos_y
        self.move_state = 'idle'
        self.velocity_x = velocity_x
        self.velocity_y = velocity_y
        self.jump_state = 'idle'
        self.color = 'green' if color is None else color

    def get_full_info(self):
        """
        Returns a data representation of all the player's info that can be sent to clients
        :return:
        """
        result = {
            'movement': {
                'state': self.move_state,
                'pos_x': self.pos_x,
                'pos_y': self.pos_y,
                'velocity_x': self.velocity_x,
                'color': self.color
            },
            'jumping': {
                'state': self.jump_state,
                'velocity_y': self.velocity_y
            }
        }

        return result

    def set_position(self, pos_x, pos_y):
        """
        Sets the player's position info
        :param pos_x:
        :param pos_y:
        :return:
        """

        self.pos_x = pos_x
        self.pos_y = pos_y

    def set_velocity_x(self, velocity_x):
        """
        Sets the player's X velocity
        :param velocity_x:
        :return:
        """

        if velocity_x == 0:
            self.move_state = 'idle'
        elif velocity_x < 0:
            self.move_state = 'moving_left'
        elif velocity_x > 0:
            self.move_state = 'moving_right'

        self.velocity_x = velocity_x

    def set_velocity_y(self, velocity_y):
        """
        Sets the player's Y velocity
        :param velocity_y:
        :return:
        """

        if velocity_y == 0:
            self.jump_state = 'idle'
        else:
            self.jump_state = 'active'

        self.velocity_y = velocity_y
