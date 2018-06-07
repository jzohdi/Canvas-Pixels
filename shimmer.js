var canvas = document.getElementById('map-canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var cb = canvas.getContext('2d');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getDeci(x) {
  return parseFloat(Number.parseFloat(x).toFixed(4));
}

var rippleSpeed = 2;
var maxDist = 0;
var ripple = false;
// function rippleUp(maxDist){
//   var maxDist = maxDist;
//   while (maxDist >= 1){
//     radius.dist += rippleSpeed;
//     maxDist -= rippleSpeed;
//   }
// }

// function rippleDown(maxDist){
//   var maxDist = maxDist;
//   while (maxDist >= 1){
//     radius.dist += rippleSpeed;
//     maxDist -= rippleSpeed;
//   }
// }
//
// function rippleLeft(maxDist){
//   var maxDist = maxDist;
//   while (maxDist >= 1){
//     radius.dist += rippleSpeed;
//     maxDist -= rippleSpeed;
//   }
// }
//
// function rippleRight(maxDist){
//   var maxDist = maxDist;
//   while (maxDist >= 1){
//     radius.dist += rippleSpeed;
//     maxDist -= rippleSpeed;
//   }
// }
var radius = {
  dist: undefined
}
var mouse = {
  x: undefined,
  y: undefined
}

function furthestWallCorner(){
  var wallUpRight = {distance: Math.round(Math.sqrt(Math.round(Math.abs(0 - mouse.y))**2 + Math.round(Math.abs(innerWidth - mouse.x))**2)), direction: 'Up'};
  var wallDownRight = {distance: Math.round(Math.sqrt(Math.round(Math.abs(innerHeight - mouse.y))**2 + Math.round(Math.abs(innerWidth - mouse.x))**2)), direction: 'Down'};
  var wallUpLeft = {distance: Math.round(Math.sqrt(Math.round(Math.abs(0 - mouse.y))**2 + Math.round(Math.abs(0 - mouse.x))**2)), direction: 'Right'};
  var wallDownLeft = {distance: Math.round(Math.sqrt(Math.round(Math.abs(innerHeight - mouse.y))**2 + Math.round(Math.abs(0 - mouse.x))**2)), direction: 'Left'};
  if (Math.max( wallUpRight.distance, wallDownRight.distance, wallUpLeft.distance, wallDownLeft.distance) == wallUpRight.distance){
    return wallUpRight;
  }
  else if (Math.max( wallUpRight.distance, wallDownRight.distance, wallUpLeft.distance, wallDownLeft.distance) == wallDownRight.distance) {
    return wallDownRight;
  }
  else if (Math.max( wallUpRight.distance, wallDownRight.distance, wallUpLeft.distance, wallDownLeft.distance) == wallUpLeft.distance) {
    return wallUpLeft;
  }
  else{
    return wallDownLeft;
  }
}

window.addEventListener('click', function(){
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  var diDict = furthestWallCorner();
  radius.dist = 0;
  maxDist = diDict.distance;
  ripple = true;
  // if (diDict.direction == 'Up'){
  //   radius.dist = 0;
  //   return rippleUp(diDict.distance);
  // }
  // else if (diDict.direction == 'Down') {
  //   radius.dist = 0;
  //   return rippleUp(diDict.distance)
  // }
  // else if (diDict.direction == 'Right') {
  //   radius.dist = 0;
  //   return rippleUp(diDict.distance)
  // }
  // else if (diDict.direction == 'Left') {
  //   radius.dist = 0;
  //   return rippleUp(diDict.distance)
  // }
})

console.log(innerWidth);
var pixelNumber = 150;
var widthForEach = innerWidth / pixelNumber;
var pixelsTall = innerHeight / widthForEach;

function Pixel(xIndex, yIndex, x, y, width){
  this.r = 255;
  this.g = 255;
  this.b = 255;
  this.xIndex = xIndex;
  this.yIndex = yIndex;
  this.x = x;
  this.y = y;
  this.width = width;
  this.rate = 5;

  this.draw = function(){
      cb.fillStyle = 'rgb(' + this.r + ',' + this.g + ',' + this.b +')'
      cb.fillRect(this.x, this.y, this.width, this.width);
  }
  this.update = function(){

    if ((mouse.y - this.y)**2 + (mouse.x - this.x)**2 >= (radius.dist - 15)**2 && (mouse.y - this.y)**2 + (mouse.x - this.x)**2 <= (radius.dist + 15)**2){
      this.r = 0;
      this.g = 0;
      this.b = 0;
    }
    else {
      this.r = 255;
      this.g = 255;
      this.b = 255;
    }

    this.draw();

  }
}
// Initian pixels for screen
var pixels = []

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

for (var y = 0; y < pixelsTall; y++){
  var rows = []
  for (var x = 0; x < pixelNumber; x++){
    rows.push(new Pixel(y, x, x*widthForEach, y*widthForEach, widthForEach))
  }
  pixels.push(rows);
}
// var pixel = new Pixel(10, 10, 50);
// pixel.draw();
// pixels[0][0].r = 200

function animate(){
  requestAnimationFrame(animate);
  cb.clearRect(0, 0, innerWidth, innerHeight);
  for (var i = pixels.length - 1; i >= 0; i--){
    for (var n =  pixels[i].length - 1; n >= 0; n--){
      pixels[i][n].update();
    }
  }
  if (ripple){
    radius.dist += rippleSpeed;
    maxDist -= 1;
  }
  if (maxDist <= 1){
    ripple = false;
  }

}

animate();
// cb.beginPath();
// cb.arc(0, 0, 100, 1.5*Math.PI, Math.PI, false);
// cb.lineCap = 'round';
// cb.lineWidth = 30;
// cb.strokeStyle = 'black';
// cb.stroke();
