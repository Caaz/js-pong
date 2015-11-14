function Game() {
  console.log("Creating canvas... ");
  this.canvas = $('<canvas>');
  $('body').css('overflow', 'hidden');
  this.width = $(window).width();
  this.height = $(window).height();
  this.canvas.attr('width',this.width);
  this.canvas.attr('height',this.height);
  this.canvas.css('background-color','black');
  this.running = true;
  this.mobs = [];
  this.scoreLeft = 0;
  this.scoreRight = 0;
}
Game.prototype.init = function() {
  console.log("Giving canvas an event listener!");
  console.log("Adding canvas.");
  $('body').html(this.canvas);
  console.log("Starting loop");
  // Place the player!
  this.mobs.push(new Mob('playerOne',20,this.height/2-25,10,50));
  this.mobs.push(new Mob('playerTwo',this.width-20,this.height/2-25,10,50));
  // Make controls work!
  var pong = this;
  $(document).on({
    keydown:function(e){
      if(e.keyCode == 87) { pong.up = true; }
      if(e.keyCode == 83) { pong.down = true; }
      if(e.keyCode == 38) { pong.upTwo = true; }
      if(e.keyCode == 40) { pong.downTwo = true; }
    },
    keyup:function(e){
      if(e.keyCode == 87) { pong.up = false; }
      if(e.keyCode == 83) { pong.down = false; }
      if(e.keyCode == 38) { pong.upTwo = false; }
      if(e.keyCode == 40) { pong.downTwo = false; }
    }
  });
  this.addBall();
  this.id = setInterval(function(){ pong.update(); pong.draw(); }, 30);
}
Game.prototype.update = function() {
  var mod = false;
  for (var i in this.mobs) {
    var mob = this.mobs[i];
    mob.x += mob.velX;
    mob.y += mob.velY;
    if(mob.name == "ball") {
      if(((mob.y + mob.height) >= this.height) || (mob.y <= 0)) { mob.velY = -mob.velY; }
      // Check if left or right wall has been hit!
      if(mob.x <= 0) { this.scoreRight++; mob.dead=true; mod=true; }
      else if(mob.x+mob.width > this.width) { this.scoreLeft++; mob.dead = true; mod=true; }
      // Collisions: First, check if it's in the right x area
      for(var i = 0; i<2; i++) {
        if(((mob.x < this.mobs[i].x+this.mobs[i].width) && (mob.x+mob.width > this.mobs[i].x)) &&
        // and now if it's in the right y area
          ((mob.y + mob.height >= this.mobs[i].y) && ((mob.y+mob.height) <= this.mobs[i].y+this.mobs[i].height)))
          // then reverse x velocity.
        { mob.velX = -mob.velX; }
      }
    }
    if(mob.name == "playerOne") {
      if(this.up) { mob.velY = -20; }
      else if(this.down) { mob.velY = 20; }
      else { mob.velY = 0; }
    }
    if(mob.name == "playerTwo") {
      if(this.upTwo) { mob.velY = -20; }
      else if(this.downTwo) { mob.velY = 20; }
      else { mob.velY = 0; }
    }
  }
  // if something's died, do this loop.
  while(mod) {
    mod = false;
    for (var i in this.mobs) {
      var mob = this.mobs[i];
      if(mob.dead) {
        this.mobs.splice(i,1); // remove element from the array
        this.addBall(); // add a new ball to the array
        mod = true; // set this to true so that we can go back through the array
        break; // break so that we don't accidentally do somethingw weird.
      }
    }
  }
  if(!this.running) { clearInterval(this.id); return; }
}
Game.prototype.draw = function() {
  var cv = this.canvas[0].getContext('2d')
  cv.clearRect(0,0,this.width,this.height);
  cv.globalCompositeOperation = 'source-over';
  cv.strokeStyle="white";
  cv.fillStyle="white";
  for (var i in this.mobs) {
    var mob = this.mobs[i];
    cv.fillRect(mob.x,mob.y,mob.width,mob.height);
  }
  cv.font="20px Monospace";
  cv.fillText("Score: "+this.scoreLeft,60,60);
  cv.fillText("Score: "+this.scoreRight,this.width-160,this.height-60);
}
Game.prototype.addBall = function() {
  var ball = new Mob('ball',this.width/2,this.height/2-5,10,10);
  ball.setVelocity(Math.random()*20-10,Math.random()*20-10);
  this.mobs.push(ball);
}
function Mob(name, x, y, width, height) {
  this.name = name;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.velX = 0;
  this.velY = 0;
}
Mob.prototype.setVelocity = function(x,y) {
  this.velX = x;
  this.velY = y;
}
$(function(){
  var pong = new Game();
  pong.init();
});
