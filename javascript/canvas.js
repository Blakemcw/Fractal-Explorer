/**
 * @file Contains the main logic for P5.js
 * @author Blakemcw
 */

let m
let DEBUG = false;

var Canvas = {
  /* Window size */
  width: window.innerWidth 
    || document.documentElement.clientWidth
    || document.body.clientWidth,

  height: window.innerHeight
    || document.documentElement.clientHeight 
    || document.body.clientHeight,
  
  /* Positional variables */
  zoom: 1.0,
  x: 0.0,
  y: 0.0,
}

let handleZoom = () => {
  /**
   * Zooms into the center of the screen.
   * @return {null}
   */

  let centerX = Canvas.width/2
  let centerY = Canvas.height/2

  translate(centerX, centerY)
  scale(Canvas.zoom)
  translate(-centerX,-centerY)
}

let redrawAtScale = () => {
  /**
   * Redraw the Mandelbrot set at the current scale.
   * @return {null}
   */

  let s = 1/Canvas.zoom

  /* Get the current window width and height when zoomed */
  let scaledWidth = s*Canvas.width
  let scaledHeight = s*Canvas.height

  /* Find the center of the screen */
  let centerX = Canvas.width/2 - Canvas.x
  let centerY = Canvas.height/2 - Canvas.y

  /* 
    Calculate the current [left x bound, right x bound] from the center of the
    screen to left and right edges
  */
  let screenLeftBorder = centerX - scaledWidth/2
  let screenRightBorder = centerX + scaledWidth/2

  /* 
    Calculate the current [left y bound, right y bound] from the center of the
    screen to top and bottom edges
  */
  let screenTopBorder = centerY - scaledHeight/2
  let screenBottomBorder = centerY + scaledHeight/2

  /* Find the adjusted x bounds for Mandelbrot set from screen size */
  tempXLBound = m.xlBound
  m.xlBound = (m._scale(screenLeftBorder, 0, Canvas.width, m.xlBound, m.xrBound))
  m.xrBound = (m._scale(screenRightBorder, 0, Canvas.width, tempXLBound, m.xrBound))

  /* Find the adjusted y bounds for Mandelbrot set from screen size */
  tempYLBound = m.ylBound
  m.ylBound = (m._scale(screenTopBorder, 0, Canvas.height, m.ylBound, m.yrBound))
  m.yrBound = (m._scale(screenBottomBorder, 0, Canvas.height, tempYLBound, m.yrBound))

  /* Reset canvas variables */
  Canvas.x = 0
  Canvas.y = 0
  Canvas.zoom = 1

  /* Recalculate Mandelbrot set at current position */
  m.buffer()
}

function setup() {
  /**
   * Setup function for P5.js.
   * @return {null}
   */
  createCanvas(Canvas.width, Canvas.height)
  background(0) // set background black
  fullscreen()
  m = new Mandelbrot(Canvas.width, Canvas.height)
  m.buffer()
}

function draw() {
  /**
   * Draw function for P5.js.
   * @return {null}
   */

  clear()

  /* Handle Mandelbrot set drawing */
  push()
  handleZoom()
  rectMode(CENTER)
  translate(Canvas.x, Canvas.y)
  m.draw()
  pop()

  /* Handle axis drawing if DEBUG is on */
  if (DEBUG) {
    push()
    stroke('red')
    strokeWeight(4)
    color(255, 0, 0)
    line(0, Canvas.height/2, Canvas.width, Canvas.height/2)
    line(Canvas.width/2, 0, Canvas.width/2, Canvas.height)
    pop()
  }
}

document.addEventListener('keydown', function(e) {
  /**
   * Handles all keypresses.
   * @param {object} e event fired from keypress
   */

  switch (e.key) {
    /* Trigger a redraw of the current position */
    case 'r':     redrawAtScale();    break;

    /* Handle panning */
    case 'w':     Canvas.y += 5;        break;
    case 'a':     Canvas.x += 5;        break;
    case 's':     Canvas.y -= 5;        break;
    case 'd':     Canvas.x -= 5;        break;

    /* Handle zooming */
    case ']':     Canvas.zoom *= 1.02;  break;
    case '[':     Canvas.zoom *= 0.98;  break;

    case 'v':     DEBUG = !DEBUG;       break;
  
    default:                            break;
  }

  /* Draw with updated position */
  draw()
})

function mouseWheel(e) {
  /**
   * P5.js function called when the mouse is scrolled.
   * @param {object} e Event fired when mouse is scrolled
   * @return {boolean} Whether or not to block page scrolling
   */
  
  if (e.deltaY > 0) { /* scrolling in */
    Canvas.zoom *= 1.02
  } else { /* scrolling out */
    Canvas.zoom *= 0.98
  }

  // block page scrolling
  return false
}
