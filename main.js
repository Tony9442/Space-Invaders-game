import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
// start by finding our canvas
const canvas = document.getElementById('game');
/* form the canvas we get our ctx. ctx meaning ConTeXt
 it can also be name of a variable*/

/*The getContext function is the function that you use to get access to the 
canvas tags 2D drawing functions.*/
const ctx = canvas.getContext('2d');


canvas.width = 600;
canvas.height = 600;

// variable for our background
const background = new Image();
background.src = 'images/space.png';

/* Here we declare an instance of the enemy controller 
and enemycontroller takes in canvas*/
// BulletController variable
const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 4, "white", false);
const enemyController = new EnemyController(canvas, enemyBulletController,playerBulletController);
// here we pass in our Player
const player = new Player(canvas, 3, playerBulletController);

let isGameOver = false;
let didWin = false;
// create our game loop
function game (){
checkGameOver();
ctx.drawImage(background,0,0,canvas.width,canvas.height);
/* here inside our game loop we ask enemyController
 draw and it take ctx*/
 displayGameOver();
 if (!isGameOver){
enemyController.draw(ctx);

// here we draw our Player
player.draw(ctx);
playerBulletController.draw(ctx);
enemyBulletController.draw(ctx);
}
}

function displayGameOver(){
    if (isGameOver) {
        let text = didWin ? "You Win" : "Game Over";
        let textOffset = didWin ? 3.5 : 5;

        ctx.fillStyle = "white";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
}

function checkGameOver(){
    if (isGameOver) {
        return;
    }

    if (enemyBulletController.collideWith(player)) {
        isGameOver = true;
    }

    if (enemyController.collideWith(player)) {
        isGameOver = true;
    }
    if (enemyController.enemyRows.length === 0){
        didWin = true;
        isGameOver = true;
    }
}
// for our game loop to work we need to call it over and over
setInterval(game, 1000 / 60);
// this that we're calling the game 60 times one sec