// have a card featuring different quotes. Have them cycle.



window.onload = function() {
  "use strict";
  const bgColor = "black";
  var porthole = document.getElementById("porthole");
  var canvas = document.getElementById("c");
  var offCanvas = document.createElement("canvas");
  var canvasWidth = canvas.width = offCanvas.width = porthole.offsetWidth;
  var canvasHeight = canvas.height = offCanvas.height = porthole.offsetHeight;
  var STAR_COUNT = 800;
  var canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2};
  var minStarRadius = Math.max(canvasWidth, canvasHeight);
  var maxStarRadius = Math.max(canvasWidth, canvasHeight) * 10;
  var ctx = canvas.getContext("2d", { alpha: false });
  var offCtx = offCanvas.getContext("2d", { alpha: false });
  const round = (x) => Math.round(x);
  const randomInt = (x) => Math.round(Math.random() * x);
  const randomInRange = (min, max) => min + Math.random() * (max - min);
  
  window.addEventListener("resize", resizeCanvas, false);
 /* porthole.addEventListener("mousemove", function(event) {
    canvasCenter.x = event.pageX - canvasWidth / 2;
    canvasCenter.y = event.pageY - canvasHeight / 2;
  }, false); */

  function Star(x, y, r, distance, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.distance = distance;
    this.ar = this.r / this.distance;
    this.color = color;

    Star.prototype.draw = function(context) {
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.arc(this.x, this.y, this.ar, 0, Math.PI * 2, false);
      context.fillStyle = this.color;
      context.fill();
    }

    Star.prototype.update = function() {
      this.ar += this.ar / this.distance;
      this.distance -= 4;

      if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight || this.distance < 1) {
        this.x = randomInt(canvasWidth);
        this.y = randomInt(canvasHeight);
        this.r = randomInRange(minStarRadius, maxStarRadius);
        this.distance = randomInRange(5000, 10000);
        this.ar = this.r / this.distance;
      } else {
        this.x += (this.x - canvasCenter.x) / this.distance;
        this.y += (this.y - canvasCenter.y) / this.distance;
      }
      // this.draw(context);
    }
  }

  //initialize some stars
  function createStars(num) {
    let stars = [];
    for (let i = 0; i < num; i++) {
      let x = randomInt(canvasWidth * 100);
      let y = randomInt(canvasHeight * 100);
      let radius = randomInRange(minStarRadius, maxStarRadius);
      let distance = randomInt(10000);
      let red = randomInRange(200,255);
      let green = randomInRange(200,255);
      let blue = randomInRange(200,255);
      green = Math.min(red, green, blue);
      let color = `rgba(${red},${green},${blue})`;
      stars[i] = new Star(x, y, radius, distance, color);
    }
    return stars;
  }
  
  var stars = createStars(STAR_COUNT);

  function resizeCanvas() {
    canvasWidth = porthole.offsetWidth;
    canvasHeight = porthole.offsetHeight;
    canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2};
    canvas.width = offCanvas.width = canvasWidth;
    canvas.height = offCanvas.height = canvasHeight;
    ctx = canvas.getContext("2d", { alpha: false });
    offCtx = offCanvas.getContext("2d", { alpha: false });
    minStarRadius = Math.max(canvasWidth, canvasHeight);
    maxStarRadius = Math.max(canvasWidth, canvasHeight) * 10;
    stars = createStars(STAR_COUNT);
  }
  


  function animate() {
    offCtx.fillStyle = bgColor;
    offCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0, len = stars.length; i < len; i++) {
      stars[i].update();
      stars[i].draw(offCtx);
    }
    
    ctx.save();
    ctx.drawImage(offCanvas, 0, 0);
    ctx.restore();
    
    window.requestAnimationFrame(animate);
  }

  // animate();

}
