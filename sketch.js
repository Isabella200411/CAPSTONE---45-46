var panda, panda_running, panda_collided;
var obstacle;
var ground, invisibleGround;
var backgroundImg;
var score=0;
var gameOver, restart;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
  backgroundImg = loadImage("backgroundimage.jpg");
  panda_running = loadAnimation("pandarun1", "pandarun2");
  panda_collided = loadImage("pandarun2");
  obstacle = loadImage("obstacle.jpg");

  gameOver = loadImage("gameover.png");
  restart = loadImage("restart.jpg");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  panda = createSprite(50,height-70,20,50);
  
  panda.addAnimation("running", trex_running);
  panda.addAnimation("collided", trex_collided);
  panda.setCollider('circle',0,0,350)
  panda.scale = 0.08;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup = new Group();

  score - 0;
}

function draw() {
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      panda.velocityY = -10;
       touches = [];
    }
    
    panda.velocityY = panda.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    panda.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(panda)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    panda.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    panda.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      default: break;
    }
          
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = panda.depth;
    panda.depth +=1;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  panda.changeAnimation("running",panda_running);
  
  score = 0;
  
}

