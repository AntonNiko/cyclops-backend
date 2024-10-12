class EndScene extends Phaser.Scene {

    constructor() {
        super('EndScene');
        this.winning_player = ""
    }

    init(data) {
        this.winning_player = data['color'];
        this.socket = data['socket'];
    }

    preload() {
        this.load.image('sky', '/assets/sky.png');
    }

    create() {
        /*
         * Declare reference to current class so socket can be referenced
         */
        let self = this;

        let bg = this.add.image(0, 200, 'sky').setScale(2);
        this.add.text(165,100, "GAME OVER", {color: "black", fontSize: "80px", fontFamily: "sans-serif" });
        this.add.text(250,200, this.winning_player[0].toUpperCase() + this.winning_player.slice(1) + " Wins!", {color: this.winning_player, fontSize: "55px", fontFamily: "sans-serif"});
        this.add.text(235,450, "Click anywhere to restart", {color: "black", fontSize: "30px", fontFamily: "sans-serif"});
        this.input.on('pointerdown', () => {
            self.socket.emit('restart_game',{});
        });
    }
}
