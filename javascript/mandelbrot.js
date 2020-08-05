let scaleFactor = 2
let iterations = 100
let power = 2

class Mandelbrot {
  constructor(_width = 0, _height = 0, _xlBound=-2.5, _xrBound=1.0, _ylBound=-1.0, _yrBound=1.0) {
    this.width = _width / scaleFactor
    this.height = _height / scaleFactor

    /* Left and right bounds for x axis */
    this.xlBound = _xlBound
    this.xrBound = _xrBound

    /* Left and right bounds for y axis */
    this.ylBound = _ylBound
    this.yrBound = _yrBound
    
    /* Buffer */
    this.buff = createGraphics(_width, _height)
  }

  _scale(num, minVal, maxVal, lRange, rRange) {
    /**
     * Scales a number from one range to another.
     * @param {number} num Number to scale
     * @param {number} minVal Minimum value of num
     * @param {number} maxVal Maximum value of num
     * @param {number} lRange Left bound of range to scale to
     * @param {number} rRange Right bound of range to scale to
     * 
     * @return {number} Scaled value of num
     */
    // Get number in range [0,1]
    let normalized = (num - minVal) / (maxVal - minVal)

    // Scale to put num in range [lRange, rRange]
    return (rRange - lRange) * normalized + lRange
  }

  _calculatePixel(Px, Py) {
    /**
     * Finds if a given pixel is in the Mandlebrot set.
     * @param {number} Px x-coordinate of pixel
     * @param {number} Py y-coordinate of pixel
     * 
     * @link https://en.wikipedia.org/wiki/Mandelbrot_set#Computer_drawings
     */
    let x0 = this._scale(Px, 0.0, this.width,  this.xlBound, this.xrBound)
    let y0 = this._scale(Py, 0.0, this.height, this.ylBound, this.yrBound)

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
    /**
     * Sets the color based on how many iterations it took to find out if pixel is in set.
     * @see this.buffer()
     * @see this.colors
     */
    return (iter === iterations) ? color(0) : COLOR_MAP[iter%255]
  }

  buffer() {
    /**
     * Buffers drawing of the Mandelbrot set.
     * For each pixel on the screen the iteration it reaches is found and colored.
     */
    this.buff = createGraphics(this.width*scaleFactor, this.height*scaleFactor)
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        let iter = this._calculatePixel(x, y)
        this.buff.fill(this._setColor(iter))
        this.buff.noStroke()
        this.buff.rect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor)
      }
    }
  }

  draw(x=0, y=0) {
    /**
     * Draw function for the Mandelbrot set.
     * Takes the values computed in bufffer and writes them to the screen.
     * @param {number} x x coordinate to start drawing from
     * @param {number} y y coordinate to start drawing from
     */
    image(this.buff, 0, 0)
  }
}
