
function Background(game, background) {
    this.active_background = background;
    this.x = 0;
    this.y = 0;
    this.startX = 0;
    this.startY = 0;
    this.game = game;
    this.ctx = game.ctx;
}

Background.prototype.draw = function () {
    //console.log(this.active_background);
    this.ctx.drawImage(this.active_background,
                  0, 0,  // source from sheet
                  800, 800,
                  0, 0,
                  800,
                  800);
}

Background.prototype.update = function () {
    //do nothing
}
