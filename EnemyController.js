import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";
/*The enemy Controller is responsible for managing 
 our enemies and moving in a group*/
export default class EnemyController{

    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      ];
      /*The idea behind the enemyMap is to convert these 
      number to actual enemy object and it will stroed 
      inside the array called enemyRows and set to emety list.*/
      enemyRows = [];

    //   this is the frist direction our enemy will be moving Right
    currentDirection = MovingDirection.right;
     xVelocity = 0; /*horizontally movement of our enemies*/
    yVelocity = 0;  /*down movement of our enemies*/
    defaultXVelocity = 1; /*detamines if our enemies move faster or slow horizontally*/
    defaultYVelocity = 1;  /*detamines if our enemies move fast or slow when moving down*/


    /* This is the timer of the movment for our enemy the value count down to 0
    the enemies start moving in a horizontal direction.*/
    moveDownTimerDefault = 30;
    moveDownTimer= this.moveDownTimerDefault;
    fireBulletTimerDefault = 100;
    fireBulletTimer = this.fireBulletTimerDefault;



    constructor(canvas, enemyBulletController, playerBulletController) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;

        this.enemyDeathSound = new Audio('sounds/enemy-death.wav');
        this.enemyDeathSound.volume = 0.5;

        this.createEnemies();
    }


    draw(ctx){
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDetection();
          // we're going draw our Enemy from here and it takes in the ctx 
        this.drawEnemies(ctx);
        /*Called in from mainjs so 
    enemyController can responed*/
        this.resetMoveDownTimer();
        this.fireBullet();
    }

    collisionDetection() {
      this.enemyRows.forEach((enemyRow) => {
       enemyRow.forEach((enemy, enemyIndex) => {
         if (this.playerBulletController.collideWith(enemy)) {
            // play a sound
            this.enemyDeathSound.currentTime = 0;
            this.enemyDeathSound.play();
            enemyRow.splice(enemyIndex, 1);
         }
       });
      });
        this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
    }

    fireBullet() {
        this.fireBulletTimer--;
        if (this.fireBulletTimer <= 0) {
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x,enemy.y,-3);
            console.log(enemyIndex);
        }
    }

    resetMoveDownTimer(){
        if(this.moveDownTimer <= 0){
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }
    decrementMoveDownTimer(){
        if(this.currentDirection === MovingDirection.downLeft ||
             this.currentDirection === MovingDirection.downRight) {
                this.moveDownTimer--;
             }
    }

    updateVelocityAndDirection() {
    //   We loop every row checking the furthest right enemy and if its touching the wall
    for (const enemyRow of this.enemyRows) {
        if(this.currentDirection == MovingDirection.right) {
            this.xVelocity = this.defaultXVelocity;
            this.yVelocity = 0;

            
            // Detecting the edge of the screen with our rightMostEnemy
            const rightMostEnemy = enemyRow[enemyRow.length - 1];
            if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
               this.currentDirection = MovingDirection.downLeft;
               break;
            }
        }
        else if (this.currentDirection === MovingDirection.downLeft) {
        
            if(this.moveDown(MovingDirection.left)) {
                break;
            }

            
            // here we push our enemy to start moving left
        } else if(this.currentDirection === MovingDirection.left) {
            this.xVelocity = -this.defaultXVelocity;
             this.yVelocity = 0;

            //  here we switch our enemy direction to down right
            const leftMostEnemy = enemyRow[0];
            if (leftMostEnemy.x <= 0 ) {
                this.currentDirection = MovingDirection.downRight;
                break;
            }
        } else if (this.currentDirection = MovingDirection.downRight){
            if(this.moveDown(MovingDirection.right)) {
                break;
            }
        }
    }
    }

    moveDown(newDirection){
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if(this.moveDownTimer <= 0){
            this.currentDirection = newDirection;
            return true;
        }
        return false;
    }

    /*here we defined the drawEnemies method and loop over all of
    our enemy rows,the idea here is tell each enemy to draw itself.*/

    /*The Flat here is to trun our array into one  big flat array with
    all our enemies inside because our enemy rows is two dimensional array.*/
    drawEnemies(ctx) {
        this.enemyRows.flat().forEach((enemy)=>{
            // here we pass the MovingDirection information this.drawEnemies.
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        });
    }

    createEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = []; /*we have added the same num of rows in
            our enemyMap which is 6 to our enemyRows Array.*/

            row.forEach((enemyNumber,enemyIndex) => {

            /*Here we're going to take the enemy number that we find 
            in every one of these rows and turn them to enemy object and 
            place them inside the enemy rows array*/
            if(enemyNumber > 0){
                this.enemyRows[rowIndex].push(
                    new Enemy(enemyIndex * 50, rowIndex * 35, enemyNumber)
                    // the number 50 and 35 is for space in between enemyNumbers for both row and coulmn 
                );
            }
            });
        });
    }

    collideWith(sprite) {
        return this.enemyRows.flat().some(enemy=> enemy.collideWith(sprite))
    }
}