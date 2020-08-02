var w =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

var h =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight

let m;

function setup() {
  createCanvas(w, h)
  background(0)
  fullscreen()
  m = new Mandelbrot(w, h, 2, 2, .25, 1)
  m.buffer()
}

function draw() {
  clear()
  m.draw()
}
