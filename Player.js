export default class Player {
    // keybroad input for moving our players
rightPressed = false;
leftPressed = false;
// to make our player shot bullets
shootPressed = false;


    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas;
        this.velocity = velocity;
        this.bulletController = bulletController;

    //    this centers our player
        this.x = this.canvas.width / 2;
        // this places our player down below
        this.y = this.canvas.height - 75;
        this.width = 50;
        this.height = 48;
        this.image = new Image();
        this. image.src = "images/player.png";

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
    }

    draw(ctx) {
        if (this.shootPressed) {
            this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
        }
        // this MOVE is responsible for responding to the keybroad event.
        this.move();
        // this helps us stop our player from off the canvas
        this.collideWithWalls();
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    collideWithWalls(){
        // leftWall Stop
        if (this.x < 0) {
            this.x = 0;
        }
        // rightWall Stop
        if (this.x > this.canvas.width -this.width){
        this.x = this.canvas.width -this.width;
        }
    }
    //   movement of the player
    move() {
        if (this.rightPressed) {
            this.x += this.velocity;
        } else if (this.leftPressed) {
            // moveing left is a nagtive number
            this.x += -this.velocity;
        }
    }

    // define our keydown
    keydown = (event) => {
        if (event.code == "ArrowRight") {
            this.rightPressed = true;
        }
        if (event.code == "ArrowLeft") {
            this.leftPressed = true;
    }
    if (event.code == "Space") {
        this.shootPressed =true;
    }
};


keyup = (event) => {
    if(event.code == "ArrowRight") {
        this.rightPressed = false;
    }
    if(event.code == "ArrowLeft") {
        this.leftPressed = false;
}
if (event.code == "Space") {
    this.shootPressed =false;
   }
 };
}