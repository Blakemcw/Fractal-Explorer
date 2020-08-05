/**
 * @file Script to interpolate a gradient from input colors.
 * @author Blakemcw
 */

var fs = require('fs')

// =============================================================================
// Input Settings
// =============================================================================

let inputFilepath  = './colors.json'  // format should be 'num': [r, g, b]
let outputFilepath = './output-colors.json'
let numberOfColorsInOutput = 255

// =============================================================================
// Functions
// =============================================================================

let interpolate = (start, end, step) => {
  /**
   * Interpolation between two numbers.
   * @param {number} start The number to start interpolation from
   * @param {number} end Then number to stop interpolation at
   * @param {number} step a fraction that gives the
   */
  return (end - start) * step + start
}


// =============================================================================
// Setup
// =============================================================================

/* Read initial colors from file */
console.log('Reading file...')
let colors = JSON.parse(fs.readFileSync(inputFilepath))

/* Find out how many colors need to be interpolated between each color */
let numColors = Object.keys(colors).length
let colorsPerSection = (numberOfColorsInOutput + numColors) / numColors

/* Variables for output */
let outputColors = {}
let currentColor = 0


// =============================================================================
// Main
// =============================================================================

for (let i = 1; i < numColors; ++i) {
  let startColor = colors[i-1]
  let endColor = colors[i]
  outputColors[currentColor] = startColor
  ++currentColor

  for (let j = 1; j < colorsPerSection; ++j) {
    outputColors[currentColor] = [
      interpolate(startColor[0], endColor[0], (colorsPerSection-j)/colorsPerSection),
      interpolate(startColor[1], endColor[1], (colorsPerSection-j)/colorsPerSection),
      interpolate(startColor[2], endColor[2], (colorsPerSection-j)/colorsPerSection)
    ]
    ++currentColor
  }
}


// =============================================================================
// Output
// =============================================================================

/* Write interpolated colors to output file */
fs.writeFileSync(outputFilepath, JSON.stringify(outputColors))
console.log('Done! Colors written to "./outputColors.json".')
