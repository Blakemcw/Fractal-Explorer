var w =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

var h =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight

let m = new Mandelbrot(w, h)

function setup() {
  createCanvas(w, h)
  background(0)
  fullscreen()
}

function draw() {
  m.draw()
}
