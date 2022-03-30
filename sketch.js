let planets = []
let sun
let numPlanets = 5
let G = 20
let destabilise = 0.0015

function setup() {
  createCanvas(windowWidth,windowHeight)
  sun = new Body(40,createVector(0,0),createVector(0,0))

    // Initialise the planets
  for (let i = 0; i < numPlanets; i++) {
    let mass = random(5, 10)
    let radius = random(sun.d, min(windowWidth/2,windowHeight/2))
    let angle = random(0, TWO_PI)
    let planetPos = createVector(radius * cos(angle), radius * sin(angle))

    // Find direction of orbit and set velocity
    let planetVel = planetPos.copy()
    if (random(1) < 0.02) planetVel.rotate(-HALF_PI)
    else planetVel.rotate(HALF_PI)  // Direction of orbit
    planetVel.normalize()
    planetVel.mult( sqrt((G * sun.mass)/(radius)) ) // Circular orbit velocity
    planetVel.mult( random( 1-0.0000001*destabilise, 1+0.00001*destabilise) ) // create elliptical orbit

    planets.push( new Body(mass, planetPos, planetVel) )
  }
}

function draw() {
  background(0,0,102)
  translate(width/2, height/2)
  for (let i = numPlanets-1; i >= 0; i--) {
    sun.attract(planets[i])
    planets[i].move()
    planets[i].show()
  }
  sun.show()
}


function Body(_mass, _pos, _vel){
  this.mass = _mass
  this.pos = _pos
  this.vel = _vel
  this.d = this.mass*2
  this.thetaInit = 0
  this.path = []
  this.pathLen = Infinity

  this.show = function() {
    stroke(0,50)
    for (let i = 0; i < this.path.length-2; i++) {
      line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y,)
    }
    fill(0,255,128); noStroke()
    ellipse(this.pos.x, this.pos.y, this.d+20, this.d+20)
     fill(51,153,255); noStroke()
    ellipse(this.pos.x, this.pos.y, this.d, this.d)
   fill(255,120,0); noStroke()
    ellipse(this.pos.x, this.pos.y, this.d-10, this.d-10)
    
    
   
  }


  this.move = function() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.path.push(createVector(this.pos.x,this.pos.y))
    if (this.path.length > 200) this.path.splice(0,1)
  }

  this.applyForce = function(f) {
    this.vel.x += f.x / this.mass
    this.vel.y += f.y / this.mass
  }

  this.attract = function(child) {
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y)
    let f = (this.pos.copy()).sub(child.pos)
    f.setMag( (G * this.mass * child.mass)/(r * r) )
    child.applyForce(f)
  }

}