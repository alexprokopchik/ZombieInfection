
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Zombie(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.count = 0;
    
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.setIt = function () {
    this.it = true;
    this.visualRadius = 500;
    
};

function drawText() {
    this.isInfected = false;
}

   // ctx.drawImage(ASSET_MANAGER.getAsset("./img/infected.png"), 325, 325, 175, 50);
    //var input = canvas.createElement('input');
    //input.type = "text";
    //input.setAttribute("style", "width:200px");
    //input.setAttribute("value", "INFECTED!");
    //input.setAttribute("color", "white");

Zombie.prototype.setNotIt = function () {
    this.it = false;
    this.visualRadius = 200;
    
};

Zombie.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Zombie.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Zombie.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Zombie.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Zombie.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};
drawText.prototype.update = function () {
}
drawText.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/infected.png"), 325, 325, 175, 50);
    ctx.closePath();
};

Zombie.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;

            if (this.it) {
                ent.setIt();
                this.count++;
                
            }
            else if (ent.it) {
                this.setIt();
                this.count++;
            }
        }

        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Zombie.prototype.draw = function (ctx) {
    ctx.beginPath();
    if (this.it) {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/zombieguy.png"), this.x - this.radius, this.y - this.radius, 62, 62);
        if (this.count >0) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./img/infected.png"), 325, 325, 175, 50);
        }
    }
    else {
        ctx.drawImage(ASSET_MANAGER.getAsset("./img/person.png"), this.x - this.radius, this.y - this.radius, 50, 50);
    }
    ctx.closePath();
};


// the "main" code begins here
var friction = 1;
var acceleration = 100000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/zombie.png");
ASSET_MANAGER.queueDownload("./img/infected.png");
ASSET_MANAGER.queueDownload("./img/zombieguy.png");
ASSET_MANAGER.queueDownload("./img/person.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/zombie.png")));
    var zombie = new Zombie(gameEngine);
    var infected = new drawText();
    var text = new drawText(gameEngine);

    zombie.setIt();

    gameEngine.addEntity(zombie);
    for (var i = 0; i < 12; i++) {
        zombie = new Zombie(gameEngine, ctx);
        gameEngine.addEntity(zombie);
    }
    

    gameEngine.start();
});
