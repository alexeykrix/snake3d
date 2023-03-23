import './style.css'
import Stick from './game-stick/stick'

// const serverAddress = 'ws://localhost:9000'
const th = require('three')
const scene = new th.Scene()
scene.background = new th.Color('#aaaaaa')

// const camera = new th.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.5, 500 )
// camera.position.set(0,20,0)
// camera.rotation.x = -1.57



const camera = new th.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 10000);
camera.layers.enable(1)
camera.position.set(0,20,0)
// camera.rotation.x = -1.57


const renderer = new th.WebGLRenderer({antialias: true})
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = th.PCFSoftShadowMap
document.body.innerHTML = ''
document.body.appendChild( renderer.domElement )


const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const theme = Math.round(Math.random())


const materials = {
  plane: new th.MeshPhongMaterial( {
    // color: new th.Color('#344CB7'),
    // color: new th.Color('#141414'),
    color: new th.Color( theme? '#ffffff': '#141414'),
  }),
  cube: new th.MeshPhongMaterial( {
    // color: new th.Color('#000957'),
    // color: new th.Color('#ffffff'),
    color: new th.Color( theme? '#141414': '#ffffff'),
  }),
  food: new th.MeshBasicMaterial( {
    color: new th.Color('#F0BB62'),
    wireframe: false,
  }),
  spot: new th.MeshPhongMaterial( {
    color: new th.Color('#ffffff'),
    transparent: true,
    opacity: 0
  }),
}

const moveDirections = []

let fieldSize = 31

const plane = new th.Mesh( new th.PlaneGeometry(fieldSize, fieldSize), materials.plane)
scene.add( plane )
plane.rotation.x = -1.5708
plane.receiveShadow = true

const borderLeft = new th.Mesh( new th.BoxGeometry(fieldSize, 3, fieldSize), materials.plane )
scene.add(borderLeft)
// borderLeft.rotation.x = -1.57
borderLeft.position.set(fieldSize/-1, 0, 0)
borderLeft.receiveShadow = true

const borderTop = new th.Mesh( new th.BoxGeometry(fieldSize*5, 3, fieldSize), materials.plane )
scene.add(borderTop)
// borderTop.rotation.x = -1.57
borderTop.position.set(0, 0, fieldSize/-1)
borderTop.receiveShadow = true

const borderBottom = new th.Mesh( new th.BoxGeometry(fieldSize*5, 3, fieldSize), materials.plane )
scene.add(borderBottom)
// borderBottom.rotation.x = -1.57
borderBottom.position.set(0, 0, fieldSize/1)
borderBottom.receiveShadow = true

const borderRight = new th.Mesh( new th.BoxGeometry(fieldSize, 3, fieldSize), materials.plane )
scene.add(borderRight)
// borderRight.rotation.x = -1.57
borderRight.position.set(fieldSize/1, 0, 0)
borderRight.receiveShadow = true

let aspectRatio = window.innerHeight/ window.innerWidth /2.5
if (window.innerWidth/ window.innerHeight > 1) { // landscape
  aspectRatio = window.innerHeight/window.innerWidth
  if (window.innerWidth < 1280) {
    aspectRatio /= 1.5
  }
}


  const boundingBox = new th.Box3().setFromObject(plane);
  const objectSize = boundingBox.getSize(new th.Vector3()).length();
  const distance = objectSize / (1 * Math.tan(Math.PI * camera.fov / 360)) * aspectRatio ;
  
  const center = boundingBox.getCenter(new th.Vector3());
  camera.position.set(center.x, center.y + distance, center.z);
  camera.lookAt(center);
// }


const createCube = ({x = 0,z = 0, cubes, map, material}) => {
  const cube = new th.Mesh( new th.BoxGeometry(1,1,1), material ?? materials.cube )
  cube.position.set(x, 0.5, z)
  cube.castShadow = true
  map? map.push({x, z, y: 0.5}) : ''
  cubes? cubes.push(cube) : ''
  scene.add( cube )
  return cube
} 

const headCords = {
  x: 0,
  z: 0
}
const map = []
const cubes = []
const gameInit = () => {
  createCube({x: 0, z: 0, cubes, map})
  createCube({x: 0, z: 1, cubes, map})
  createCube({x: 0, z: 2, cubes, map})
}
gameInit()

// online
{
  // const playerCubes = []

  // const renderMultyplayer = cubesMap => {
  //   cubesMap.forEach(({x,z}, id) => {
  //     playerCubes[id].position.set(x, 0.5, z)
  //   })
  // }

  // const editUser = ({id, data}) => {
  //   let userEl = players.find(el => el.id === id)
  //   if (userEl) {
  //     if (userEl.data.length !== data.length) {
  //       playerCubes.forEach(el => {
  //         el.position.y = -10
  //         el.opacity = 0
  //         el.visible = false
  //       })
  //       playerCubes.splice(0, 0)
  //       data.forEach(cube => {
  //         createCube({x: cube.x, z: cube.z, cubes: playerCubes })
  //       })
  //     }
      
  //     userEl.data = data
  //     renderMultyplayer(data)
  //     return
  //   }

  //   players.push({id, data})
  //   data.forEach(cube => {
  //     createCube({x: cube.x, z: cube.z, cubes: playerCubes })
  //   })
  // }

  // const myWs = new WebSocket(serverAddress)
  // let serverAlive = false

  // let user = {
  //   id: null,
  //   data: map
  // }

  // let players = []
  // myWs.onmessage = msg => {
  //   let data = JSON.parse(msg.data)
  //   if (user.id) {   // another's changed data
  //     editUser({id: data.id, data: data.data})
  //   } else {    // initial server response to get id
  //     user.id = data.id
  //     sendCords()
  //   }
  // }

  // const sendCords = () => {
  //   if (!serverAlive) return
  //   myWs.send(JSON.stringify({
  //     action: 'UPDATE', 
  //     data: user.data,
  //     id: user.id
  //   }))
  // }

  // myWs.onopen = function () {
  //   console.log('connected')
  //   serverAlive = true
  // }

}
// /online

const light = new th.PointLight( 0xf0bb62, 1, 100, 2 )      
scene.add( light )


// const light = new th.DirectionalLight(0xffffff, 0.75);
// light.position.setScalar(100);
// scene.add(light);


const ambientLight = new th.AmbientLight( 0x202020 , 0)
// const ambientLight = new th.AmbientLight( 0x202020 , 1)
scene.add( ambientLight )

const spotLight = new th.SpotLight( 0xffffff )
spotLight.position.set( 0, 2, 0 )
spotLight.distance = theme? 24 : 50
spotLight.penumbra = 0.5
spotLight.intensity = theme? 1 : 2
spotLight.castShadow = true
scene.add(spotLight)



function animate() {
  requestAnimationFrame( animate )
  renderer.render( scene, camera )
}
animate()

const food = createCube({x: 10, z: 10, material: materials.food})
const headMask = createCube(headCords)
const taleMask = createCube(map[map.length-1])
const spotTarget = createCube({x: 0, z: -10, material: materials.spot})
spotLight.target = spotTarget
spotTarget.castShadow = false
food.scale.set(0.9, 0.9, 0.9)
const randColor = getRandomColor()
food.material.color = new th.Color(randColor)
light.color =  new th.Color(randColor)

food.layers.enable(1)


const updateCubes = () => {
  map.unshift(map.pop())
  map[0].x = headCords.x
  map[0].z = headCords.z

  // sendCords()

  map.forEach(({x,z}, id) => {
    if (id === map.length-1) {
      cubes[id].position.set(x, -10, z)
      taleMask.position.set(x, 0.5, z)
      return
    }
    cubes[id].position.set(x, 0.5, z)
  })
}

const gameEnd = () => {
  cubes.forEach(cube => cube.position.y = -30)
  cubes.splice(0, cubes.length)
  headCords.x = 0
  headCords.z = 0
  map.splice(0, map.length)
  gameInit()
  let rand = getRandomAvailableCords()
  food.position.set(rand.x, 0.5, rand.z)
  const randColor = getRandomColor()
  food.material.color = new th.Color(randColor)
  light.color =  new th.Color(randColor)
  light.position.set(rand.x, 1.5, rand.z)
  moveDirections.splice(0, 2)
  headMask.position.set(headCords.x, 0.5, headCords.z)
  taleMask.position.set(map[map.length -1].x, 0.5, map[map.length -1].z)
  spotLight.position.set(0, 2 , 0)
}

const getRandomAvailableCords = () => {
  let random = { 
    x: Math.floor((Math.random()-0.5)*(fieldSize-2)),
    z: Math.floor((Math.random()-0.5)*(fieldSize-2)) 
  }

  while (checkCollision(random)) {
    random.x = Math.floor((Math.random()-0.5)*(fieldSize-2))
    random.z = Math.floor((Math.random()-0.5)*(fieldSize-2))
  } 
  return random
}


let foodCount = 0

const checkCollision = ({x = 0, z = 0} ) => {
  // if (x >= 15 || x <= -15 || z >= 15 || z <= -15) {
    if (x > 15) {
      headCords.x = -15
      spotLight.position.set(headCords.x,2, headCords.z)
      headMask.position.set(headCords.x,0.5, headCords.z)
      return false
    }
    if (x < -15) {
      headCords.x = 15
      spotLight.position.set(headCords.x,2, headCords.z)
      headMask.position.set(headCords.x,0.5, headCords.z)
      return false
    }
    if (z > 15) {
      headCords.z = -15
      spotLight.position.set(headCords.x,2, headCords.z)
      headMask.position.set(headCords.x,0.5, headCords.z)
      return false
    }
    if (z < -15) {
      headCords.z = 15
      spotLight.position.set(headCords.x,2, headCords.z)
      headMask.position.set(headCords.x,0.5, headCords.z)
      return false
    }
    
    // return true
  // }
  let collision = false
  
  let foodCords = {
    x: food.position.x,
    z: food.position.z,
  }

  if (foodCords.x === x && foodCords.z === z) {
    let tale = map[map.length -1]
    // const material = new th.MeshPhongMaterial( {
    //   // color: food.material.color,
    //   // color: new th.Color('#000957'),
    //   color: new th.Color('#ffffff'),
    // })
    const material = materials.cube
    createCube({x: tale.x, z: tale.z, cubes, map, material })
    let rand = getRandomAvailableCords() ?? {x: 0, z: 0}
    foodCount++
    if (foodCount > 5 && Math.floor(Math.random()*100) < 10 && !theme) {
      let interval = setInterval(() => {
        if (ambientLight.intensity === 1) {
          clearInterval(interval)
        } else ambientLight.intensity += 0.2
      }, 200)
      let t = setTimeout(() => {
        clearTimeout(t)
        interval = setInterval(() => {
          if (ambientLight.intensity <= 0) {
            clearInterval(interval)
            ambientLight.intensity = 0
          } else ambientLight.intensity -= 0.2
        }, 200)
      }, 5000)
      foodCount = 0
    }
    food.position.set(rand.x, 0.5, rand.z)
    light.position.set(rand.x, 1.5, rand.z)
    const randColor = getRandomColor()
    food.material.color = new th.Color(randColor)
    light.color =  new th.Color(randColor)
    return false
  }

  map.forEach( cords => 
    cords.x === x && cords.z === z 
      ? collision = true : ''
  )

  return collision
}

let rand = getRandomAvailableCords()
food.position.set(rand.x, 0.5, rand.z)
light.position.set(rand.x, 1.5, rand.z)

const moveTop = () => {
  headCords.z--
  if (checkCollision(headCords)) return gameEnd()
  updateCubes()
}
const moveDown = () => {
  headCords.z++
  if (checkCollision(headCords)) return gameEnd()
  updateCubes()
}
const moveLeft = () => {
  headCords.x--
  if (checkCollision(headCords)) return gameEnd()
  updateCubes()
}
const moveRight = () => {
  headCords.x++
  if (checkCollision(headCords)) return gameEnd()
  updateCubes()
}

let intervalCount = 0
const gameRun = () => {
  if (!moveDirections[0]) return
  
  let moveDir = moveDirections[0].name.split(' ')[1]
  if (moveDir === 'moveTop') {
    headMask.position.z -= 0.1 
    spotLight.position.z -= 0.1
    spotTarget.translateOnAxis(new th.Vector3(
      Math.floor(headCords.x - spotTarget.position.x), 
      0, 
      Math.floor(headCords.z-10 - spotTarget.position.z)
    ), 0.2)
  }
  if (moveDir === 'moveDown') {
    headMask.position.z += 0.1 
    spotLight.position.z += 0.1
    spotTarget.translateOnAxis(new th.Vector3(
      Math.floor(headCords.x - spotTarget.position.x), 
      0, 
      Math.floor(headCords.z+10 - spotTarget.position.z)
    ), 0.2)
  }
  if (moveDir === 'moveLeft') {
    headMask.position.x -= 0.1 
    spotLight.position.x -= 0.1
    spotTarget.translateOnAxis(new th.Vector3(
      Math.floor(headCords.x-10 - spotTarget.position.x), 
      0, 
      Math.floor(headCords.z - spotTarget.position.z)
    ), 0.2)  
  }
  if (moveDir === 'moveRight') {
    headMask.position.x += 0.1 
    spotLight.position.x += 0.1
    spotTarget.translateOnAxis(new th.Vector3(
      Math.floor(headCords.x+10 - spotTarget.position.x), 
      0, 
      Math.floor(headCords.z - spotTarget.position.z)
    ), 0.2)  
  }

  // tale move
  let tale = map[map.length-1]
  let next = map[map.length-2]
  if (next.z - tale.z !== 0) taleMask.position.z += (next.z - tale.z)/10
  if (next.x - tale.x !== 0) taleMask.position.x += (next.x - tale.x)/10


  intervalCount++
  if (intervalCount < 10) return

  intervalCount = 0
  moveDirections[0]?.call()
  if (moveDirections.length> 1) {
    moveDirections.shift()
  }
  clearInterval(interval)
  interval = setInterval(gameRun, (1000/map.length)/10)
}

let interval = setInterval(gameRun, (1000/map.length)/10)
document.addEventListener('keydown', e => {
  let func = null 
  if (['KeyW', 'ArrowUp'].includes(e.code)) func = moveTop.bind(0)
  if (['KeyS', 'ArrowDown'].includes(e.code)) func = moveDown.bind(0)
  if (['KeyA', 'ArrowLeft'].includes(e.code)) func = moveLeft.bind(0)
  if (['KeyD', 'ArrowRight'].includes(e.code)) func = moveRight.bind(0)

  if (!func) return
  if (!moveDirections[0]) return moveDirections.push(func)
  if (moveDirections.length === 1) {  
    let inverted = {
      'bound moveDown': 'bound moveTop',
      'bound moveTop' : 'bound moveDown',
      'bound moveLeft': 'bound moveRight',
      'bound moveRight': 'bound moveLeft'
    }

    let last = moveDirections[0]
    if (last.name !== func.name
    && inverted[last.name] !== func.name) {
      moveDirections.push(func)
    }
  }
})

document.addEventListener('touchmove', handleTouch)

function handleTouch() {
  const direction = stick.getValues().direction

  let func = null 
  if (direction === 'up') func = moveTop.bind(0)
  if (direction === 'down') func = moveDown.bind(0)
  if (direction === 'left') func = moveLeft.bind(0)
  if (direction === 'right') func = moveRight.bind(0)

  if (!func) return
  if (!moveDirections[0]) return moveDirections.push(func)
  if (moveDirections.length === 1) {  
    let inverted = {
      'bound moveDown': 'bound moveTop',
      'bound moveTop' : 'bound moveDown',
      'bound moveLeft': 'bound moveRight',
      'bound moveRight': 'bound moveLeft'
    }

    let last = moveDirections[0]
    if (last.name !== func.name
    && inverted[last.name] !== func.name) {
      moveDirections.push(func)
    }
  }
}


const stick = new Stick()
const initStick = () => {
  stick.init()
  stick.wrapper.style.display = 'block'
  stick.enabled = true
  document.removeEventListener('touchstart', initStick)
}
document.addEventListener('touchstart', initStick)

const helpers = () => {
  // camera rotate
  let mouseStart = {x: 0, y: 0}
  document.addEventListener('mousemove', e => {
    if (e.ctrlKey) {
      if (!mouseStart.x) return mouseStart.x = e.clientX 
      if (!mouseStart.y) return mouseStart.y = e.clientY 
      else {
        camera.rotation.y += (mouseStart.x - e.clientX) * 0.005
        camera.rotation.x += (mouseStart.y - e.clientY) * 0.005
        mouseStart.x = e.clientX 
        mouseStart.y = e.clientY 
      }
    } else mouseStart = {x: 0, y: 0}
  })
  
  //  // camera move
  document.addEventListener('keydown', e => {
    if (e.code === 'KeyW') camera.position.z -=1
    if (e.code === 'KeyS') camera.position.z +=1
    if (e.code === 'KeyA') camera.position.x -=1
    if (e.code === 'KeyD') camera.position.x +=1
    if (e.code === 'Space') camera.position.y +=1
    if (e.code === 'ShiftLeft') camera.position.y -=1
    if (e.code === 'ArrowUp') plane.rotation.x -= 0.005, console.log(plane.rotation.x)
  })

  const axesHelper = new th.AxesHelper( 5 );
  scene.add( axesHelper );
  axesHelper.setColors('red', 'green', 'blue')

  const size = 10;
  const divisions = 10;

  const gridHelper = new th.GridHelper( size, divisions );
  scene.add( gridHelper );
}
// helpers()