class Stick {
  constructor(color = '#ededed', width = 100, dotWidth) {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('stick')
    document.body.appendChild(this.wrapper)
    this.wrapper.innerHTML = 
    `<div class="stick__wrapper"><div class="stick__dot"></div></div>`
    this.stick = {
      container: this.wrapper.querySelector('.stick__wrapper'),
      dot: this.wrapper.querySelector('.stick__dot'),
      x: null,
      y: null,
      dotX: null,
      dotY: null,
      radius: null,
      direction: '', 
      width,
      dotWidth: dotWidth? dotWidth : width * 0.3,
      color,
    }
  }

  updateDot = () => {
    this.stick.dot.style.transform = 
      `translate(${this.stick.dotX}px, ${this.stick.dotY}px)`
  }
  upadteStyles = () => {
    this.wrapper.style.width = this.stick.width+'px'
    this.wrapper.style.height = this.stick.width+'px'
    this.wrapper.style.position = 'absolute'
    this.wrapper.style.bottom = 30+'px'
    this.wrapper.style.left = `calc(50vw - ${this.stick.width/2}px)`
    this.stick.container.style.cssText = `
      position: relative; 
      border: 4px solid ${this.stick.color};
      border-radius: 100%; 
      width: ${this.stick.width}px; 
      height: ${this.stick.width}px; 
    `
    const dotPos = this.stick.width/2-this.stick.dotWidth/2-5
    this.stick.dot.style.cssText = `
      position: absolute; 
      left: ${dotPos}px; 
      top: ${dotPos}px; 
      width: ${this.stick.dotWidth}px; 
      height: ${this.stick.dotWidth}px; 
      border-radius: 100%; 
      background: ${this.stick.color};
    `
  }

  checkDirection = () => {
    this.stick.radius = Math.sqrt(this.stick.dotX**2 + this.stick.dotY**2)

    const sin = Math.abs(this.stick.dotY) / this.stick.radius
    let angle = Math.round(Math.asin(sin) * 57.2958)

    // check fourth
    if (-this.stick.dotX > 0 && -this.stick.dotY > 0) {
      angle = 180 - angle
    } else if (-this.stick.dotX > 0 && -this.stick.dotY < 0) {
      angle = 180 + angle
    } else if (-this.stick.dotX < 0 && -this.stick.dotY < 0) {
      angle = 360 - angle
    }

    if (this.stick.radius < 10) return

    let direction = ''
    if (angle <= 20 || angle >= 340) direction = 'right'
    if (angle > 20 && angle < 70) direction = 'right up'
    if (angle >= 70 && angle <= 110) direction = 'up'
    if (angle > 110 && angle < 160) direction = 'left up'
    if (angle >= 160 && angle <= 200) direction = 'left'
    if (angle > 200 && angle < 250) direction = 'left down'
    if (angle >= 250 && angle < 290) direction = 'down'
    if (angle > 290 && angle < 340) direction = 'right down'
    this.stick.direction = direction
  }

  handlerMove = evt => {
    let e = evt.touches? evt.touches[0] : evt
    let mouseX = e.clientX - this.stick.x - this.stick.width/2 - this.wrapper.offsetLeft
    let mouseY = e.clientY - this.stick.y - this.stick.width/2 - this.wrapper.offsetTop
    if (Math.pow(mouseX, 2) + Math.pow(mouseY, 2) < (this.stick.width/2)**2) {
      this.stick.dotX = e.clientX - this.stick.x - this.stick.width/2
      this.stick.dotY = e.clientY - this.stick.y - this.stick.width/2
    } else {
      let bigLine = Math.sqrt(mouseX**2 + mouseY**2)
      let sin = mouseY / bigLine
      let cos = mouseX / bigLine
      
      this.stick.dotX = cos * this.stick.width/2
      this.stick.dotY = sin * this.stick.width/2
    }
    
    this.updateDot()
    this.checkDirection()
  }
  handlerStart = evt => {
    let e = evt.touches? evt.touches[0] : evt
    if (!e.target.closest('.stick__wrapper')) return
    this.handlerMove(evt)
    document.addEventListener('mousemove', this.handlerMove)
    document.addEventListener('touchmove', this.handlerMove)
  }
  handlerEnd = e => {
    document.removeEventListener('mousemove', this.handlerMove)
    document.removeEventListener('touchmove', this.handlerMove)
    this.stick.dotX = 0
    this.stick.dotY = 0
    this.stick.radius = 0
    this.stick.direction = ''
    this.updateDot()
  }

  init = () => {
    this.upadteStyles()
    this.stick.x = this.stick.container.offsetLeft
    this.stick.y = this.stick.container.offsetTop
    document.addEventListener('mousedown', this.handlerStart)
    document.addEventListener('mouseup', this.handlerEnd)
    document.addEventListener('touchstart', this.handlerStart)
    document.addEventListener('touchend', this.handlerEnd)
  }

  getValues = () => ({
    strength: Math.round(this.stick.radius)*0.02,
    direction: this.stick.direction,
  })
}

export default Stick