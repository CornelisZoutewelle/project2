//hier begin ik met het aangeven van de canvas en kleuren en de spelers

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
  static width = 40
  static height = 40
  constructor({position}) {
    this.position = position
    this.width = 40
    this.height = 40
    }
  
  draw() {
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, this.width, this.height
      )
  }
}

class Player {
  constructor({ position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openrate = 0.12
  }

  draw() {
    c.beginPath()
    c.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * - this.radians
    )
    c.arc(this.position.x, this.position.y, this.radius, 0,
      Math.PI * 2)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

}
class Ghost {
  constructor({ position, velocity, color = 'red'}) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0,
      Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

}
 
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x: 0,
      y: 0
    }
  })
]
//hier begin ik de met aangeven van het map 
const map = [
  ['-','-','-','-','-','-','-','-','-','-','-','-','-'],
  ['-',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-',' ','-',' ','-',' ','-','-',' ','-',' ','-','-'],
  ['-',' ','-',' ','-',' ','-','-',' ','-',' ',' ','-'],
  ['-',' ',' ',' ',' ',' ','-','-',' ','-',' ','-','-'],
  ['-',' ','-',' ','-',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-',' ','-',' ','-',' ','-','-',' ','-','-','-','-'],
  ['-',' ','-',' ',' ',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-',' ','-',' ','-','-','-','-',' ','-','-',' ','-'],
  ['-',' ','-',' ',' ',' ','-','-',' ','-','-',' ','-'],
  ['-',' ','-','-','-',' ','-','-',' ','-','-',' ','-'],
  ['-',' ','-',' ',' ',' ','-','-',' ','-','-',' ','-'],
  ['-',' ','-',' ',' ',' ','-','-',' ','-','-',' ','-'],
  ['-',' ','-','-',' ',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-',' ',' ',' ',' ',' ','-','-','-','-','-',' ','-'],
  ['-',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-','-','-','-','-','-','-','-','-','-','-','-','-']
]
const boundaries = []
const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
})
//hier zorg ik ervoor dat wasd letters de popppetje kunnen laten bewegen
const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}
//dit is ook een deel van werking voor de collisions
map.forEach((row, i) => {
  row.forEach((Symbol, j) => {
    switch (Symbol){
      case  '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            }
           })
        )
        break
    }
  })
})    
// dit zorgt ook voor het bewegen van de speler
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  boundaries.forEach((Boundary) => {
  Boundary.draw()

  if (
    circleLeCollidesWithRectangle({
      circle: player,
      rectangle: Boundary
      
    })
  )
  { 
  player.velocity.x = 0 
  player.velocity.y = 0 

  } 
})

//dit is ook een deel van werking voor de collisions
player.update()

ghosts.forEach((ghost) => {
  ghost.update()

const collisions =[]

 boundaries.forEach(Boundary => {
  if(
    circleLeCollidesWithRectangle({
      circle: {
        ...ghost,
        velocity: {
          x: 5,
          y: 0
        }
      },
      rectangle: Boundary
    })
  ){}
  collisions.push('right')
 })


})


function circleLeCollidesWithRectangle({
  circle,
  rectangle
}){
  return(circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height && circle.position.x +
    circle.radius + circle.velocity.x >= rectangle.position.x && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y &&
     circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width)
}
if (keys.w.pressed && lastKey === 'w') {
  
   player.velocity.y = -5
} else if (keys.a.pressed && lastKey === 'a'){
  player.velocity.x = -5

} else if (keys.s.pressed && lastKey === 's'){
  player.velocity.y = 5

} else if (keys.d.pressed && lastKey === 'd'){
  player.velocity.x = 5
}
}

//player.update()




animate()

//ook dit zorgt ervoor dat de speler kan bewegen


addEventListener('keydown' , ({ key }) => {
  switch (key) {
    case 'w':
    keys.w.pressed = true
    lastKey = 'w'
    break  
    case 'a':
    keys.a.pressed = true
    lastKey = 'a'
    break 
    case 's':
    keys.s.pressed = true
    lastKey = 's'
    break 
    case 'd':
    keys.d.pressed = true
    lastKey = 'd'
    break 
  }



})

addEventListener('keyup' , ({ key }) => {
  switch (key) {
    case 'w':
    key.w.pressed = false
    break  
    case 'a':
    key.a.pressed = false
    break 
    case 's':
    key.s.pressed = false
    break 
    case 'd':
    key.d.pressed = false
    break 
  }
})






const ghost = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x: 1,
      y: 1
    }
  })
]

     
