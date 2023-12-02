// necessary global variables for controling the game state outside of classes and functions
let play;
let camX;
let camY;
let Base;
let end;
let Right01;
let Right02;
let Right03;
let Down01;
let Down02;
let Down03;
let Left01;
let Left02;
let Left03;
let maps;
let shoes;
let gasTank;
let boss01;
let tileWidth = 50;
let tileHeight = 50;
let mapSize = 50 * tileWidth;
let tileAngle = 90;
let bullets = [];
let chests = [];
let playerBullets = [];
let enemy;
let enemies = [];
let selection;
let gravity;
let player;
let crossHairs;
let backGroundTiles = [];
let ladderTops = [];
let playerWalkCycle = [];
let swimBlocks = [];
let mines = [];
let Mine;
let particles = [];
let coins = [];
let healths = [];
let index = 0;
let coinFrame = 0;
let coinIndex = 10;
let start = true;
let rotation = 0;

// class for the chest object
// INPUT: the x and y position of the chest,
// the special item the chest drops if it has a special item
// the map the chest is spawned on,
// the direction the chest is facing, decided by the map it is spawned on
class chestObj
{
  constructor(x, y, item, inputMap, orientation)
  {
    this.position = createVector(x, y);
    this.coinCount = floor(random(2, 5));
    this.healthCount = floor(random(0, 10));
    this.item = item;
    this.map = inputMap;
    this.opended = false;
    this.orientation = orientation;
  }
  // drawing the chest as well as the open prompt
  // if opened we spawn a random number of coins, 
  // a random number of health packs but a health pack is guranteed if the player
  // health is below 20
  draw()
  {
    
    if(!this.opended)
    {
      push();
      translate(this.position.x, this.position.y);
      if(this.orientation === -1)
      {
        scale(-1, 1);
      }
      if(this.item === null)
      {
        image(Chest[0], -50, 0 + 25, 100, -100);
      }
      else
      {
        image(JumpChest[0], -50, 0 + 25, 100, -100);
      }
      pop();
      if(dist(player.position.x, player.position.y, this.position.x, this.position.y) < 100)
      {
        scale(1, 1);
        image(InteractButton, this.position.x - 25, this.position.y - 75, 50, -50);
        if (keyIsPressed && (key === 'E' || key === 'e')) {
          this.opended = true;
        }
      }
    }
    else
    {
      push();
      translate(this.position.x, this.position.y);
      if(this.orientation === -1)
      {
        scale(-1, 1);
      }
      if(this.item === null)
      {
        image(Chest[1], -50, 0 + 25, 100, -100);
      }
      else
      {
        image(JumpChest[1], -50, 0 + 25, 100, -100);
      }
      pop();
      for(let i = 0; i < this.coinCount; i++)
      {
        coins.push(new coinObj(this.position.x + 5 + i * 20, this.position.y - 20, this.map)); 
      }
      if(this.healthCount === 7 || player.health < 25)
      {
        healths.push(new healthObj(this.position.x + 25, this.position.y - 20, this.map));
        this.healthCount = 0;
      }
      if(this.item === 'shoes')
      {
        coins.push(new shoeObj(this.position.x + 25, this.position.y - 20, this.map));
        this.item = null;
      }
      else if (this.item === 'gasTank')
      {
        coins.push(new scoobaObj(this.position.x + 25, this.position.y - 20, this.map));
        this.item = null;
      }
      this.coinCount = 0;
    }
  }
}
// draws the scooba object that allows the player dive
// similar logic to the coin object but sets the players
// swim state to true
class scoobaObj
{
  constructor(x, y, tileMap)
  {
    this.position = createVector(x, y);
    this.mapPosition = tileMap.position;
    this.velocity = createVector();
    this.map = tileMap.mapData;
    this.timer = millis();
    this.delete = false;
    this.frameCount = 0;
    
  }
  jump(force)
  {
    this.velocity.add(force);
  }
  update()
  {
    this.position.add(this.velocity);
    let tileY1 = floor((this.position.y - this.mapPosition.y + 5) / tileWidth);
    let tileX = floor((this.position.x - this.mapPosition.x) / tileWidth);
    if (tileY1 > 0 && tileY1 < 50 && tileX > 0 && tileX < 50) {
      let value = this.map[tileX][tileY1][0];
      if (backGroundTiles.includes(value)) {
        this.jump(gravity);
      }
      else{
        this.velocity.y = -this.velocity.y / 2;
        if(this.velocity.y < 1)
        {
          this.position.y = tileY1 * tileWidth + ( this.mapPosition.y - maps[0].position.y);
        }
      }
    }

    if(dist(this.position.x, this.position.y, player.position.x, player.position.y) < 8)
    {
      this.delete = true;
      player.swim = true;
    }
    if(millis() - this.timer >= 10000)
    {
      this.delete = true;
    }
    if(frameCount % 5 === 0)
    {
      if(this.frameCount < 9)
      {
        this.frameCount++;
      }
      else
      {
        this.frameCount = 0;
      }
    }
  }
  draw()
  {
    image(Scooba[this.frameCount], this.position.x, this.position.y + 5, (0.7 * tileWidth), -(0.7 * tileHeight));
  }
}
// draws the scooba object that allows the player dive
// similar logic to the coin object but sets the players
// double jump state to true
class shoeObj
{
  constructor(x, y, tileMap)
  {
    this.position = createVector(x, y);
    this.mapPosition = tileMap.position;
    this.velocity = createVector();
    this.map = tileMap.mapData;
    this.timer = millis();
    this.delete = false;
    this.frameCount = 0;
    
  }
  jump(force)
  {
    this.velocity.add(force);
  }
  update()
  {
    this.position.add(this.velocity);
    let tileY1 = floor((this.position.y - this.mapPosition.y + 5) / tileWidth);
    let tileX = floor((this.position.x - this.mapPosition.x) / tileWidth);
    if (tileY1 > 0 && tileY1 < 50 && tileX > 0 && tileX < 50) {
      let value = this.map[tileX][tileY1][0];
      if (backGroundTiles.includes(value)) {
        this.jump(gravity);
      }
      else{
        this.velocity.y = -this.velocity.y / 2;
        if(this.velocity.y < 1)
        {
          this.position.y = tileY1 * tileWidth + ( this.mapPosition.y - maps[0].position.y);
        }
      }
    }

    if(dist(this.position.x, this.position.y, player.position.x, player.position.y) < 8)
    {
      this.delete = true;
      player.doubleJump = true;
    }
    if(millis() - this.timer >= 10000)
    {
      this.delete = true;
    }
    if(frameCount % 5 === 0)
    {
      if(this.frameCount < 7)
      {
        this.frameCount++;
      }
      else
      {
        this.frameCount = 0;
      }
    }
  }
  draw()
  {
    image(Boots[this.frameCount], this.position.x, this.position.y + 5, (0.7 * tileWidth), -(0.7 * tileHeight));
  }
}

// tile map object, this contains the tilemap json
// the tilemaps spaw position
class tileMapObj
{
  constructor(x, y, inputMap)
  {
    this.position = createVector(x, y);
    this.mapData = loadJSON(inputMap);
    this.input = inputMap;
  }
}

// health pack object, similar to coin object but increments
// the players health when picked up
class healthObj
{
  constructor(x, y, tileMap)
  {
    this.position = createVector(x, y);
    this.mapPosition = tileMap.position;
    this.velocity = createVector();
    this.map = tileMap.mapData;
    this.timer = millis();
    this.delete = false;
    this.frameCount = 0;
    
  }
  jump(force)
  {
    this.velocity.add(force);
  }
  update()
  {
    this.position.add(this.velocity);
    let tileY1 = floor((this.position.y - this.mapPosition.y + 5) / tileWidth);
    let tileX = floor((this.position.x - this.mapPosition.x) / tileWidth);
    if (tileY1 > 0 && tileY1 < 50 && tileX > 0 && tileX < 50) {
      let value = this.map[tileX][tileY1][0];
      if (backGroundTiles.includes(value)) {
        this.jump(gravity);
      }
      else{
        this.velocity.y = -this.velocity.y / 2;
        if(this.velocity.y < 1)
        {
          this.position.y = tileY1 * tileWidth + ( this.mapPosition.y - maps[0].position.y);
        }
      }
    }

    if(dist(this.position.x, this.position.y, player.position.x, player.position.y) < 8)
    {
      this.delete = true;
      player.health += 10;
      if(player.health > 100)
      {
        player.health = 100;
      }
    }
    if(millis() - this.timer >= 10000)
    {
      this.delete = true;
    }
    if(frameCount % 5 === 0)
    {
      if(this.frameCount < 7)
      {
        this.frameCount++;
      }
      else
      {
        this.frameCount = 0;
      }
    }
  }
  draw()
  {
    image(Health[this.frameCount], this.position.x, this.position.y + 5, (0.7 * tileWidth), -(0.7 * tileHeight));
  }
}

// boss object, inputs are just the tilemap
class bossObj
{
  constructor(tileMap)
  {
    this.position = createVector(tileMap.position.x  + 800, tileMap.position.y + 1200);
    this.startPosition = createVector(tileMap.position.x  + 800, tileMap.position.y + 1200);
    this.mapPosition = tileMap.position;
    this.frameCount = 0;
    this.attack01Frame = 0;
    this.health = 100;
    this.inRange = false;
    this.screenWash = 1600;
    this.x = this.startPosition.x + 560;
    this.heightOptions = [this.startPosition.y - 200, this.startPosition.y - 100];
    this.timer = millis();
    this.state = 0;
    this.exploding = true;
  }
  // state one the bullet spray, the boss spawns 6
  // bullets every 15 frames 
  state01()
  {
    if(frameCount % 15 == 0)
    {
      let x = this.position.x + 260;
      let y = this.position.y - 200;
      bullets.push(new bossBulletObj(x, y, createVector(x + 100, y), color(200, 20, 25)));
      bullets.push(new bossBulletObj(x, y, createVector(x, y + 100), color(200, 20, 25)));
      bullets.push(new bossBulletObj(x, y, createVector(x + 100, y ), color(200, 20, 25)));
      bullets.push(new bossBulletObj(x, y, createVector(x - 100, y), color(200, 20, 25)));
      bullets.push(new bossBulletObj(x, y, createVector(x, y - 100), color(2+ 100, 20, 25)));
      bullets.push(new bossBulletObj(x, y, createVector(x - 100, y - 100), color(200, 20, 25)));
      bullets.push(new bossBulletObj(x, y, createVector(x + 100, y - 100), color(200, 20, 25)));
    }
    if(millis() - this.timer > 40)
    {
      this.state = floor(random(1, 4) - 0.1);
      this.timer = millis();
    }
  }
  // attack state 2, the boss spawns collision walls starting
  // on the right side of the screen and washes over the entire screen
  state02()
  {
    let y = this.startPosition.y - 100;
    if(this.screenWash > 0)
    {
      this.screenWash -= 8;
    }
    else
    {
      this.state = 1;

      this.screenWash = 1400;
    }
    image(BossAttack01[this.attack01Frame], this.x + this.screenWash - 1000 - 100, y, 400, 500);
    hitBox(this.x + this.screenWash - 1000, y + 50, 110, 430);
  }
  // attack state 2, the boss spawns collision walls starting
  // on the left side of the screen and washes over the entire screen
  state03()
  {
    let y = this.startPosition.y - 200;
    if(this.screenWash > 0)
    {
      this.screenWash -= 8;
    }
    image(BossAttack01[this.attack01Frame], this.x - this.screenWash, y, 400, 500);
    hitBox(this.x - this.screenWash + 140, y + 50, 110, 430);
    if (this.screenWash <= 0)
    {
      this.state = 1;
      this.screenWash = 1400;
    }
  }
  // logic that moves the player between states
  update()
  {
    if(millis() - this.timer > 400 && this.state === 0)
    {
      this.state = floor(random(1, 4) - 0.1);
    }
    if(this.state === 1)
    {
      this.state01();
      this.timer = millis();
    }
    if (this.state === 2)
    {
      this.state02();
    }
    if (this.state === 3)
    {
      this.state03();
    }
    // collision check for the players bullets
    for(let bullet of playerBullets)
    {
      if (dist(bullet.position.x, bullet.position.y, this.position.x + 250, this.position.y - 250) < 150)
      {
        this.health -= 10;
        bullet.delete = true;
      }
    }
    // creates a hitbox for the boss
    hitBox(this.position.x + 190, this.position.y - 400, 150, 250);
  }
  // draws the bosses health on the screen
  drawHealth()
  {
    fill(70);
    rect(3 * tileWidth, 17.75 * tileWidth, 34 * tileWidth, 1.25 * tileWidth);
    fill(200);
    rect(3.25 * tileWidth, 18 * tileWidth, tileWidth * 33.3, 0.75 * tileWidth);
    fill(255, 50, 50);
    if(this.health > 0)
    {
      rect(3.25 * tileWidth, 18 * tileWidth, this.health * (tileWidth / 30), 0.75 * tileWidth);
    }
    image(BossHead[0], 2 * tileWidth, 16.75 * tileWidth, 3 * tileWidth, 3 * tileWidth);
  }
  // draws the bosses animations
  draw()
  {
    if(this.health > 0)
    {
      if(frameCount % 3 === 0)
      {
        if(this.frameCount < 10)
        {
          this.frameCount++;
        }
        else
        {
          this.frameCount = 0;
        }
        if(this.attack01Frame < 4)
        {
          this.attack01Frame++;
        }
        else
        {
          this.attack01Frame = 0;
        }
      }
      if(player.position.y - this.position.y != 200 && player.position.x < -2943)
      {
        this.position.y -= signValue(this.position.y - player.position.y);
      }
      if(abs(this.position.x - player.position.x) > 300)
      {
        this.position.x -= signValue(this.position.x - player.position.x);
      }
      image(BossHead[this.frameCount], this.position.x, this.position.y, 500, -500);
      if(player.position.x < -2943)
      {
        this.inRange = true;
      }
      else
      {
        this.inRange = false;
      }
    }
    // when the boss is kill particles are spawned to indicate his death
    else if (this.exploding)
    {
      let x = this.position.x + 260;
      let y = this.position.y - 200;
      for(let i = 0; i < 15; i++)
      {
        for(let j = 0; j < 15; j++)
        {
          particles.push(new particleObj(x + 10 + i, y + j));
        }
      }
      this.exploding = false;
      chests.push(new chestObj(-4113.837262824329, 2900, null, Left02, 0));
    }
  }
    
}
// retuns the sign of a number
function signValue(number) {
  if (number > 0) {
    return 1;
  } else {
    return -1;
  }
}
// coin class
// INPUT: the x position of the coin, the y position and the map the coin
// was spawned in
class coinObj
{
  constructor(x, y, tileMap)
  {
    this.position = createVector(x, y);
    this.mapPosition = tileMap.position;
    this.velocity = createVector();
    this.map = tileMap.mapData;
    this.timer = millis();
    this.delete = false;
    this.frameCount = 0;
  }
  // applies force to the coin
  jump(force)
  {
    this.velocity.add(force);
  }
  update()
  {
    // check sif the coin has collided with the ground, if so we set the velocity to zero
    this.position.add(this.velocity);
    let tileY1 = floor((this.position.y - this.mapPosition.y + 5) / tileWidth);
    let tileX = floor((this.position.x - this.mapPosition.x) / tileWidth);
    if (tileY1 > 0 && tileY1 < 50 && tileX > 0 && tileX < 50) {
      let value = this.map[tileX][tileY1][0];
      if (backGroundTiles.includes(value)) {
        this.jump(gravity);
      }
      else{
        this.velocity.y = -this.velocity.y / 2;
        if(this.velocity.y < 1)
        {
          this.position.y = tileY1 * tileWidth + ( this.mapPosition.y - maps[0].position.y);
        }
      }
    }
    // checks if the player collided with the coin, if so the coin is deleted
    // and the players score is incremented
    if(dist(this.position.x, this.position.y, player.position.x, player.position.y) < 8)
    {
      this.delete = true;
      player.score += 10;
    }
    // timer set at the begining of creating the coin,
    // if this timer expires we delete the coin
    if(millis() - this.timer >= 10000)
    {
      this.delete = true;
    }
    // loops through each frame of the coins animations every 5th frame cycle
    if(frameCount % 5 === 0)
    {
      if(this.frameCount < 7)
      {
        this.frameCount++;
      }
      else
      {
        this.frameCount = 0;
      }
    }
  }
  // draws the coin depending on which frame cycle we are on
  draw()
  {
    image(Coin[this.frameCount], this.position.x, this.position.y, (0.5 * tileWidth), -(0.5 * tileHeight));
  }
}

// creates a particle explosion effect when called
// learned this in class
class particleObj
{
  constructor(x, y) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(random(0, TWO_PI), random(-0.5, 0.5));
    this.size = random(1, 10);
    this.c1 = random(155, 255);
    this.c2 = random(0, 255);
    this.timeLeft = 100;
  }
  move() {
    var v = new p5.Vector(this.velocity.y*cos(this.velocity.x),
    this.velocity.y*sin(this.velocity.x));
    this.position.add(v);
    this.timeLeft--;
  }
  draw() {
    noStroke();
    fill(this.c1, this.c2, 0, this.timeLeft);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
}


// sets up the players start position, the boss's position,
// the relative camera position and the play state.
function playerSetup()
{
  timer = millis();
  player = new playerObj(1385, 100);
  boss01 = new bossObj(Left03);
  camX = player.position.x;
  camY = player.position.y;
  play = false;
}

function setup() {
  // sets the text size
  textSize(32);
  // removes the default cursor image
  noCursor();
  // removes the stroke
  noStroke();
  // calls the setup function
  playerSetup();
  // sets gravity
  gravity = createVector(0, 0.015 * tileWidth);
  const canvas = createCanvas(40 * tileWidth, 20 * tileHeight);
  canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());
  // dictionary containing the tiles and their corresponding character values in
  // the json's of each map
  selection = {'a':Background,
    'b':GrassSuspendedEdge,
    'c':GrassCorner,
    'd':GrassWall01,
    'e':GrassRoofCorner,
    'f':WaterSpout,
    'g':WaterFoamLeft,
    'h':WaterFoamBelowLeft,
    'i':WaterBottomFade,
    'j':CenterBrick01,
    'k':GrassSuspendedLadder,
    'l':GrassSuspendedCenter,
    'm':GrassFloor,
    'n':GrassBrick01,
    'o':GrassRoof,
    'p':WaterRidges,
    'q':WaterFallBottom,
    'r':WaterFoamBelow,
    's':WaterWallEdgeRight,
    't':WaterColor,
    'u':WaterWallEdgeLeft,
    'v':WaterFoamBelowRight,
    'w':WaterTopBlock,
    'x':WaterFoamRight,
    'y':SmallWaterFall,
    'z':SmallWaterFallBottomFoam,
    'A':LavaWall,
    'B':LavaBottomFoam,
    'C':LavaTopLevel,
    'D':LavaCenter,
    'E':Grass01,
    'F':Grass02,
    'G':Grass03,
    'H':LavaStart,
    'I':DirtRoof,
    'J':DirtRoofCorner,
    'K':DirtWall,
    'L':DirtSuspendedEdge,
    'M':DirtCorner,
    'N':DirtSuspendedLadder,
    'O':DirtSuspendedCenter,
    'P':DirtFloor,
    'Q':ConcreteRoofCorner,
    'R':ConcreteWall,
    'S':ConcreteSuspendedEdge,
    'T':GrassInteriorCorner,
    'U':GrassWall02,
    'V':Grass04,
    'W':Rock01,
    'X':WoodenLadder,
    'Y':WoodenLadderTop,
    'Z':ConcreteSuspendedLadder,
    '1':MetalLadder,
    '2':MetalLadderTop,
    '3':Stilte,
    '4':BridgeStilte,
    '5':BridgeFloor,
    '6':BridgeWall,
    '7':Chains,
    '8':LavaBottom,
    '9':DirtInteriorCorner,
    '>':ConcreteInteriorCorner,
    '-':ConcreteSuspendedCenter,
    '=':ConcreteOpening,
    '!':ConcreteRoof,
    '@':CenterBrick02,
    '#':CenterBrick03,
    '$':CenterBrick04,
    '%':CenterBrick05,
    '^':CenterBrick06,
    '&':ConcreteFloorCorner,
    '*':ConcreteFloor,
    '(':WaterBridge, 
    ')':ChainsUnderWater,
    '+':WaterColor}  
    backGroundTiles = ['=','!','f','g','h','i','p','q','r','s','t','u','v','w','x','y','z','1','X','2','Y','W','E','F','G','V','+',0];
    ladderTiles = ['X','1','k','N','Z'];
    ladderTops = ['2','Y'];
    swimBlocks = ['+'];
}

// global variables for all of our tiles
let Background;
let GrassSuspendedEdge;
let GrassCorner;
let GrassWall01;
let GrassRoofCorner;
let WaterSpout;
let WaterFoamLeft;
let WaterFoamBelowLeft;
let WaterBottomFade;
let CenterBrick01;
let GrassSuspendedLadder;
let GrassSuspendedCenter;
let GrassFloor;
let GrassBrick01;
let GrassRoof;
let WaterRidges;
let WaterFallBottom;
let WaterFoamBelow;
let WaterWallEdgeRight;
let WaterColor;
let WaterWallEdgeLeft;
let WaterFoamBelowRight;
let WaterTopBlock;
let WaterFoamRight;
let SmallWaterFall;
let SmallWaterFallBottomFoam;
let LavaWall;
let LavaBottomFoam;
let LavaTopLevel;
let LavaCenter;
let Grass01;
let Grass02;
let Grass03;
let LavaStart;
let DirtRoof;
let DirtRoofCorner;
let DirtWall;
let DirtSuspendedEdge;
let DirtCorner;
let DirtSuspendedLadder;
let DirtSuspendedCenter;
let DirtFloor;
let ConcreteRoofCorner;
let ConcreteWall;
let ConcreteSuspendedEdge;
let GrassInteriorCorner;
let GrassWall02;
let Grass04;
let Rock01;
let WoodenLadder;
let WoodenLadderTop;
let ConcreteSuspendedLadder;
let MetalLadder;
let MetalLadderTop;
let Stilte;
let BridgeStilte;
let BridgeFloor;
let BridgeWall;
let Chains;
let LavaBottom;
let DirtInteriorCorner;
let ConcreteInteriorCorner;
let ConcreteSuspendedCenter;
let ConcreteOpening;
let ConcreteRoof;
let CenterBrick02;
let CenterBrick03;
let CenterBrick04;
let CenterBrick05;
let CenterBrick06;
let ConcreteFloorCorner;
let ConcreteFloor;
let WaterBridge;
let ChainsUnderWater;
let titleScreen;
let Bench;
let BossHead = [];
let BossAttack01 = [];
let StartButtons = [];
let ReplayButtons = [];
let GameOver;
let InstructionButtons = [];
let Title;
let Coin = [];
let Health = [];
let Chest = [];
let JumpChest = [];
let enemyWalkCycle = [];
let enemyIdleCycle = [];
let enemyBatFlyCycle = [];
let enemyBatAttackCycle = [];
let enemyBatSleep;
let playerIcon;
let playerJumpCycle = [];
let playerFallCycle = [];
let playerIdle = [];
let playerSwimCycle = [];
let enemyHealthBar = [];
let Boots = [];
let Scooba = [];
let InteractButton;
let BaseBackground;
let InstructionsPage;

// preloads all our tiles into global variables
function preload()
{
  Background = loadImage('TileMap/Background.png');
  GrassSuspendedEdge = loadImage('TileMap/GrassSuspendedEnd.png');
  GrassCorner = loadImage('TileMap/GrassCorner.png');
  GrassWall01 = loadImage('TileMap/GrassWall01.png');
  GrassRoofCorner = loadImage('TileMap/GrassRoofCorner.png');
  WaterSpout = loadImage('TileMap/WaterSpout.png');
  WaterFoamLeft = loadImage('TileMap/WaterFoamLeft.png');
  WaterFoamBelowLeft = loadImage('TileMap/WaterFoamBelowLeft.png');
  WaterBottomFade = loadImage('TileMap/WaterBottomFade.png');
  CenterBrick01 = loadImage('TileMap/CenterBrick01.png');
  GrassSuspendedLadder = loadImage('TileMap/GrassSuspendedLadder.png');
  GrassSuspendedCenter = loadImage('TileMap/GrassSuspendedCenter.png');
  GrassFloor = loadImage('TileMap/GrassFloor.png');
  GrassBrick01 = loadImage('TileMap/GrassBrick01.png');
  GrassRoof = loadImage('TileMap/GrassRoof.png');
  WaterRidges = loadImage('TileMap/WaterRidges.png');
  WaterFallBottom = loadImage('TileMap/WaterFallBottom.png');
  WaterFoamBelow = loadImage('TileMap/WaterFoamBelow.png');
  WaterWallEdgeRight = loadImage('TileMap/WaterWallEdgeRight.png');
  WaterColor = loadImage('TileMap/WaterColor.png');
  WaterWallEdgeLeft = loadImage('TileMap/WaterWallEdgeLeft.png');
  WaterFoamBelowRight = loadImage('TileMap/WaterFoamBelowRight.png');
  WaterTopBlock = loadImage('TileMap/WaterTopBlock.png');
  WaterFoamRight = loadImage('TileMap/WaterFoamRight.png');
  SmallWaterFall = loadImage('TileMap/SmallWaterFall.png');
  SmallWaterFallBottomFoam = loadImage('TileMap/SmallWaterFallBottomFoam.png');
  LavaWall = loadImage('TileMap/LavaWall.png');
  LavaBottomFoam = loadImage('TileMap/LavaBottomFoam.png');
  LavaTopLevel = loadImage('TileMap/LavaTopLevel.png');
  LavaCenter = loadImage('TileMap/LavaCenter.png');
  Grass01 = loadImage('TileMap/Grass01.png');
  Grass02 = loadImage('TileMap/Grass02.png');
  Grass03 = loadImage('TileMap/Grass03.png');
  LavaStart = loadImage('TileMap/LavaStart.png');
  DirtRoof = loadImage('TileMap/DirtRoof.png');
  DirtRoofCorner = loadImage('TileMap/DirtRoofCorner.png');
  DirtWall = loadImage('TileMap/DirtWall.png');
  DirtSuspendedEdge = loadImage('TileMap/DirtSuspendedEdge.png');
  DirtCorner = loadImage('TileMap/DirtCorner.png');
  DirtSuspendedLadder = loadImage('TileMap/DirtSuspendedLadder.png');
  DirtSuspendedCenter = loadImage('TileMap/DirtSuspendedCenter.png');
  DirtFloor = loadImage('TileMap/DirtFloor.png');
  ConcreteRoofCorner = loadImage('TileMap/ConcreteRoofCorner.png');
  ConcreteWall = loadImage('TileMap/ConcreteWall.png');
  ConcreteSuspendedEdge = loadImage('TileMap/ConcreteSuspendedEdge.png');
  GrassInteriorCorner = loadImage('TileMap/GrassInteriorCorner.png');
  GrassWall02 = loadImage('TileMap/GrassWall02.png');
  Grass04 = loadImage('TileMap/Grass04.png');
  Rock01 = loadImage('TileMap/Rock01.png');
  WoodenLadder = loadImage('TileMap/WoodenLadder.png');
  WoodenLadderTop = loadImage('TileMap/WoodenLadderTop.png');
  ConcreteSuspendedLadder = loadImage('TileMap/ConcreteSuspendedLadder.png');
  MetalLadder = loadImage('TileMap/MetalLadder.png');
  MetalLadderTop = loadImage('TileMap/MetalLadderTop.png');
  Stilte = loadImage('TileMap/Stilte.png');
  BridgeStilte = loadImage('TileMap/BridgeStilte.png');
  BridgeFloor = loadImage('TileMap/BridgeFloor.png');
  BridgeWall = loadImage('TileMap/BridgeWall.png');
  Chains = loadImage('TileMap/Chains.png');
  LavaBottom = loadImage('TileMap/LavaBottom.png');
  DirtInteriorCorner = loadImage('TileMap/DirtInteriorCorner.png');
  ConcreteInteriorCorner = loadImage('TileMap/ConcreteInteriorCorner.png');
  ConcreteSuspendedCenter = loadImage('TileMap/ConcreteSuspendedCenter.png');
  ConcreteOpening = loadImage('TileMap/ConcreteOpening.png');
  ConcreteRoof = loadImage('TileMap/ConcreteRoof.png');
  CenterBrick02 = loadImage('TileMap/CenterBrick02.png');
  CenterBrick03 = loadImage('TileMap/CenterBrick03.png');
  CenterBrick04 = loadImage('TileMap/CenterBrick04.png');
  CenterBrick05 = loadImage('TileMap/CenterBrick05.png');
  CenterBrick06 = loadImage('TileMap/CenterBrick06.png');
  ConcreteFloorCorner = loadImage('TileMap/ConcreteFloorCorner.png');
  ConcreteFloor = loadImage('TileMap/ConcreteFloor.png');
  WaterBridge = loadImage('TileMap/WaterBridge.png');
  ChainsUnderWater = loadImage('TileMap/ChainsUnderWater.png');
  crossHairs = loadImage('CrossHairs.png');
  Mine = loadImage('TileMap/Mine.png');
  titleScreen = loadImage('TileMap/TitleScreen.png');
  Bench = loadImage('TileMap/Bench.png');
  playerIcon = loadImage('Main/Icon/PlayerHealthIcon.png');
  BaseBackground = loadImage('Levels/BaseBackground.png');
  InteractButton = loadImage('Chests/InteractButton.png');
  Title = loadImage('Instructions/Title.png');
  InstructionsPage = loadImage('Instructions/InstructionsPage.png');
  GameOver = loadImage('Instructions/GameOver.png');
  enemyBatSleep = loadImage('Enemies/Bat/Sleep.png');
  for(let i = 0; i <= 10; i++)
  {
    if (i <= 7)
    {
      enemyWalkCycle[i] = loadImage('Enemies/Bug/walk/enemyWalkCycle0' + i.toString() +'.png');
      enemyIdleCycle[i] = loadImage('Enemies/Bug/Idle/Idle0' + i.toString() +'.png');
      Coin[i] = loadImage('Coins/Coin0' + i.toString() + '.png');
      Health[i] = loadImage('Health/Health0' + i.toString() + '.png');
      Boots[i] = loadImage('Boots/Boots0' + i.toString() + '.png');
    }
    if(i <= 5)
    {
      if(i + 1 < 5)
      {
        enemyBatFlyCycle[i] = loadImage('Enemies/Bat/Fly0' + (i + 1).toString() +'.png');
      }
      enemyBatAttackCycle[i] = loadImage('Enemies/Bat/Attack0' + (i + 1).toString() +'.png');
    }
    if(i < 5)
    {
      BossAttack01[i] = loadImage('BossAttack01/BossAttack0' + i.toString() + '.png');
    }
    if(i < 4)
    {
      playerJumpCycle[i] = loadImage('Main/JumpUp/Jump0' + i.toString() + '.png');
      playerFallCycle[i] = loadImage('Main/Fall/Fall0' + i.toString() + '.png');
      playerSwimCycle[i] = loadImage('Main/Swim/Swim0' + i.toString() + '.png');
    }
    if(i < 2)
    {
      playerIdle[i] = loadImage('Main/Idle/Idle0' + i.toString() + '.png');
      enemyHealthBar[i] = loadImage('HealthBar/HealthBar0' + i.toString() + '.png');
      Chest[i] = loadImage('Chests/Chest0' + i.toString() + '.png');
      JumpChest[i] = loadImage('JumpChest/JumpChest0' + i.toString() + '.png');
      StartButtons[i] = loadImage('Instructions/Start0' + i.toString() + '.png');
      ReplayButtons[i] = loadImage('Instructions/Replay0' + i.toString() + '.png');
      InstructionButtons[i] = loadImage('Instructions/Instruction0' + i.toString() + '.png');
    }
    if(i < 9)
    {
      playerWalkCycle[i] = loadImage('Main/Walk/Run0' + i.toString() + '.png');
    }
    BossHead[i] = loadImage('BossHead/BossHead0' + i.toString() + '.png');
    if(i < 10)
    {
      Scooba[i] = loadImage('ScoobaUpgrade/Scooba0' + i.toString() + '.png');
     }
  }
  LoadMaps();
}

// loads our json maps into variables and adds those variables
// to an array that we index to draw the maps
function LoadMaps()
{
  Base = new tileMapObj(0, 0, 'Levels/BaseTiled.json');
  Right01 = new tileMapObj(mapSize, -mapSize + tileWidth * 29, 'Levels/Right01Tiled.json');
  Right02 = new tileMapObj(mapSize * 2, -(mapSize / 2) - tileWidth * 14, 'Levels/Right02Tiled.json');
  Right03 = new tileMapObj(mapSize * 3 - tileWidth * 27,   tileWidth * 11  , 'Levels/Right03Tiled.json');
  Down01 = new tileMapObj(-tileWidth * 2, mapSize, 'Levels/Down01Tiled.json');
  Down02 = new tileMapObj(-tileWidth * 9, mapSize * 2, 'Levels/Down02Tiled.json');
  Down03 = new tileMapObj(-mapSize - 9, (mapSize * 3) - (tileWidth * 19), 'Levels/Down03Tiled.json');
  Left01 = new tileMapObj(-mapSize, (mapSize / 2) + tileWidth * 2, 'Levels/Left01Tiled.json');
  Left02 = new tileMapObj(-mapSize * 2, (mapSize / 2) + tileWidth * 2, 'Levels/Left02Tiled.json'); // -- needs to be redrawn
  Left03 = new tileMapObj(-mapSize - tileWidth * 7, -(mapSize / 2) + tileHeight * 2, 'Levels/Left03Tiled.json');
  maps = [Base, Right01, Right02, Right03, Down01, Down02, Down03, Left01, Left02, Left03];
}

// mine class
// Inputs: x position, y position and rotation
class mineObj
{
  constructor(x, y, rotation)
  {
    this.position = createVector(x, y);
    this.rotation = rotation;
    this.hit = false;
  }
  draw()
  {
    // spawns several particals and decrements the players
    // health if the player collides with the mine.
    if(dist(this.position.x + tileWidth, this.position.y + tileWidth, player.position.x, player.position.y) < 30)
    {
      for(let i = 0; i < 15; i++)
      {
        for(let j = 0; j < 15; j++)
        {
          particles.push(new particleObj(this.position.x + tileWidth + 10 + i, this.position.y + tileWidth + j));
        }
      }
      if(!this.hit)
      {
        player.health -= 30;
      }
      this.hit = true;
      
    }
    else if (!this.hit)
    {
      push();
      translate(this.position.x + 25, this.position.y + 25);
      // rotates the mine by pi depending on the position it was spawned in
      if(this.rotation === -1)
      {
        rotate(PI);
        image(Mine, -110, -35, 2.5 * tileWidth, 2.5 * tileHeight);
      }
      else 
      {
        image(Mine, -12, -25, 2.5 * tileWidth, 2.5 * tileHeight);
      }
      pop();
    }
  }
}


// enemy class
// INPUTS: x position, y position and the tilemap that spawned him
class enemyObj
{
  constructor(x, y, tileMap)
  {
    this.mapObj = tileMap;
    this.map = tileMap.mapData;
    this.mapPosition = tileMap.position;

    this.velocity = createVector();
    this.position = createVector(x, y);
    this.startPosition = createVector(x, y);
    
    this.speed = tileWidth/10;
    this.angle = 0;
    this.radius = 80;
    this.health = 100;
    this.maxSpeed = 8;
    this.idleFlip = 1; 
    this.frameCount = 0;
    this.direction = -1;
    this.angleRange = 45;
    this.pauseCycles = 0;
    this.maxPauseCycles = 100;
    
    this.delete = false;
  }
  // applies vector forces to the players velocity
  jump(force)
  {
    this.velocity.add(force);
    this.velocity.limit(this.maxSpeed);
  }
  update()
  {
    // updates the enemies position based on the velocity increments
    // applied to the enemy
    this.position.add(this.velocity);
    // checks if the enemy can move right by referencing the tilemap
    if (!backGroundTiles.includes(this.map[floor((this.position.x + (1.25 * tileWidth) - this.mapPosition.x) / tileWidth)][floor((this.position.y - (0.1 * tileWidth) - this.mapPosition.y)/ tileHeight)][0])) {
      this.direction = -1;
    }
    // checks if the enemy can move left based on the tilemap
    else if (!backGroundTiles.includes(this.map[floor((abs(this.position.x - (1.25 * tileWidth) - this.mapPosition.x)) / tileWidth)][floor((this.position.y - (0.1 * tileWidth) - this.mapPosition.y)/ tileHeight)][0])) {
      this.direction = 1;
    }
    // creates the enemies collision points as variables
    let tileY1 = floor((this.position.y - this.mapPosition.y + (0.25 * tileWidth)) / tileWidth);
    let tileX = floor((this.position.x - this.mapPosition.x) / tileWidth);
    // checks if the enemy has collided with the ground, if so it stops falling
    if (tileY1 > 0 && tileY1 < 50 && tileX > 0 && tileX < 50) {
      let value = this.map[tileX][tileY1][0];
      if (backGroundTiles.includes(value)) {
        this.jump(gravity);
      }
      else{
        this.velocity.y = 0;
        this.position.y = tileY1 * tileWidth + ( this.mapPosition.y - maps[0].position.y);
      }
      // creates corner below variables for enemies on platforms
      // flips their direction if there is no ground infront of them
      let cornersBelowLeft = this.map[tileX - 1][tileY1][0];
      let cornersBelowRight = this.map[tileX + 1][tileY1][0];
      if(backGroundTiles.includes(cornersBelowLeft) || backGroundTiles.includes(cornersBelowRight))
      {
        this.direction *= -1;
      } 
    }
    // decrements the enemies health if they collide with the players bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const playerBullet = playerBullets[i];
      if(dist(this.position.x, this.position.y, playerBullet.position.x, playerBullet.position.y) < 0.75 * tileWidth)
      {
        if(this.health > 0)
        {
          this.health -= 20;
          playerBullets.splice(i, 1);
        }
      }
    }
    // moves the enemies position based on its direction and speed
    this.position.x += this.speed / 2 * this.direction;
    // if the enemies health is below zero we delete the enemy
    if(this.health <= 0)
    {
      this.delete = true;
    }
    
  }
  draw()
  {
    push();
    // flips the enemies direction depending on which direction
    // it is moving in
    if(this.direction != 0 )
    {
      this.idleFlip = this.direction;
    }
    translate(this.position.x,  this.position.y);
    scale(this.idleFlip, 1);
    image(enemyWalkCycle[this.frameCount], -(0.75 * tileWidth), (0.15 * tileWidth), 2 * tileWidth, -1.25 * tileHeight);
    pop();
    if(this.health < 100)
    {
      image(enemyHealthBar[1], this.position.x - (0.5 * tileWidth), this.position.y - (1.5 * tileWidth), 1.25 * tileWidth, 0.25 * tileHeight);
      fill(255, 0, 0);
      rect(this.position.x - (0.5 * tileWidth), this.position.y - (1.5 * tileWidth), floor((this.health * tileWidth) / 80), (0.25 * tileWidth));
      image(enemyHealthBar[0], this.position.x - (0.5 * tileWidth), this.position.y - (1.5 * tileWidth), 1.25 * tileWidth, 0.25 * tileHeight);
    }
    // loops through the animation frames of the enemy object
    if(this.frameCount < 7)
    {
      this.frameCount++;
    }
    else
    {
      this.frameCount = 0;
    }
  }
}

// enemy logic class
// Inputs: Enemy x and y spawn position and the tilemap that spawned the enemy
class enemyFlyingObj
{
  constructor(x, y, tileMap)
  {
    this.mapObj = tileMap;
    this.mapPosition = tileMap.position;
    this.position = createVector(x, y);
    this.startPosition = createVector(x, y);
    
    this.delete = false;
    
    this.state = "move";

    this.shootInterval = floor(random(1, 5));
    
    this.speed = 2;
    this.angle = 0;
    this.radius = 80;
    this.distance = 0;
    this.maxSpeed = 8;
    this.health = 100;
    this.direction = -1;
    this.frameCount = 0;
    this.angleRange = 45;
    this.returnAngle = 0; 
    this.pauseCycles = 0;
    this.maxDistance = 100;
    this.maxPauseCycles = 20;
  }
  update()
  {
    // calculates the distance between the player and the enemy
    // if the player is close enough we change states
    let distance = dist(this.position.x, this.position.y, player.position.x, player.position.y);
    if(distance > 10 * tileWidth)
    {
      this.state = "move";
    }
    // if in the move state we move towards the target, if dodge we move away from the
    // target, and if fire we fire at the target. Our target can change depending on
    // the position of the player, bat and the bats start position.
    if(this.state === "move")
    {
      if(dist(player.position.x, player.position.y, this.startPosition.x, this.startPosition.y) > 20 * tileWidth)
      {
        this.moveTowardsState(createVector(this.startPosition.x, this.startPosition.y));
      }
      else{
        this.moveTowardsState(createVector(player.position.x, player.position.y - (4.5 * tileWidth)));
      }
      
    }
    else if (this.state === "dodge")
    {
      this.dodgeState();
    }
    if((frameCount - this.shootInterval) % 100 == 0 && distance < (25 * tileWidth))
    {
      this.fire();
    }
    for(let playerBullet of playerBullets)
    {
      if(dist(this.position.x, this.position.y, playerBullet.position.x, playerBullet.position.y) < (0.75 * tileWidth))
      {
        if(this.health > 0)
        {
          this.health -= 20;
        }
        else{
          this.delete = true;
        }
        
      }
    }
    // removes the players bullet if it collides with the bat and decrements the bats health
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const playerBullet = playerBullets[i];
      if(dist(this.position.x, this.position.y, playerBullet.position.x, playerBullet.position.y) < (0.75 * tileWidth))
      {
        if(this.health > 0)
        {
          this.health -= 20;
          playerBullets.splice(i, 1);
        }
      }
    }
  }
  // moves towards the position right above the players head
  moveTowardsState(target)
  {
    let direction = createVector(target.x - this.position.x, target.y - this.position.y);
    direction.normalize();
    let speed = 1;
    this.position.x += direction.x * speed;
    this.position.y += direction.y * speed;
    this.distance = 0;
    if(dist(this.position.x, this.position.y, player.position.x, player.position.y) < (25 * tileWidth) && !player.grounded)
    {
      this.distance = 0;
      this.state = "dodge";
    }
    else if (player.grounded && player.position.y - this.position.y > (25 * tileWidth))
    {
      this.distance = 0;
      this.state = "dodge";
    }
  }
  // moves away from the player to a position above the player
  dodgeState()
  {
    if (this.distance >= this.maxDistance) {
      if(this.pauseCycles < this.maxPauseCycles)
      {
          this.pauseCycles++;
          this.direction = 0;
      }else
      {
          this.pauseCycles = 0;
          this.direction = -1;
      }
    }
    
    else if (this.distance <= -this.maxDistance) {
        if(this.pauseCycles < this.maxPauseCycles)
        {
            this.pauseCycles++;
            this.direction = 0;
        }else
        {
            this.pauseCycles = 0;
            this.direction = 1;
        }
    }
    this.position.x += this.direction;
    this.distance += this.direction;

  }
  // fires a bullet at the player
  fire()
  {
    bullets.push(new bulletObj(this.position.x, this.position.y, createVector(player.position.x, player.position.y), color(200, 20, 25), 'bat'));
  }
  // draws the bat animation cycle as well as its health bar
  draw()
  {
    fill(255, 0, 0);
    push();
    translate(this.position.x, this.position.y);
    if(this.position.x > player.position.x)
    {
      scale(-1, 1);
    }
    tint(255, 0, 0);
    image(enemyBatFlyCycle[floor(this.frameCount)], -(1.75 * tileWidth), tileHeight, 4 * tileWidth, -3 * tileHeight);
    pop();
    if(this.health < 100)
    {image(enemyHealthBar[1], this.position.x - (0.5 * tileWidth), this.position.y - tileWidth, 1.25 * tileWidth, 0.25 * tileHeight);
    fill(255, 0, 0);
    rect(this.position.x - (0.5 * tileWidth), this.position.y - tileHeight, floor((this.health * tileWidth) / tileWidth), 0.2 * tileWidth);
    image(enemyHealthBar[0], this.position.x - (0.5 * tileWidth), this.position.y - tileHeight, 1.25 * tileWidth, 0.25 * tileHeight);}
    // loops throught the bats animation frames
    if(this.frameCount < 3)
    {
      this.frameCount += .5;
    }
    else
    {
      this.frameCount = 0;
    }
  }
}
// player logic class,
// INPUTS:
// x position and y position
class playerObj
{
  constructor(x, y)
  {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.jumpForce = createVector(0, -0.20 * tileWidth);
    
    this.fall;
    this.previousPosition;
    
    this.hit = false;
    this.swim = false;
    this.grounded = true;
    this.swiming = false;
    this.doubleJump = false;
    
    this.score = 0;
    this.health = 100;
    this.coolDown = 5;
    this.jumpCount = 2;
    this.direction = 0;
    this.frameCount = 0;
    this.increment = 0.5;
    this.hitCoolDown = 15;
    this.jumpCoolDown = 20;
    this.maxSpeed = 0.5  * tileWidth;
  }
  // applies a force to the player object as long as
  // the velocity applied is less that the max speed
  // the player is allowed to travel
  jump(force) {
    this.velocity.add(force);
    this.velocity.limit(this.maxSpeed);
  }
  update()
  {
    // adds the new velocity to the player position
    this.position.add(this.velocity);
    this.grounded = false;
    // loops through each map to check which map the player is currently in
    for(let i = 0; i < maps.length; i++)
    {
      let x = this.position.x;
      let y = this.position.y;
      let mapX = maps[i].position.x;
      let mapY = maps[i].position.y;
      // if the player is within the map we are currenly on we perform collision
      // check on the tilemap the player is in
      if (
        x >= mapX && x <= mapX + mapSize - 1 &&
        y >= mapY && y <= mapY + mapSize
      ) {
        this.fall = false;
        // variables for the players collision point to the left, right, up center.
        let tileXRight = floor((x - mapX + (0.55 * tileWidth)) / tileWidth);
        let tileXLeft = floor((x - mapX - (0.25 * tileWidth)) / tileWidth);
        let tileCenter = floor((x - mapX + (0.15 * tileWidth)) / tileWidth);
        let tileCenterHeight = floor((y - mapY - (0.05 * tileHeight)) / tileWidth);
        // if the right arrow is pressed or if D is pressed we check if the player is within
        // the bounds of the current tilemap, if he is we perform a collision check below him.
        // if he isnt but the area he is trying to move to is untiled we allow him to move right anyways.
        if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && this.coolDown === 0) {
          if(floor((y - (0.05 * tileHeight) - mapY) / tileWidth) >= 0)
          {
            if(tileXRight < 50 && !this.hit)
            {
              let value = maps[i].mapData[tileXRight][floor((y - (0.05 * tileHeight) - mapY) / tileWidth)][0];
              if (backGroundTiles.includes(value)) {
                this.position.x += 0.2 * tileWidth;
                this.coolDown = 2;
              }
            }
            else if(backGroundTiles.includes(maps[i].mapData[tileXRight - 1][floor((y - (0.05 * tileHeight) - mapY) / tileWidth)][0]) && !this.hit){
              this.position.x += 0.2 * tileWidth;
              this.coolDown = 2;
            }
            // direction variable used to flip the player image
            this.direction = -1;
          }
        }
        // if the left arrow is pressed or if D is pressed we check if the player is within
        // the bounds of the current tilemap, if he is we perform a collision check below him.
        // if he isnt but the area he is trying to move to is untiled we allow him to move left anyways.
        else if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && this.coolDown === 0) {
          if(floor((y - (0.05 * tileHeight) - mapY) / tileWidth) >= 0)
          {
            if(tileXLeft > 0 && !this.hit)
            {
              let value = maps[i].mapData[tileXLeft][floor((y - (0.05 * tileHeight) - mapY) / tileWidth)][0];
              if (backGroundTiles.includes(value)) {
                this.position.x -= 0.2 * tileWidth;
                this.coolDown = 2;
              }
            }
            else if (backGroundTiles.includes(maps[i].mapData[tileXLeft + 1][floor((y - (0.05 * tileHeight) - mapY) / tileWidth)][0]) && !this.hit){
              this.position.x -= 0.2 * tileWidth;
              this.coolDown = 2;
            }
            // direction variable used to flip the player image
            this.direction = 1;
          }
        }
        // set the center value so we have no undefined variables
        let valueCenter = '~';
        // if we are within the tilemap we check what the value of the tile the player is currently
        // in.
        if(tileCenter > 0 && tileCenter < 50 && tileCenterHeight > 0 && tileCenterHeight < 50)
        {
          valueCenter = maps[i].mapData[tileCenter][floor((y - mapY - 1) / tileWidth)][0];
        }
        // if the player is curerntly in a swim block and the player has unlocked the ability to swim
        // we allow him to move up and down within the water, otherwise the player drowns.
        if(swimBlocks.includes(valueCenter))
        {
          if(this.swim == false)
          {
            this.velocity.set(0, 0);
            this.health -= 0.1;
          }
          else
          {
            gravity = createVector(0, .01);
            this.velocity.add(createVector(-this.velocity.x / 10, -this.velocity.y / 10));
            this.swiming = true;
            if(keyIsDown(UP_ARROW) || keyIsDown(87))
            {
              this.position.y -= 0.1 * tileWidth;
              this.coolDown = 2;
            }
            else if(keyIsDown(DOWN_ARROW) || keyIsDown(83))
            {
              this.position.y += 0.1 * tileWidth;
              this.coolDown = 2;
            }
          }
        }
        else
        {
          gravity = createVector(0, 0.3);
          this.swiming = false;
        }
        // variables for collision checks above and below the player
        // as well as the players current x position.
        let tileY1 = floor((y - mapY + 1) / tileWidth);
        let tileY2 = floor((y - mapY - (1.5 * tileWidth)) / tileWidth);
        let tileX = floor((x - mapX) / tileWidth);
        // checks if teh player is infornt of a ladder, if he is we allow him to move up and down
        // ladders.
        // we also check if the player is attempting to move up a ladder top which is not allowed
        if(ladderTiles.includes(valueCenter) || ladderTops.includes(valueCenter))
        {
          this.velocity.set(0, 0);
          if(((keyIsDown(UP_ARROW) || keyIsDown(87)) && !ladderTops.includes(valueCenter)))
          {
            this.velocity.y = 0;
            this.position.y -= 0.15 * tileHeight;
            this.coolDown = 20;
            this.position.x = floor(x / tileWidth) * tileWidth + (0.2 * tileWidth);
          }
          else if(keyIsDown(DOWN_ARROW) || keyIsDown(83))
          {
            this.velocity.y = 0;
            this.position.y += 0.15 * tileHeight;
            this.coolDown = 20;
            this.position.x = floor(x / tileWidth) * tileWidth + (0.2 * tileWidth);
          }
        }
        // else we check if the position above and below the player is a tile
        // if we collided and we reset the players velocity and apply gravity to it.
        else
        {
          if (tileY2 > 0 && tileY2 < 50 && tileX > 0 && tileX + 10 < 50) {
            let value = maps[i].mapData[tileX][tileY2][0];
            if ( value !== 0 && !backGroundTiles.includes(value)) {
              if(this.velocity.y < 0)
              {
                this.velocity.set(0, 0);
              }
              
              this.jump(gravity);
              this.fall = true;
            }
          }
          if (tileY1 > 0 && tileY1 < 50 && tileX >= 0 && tileX <= 50) {
            let value = maps[i].mapData[tileX][tileY1][0];
            if (!backGroundTiles.includes(value)) {
              this.velocity.y = 0;
              this.position.y = tileY1 * tileWidth + ( maps[i].position.y - maps[0].position.y);
              this.grounded = true;
              this.jumpCount = 2;
            } else if (!this.fall) {
              this.jump(gravity);
              this.fall = true;
            }
          }
          // if the player is grounded and the jump button is clicked
          // we allow the player to jump
          if (keyIsDown(32) && !this.hit) {
            if(this.grounded )
            {
              if (this.jumpCoolDown === 0) {
                this.velocity.set(0, 0);
                this.jump(this.jumpForce);
                this.jumpCoolDown = 20;
                this.jumpCount -= 1;
              }
            }
            // if the player has unlocked the double jump we allow for a 
            // second jump before the player must be grounded again to jump
            else if(this.doubleJump == true && this.jumpCount > 0)
            {
              if (this.jumpCoolDown === 0) {
                this.velocity.set(0, 0);
                this.jump(this.jumpForce);
                this.jumpCoolDown = 20;
                this.jumpCount -= 1;
              }
            }
          }
        }
        if(this.velocity.x != 0)
        {
          if(tileXRight < 50)
          {
            let value = maps[i].mapData[tileXRight][floor((y - (0.05 * tileHeight) - mapY) / tileWidth)][0];
            if (!backGroundTiles.includes(value)) {
              this.velocity.x = 0;
            }
          }

          if(tileXLeft > 0)
          {
            let value = maps[i].mapData[tileXLeft][floor((y - (0.05 * tileHeight) - mapY) / tileWidth)][0];
            if (!backGroundTiles.includes(value)) {
              this.velocity.x = 0;
            }
          }
        }
      }
      if(this.velocity.y >= 0)
      {
        this.fall = false;
      }
      else{
        this.fall = true;
      }
    }
    
    if(this.jumpCoolDown > 0)
    {
      this.jumpCoolDown--;
    }
    if(this.coolDown > 0)
    {
      this.coolDown--;
    }
    if(this.hitCoolDown > 0)
    {
      this.hitCoolDown--;
    }
    if(this.hit && this.hitCoolDown === 0)
    {
      this.health -= 10;
      this.hit = false;
      this.hitCoolDown = 15;
    }
    if(this.grounded)
    {
      this.velocity.x = 0;
      this.hit = false;
    }
  }
  hitCheck(hitBoxHit)
  {
    let hit = false;
    for(let enemy of enemies)
    {
      if(dist(enemy.position.x, enemy.position.y, this.position.x, this.position.y) < tileWidth )
      {
        this.hit = true;
        hit = true;
      }
    }
    if(hit || hitBoxHit)
    {
      this.velocity.set(0, 0);
      this.jump(createVector(this.direction * (tileWidth / 10), -(tileWidth / 10)));
      if(hitBoxHit)
      {
        this.hit = true;
      }
    }
    
  }
  draw()
  {
    this.increment = 0.5;
    this.hitCheck(false);
    fill(0, 255, 0);
    push();
    translate(this.position.x + (0.35 * tileWidth), this.position.y);
    if(this.direction > 0)
    {
      scale(-1, 1);
    }
    if(this.grounded)
    {
      if(this.previousPosition != this.position.x)
      {
        image(playerWalkCycle[floor(this.frameCount)], -0.75 * tileHeight, 0, 1.5 * tileWidth, -1.5 * tileHeight);
      }
      else
      {
        this.increment = 0.0625;
        if(this.frameCount >= 2)
        {
          this.frameCount = 0;
        }
        image(playerIdle[floor(this.frameCount)], -0.75 * tileHeight, 0, 1.5 * tileWidth, -1.5 * tileHeight);
      }
    }
    else if(!this.ground && this.velocity.y <= -1)
    {
      if(this.frameCount > 3)
      {
        this.frameCount = 0;
      }
      image(playerJumpCycle[floor(this.frameCount)], -0.75 * tileHeight, 0, 1.5 * tileWidth, -1.5 * tileHeight);
    }
    else if(this.swiming)
    {
      if(this.frameCount > 3)
      {
        this.frameCount = 0;
      }
      let offset = abs((player.position.y + camY)) - 200;
      rotate(atan2((player.position.y + mouseY / 10 - 330 - offset) - this.position.y, -this.direction * ((player.position.x + mouseX / 10 - 500) - this.position.x)));
      rotate(45);
      image(playerSwimCycle[floor(this.frameCount)], -tileWidth, (0.5 * tileHeight), 2 * tileWidth, -2 * tileHeight);
    }
    else
    {
      if(this.frameCount > 3)
      {
        this.frameCount = 0;
      }
      image(playerFallCycle[floor(this.frameCount)], -(0.75 * tileWidth), 0, 1.5 * tileWidth, -1.5 * tileHeight)
    }
    
    pop();
    this.mousePressed();
    if(this.frameCount < playerWalkCycle.length - this.increment )
    {
      this.frameCount += this.increment;
    }
    else{
      this.frameCount = 0;
    }
    this.previousPosition = this.position.x;
  }
  mousePressed()
  {
    if(mouseButton === LEFT)
    {
      playerBullets.push(new bulletObj(this.position.x, this.position.y, createVector((player.position.x + mouseX) - (tileWidth * 24), (player.position.y + mouseY) - (tileWidth * 14)),  color(0, 200, 255), null));
      mouseButton = null;
    }
    
  }
}
// boss bullet logic
// INPUTS:
// x ---- bullets x spawn location
// y ---- bullets y spawn location
// target ---- direction of the path the bullet will follow
// color ---- the color of the bullet
// shooter --- the object shooting the bullet
class bossBulletObj
{
  constructor(x, y, target, color)
  {
    this.position = createVector(x, y - tileHeight);
    this.velocity = createVector();
    this.mousePosition = target;
    this.size = 20;
    this.speed = 5;
    this.slope = p5.Vector.sub(this.mousePosition, this.position);
    this.angle = atan2(this.mousePosition.y - this.position.y, this.mousePosition.x - this.position.x);
    this.delete = false;
    this.timer = floor(random(10, 20));
    this.color = color;
  }
  // moves the bullet in the path dictated by the input variables
  update()
  {
    this.velocity.set(cos(this.angle) * this.speed, sin(this.angle) * this.speed);
    if(dist(this.position.x, this.position.y, player.position.x, player.position.y) > 800)
    {
      this.delete = true;
    }
    this.position.add(this.velocity);
  }
  // boss bullet art
  draw()
  {
    noStroke();
    fill(this.color);
    square(this.position.x, this.position.y, this.size);
    rect(this.position.x, this.position.y + this.size, this.size, this.size/2);
    rect(this.position.x, this.position.y - this.size/2, this.size, this.size/2);
    rect(this.position.x + this.size, this.position.y, this.size/2, this.size);
    rect(this.position.x - this.size / 2, this.position.y, this.size/2, this.size);

    fill(220)
    rect(this.position.x + this.size/4, this.position.y, this.size/2, this.size);
    rect(this.position.x, this.position.y  + this.size/4, this.size, this.size/2);

    fill(0)
    hitBox(this.position.x - this.size/2, this.position.y - this.size/2, this.size * 2, this.size * 2);
  }
}

// bullet class that controls its movement logic
// INPUTS:
// x ---- bullets x spawn location
// y ---- bullets y spawn location
// target ---- direction of the path the bullet will follow
// color ---- the color of the bullet
// shooter --- the object shooting the bullet
class bulletObj
{
  constructor(x, y, target, color, shooter)
  {
    this.position = createVector(x, y - tileHeight);
    this.velocity = createVector();
    this.mousePosition = target;
    this.size = 5;
    this.speed = 5;
    this.slope = p5.Vector.sub(this.mousePosition, this.position);
    this.angle = atan2(this.mousePosition.y - this.position.y, this.mousePosition.x - this.position.x);
    this.fall = false;
    this.delete = false;
    this.timer = floor(random(10, 20));
    this.color = color;
    this.shooter = shooter;
  }
  update()
  {
    // checks if the bullet has collided with anything, if it has the bullet
    // falls downwards
    if(!this.fall)
    {
      this.velocity.set(cos(this.angle) * this.speed, sin(this.angle) * this.speed);
      for(let i = 0; i < maps.length; i++)
      {
        let x = this.position.x;
        let y = this.position.y;
        let mapX = maps[i].position.x;
        let mapY = maps[i].position.y;
        if (
          x >= mapX && x <= mapX + mapSize - 1 &&
          y >= mapY && y <= mapY + mapSize
        ) {
          let tileXRight = floor((x - mapX + (0.35 * tileWidth)) / tileWidth);
          let tileXLeft = floor((x - mapX - (0.25 * tileWidth)) / tileWidth);
          if(tileXRight < 50)
          {
            let value = maps[i].mapData[tileXRight][floor((y - mapY) / tileWidth)][0];
            if (!backGroundTiles.includes(value)) {
              this.fall = true;
            }
          }
          if(tileXLeft >= 0)
          {
            let value = maps[i].mapData[tileXLeft][floor((y - mapY) / tileWidth)][0];
            if (!backGroundTiles.includes(value)) {
              this.fall = true;
            }
          }
        }
      }
    }
    else if(this.timer > 0){
      this.velocity.set(0, 0);
      this.timer--;
    }
    else
    {
      this.velocity.set(0, 3);
    }
    // if the bullets position is 800 pixels away for the player delete the object
    if(dist(this.position.x, this.position.y, player.position.x, player.position.y) > 800)
    {
      this.delete = true;
    }
    this.position.add(this.velocity);
    // if the bullet is being shot by an enemy, perform a player hitcheck if it hits the player
    if(this.shooter === 'bat')
    {
      if(dist(this.position.x, this.position.y, player.position.x + this.size * 5, player.position.y - this.size * 5) < 20)
      {
        player.hitCheck(true);
      }
    }
  }
  draw()
  {
    noStroke();
    fill(this.color);
    square(this.position.x, this.position.y, this.size);
  }
}
// draws the crosshairs where the mouse is on the screen
function CrossHairs()
{
  if(!play)
  {
    image(crossHairs, mouseX + (tileWidth * 5), mouseY - (tileWidth * 11), 0.75 * tileWidth, 0.75 * tileHeight);
  }
  else{
    let offset = abs((player.position.y + camY)) - (tileWidth * 10);
    image(crossHairs, (player.position.x + mouseX) - (tileWidth * 24), (player.position.y + mouseY) - (tileWidth * 14) - offset, 0.75 * tileWidth, 0.75 * tileHeight);
  }
}
// title screen that contains our instructions, our title image, as well as the animation
// of the player moving their head
function TitleScreen()
{
  image(titleScreen, 8 * tileWidth, -8 * tileWidth, 40.5 * tileWidth, 20 * tileWidth);
  image(Bench, 25 * tileWidth, tileWidth, 4 * tileWidth, 1.5 * tileWidth);
  
  if(frameCount % 40 == 0)
  {
    if(index === 0)
    {
      index = 1;
    }
    else{
      index = 0;
    }
  }
  image(playerIdle[index], 25.9 * tileWidth, -0.1 * tileWidth, 2 * tileWidth, 2 * tileWidth);
  startButton(StartButtons, 40.25 * tileWidth, -6.5 * tileWidth, 6 * tileWidth, 2 * tileWidth, 'start');

  image(Title, 10 * tileWidth, -6.5 * tileWidth, 15 * tileWidth, 5 * tileWidth);
  if(mouseX / 9 + 30 > 875 && mouseX / 9 + 30 < 935 && mouseY / 9 - 260 > -70 && mouseY / 9 - 260 < -10)
  {
    play = true;
  }
  startButton(InstructionButtons, 35.25 * tileWidth, -5 * tileWidth, 10 * tileWidth, 2 * tileWidth, 'instruction');
}

// end screen that allows us to restart the game
function EndScreen()
{
  image(GameOver, 24 * tileWidth, tileWidth, 8 * tileWidth, 8 * tileWidth);
  startButton(ReplayButtons, 25 * tileWidth, 10 * tileWidth, 6 * tileWidth, 2 * tileWidth, 'replay');
}

// creates a button that performs an action when clicked and changes color
// when the mous hovers over it
function startButton(icon, x, y, width, height, type)
{

  if(x < mouseX + (tileWidth * 5) && x + width > mouseX + (tileWidth * 5))
  {
    if(y > mouseY - (tileWidth * 11) && y - (height/2) < mouseY - (tileWidth * 11))
    {
      image(icon[1], x, y - tileWidth, width, height);
      if(mouseIsPressed && (type === 'start' || type === 'replay'))
      {
        play = true;
        end = false;
      }
      else if(mouseIsPressed && type == 'instruction')
      {
        image(InstructionsPage, 900, -8 * tileWidth, 1000, 1000);
      }
    }
    else
    {
      image(icon[0], x, y - tileWidth, width, height);
    }
  }
  else
  {
    image(icon[0], x, y - tileWidth, width, height);
  }
}


function draw() {
  textSize(32);
  updateCamera();
  if(!play && !end)
  {
    background(23, 16, 34);
    TitleScreen();
    CrossHairs();
  }
  if(!play && end)
  {
    background(23, 16, 34);
    playerSetup();
    EndScreen();
    CrossHairs();
  }
  else if(play){
    // draws each animation every other frame
    if(frameCount % 2 === 0)
    {
      background(23, 16, 34);
      // draws the tile map each time it is called
      mapDraw();
      // draws all the mines
      for (let mine of mines)
      {
        mine.draw();
      }
      // draws the particles made when the mines explode
      // and when the boss dies
      for (var i=0; i<particles.length; i++) {
        if (particles[i].timeLeft > 0) {
          particles[i].draw();
          particles[i].move();
        }
        else {
          particles.splice(i, 1);
        }
      }
      // draws each chest
      for(let chest of chests)
      {
        chest.draw();
      }
      boss01.draw();
      player.draw();
      CrossHairs();
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.draw();
      }
      for(let i = playerBullets.length - 1; i >= 0; i--)
      {
        const playerBullet = playerBullets[i];
        playerBullet.draw();
      }
      for(let enemy of enemies)
      {
        if(dist(enemy.position.x, enemy.position.y, player.position.x,player.position.y) < mapSize)
        {
          enemy.draw();
        }
      }
      
    }
    // updates the players logic
    player.update();
    // switches game states if the player loses all his health
    if(player.health < 0)
    {
      play = false;
      end = true;
    }
    // draws and updates the enemy boss's logic
    if(boss01.health > 0)
    {boss01.update();}
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      bullet.update();
      if (bullet.delete) {
        bullets.splice(i, 1);
      }
    }
    // draws and updates the players bullet logic
    for (let i = playerBullets.length - 1; i >= 0; i--) {
      const playerBullet = playerBullets[i];
      playerBullet.update();
      if (playerBullet.delete) {
        playerBullets.splice(i, 1);
      }
    }
    // draws the enemeies and removes the if they lose all their health
    // also adds a coin when the enemy is killed.
    for(let i = 0; i < enemies.length; i++)
    {
      if(dist(enemies[i].position.x, enemies[i].position.y, player.position.x,player.position.y) < mapSize)
        {
          enemies[i].update();
          if(enemies[i].delete)
          {
            coins.push(new coinObj(enemies[i].position.x, enemies[i].position.y - (0.5 * tileWidth), enemies[i].mapObj));
            coins[coins.length - 1].jump(createVector(0, -(0.25 * tileWidth)));
            enemies.splice(i, 1);
          }
        }
    }
    // updates the logic and animations for coins
    for(let i = 0; i < coins.length; i++)
    {
      coins[i].update();
      coins[i].draw();
      if(coins[i].delete)
      {
        coins.splice(i, 1); 
      }
    }
    // updates the logic and animations for health packs
    for(let i = 0; i < healths.length; i++)
    {
      healths[i].update();
      healths[i].draw();
      if(healths[i].delete)
      {
        healths.splice(i, 1); 
      }
    }

    // we reset the Matrix so the transations we do that allows
    // the map to move in the background does not move foreground
    // objects like healthbars and score trackers
    resetMatrix();
    // Display Player Score
    fill(200); 
    rect(35 * tileWidth, 0.5 * tileWidth, 6 * tileWidth, 1.5 * tileWidth);
    fill(100);
    
    rect(35 * tileWidth, 0.25 * tileWidth, 0.25 * tileWidth, 1.75 * tileWidth);
    rect(35 * tileWidth, 2 * tileWidth, 5 * tileWidth, 0.25 * tileWidth);
    
    fill(70);
    rect(35.25 * tileWidth, 0.25 * tileWidth, 4.5 * tileWidth, 0.25 * tileWidth);
    rect(35.25 * tileWidth, 0.25 * tileWidth, 0.25 * tileWidth, 1.75 * tileWidth);
    image(Coin[coinFrame], 35.75 * tileWidth, 0.75 * tileWidth, tileWidth, tileWidth);
    fill(10);
    text(player.score, 37.25 * tileWidth, 1.65 * tileWidth); 


    // Display Player Health
    fill(70);
    rect(tileWidth, 0.25 * tileWidth, 10.5 * tileWidth, 1.25 * tileWidth);
    fill(200);
    rect(1.25 * tileWidth, 0.5 * tileWidth, tileWidth * 10, 0.75 * tileWidth);
    fill(255, 0, 0);
    if(player.health > 0)
    {
      rect(1.25 * tileWidth, 0.5 * tileWidth, player.health * (tileWidth / 10), 0.75 * tileWidth);
    }
    image(playerIcon, 0, -(0.5 * tileWidth), 3 * tileWidth, 3 * tileWidth);

    if(coinIndex > 0)
    {
      coinIndex--;
    }
    else
    {
      coinIndex = 5;
      if(coinFrame > 6)
      {
        coinFrame = 0;
      }
      else{
        coinFrame++;
      }
    }
  }

  
  // logic used to draw the bosses health on the screen when
  // in the boss levels arena
  resetMatrix();
  fill(100);
  rect(0, 19.75 * tileWidth, 40 * tileWidth, 0.25 * tileWidth);
  rect(0, 0, 0.25 * tileWidth, 20 * tileWidth);
  rect(0, 0,  40 * tileWidth, 0.25 * tileWidth);
  rect(39.75 * tileWidth, 0, 0.25 * tileWidth, 20 * tileWidth);
  if(boss01.inRange)
  {
    boss01.drawHealth();
  }
  
}
// camera logic that smoothly follows the player around the world
function updateCamera()
{
  camX = width / 2 - player.position.x;
  camY = lerp(camY, height / 2 - player.position.y, 0.05);
  translate(camX, camY);
}
// draws each tile on the map if the player is close enough to the
// maps spawn location for it to be drawn. All map objects are in a maps
// array that we cycle through and check if they are close enough
function mapDraw()
{
  for(let mapObj of maps)
  {
    if(abs(dist(player.position.x, player.position.y, mapObj.position.x + (mapSize/2), mapObj.position.y + (mapSize/2))) < mapSize)
    {
      
      for(let i = 0; i < 50; i++)
      {
        for(let j = 0; j < 50; j++)
        {
          // adds mines to the chains under water
          if(selection[mapObj.mapData[i][j][0]]) {
            if(mapObj.mapData[i][j][0] === '+')
            {
              if(mapObj.mapData[i][j + 1][0] === ')')
              {
                mines.push(new mineObj(mapObj.position.x + (i * tileWidth) - tileWidth, mapObj.position.y + (j * tileHeight), 1));
                mapObj.mapData[i][j + 1][0] = 't';
              }
              if(mapObj.mapData[i][j - 1][0] === ')')
              {
                mines.push(new mineObj(mapObj.position.x + (i * tileWidth) - tileWidth, mapObj.position.y + (j * tileHeight) - tileHeight, -1));
                mapObj.mapData[i][j - 1][0] = 't';
              }
            }
            let tileCenterX = (i * tileWidth + tileWidth / 2) + mapObj.position.x;
            let tileCenterY = (j * tileHeight + tileHeight / 2) + mapObj.position.y;
            push();
            translate(tileCenterX, tileCenterY);
            rotate(radians(tileAngle * mapObj.mapData[i][j][1]));
            // rotates the tile if their rotation value in their map JSON
            // dictate4s that they need to be rotated
            if(mapObj.mapData[i][j][1] < 0)
              {
                scale(-1, 1);
              }
            image(selection[mapObj.mapData[i][j][0]], -tileWidth / 2, -tileWidth / 2 , tileWidth, tileHeight);
            pop();
          }
          // draws each object enemy objects and removes them from the map so we dont
          // keep drawing them every frame
          else if(mapObj.mapData[i][j][0] === '|')
          {
            enemies.push(new enemyFlyingObj(mapObj.position.x + (i * tileWidth), mapObj.position.y + (j * tileHeight), mapObj));
            mapObj.mapData[i][j][0] = 0;
          }
          else if(mapObj.mapData[i][j][0] === '/')
          {
            enemies.push(new enemyObj(mapObj.position.x + (i * tileWidth), mapObj.position.y + (j * tileWidth), mapObj));
            mapObj.mapData[i][j][0] = 0;
          }
          else if(mapObj.mapData[i][j][0] === ';')
          {
            chests.push(new chestObj(mapObj.position.x + (i * tileWidth), mapObj.position.y + ((j + 1) * tileWidth), null, mapObj, mapObj.mapData[i][j][1]));
            mapObj.mapData[i][j][0] = 0;
          }
          else if(mapObj.mapData[i][j][0] === ':')
          {
            chests.push(new chestObj(mapObj.position.x + (i * tileWidth), mapObj.position.y + ((j + 1) * tileWidth), 'shoes', mapObj, mapObj.mapData[i][j][1]));
            mapObj.mapData[i][j][0] = 0;
          }
          else if(mapObj.mapData[i][j][0] === '`')
          {
            chests.push(new chestObj(mapObj.position.x + (i * tileWidth), mapObj.position.y + ((j + 1) * tileWidth), 'gasTank', mapObj, mapObj.mapData[i][j][1]));
            mapObj.mapData[i][j][0] = 0;
          }
          else if(mapObj.mapData[i][j][0] === '?')
          {
            boss01 = new bossObj(mapObj);
            mapObj.mapData[i][j][0] = 0;
          }
        }
      }
    }
  }
}


// creates a hitbox where ever the function is called
// works similarly to p5's rect() function but performs
// hitboxes and is invisible
function hitBox(x1, y1, width, height)
{
  if(player.position.x >= x1 && player.position.x <= x1 + width)
  {
    if(player.position.y >= y1 && player.position.y <= y1 + height)
    {
      player.hitCheck(true);
    }
  }
}
