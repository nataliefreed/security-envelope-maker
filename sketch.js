var drawingGrid = [];
var size = 50;

var clearGrid = function() {
  for (var i = 0; i < 10; i++) {
    drawingGrid[i] = [];
    for (var j = 0; j < 10; j++) {
      drawingGrid[i][j] = 255;
    }
  }
}

var envelopeSketch = function(p) {
  var mask;

  p.preload = function() {
    p.createCanvas(792, 612);
    mask = p.loadImage("envelope mask.png");

    clearGrid();
  }

  p.setup = function() {}

  p.draw = function() {
    p.background(255);

    brickTiling(renderGrid, 0, 0, size / 10, size / 10, p.height / size, p.width / size, size, size);

    p.image(mask, 0, 0, 0.5 * mask.width, 0.5 * mask.height);

    p.noLoop();
  }

  blockTiling = function(shape, x, y, w, h, numRows, numCols, spacingX, spacingY) {
    p.push();
    for (var row = 0; row < numRows; row++) {
      p.push();
      for (var col = 0; col < numCols; col++) {
        shape(x, y, w, h);
        p.translate(spacingX, 0);
      }
      p.pop();
      p.translate(0, spacingY);
    }
    p.pop();
  }

  brickTiling = function(shape, x, y, w, h, numRows, numCols, spacingX, spacingY) {
    p.push();
    for (var row = 0; row < numRows; row++) {
      p.push();
      if (row % 2 == 1) {
        p.translate(spacingX / 2, 0)
      }
      for (var col = 0; col < numCols; col++) {
        shape(x, y, w, h);
        p.translate(spacingX, 0);
      }
      p.pop();
      p.translate(0, spacingY);
    }
    p.pop();
  }

  renderGrid = function(x, y, pw, ph) {
    p.push();
    p.noStroke();
    p.translate(x, y);
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        p.fill(drawingGrid[i][j]);
        p.rect(i * pw, j * ph, pw, ph);
      }
    }
    p.pop();
  }
}

var menuSketch = function(p) {
  var colorGrid;
  var blockColor;
  var instructions;
  var small = 20;
  var medium = 50;
  var large = 80;

  p.preload = function() {
    instructions = p.loadImage("envelope maker instructions.png");
  }

  p.setup = function() {
    p.createCanvas(360, 612);
    colorGrid = ['#f40c46', '#f97b04', '#ffee00', '#00ff6e', '#069b41', '#00ffe9', '#00cbff', '#0087ff', '#003bff', '#5900ff', '#c300ff', '#ff00c3', '#ffffff', '#c4c4c4', '#919191', '#000000'];
    blockColor = p.color(0);
  }

  p.draw = function() {
    p.background(175);
    p.fill(255);
    p.noStroke();
    p.rect(120, 0, 250, 612);
    p.image(instructions, 160, 10, instructions.width * 0.5, instructions.height * 0.5);

    renderDrawingGrid(drawingGrid, 10, 10, 10, 10);

    p.stroke(200);
    p.push();
    for (i = 0; i < 10; i++) {
      p.line(10, 10, 110, 10);
      p.translate(0, 10);
    }
    p.pop();
    p.push();
    for (i = 0; i < 10; i++) {
      p.line(10, 10, 10, 110);
      p.translate(10, 0);
    }
    p.pop();
    p.stroke(0);
    p.noFill();
    p.rect(10, 10, 100, 100);

    gridLayout(colorGrid, 10, 120, 20, 20, 4, 4, 26, 26);

    p.textSize(20);
    p.textAlign(p.CENTER, p.CENTER);

    //random button
    p.fill(blockColor);
    p.stroke(0);
    p.rect(10, 240, 100, 30);
    p.fill(255);
    p.noStroke();
    p.text("random", 10, 240, 100, 30);

    //small, medium, large buttons
    p.push();
    p.textSize(14);
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.text("pattern size:", 10, 280, 100, 30);
    p.pop();
    p.fill(200);
    p.stroke(0);
    
    p.push(); //small
    if (size == small) {
      p.fill(150);
    }
    p.rect(10, 310, 100, 30);
    p.pop();
    
    p.push(); //medium
    if (size == medium) {
      p.fill(150);
    }
    p.rect(10, 350, 100, 30);
    p.pop();

    p.push(); //large
    if (size == large) {
      p.fill(150);
    }
    p.rect(10, 390, 100, 30);
    p.pop();

    p.fill(0);
    p.noStroke();
    p.text("small", 10, 310, 100, 30);
    p.text("medium", 10, 350, 100, 30);
    p.text("large", 10, 390, 100, 30);

    //clear button
    p.fill(255);
    p.stroke(0);
    p.rect(10, 440, 100, 30);
    p.fill(0);
    p.noStroke();
    p.text("clear", 10, 440, 100, 30);

    p.noLoop();
  }

  p.mousePressed = function() {
    if (p.mouseX > 10 && p.mouseX < 110) {
      if (p.mouseY > 10 && p.mouseY < 110) {
        var x = Math.floor(p.mouseX / 10) - 1;
        var y = Math.floor(p.mouseY / 10) - 1;
        if (drawingGrid[x][y] == blockColor) { //if we are clicking on the same color
          drawingGrid[x][y] = 255;
        } else {
          drawingGrid[x][y] = blockColor;
        }
      } else if (p.mouseY > 120 && p.mouseY < 220) {
        blockColor = p.color(p.get(p.mouseX, p.mouseY));
      } else if (p.mouseY > 240 && p.mouseY < 270) { //clear button
        randomize();
      } else if (p.mouseY > 310 && p.mouseY < 340) { //small button
        size = small;
      } else if (p.mouseY > 350 && p.mouseY < 380) { //medium button
        size = medium;
      } else if (p.mouseY > 390 && p.mouseY < 420) { //large button
        size = large;
      } else if (p.mouseY > 440 && p.mouseY < 470) {
        clearGrid();
      }
      envelope.loop();
      p.loop();
    }
  }

  randomize = function() {
    //randomize grid
    clearGrid();
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        drawingGrid[i][j] = Math.random() > 0.5 ? blockColor : 255;
      }
    }
  }

  renderDrawingGrid = function(grid, x, y, pw, ph) {
    p.push();
    p.noStroke();
    p.translate(x, y);
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        p.fill(grid[i][j]);
        p.rect(i * pw, j * ph, pw, ph);
      }
    }
    p.pop();
  }

  colorPalette = function(grid, x, y, pw, ph, xd, yd) {
    var k = 0;
    p.push();
    p.noStroke();
    p.translate(x, y);
    for (var i = 0; i < 10; i++) {
      push();
      for (var j = 0; j < 10; j++) {
        p.fill(grid[k]);
        p.rect(i * pw, j * ph, pw, ph);
        translate(xd, 0);
        k++;
      }
      pop();
      translate(0, yd);
    }
    p.pop();
  }

  gridLayout = function(colorArray, x, y, w, h, numRows, numCols, spacingX, spacingY) {
    var k = 0;
    p.push();
    for (var row = 0; row < numRows; row++) {
      p.push();
      for (var col = 0; col < numCols; col++) {
        p.fill(colorArray[k]);
        p.rect(x, y, w, h);
        p.translate(spacingX, 0);
        k++;
      }
      p.pop();
      p.translate(0, spacingY);
    }
    p.pop();
  }
}

var envelope = new p5(envelopeSketch);
var menu = new p5(menuSketch);