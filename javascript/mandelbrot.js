let scaleFactor = 1
let iterations = 100
let power = 2

class Mandelbrot {
  constructor(_width = 0, _height = 0, _lx=1, _ly=1, _xPos=0, _yPos=0) {
    this.width = _width / scaleFactor
    this.height = _height / scaleFactor

    // Control the frame/zoom of image
    this.lx = _lx
    this.ly = _ly

    // Control the center of focus
    this.xPos = _xPos
    this.yPos = _yPos
    
    // Buffer
    this.buff = createGraphics(_width, _height)
    
    // Color gradient for rendering
    this.colors = {
      0:  color( 66,  30,  15),
      1:  color( 25,   7,  26),
      2:  color(  9,   1,  47),
      3:  color(  4,   4,  73),
      4:  color(  0,   7, 100),
      5:  color( 12,  44, 138),
      6:  color( 24,  82, 177),
      7:  color( 57, 125, 209),
      8:  color(134, 181, 229),
      9:  color(211, 236, 248),
      10: color(241, 233, 191),
      11: color(248, 201,  95),
      12: color(255, 170,   0),
      13: color(204, 128,   0),
      14: color(153,  87,   0),
      15: color(106,  52,   3),
    }
  }

  _scale(num, minVal, maxVal, lRange, rRange) {
    // Get number in range [0,1]
    let normalized = (num - minVal) / (maxVal - minVal)

    // Scale to put num in range [lRange, rRange]
    return (rRange - lRange) * normalized + lRange
  }

  _calculatePixel(Px, Py) {
    let x0 = this._scale(Px, 0.0, this.width,  -2.5, 1.0) * (1/this.lx) + this.xPos
    let y0 = this._scale(Py, 0.0, this.height, -1.0, 1.0) * (1/this.ly) + this.yPos

    let x = 0.0
    let y = 0.0

    let iteration = 0
    let maxIteration = iterations

    while (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(2, 2) && iteration < maxIteration) {
      let xtemp = Math.pow(x, power) - Math.pow(y, power) + x0
      y = 2 * x * y + y0
      x = xtemp

      iteration += 1
    }

    return iteration
  }

  _setColor(iter) {
    return (iter === iterations) ? color(0) : this.colors[iter%16]
  }

  buffer() {
    this.buff = createGraphics(this.width, this.height)
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        let iter = this._calculatePixel(x, y)
        this.buff.fill(this._setColor(iter))
        this.buff.noStroke()
        this.buff.rect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor)
      }
    }
  }

  draw() {
    image(this.buff, 0, 0)
  }
}
