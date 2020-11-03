var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var restart, gameOver, resart_img, gameOver_img;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var jump_sound, die_sound, checkpoint_sound;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var back;
var finish;
var yeah;
var good;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  back = loadImage("download.jpg");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restart_img = loadImage("restart.png");
  gameOver_img = loadImage("gameOver.png");

  jump_sound = loadSound("jump.mp3");
  die_sound = loadSound("die.mp3");
  checkpoint_sound = loadSound("checkPoint.mp3");

  finish = loadSound("win1.mp3");
  yeah = loadSound("yeah.mp3");
  good = loadSound("Good.mp3")
}

function setup() {
  createCanvas(displayWidth - 20, displayHeight - 100);

  trex = createSprite(50, 50, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addAnimation("collided", trex_collided);

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  restart = createSprite(displayWidth / 2, (displayHeight / 2) - 400);
  restart.addImage(restart_img);
  restart.scale = 1;
  restart.visible = false;

  gameOver = createSprite(displayWidth / 2, (displayHeight / 2) - 500);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 1;
  gameOver.visible = false;

  score = 0;
}

function draw() {
  background(back);
  console.log(ground.y)

  camera.y = trex.y - 20;

  if (gameState === PLAY) {

    score = score + Math.round(getFrameRate() / 60);

    if (score >= 700) {
      background("black");
    }

    if (score > 0 && score % 100 === 0) {
      checkpoint_sound.play();
    }

    if (keyDown("space") && trex.y > 159) {
      trex.velocityY = -14;
      jump_sound.play();
    }
    ground.velocityX = -(8 + 3 * score / 100);

    trex.velocityY = trex.velocityY + 0.9;

    if (ground.x < 200) {
      ground.x = ground.width / 2;
    }

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      die_sound.play();
    }
    if (score === 500) {
      good.play();
    }
    if (score >= 1000) {
      finish.play();
      yeah.play();
      gameState = END;
    }

    spawnClouds();
    spawnObstacles();
  } else if (gameState === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided", trex_collided);

    restart.visible = true;
    gameOver.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  if (score >= 600) {
    background("black");
  }

  trex.collide(invisibleGround);

  drawSprites();

  textSize(25);
  fill("red");
  stroke("blue");
  text("Score: " + score, 1000, 50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 50 === 0) {
    var cloud = createSprite(displayWidth - 20, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -4;

    //assign lifetime to the variable
    cloud.lifetime = 1000;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 50 === 0) {
    var obstacle = createSprite(displayWidth - 20, 165, 10, 40);
    obstacle.velocityX = -(8 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;
}